'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  up: async (queryInterface, Sequelize) => {

    options.tableName = 'SpotImages';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        url: 'https://i.pinimg.com/564x/22/73/4c/22734c601b6d13432ef375abcf86a0e0.jpg',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://i.pinimg.com/564x/9d/bf/a2/9dbfa25af8189e6ccb0c24a9a5239175.jpg',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://i.pinimg.com/564x/d6/e9/a5/d6e9a579161fb7490ccee82333d29f72.jpg',
        preview: false
      },
      {
        spotId: 4,
        url: 'https://i.pinimg.com/564x/25/01/d5/2501d595a73c1a1cea9eb7f9ec00bebd.jpg',
        preview: false
      },
      {
        spotId: 5,
        url: 'https://cdnportal.mobalytics.gg/production/1969/10/Ionia-Splash-1920x960.jpg',
        preview: false
      },
      {
        spotId: 6,
        url: 'https://blog.displate.com/wp-content/uploads/2021/09/img_6138b2beedbd9.jpg',
        preview: false
      },
      {
        spotId: 7,
        url: 'https://i.etsystatic.com/36778254/r/il/580d0c/4040086766/il_fullxfull.4040086766_ol5e.jpg',
        preview: false
      },
      {
        spotId: 8,
        url: 'https://images.contentstack.io/v3/assets/blt187521ff0727be24/bltd170f10ccce6ba7e/614cc12077d06a0c9835f862/demacia_splash.jpeg',
        preview: false
      },
    ])
  },

  down: async (queryInterface, Sequelize) => {

    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
