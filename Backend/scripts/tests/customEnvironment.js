const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const { TestEnvironment } = require('jest-environment-node');
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sportifycampus_test';

class CustomEnvironment extends TestEnvironment {
  async setup() {
    await super.setup();
    console.log('CUSTOM ENV setup', { NODE_ENV: process.env.NODE_ENV, MONGODB_URI });

    if (process.env.NODE_ENV === 'test' && mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('CUSTOM ENV connected', mongoose.connection.readyState);
    }
  }

  async teardown() {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close(true);
    }
    await super.teardown();
  }
}

module.exports = CustomEnvironment;
