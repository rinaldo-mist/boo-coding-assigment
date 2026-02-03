'use strict';

const app = require('./app.js');
const db = require('./config/db.js');
const port =  process.env.PORT || 3000;

// start server
db.connect().then(() => {
    try {
        const server = app.listen(port);
        console.log('Express started. Listening on %s', port);
    } catch (err) {
        console.log('error connecting to database...')
    }
}).catch(err => {
    console.error('invalid database connection...'+ err);
})

// (async () => {
//   await db.connect();
//   app.listen(port, () => {
//     console.log(`Server running on port ${port}`);
//   });
// })();