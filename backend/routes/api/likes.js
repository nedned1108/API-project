const { Router } = require('express');
const express = require('express');
const { Spot, User, sequelize } = require('../../db/models');
const { restoreUser, requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// Delete a Like
router.delete(
  '/:likeId',
  requireAuth,
  restoreUser,
  async (req, res, next) => {
      const { user } = req;
      const { likeId } =  req.params;
      const like = await Review.findByPk(parseInt(likeId));

      if (like) {
          if (like.userId === user.id) {
              await like.destroy();
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
                      "message": "Like couldn't be found",
                      "statusCode": 404
                  }
              )
          }
      } else {
          res.status(404);
          return res.json(
              {
                  "message": "Like couldn't be found",
                  "statusCode": 404
              }
          )
      }
  }
)
