const { Router } = require('express');
const express = require('express');
const { Spot, User, Review, SpotImage, ReviewImage, sequelize } = require('../../db/models');
const { restoreUser, requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { route } = require('./reviews');

const router = express.Router();

const validateSpot = [
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

const validateReview = [
    check('review')
        .exists({ checkFalsy: true })
        .withMessage('Review text is required'),
    check('stars')
        .exists({ checkFalsy: true })
        .isInt({ min: 1, max: 5})
        .withMessage('Stars must be an integer from 1 to 5'),
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
                group: 'id',
                raw: true
            });
            const previewImage = await SpotImage.findAll({
                where: {
                    spotId: spot.id
                },
                attributes: ['url']
            })
            if (avgRating[0]) {
                spot.avgRating = avgRating[0].avgRating;
            } else {
                spot.avgRating = 0;
            }
            
            if (previewImage[0]) {
                spot.previewImage = previewImage[0].url;
            } else {
                spot.previewImage = null;
            }
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
                    group: 'id',
                    raw: true
                });
                const previewImage = await SpotImage.findAll({
                    where: {
                        spotId: spot.id
                    },
                    attributes: ['url']
                })
                if (avgRating[0]) {
                    spot.avgRating = avgRating[0].avgRating;
                } else {
                    spot.avgRating = 0;
                }
                
                if (previewImage[0]) {
                    spot.previewImage = previewImage[0].url;
                } else {
                    spot.previewImage = null;
                }
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
                group: 'id',
                raw: true
            });
    
            const numReviews = await spot.countReviews();
    
            spot = spot.toJSON();
            if (avgRating[0]) {
                spot.avgRating = avgRating[0].avgRating;
            } else {
                spot.avgRating = 0;
            }
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
    validateSpot,
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
                    spotId: parseInt(spotId),
                    url,
                    preview
                });
                const newImage = await SpotImage.findByPk(image.id,
                    {attributes: { exclude: ['spotId','createdAt', 'updatedAt'] } }
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

// Edit a spot
router.put(
    '/:spotId',
    requireAuth,
    restoreUser,
    validateSpot,
    async (req, res, next) => {
        const { user } = req;
        const { spotId } = req.params;
        const {address, city, state, country, lat, lng, name, description, price } = req.body;
        const spot = await Spot.findByPk(parseInt(spotId));
        if (spot) {
            if (user.id === spot.ownerId) {
                await spot.update({
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
                
                return res.json(spot)
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

// Delete a Spot
router.delete(
    '/:spotId',
    requireAuth,
    restoreUser,
    async (req, res, next) => {
        const { user } = req;
        const { spotId } = req.params;
        const spot = await Spot.findByPk(parseInt(spotId));

        if (spot) {
            if (spot.ownerId === user.id) {
                await spot.destroy();
                res.json(
                    {
                        "message": "Successfully deleted",
                        "statusCode": 200
                    }
                )
            } else {
                res.status(404);
                res.json(
                    {
                        "message": "Spot couldn't be found",
                        "statusCode": 404
                    }
                )
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
);

// Get all Reviews by a Spot's id
router.get(
    '/:spotId/reviews',
    async (req, res, next) => {
        const { spotId } = req.params;
        const reviews = await Review.findAll({
            where: {
                spotId: parseInt(spotId)
            },
            include: [
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName']
                },
                {
                    model: ReviewImage,
                    attributes: ['id', 'url']
                }
            ]
            });

        if (reviews.length !== 0) {
            res.json({ Reviews: reviews })
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
);

// Create a Review for a Spot based on the Spot's id
router.post(
    '/:spotId/reviews',
    requireAuth,
    restoreUser,
    validateReview,
    async (req, res, next) => {
        const { user } = req;
        const { spotId } = req.params;
        const { review, stars } = req.body;
        const spot = await Spot.findByPk(parseInt(spotId));

        if ( spot ) {
            if (spot.ownerId !== user.id) {
                const newReview = await Review.create({
                    userId: user.id,
                    spotId: parseInt(spotId),
                    review,
                    stars: parseInt(stars)
                });

                return res.json(newReview)
            } else {
                res.status(400);
                res.json(
                    {
                        "message": "Can not create review for your own spot",
                        "statusCode": 404
                    }
                )
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
