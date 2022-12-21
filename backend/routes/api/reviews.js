const { Router } = require('express');
const express = require('express');
const { Spot, User, Review, SpotImage, ReviewImage, sequelize } = require('../../db/models');
const { restoreUser, requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// Get all Reviews of the Current User
router.get(
    '/current',
    requireAuth,
    restoreUser,
    async (req, res, next) => {
        const { user } = req;

        const reviews = await Review.findAll({
            where: {
                userId: parseInt(user.id)
            },
            include: [
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName']
                },
                {
                    model: Spot,
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'description']
                    }
                },
                {
                    model: ReviewImage,
                    attributes: ['id', 'url']
                }  
            ]
        });
        const newReviews = [];
        for (let review of reviews) {
            const previewImage = await SpotImage.findOne({
                attributes: ['url'],
                raw: true
            });
            review = review.toJSON()
            if (previewImage){
                review.Spot.previewImage = previewImage.url
            }
            newReviews.push(review)
        }
        if (reviews) {
            res.json({ Reviews: newReviews })
        }
    }
)

module.exports = router;
