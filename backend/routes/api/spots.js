const { Router } = require('express');
const express = require('express');
const { Spot, User, Review, SpotImage, sequelize } = require('../../db/models');
const { restoreUser, requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateCreateSpot = [
    check('address')
        .exists({ checkFalsy: true })
        .withMessage('Street address is required'),
    check('city')
        .exists({ checkFalsy: true })
        .withMessage('City is required'),
    check('state')
        .exists({ checkFalsy: true })
        .withMessage('State is required'),
    check('country')
        .exists({ checkFalsy: true })
        .withMessage('Country is required'),
    check('lat')
        .exists({ checkFalsy: true })
        .isDecimal({ decimal_digits: '7'})
        .withMessage('Latitude is not valid'),
    check('lng')
        .exists({ checkFalsy: true })
        .isDecimal({ decimal_digits: '7'})
        .withMessage('Longitude is not valid'),
    check('name')
        .exists({ checkFalsy: true })
        .isLength({ max: 50 })
        .withMessage('Name must be less than 50 characters'),
    check('description')
        .exists({ checkFalsy: true })
        .withMessage('Description is required'),
    check('price')
        .exists({ checkFalsy: true })
        .withMessage('Price per day is required'),
    handleValidationErrors
];

// Get all Spots
router.get(
    '/', 
    async (req, res, next) => {
        const spots = await Spot.findAll({raw: true});

        for (let spot of spots) {
            const avgRating = await Review.findAll({
                where: {
                    spotId: spot.id
                },
                attributes: {
                    include: [
                        [
                            sequelize.fn('AVG', sequelize.col('stars')), 'avgRating'
                        ]
                ]},
                raw: true
            });
            const previewImage = await SpotImage.findAll({
                where: {
                    spotId: spot.id
                },
                attributes: ['url']
            })

            spot.avgRating = avgRating[0].avgRating;
            spot.previewImage = previewImage[0];
        };

        return res.json({ spots });
    })

// Get all Spots owned by the Current User
router.get(
    '/current',
    requireAuth,
    restoreUser,
    async (req, res, next) => {
        const { user } = req;
        if (user) {
            user.toSafeObject();
            const spots = await Spot.findAll({
                where: {
                    ownerId: user.id
                },
                raw: true
            });
            for (let spot of spots) {
                const avgRating = await Review.findAll({
                    where: {
                        spotId: spot.id
                    },
                    attributes: {
                        include: [
                            [
                                sequelize.fn('AVG', sequelize.col('stars')), 'avgRating'
                            ]
                    ]},
                    raw: true
                });
                const previewImage = await SpotImage.findAll({
                    where: {
                        spotId: spot.id
                    },
                    attributes: ['url']
                })
                spot.avgRating = avgRating[0].avgRating;
                spot.previewImage = previewImage[0];
            };
            return res.json({spots})
        }
    }
)

// Get Details of a Spot by Id
router.get(
    '/:spotId',
    async (req, res, next) => {
        const { spotId } = req.params;

        let spot = await Spot.findByPk(spotId, 
            {
                include: [
                    {
                        model: Review,
                        attributes: []
                    },
                    {
                        model: SpotImage,
                        attributes: ['id', 'url', 'preview']
                    },
                    {
                        model: User,
                        attributes: ['id', 'firstName', 'lastName'],
                        as: 'Owner'
                    }
                ]
            },
        );
        // Successful response
        if (spot) {
            const avgRating = await Review.findAll({
                where: {
                    spotId: spot.id
                },
                attributes: {
                    include: [
                        [
                            sequelize.fn('AVG', sequelize.col('stars')), 'avgRating'
                        ]
                ]},
            });
    
            const numReviews = await spot.countReviews();
    
            spot = spot.toJSON();
            spot.avgRating = avgRating[0].toJSON().avgRating;
            spot.numReviews = numReviews;
    
            if (spot) {
                return res.json(spot)
            }
        } else {
            // Error response if couldn't find the specified id
            res.status(404);
            res.json(
                {
                    "message": "Spot couldn't be found",
                    "statusCode": 404
                }
            )
        }
    }
);

// Create a Spot
router.post(
    '/',
    requireAuth,
    restoreUser,
    validateCreateSpot,
    async (req, res, next) => {
        const { user } = req;
        const { address, city, state, country, lat, lng, name, description, price } = req.body;

        const newSpot = await Spot.create({
            ownerId: user.id,
            address,
            city,
            state, 
            country,
            lat,
            lng,
            name,
            description,
            price
        });
        return res.json(newSpot)
    }
);

// Add an Image to a Spot based on the Spot's id
router.post(
    '/:spotId/images',
    requireAuth,
    restoreUser,
    async (req, res, next) => {
        const spotId = req.params.spotId;
        const { url, preview } = req.body;
        const { user } = req;
        const spot = await Spot.findByPk(parseInt(spotId));

        if (spot) {
            if (user.id === spot.ownerId) {
                const image = await SpotImage.create({
                    spotId: spotId,
                    url,
                    preview
                });

                const newImage = await SpotImage.findOne(
                    {attributes: { exclude: ['id', 'createdAt', 'updatedAt'] } },
                    { where: { spotId: spotId } }
                );
                return res.json(newImage)
            } else {
                res.status(404);
                res.json({
                    "message": "Spot couldn't be found",
                    "statusCode": 404
                })
            }
        } else {
            res.status(404);
            res.json(
                {
                    "message": "Spot couldn't be found",
                    "statusCode": 404
                }
            )
        }
    }

)


module.exports = router;
