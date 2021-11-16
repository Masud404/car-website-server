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
        const database = client.db('rotors');
        const servicesCollection = database.collection('services');
        const orderCollection = database.collection('orders');
        const usersCollection = database.collection('users')
        const reviewCollection = database.collection('review')



        // get all Product
        app.get('/car', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })


        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.json(result)
        })

        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin })
        })

        // save data to database
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            console.log(result)
            res.json(result);
        })



        // review data to database
        app.post('/review', async (req, res) => {
            const user = req.body;
            const result = await reviewCollection.insertOne(user);
            console.log(result);
            res.json(result);
        })

        app.get('/review', async (req, res) => {
            const cursor = reviewCollection.find({});
            const review = await cursor.toArray();
            console.log(review)
            res.send(review);
        })

        // admin
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);
        })

        // GET Single Service

        app.get('/orders/:_id', async (req, res) => {
            const id = req.params._id;
            const query = { name: id }
            const result = await orderCollection.find(query).toArray();
            res.send(result);

        })

        // DELETE API
        app.delete('/orders/:_id', async (req, res) => {
            const id = req.params._id;
            const query = { name: id }
            const result = await orderCollection.deleteOne(query)
            res.json(result);

        })


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