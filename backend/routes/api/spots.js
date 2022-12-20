const { Router } = require('express');
const express = require('express');
const { Spot, Review, SpotImage, sequelize } = require('../../db/models');
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
            console.log(user.id)
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



module.exports = router
