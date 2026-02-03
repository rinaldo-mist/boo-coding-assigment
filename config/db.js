const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const env = process.env.NODE_ENV || 'test';

    let mongoServer;
    let isConnected = false;

module.exports = {
    connect: async function() {
        if (isConnected) return;
        if (env === 'test') { 
            mongoServer = await MongoMemoryServer.create();
            isConnected = false;

            const mongoUri = mongoServer.getUri();

            await mongoose.connect(mongoUri, { dbName: "testDb" });
            console.log(`MongoDB is connected to ${mongoUri}`);
        } else {
            const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/soulverse';

            await mongoose.connect(uri);
            console.log('Mongo connected:', uri);
        }
        isConnected = true;
    },
    close: async function() {
        if (!isConnected) return;

        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();

        if (mongoServer) await mongoServer.stop();

        isConnected = false;
    }
}