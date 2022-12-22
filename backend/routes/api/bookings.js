const { Router } = require('express');
const express = require('express');
const { Spot, User, Review, SpotImage, ReviewImage, Booking, sequelize } = require('../../db/models');
const { restoreUser, requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// Get all of the Current User's Bookings
router.get(
    '/current',
    requireAuth,
    restoreUser,
    async (req, res, next) => {
        const { user } = req;
        const bookings = await Booking.findAll({
            include: {
                model: Spot,
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            },
            where: {
                userId: user.id
            }
        });
        const newBookings = [];
        for (let booking of bookings) {
            const previewImage = await SpotImage.findOne({
                attributes: ['url'],
                raw: true
            });
            booking = booking.toJSON()
            if (previewImage){
                booking.Spot.previewImage = previewImage.url
            }
            newBookings.push(booking)
        }
        return res.json({Bookings: newBookings})
    }
);

module.exports = router;
