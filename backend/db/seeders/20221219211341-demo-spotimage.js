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
      {
        spotId: 9,
        url: 'https://a0.muscache.com/im/pictures/prohost-api/Hosting-26942968/original/8c89f2d8-7791-495f-8caa-65ee521ec6c4.jpeg',
        preview: false
      },
      {
        spotId: 10,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-654247531872357893/original/54e138e6-4e49-4bfc-a822-fa3f96aac1e0.jpeg',
        preview: false
      },
      {
        spotId: 11,
        url: 'https://a0.muscache.com/im/pictures/prohost-api/Hosting-654247531872357893/original/67860e7a-7430-48e7-a372-b9802d367795.jpeg',
        preview: false
      },
      {
        spotId: 12,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-808596818384709853/original/3f9e033c-432a-4fe1-ba70-98eb7236823b.jpeg',
        preview: false
      },
      {
        spotId: 13,
        url: 'https://a0.muscache.com/im/pictures/8ea5cfae-2d8e-40d4-9249-4a0dab5c2044.jpg',
        preview: false
      },
      {
        spotId: 14,
        url: 'https://a0.muscache.com/im/pictures/prohost-api/Hosting-697169580264978182/original/ce04bb95-6097-48d9-a117-6bc72d5ecd84.jpeg',
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
