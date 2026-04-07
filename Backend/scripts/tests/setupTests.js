const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

jest.setTimeout(20000);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sportifycampus_test';

if (!global.__TEST_FILE_COUNT__) {
  const testFiles = fs.readdirSync(__dirname).filter(file => file.endsWith('.test.js'));
  global.__TEST_FILE_COUNT__ = testFiles.length;
  global.__TEST_FILES_REMAINING__ = testFiles.length;
}

beforeAll(async () => {
  if (!global.__MONGOOSE_CONNECTED__ && mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 20000,
    });
    global.__MONGOOSE_CONNECTED__ = true;
  }
});

afterAll(async () => {
  global.__TEST_FILES_REMAINING__ -= 1;
  if (global.__TEST_FILES_REMAINING__ === 0 && mongoose.connection.readyState !== 0) {
    await mongoose.connection.close(true);
  }
});
