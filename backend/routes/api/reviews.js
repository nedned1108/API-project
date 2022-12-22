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
);

// Add an Image to a Review based on the Review's id
router.post(
    '/:reviewId/images',
    requireAuth,
    restoreUser,
    async (req, res, next) => {
        const { user } = req;
        const { reviewId } = req.params;
        const { url } = req.body;
        const review = await Review.findByPk(parseInt(reviewId));
        const reviewImageCount = await ReviewImage.count({
            where: {
                reviewId: review.id
            }
        });
        console.log(reviewImageCount)
        if (reviewImageCount >= 10) {
            res.status(403);
            return res.json({
                "message": "Maximum number of images for this resource was reached",
                "statusCode": 403
              })
        };
        if (review) {
            if (review.userId === user.id && reviewImageCount < 10) {
                const reviewImage = await ReviewImage.create({
                    reviewId: review.id,
                    url
                });
                const newReviewImage = await ReviewImage.findByPk(reviewImage.id, 
                    {
                        attributes: ['id', 'url']
                    }
                )
                return res.json(newReviewImage)
            } else {
                res.status(404);
                res.json(
                    {
                        "message": "Review couldn't be found",
                        "statusCode": 404
                    }
                )
            }
        } else {
            res.status(404);
            res.json(
                {
                    "message": "Review couldn't be found",
                    "statusCode": 404
                }
            )
        }
    }
)

module.exports = router;
