const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;


// Middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.adan0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


// database funcation
async function run() {
    try {
        await client.connect();
        console.log('database')

    }
    finally {
        // await client.close();
    }

}

run().catch(console.dir);






app.get('/', (req, res) => {
    res.send('Welcome Masud Server')
})

app.listen(port, () => {
    console.log('Example app')
})