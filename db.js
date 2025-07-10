// import mongoose from 'mongoose';

// const mongoUrl = 'mongodb://127.0.0.1:27017/kcs';

// mongoose.connect(mongoUrl, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });

// const db = mongoose.connection;

// db.on('connected', () => {
//     console.log('Connection established successfully');
// });

// db.on('error', (err) => {
//     console.error('Connection error occurred:', err);
// });

// db.on('disconnected', () => {
//     console.log('Connection disconnected');
// });


import mongoose from 'mongoose';

const mongoUrl = 'mongodb://127.0.0.1:27017/kcs';

// Function to establish a database connection
export const connectToDatabase = async () => {
    try {
        await mongoose.connect(mongoUrl); // Removed deprecated options
        console.log('Connection established successfully');
    } catch (err) {
        console.error('Connection error occurred:', err);
        process.exit(1); // Exit process if the connection fails
    }
};

// Listen to Mongoose connection events
mongoose.connection.on('disconnected', () => {
    console.log('Connection disconnected');
});
