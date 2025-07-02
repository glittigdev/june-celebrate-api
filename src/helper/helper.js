'use strict';

module.exports = exports = {
  addTimestamps,
};

function addTimestamps(schema) {
  schema.pre('save', (next) => {
    console.log('save');
    let currentDate = new Date();

    this.updatedAt = currentDate;

    if (!this.createdAt) {
      this.createdAt = currentDate;
    }

    next();
  });
}
