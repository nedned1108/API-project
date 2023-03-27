'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Likes';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 2,
        userId: 1
      },
      {
        spotId: 3,
        userId: 1
      },
      {
        spotId: 1,
        userId: 2
      },
    ])
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Likes';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
