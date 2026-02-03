const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

module.exports = {
    connect: async function() {
        const mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();

        await mongoose.connect(mongoUri, { dbName: "testDb" });
        console.log(`MongoDB is connected to ${mongoUri}`);
    }
}