const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qm6ghoc.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async() => {
    try{
        const appointmentCollections = client.db('doctorsPortalTwo').collection('appointmentInfo');
        app.get('/appointments', async(req, res)=>{
            const query = {};
            const cursor = appointmentCollections.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })
    }
    finally{

    }
}
run().catch( error=> console.error(error))








app.get('/', (req, res) => {
    res.send('Doctors Server is Running')
})

app.listen(port, () => {
    console.log(`Doctors Server is Running on port ${port}`)
})