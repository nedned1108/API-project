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

// Edit a Booking
router.put(
    '/:bookingId',
    requireAuth,
    restoreUser,
    async (req, res, next) => {
        const { bookingId } = req.params;
        const { user } = req;
        let { startDate, endDate } = req.body;
        const booking = await Booking.findByPk(parseInt(bookingId));
        const newStartDate = new Date(startDate);
        const newEndDate = new Date(endDate);
        const currentDate = new Date()
        const bookedDate = await Booking.findAll({
            attributes: ['startDate', 'endDate'],
            where: {
                id: parseInt(bookingId)
            }
        });

        if (booking) {
            if (user.id === booking.userId) {
                for (let booked of bookedDate) {
                    const bookedStartDate = new Date(booked.startDate);
                    const bookedEndDate = new Date(booked.endDate);
                    if ((newStartDate.getTime() >= bookedStartDate.getTime()) &&
                        newStartDate.getTime() <= bookedEndDate.getTime()) {
                        res.status(403);
                        return res.json(
                            {
                                "message": "Sorry, this spot is already booked for the specified dates",
                                "statusCode": 403,
                                "errors": {
                                    "startDate": "Start date conflicts with an existing booking",
                                }
                            }
                        )
                    } else if ((newEndDate.getTime() >= bookedStartDate.getTime()) &&
                        newEndDate.getTime() <= bookedEndDate.getTime()) {
                        res.status(403);
                        return res.json(
                            {
                                "message": "Sorry, this spot is already booked for the specified dates",
                                "statusCode": 403,
                                "errors": {
                                    "endDate": "End date conflicts with an existing booking"
                                }
                            }
                        )
                    }
                };
                if (newEndDate.getTime() <= currentDate.getTime()) {
                    res.status(403);
                    return res.json(
                        {
                            "message": "Past bookings can't be modified",
                            "statusCode": 403
                        }
                    )
                } else if (newStartDate.getTime() >= newEndDate.getTime()) {
                    res.status(400);
                    return res.json(
                        {
                            "message": "Validation error",
                            "statusCode": 400,
                            "errors": {
                              "endDate": "endDate cannot come before startDate"
                            }
                        }
                    )
                } else {
                    const updateBooking = await booking.update({
                        startDate: newStartDate,
                        endDate: newEndDate
                    });

                    return res.json(updateBooking)
                }
            } else {
                res.status(400);
                return res.json(
                    {
                        "message": "Cannot edit booking that is not yours",
                        "statusCode": 400
                    }
                )
            }
        } else {
            res.status(404);
            res.json(
                {
                    "message": "Booking couldn't be found",
                    "statusCode": 404
                }
            )
        }
    }
)

module.exports = router;
