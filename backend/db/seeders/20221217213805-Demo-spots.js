'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  up: async (queryInterface, Sequelize) => {

    options.tableName = 'Spots';
    return queryInterface.bulkInsert(options, [
      {
        ownerId: 1,
        address: "123 Disney Lane",
        city: "San Francisco",
        state: "California",
        country: "United States of America",
        lat: 37.7645358,
        lng: -122.4730327,
        name: "App Academy",
        description: "Place where web developers are created",
        price: 123,
      },
      {
        ownerId: 2,
        address: "4883 Camaron Drive",
        city: "Atlanta",
        state: "Georgia",
        country: "United States of America",
        lat: 159.24356728,
        lng: -122.47303274,
        name: "Spectacular Craftsman Style Lake house",
        description: "Home sweet home",
        price: 553,
      },
      {
        ownerId: 3,
        address: "321 This Way",
        city: "Dallas",
        state: "Texas",
        country: "United States of America",
        lat: 456.7645358,
        lng: -67.4734567,
        name: "Hunting Library",
        description: "No way this is a house",
        price: 456,
      },
      {
        ownerId: 2,
        address: "479 JP",
        city: "Akihabrara",
        state: "Tokyo",
        country: "Japan",
        lat: 123.4567899,
        lng: 123.1234567,
        name: "Sandbox Studio",
        description: "4 beds, 2 baths with beautiful front yard",
        price: 789,
      },
      {
        ownerId: 1,
        address: "991 Jami Cir",
        city: "Eatonton",
        state: "GA",
        country: "United States of America",
        lat: 321.4567899,
        lng: 321.1234567,
        name: "Haven On The Lake",
        description: "12 guests | 4 bedrooms | 7 beds | 3.5 baths",
        price: 1200,
      },
      {
        ownerId: 3,
        address: "4312 Matthew Lane",
        city: "Lavonia",
        state: "Washington",
        country: "United States of America",
        lat: 654.4567899,
        lng: 456.1234567,
        name: "Waterfront on Lake Hartwell",
        description: "4 guests | 2 bedrooms | 2 beds | 1 bath",
        price: 300,
      },
      {
        ownerId: 2,
        address: "459 Minal Jasper Way",
        city: "Winston",
        state: "California",
        country: "United States of America",
        lat: 789.4567899,
        lng: 87.1234567,
        name: "Family Fun Relaxing Condo w/Amenties",
        description: "6 guests | 4 bedrooms | 5 beds | 3 baths",
        price: 954,
      },
      {
        ownerId: 3,
        address: "4312 Matthew Lane",
        city: "Phantomie",
        state: "Toronto",
        country: "Canada",
        lat: 34.4567899,
        lng: 91.1234567,
        name: "Cozy Cabin",
        description: "8 guests | 8 bedrooms | 6 beds | 2 baths",
        price: 621,
      },
    ])
  },

  down: async (queryInterface, Sequelize) => {

    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      ownerId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
