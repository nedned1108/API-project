const { Router } = require('express');
const express = require('express');
const { Spot, User, Review, SpotImage, ReviewImage, Booking, sequelize } = require('../../db/models');
const { restoreUser, requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require("sequelize");

const router = express.Router();

const validateBooking = [
  check('startDate')
    .exists({ checkFalsy: true })
    .withMessage('Please provide check in date'),
  check('startDate')
    .isAfter()
    .withMessage('Invalid check in date'),
  check('endDate')
    .exists({ checkFalsy: true })
    .withMessage('Please provide check out date'),
  handleValidationErrors
];

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
          exclude: ['createdAt', 'updatedAt', 'description']
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
      if (previewImage) {
        booking.Spot.previewImage = previewImage.url
      }
      newBookings.push(booking)
    }
    return res.json({ Bookings: newBookings })
  }
);

// Edit a Booking
router.put(
  '/:bookingId',
  requireAuth,
  restoreUser,
  validateBooking,
  async (req, res, next) => {
    const { bookingId } = req.params;
    const { user } = req;
    let { startDate, endDate } = req.body;
    const booking = await Booking.findByPk(bookingId);
    const newStartDate = new Date(startDate);
    const newEndDate = new Date(endDate);
    const currentDate = new Date()
    const bookedDate = await Booking.findAll({
      attributes: ['startDate', 'endDate'],
      where: {
        spotId: booking.spotId,
        id: {
          [Op.ne]: booking.id
        }
      }
    });

    if (booking) {
      if (user.id === booking.userId) {
        for (let booked of bookedDate) {
          const bookedStartDate = new Date(booked.startDate);
          const bookedEndDate = new Date(booked.endDate);
          if ((newStartDate.getTime() >= bookedStartDate.getTime() && newStartDate.getTime() <= bookedEndDate.getTime()) ||
            (newStartDate.getTime() < bookedStartDate.getTime() && newEndDate.getTime() > bookedEndDate.getTime())) {
            res.status(403);
            return res.json(
              {
                "statusCode": 403,
                "errors": ["Sorry, this spot is already booked for the specified dates"]
              }
            )
          } else if ((newEndDate.getTime() >= bookedStartDate.getTime()) && newEndDate.getTime() <= bookedEndDate.getTime()) {
            res.status(403);
            return res.json(
              {
                "statusCode": 403,
                "errors": ["Sorry, this spot is already booked for the specified dates"]
              }
            )
          }
        };
        if (newEndDate.getTime() <= currentDate.getTime()) {
          res.status(403);
          return res.json(
            {
              "errors": ["Past bookings can not be modified"],
              "statusCode": 403
            }
          )
        } else if (newStartDate.getTime() >= newEndDate.getTime()) {
          res.status(400);
          return res.json(
            {
              "message": "Validation error",
              "statusCode": 400,
              "errors": ["Invalid check out date"]
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
            "errors": ["Cannot edit booking that is not yours"],
            "statusCode": 400
          }
        )
      }
    } else {
      res.status(404);
      return res.json(
        {
          "errors": ["Booking couldn't be found"],
          "statusCode": 404
        }
      )
    }
  }
);

// Delete a Booking
router.delete('/:bookingId', requireAuth,
  async (req, res, next) => {
    const { user } = req;
    const { bookingId } = req.params;
    const booking = await Booking.findByPk(bookingId);
    let spot;
    if (booking) {
      spot = await Spot.findByPk(booking.spotId)
    }
    const currentDate = new Date();

    if (!booking || (user.id !== booking.userId && spot.ownerId !== user.id)) {
      res.status(404);
      return res.json(
        {
          "errors": ["Booking couldn't be found"],
          "statusCode": 404
        }
      )
    } else if (booking.startDate.getTime() <= currentDate.getTime()) {
      res.status(403);
      return res.json(
        {
          "errors": ["Bookings that have been started can't be deleted"],
          "statusCode": 403
        }
      )
    }

    await booking.destroy();
    return res.json(
      {
        "message": "Successfully deleted",
        "statusCode": 200
      }
    )
  }
)

module.exports = router;
