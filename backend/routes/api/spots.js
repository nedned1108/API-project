const { Router } = require('express');
const express = require('express');
const { Spot, User, Review, SpotImage, sequelize } = require('../../db/models');
const { restoreUser } = require('../../utils/auth');

const router = express.Router();


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
)


module.exports = router;
