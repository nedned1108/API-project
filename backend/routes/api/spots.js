const { Router } = require('express');
const express = require('express');
const { Spot, User, Review, SpotImage, Booking, ReviewImage, sequelize, Like } = require('../../db/models');
const { restoreUser, requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { Op } = require('sequelize');

const router = express.Router();

const validateSpot = [
  check('address')
    .exists({ checkFalsy: true })
    .withMessage('Street address is required'),
  check('address')
    .isLength({ max: 50 })
    .withMessage('Address must be less then 50 characters'),
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
    .isDecimal({ decimal_digits: '7' })
    .withMessage('Latitude is not valid'),
  check('lng')
    .exists({ checkFalsy: true })
    .isDecimal({ decimal_digits: '7' })
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
    .isInt({ min: 1, max: 5 })
    .withMessage('Stars must be an integer from 1 to 5'),
  handleValidationErrors
];

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

const validateSpotImage = [
  check('url')
    .exists({ checkFalsy: true })
    .withMessage('Please provide image url'),
  handleValidationErrors
];

// Get all Spots
router.get(
  '/',
  async (req, res, next) => {
    // Add Query Filters to Get All Spots
    let { page, size } = req.query;
    const query = {};
    if (page < 1) {
      res.status(400);
      return res.json(
        {
          "message": "Validation Error",
          "statusCode": 400,
          "errors": {
            "page": "Page must be greater than or equal to 1",
          }
        }
      )
    } else if (size < 1) {
      res.status(400);
      return res.json(
        {
          "message": "Validation Error",
          "statusCode": 400,
          "errors": {
            "page": "Size must be greater than or equal to 1",
          }
        }
      )
    }
    page = (page) ? +page : 1;
    size = (size) ? +size : 20;
    page = (page > 10) ? 10 : page;
    size = (size > 20) ? 20 : size;
    if (page > 0 && page <= 10 && size > 0 && size <= 20) {
      query.limit = size;
      query.offset = size * (page - 1);
    };

    const spots = await Spot.findAll({ raw: true, ...query });
    for (let spot of spots) {
      const avgReview = await Review.findAll({
        where: {
          spotId: spot.id
        },
        attributes: {
          include: [
            [
              sequelize.fn('AVG', sequelize.col('stars')), 'avgRating'
            ]
          ]
        },
        group: 'id',
        raw: true
      });
      const previewImage = await SpotImage.findAll({
        where: {
          spotId: spot.id
        },
        attributes: ['url'],
      })
      if (avgReview.length !== 0) {
        let sum = 0;
        for (avg of avgReview) {
          sum += avg.stars
        };
        spot.avgRating = sum / avgReview.length
      } else {
        spot.avgRating = 0;
      }

      if (previewImage[0]) {
        spot.previewImage = previewImage[0].url;
      } else {
        spot.previewImage = null;
      }
    };

    return res.json({ spots, page, size });
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
        const avgReview = await Review.findAll({
          where: {
            spotId: spot.id
          },
          attributes: {
            include: [
              [
                sequelize.fn('AVG', sequelize.col('stars')), 'avgRating'
              ]
            ]
          },
          group: 'id',
          raw: true
        });
        const previewImage = await SpotImage.findAll({
          where: {
            spotId: spot.id
          },
          attributes: ['url']
        })
        if (avgReview.length !== 0) {
          let sum = 0;
          for (avg of avgReview) {
            sum += avg.stars
          };
          spot.avgRating = sum / avgReview.length
        } else {
          spot.avgRating = 0;
        }

        if (previewImage[0]) {
          spot.previewImage = previewImage[0].url;
        } else {
          spot.previewImage = null;
        }
      };
      return res.json({ spots })
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
      const avgReview = await Review.findAll({
        where: {
          spotId: spot.id
        },
        attributes: {
          include: [
            [
              sequelize.fn('AVG', sequelize.col('stars')), 'avgRating'
            ]
          ]
        },
        group: 'id',
        raw: true
      });

      const numReviews = await spot.countReviews();

      spot = spot.toJSON();
      if (avgReview.length !== 0) {
        let sum = 0;
        for (avg of avgReview) {
          sum += avg.stars
        };
        spot.avgRating = sum / avgReview.length
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
      return res.json(
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
  validateSpotImage,
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
          { attributes: { exclude: ['spotId', 'createdAt', 'updatedAt'] } }
        );
        return res.json(newImage)
      } else {
        res.status(404);
        return res.json({
          "message": "Spot couldn't be found",
          "statusCode": 404
        })
      }
    } else {
      res.status(404);
      return res.json(
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
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
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
        return res.json({
          "message": "Spot couldn't be found",
          "statusCode": 404
        })
      }
    } else {
      res.status(404);
      return res.json(
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
        return res.json(
          {
            "message": "Successfully deleted",
            "statusCode": 200
          }
        )
      } else {
        res.status(404);
        return res.json(
          {
            "message": "Spot couldn't be found",
            "statusCode": 404
          }
        )
      }
    } else {
      res.status(404);
      return res.json(
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
    let spot = await Spot.findByPk(spotId)
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
    if (spot) {
      return res.json({ Reviews: reviews })
    }
    res.status(404);
    return res.json(
      {
        "message": "Spot couldn't be found",
        "statusCode": 404
      }
    )
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
    const existedReview = await Review.findOne({
      where: { userId: user.id }
    })

    if (existedReview && existedReview.spotId === Number(spotId)) {
      res.status(400)
      return res.json(
        {
          "statusCode": 400,
          "errors": ["Can not create more than 1 review for the same spot"]
        }
      )
    }

    if (spot) {
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
        return res.json(
          {
            "statusCode": 400,
            "errors": [
              "Can not create review for your own spot"
            ]
          }
        )
      }
    } else {
      res.status(404);
      return res.json(
        {
          "message": "Spot couldn't be found",
          "statusCode": 404
        }
      )
    }
  }
);

// Get all Bookings for a Spot based on the Spot's id
router.get(
  '/:spotId/bookings',
  requireAuth,
  restoreUser,
  async (req, res, next) => {
    const { user } = req;
    const { spotId } = req.params;
    const spot = await Spot.findByPk(parseInt(spotId));

    if (spot) {
      if (user.id === spot.ownerId) {
        const bookings = await Booking.findAll({
          include: {
            model: User,
            attributes: ['id', 'firstName', 'lastName']
          },
          where: { spotId: parseInt(spotId) }
        });
        return res.json({ Bookings: bookings });
      } else {
        const bookings = await Booking.findAll({
          attributes: ['spotId', 'startDate', 'endDate'],
          where: { spotId: parseInt(spotId) }
        });
        return res.json({ Bookings: bookings });
      }
    } else {
      res.status(404);
      return res.json(
        {
          "message": "Spot couldn't be found",
          "statusCode": 404
        }
      )
    }
  }
);

// Create a Booking from a Spot based on the Spot's id
router.post(
  '/:spotId/bookings',
  requireAuth,
  restoreUser,
  validateBooking,
  async (req, res, next) => {
    const { user } = req;
    const { spotId } = req.params;
    let { startDate, endDate } = req.body;
    const spot = await Spot.findByPk(parseInt(spotId));
    const bookedDate = await Booking.findAll({
      attributes: ['startDate', 'endDate'],
      where: {
        spotId: parseInt(spotId)
      }
    });

    if (spot) {
      if (user.id !== spot.ownerId) {
        newStartDate = new Date(startDate);
        newEndDate = new Date(endDate);
        for (let booked of bookedDate) {
          const bookedStartDate = new Date(booked.startDate);
          const bookedEndDate = new Date(booked.endDate);

          if ((newStartDate.getTime() >= bookedStartDate.getTime() && newStartDate.getTime() <= bookedEndDate.getTime()) ||
            (newStartDate.getTime() < bookedStartDate.getTime() && newEndDate.getTime() > bookedEndDate.getTime())) {
            res.status(403);
            return res.json(
              {
                "statusCode": 403,
                "errors": ["Sorry, this spot is already booked for the specified dates",]
              }
            )
          } else if ((newEndDate.getTime() >= bookedStartDate.getTime()) &&
            newEndDate.getTime() <= bookedEndDate.getTime()) {
            res.status(403);
            return res.json(
              {
                "statusCode": 403,
                "errors": ["Sorry, this spot is already booked for the specified dates"]
              }
            )
          }
        }

        if (newStartDate.getTime() >= newEndDate.getTime()) {
          res.status(400);
          return res.json(
            {
              "message": "Validation error",
              "statusCode": 400,
              "errors": ["Invalid check out date"]
            }
          )
        };
        const booking = await Booking.create({
          spotId: parseInt(spotId),
          userId: user.id,
          startDate: new Date(startDate),
          endDate: new Date(endDate)
        });
        return res.json({...booking, Spot: spot})

      } else {
        res.status(400);
        return res.json(
          {
            "errors": ["Can not book your own property"],
            "statusCode": 400
          }
        )
      }
    } else {
      res.status(404);
      return res.json(
        {
          "errors": ["Spot couldn't be found"],
          "statusCode": 404
        }
      )
    }
  }
);

// Create a Like for a Spot based on the Spot's id
router.post(
  '/:spotId/likes',
  requireAuth,
  restoreUser,
  async (req, res, next) => {
    const { user } = req;
    const { spotId } = req.params;
    const spot = await Spot.findByPk(parseInt(spotId));
    const existedLike = await Like.findOne({
      where: { userId: user.id }
    })

    if (existedLike && existedLike.spotId === Number(spotId)) {
      res.status(400)
      return res.json(
        {
          "statusCode": 400,
          "errors": ["Can not like the same spot more than once"]
        }
      )
    }

    if (spot) {
      if (spot.ownerId !== user.id) {
        const newLike = await Like.create({
          userId: user.id,
          spotId: parseInt(spotId)
        });

        return res.json(
          {
            "Likes": newLike,
            "statusCode": 200
          }
        )
      } else {
        res.status(400);
        return res.json(
          {
            "statusCode": 400,
            "errors": [
              "Can not like your own spot"
            ]
          }
        )
      }
    } else {
      res.status(404);
      return res.json(
        {
          "message": "Spot couldn't be found",
          "statusCode": 404
        }
      )
    }
  }
);

// Get all likes by a Spot's id
router.get(
  '/:spotId/likes',
  async (req, res, next) => {
    const { spotId } = req.params;
    let spot = await Spot.findByPk(spotId)
    const likes = await Like.findAll({
      where: {
        spotId: parseInt(spotId)
      }
    });
    if (spot) {
      return res.json({ Likes: likes })
    }
    res.status(404);
    return res.json(
      {
        "message": "Spot couldn't be found",
        "statusCode": 404
      }
    )
  }
);


module.exports = router;
