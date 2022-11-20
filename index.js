const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qm6ghoc.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async () => {
    try {
        const appointmentCollections = client.db('doctorsPortalTwo').collection('appointmentInfo');
        const bookingCollection = client.db('doctorsPortalTwo').collection('bookings');

        // get appointments data from database
        app.get('/appointments', async (req, res) => {
            const date = req.query.date;
            // console.log(date);
            const query = {};
            const options = await appointmentCollections.find(query).toArray();
            const bookingDate = { appointmentDate: date };
            const alreadyBooked = await bookingCollection.find(bookingDate).toArray();
            options.forEach(option => {
                const optionBooked = alreadyBooked.filter(book => book.treatement === option.name);
                const bookedSlot = optionBooked.map(book => book.slot);
                const reminingSolts = option.slots.filter(slot => !bookedSlot.includes(slot));
                option.slots = reminingSolts;
            })

            res.send(options);
        })


        app.get('/bookings', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const bookings = await bookingCollection.find(query).toArray();
            res.send(bookings)
        })



        // added booking data form database
        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            console.log(booking);
            const query = {
                appointmentDate: booking.appointmentDate,
                treatement: booking.treatement,
                email: booking.email
            }

            const alreadyBooked = await bookingCollection.find(query).toArray();

            if (alreadyBooked.length) {
                const message = `You Have Already Booked on ${booking.appointmentDate}`
                return res.send({ acknowledged: false, message })
            }

            const bookings = await bookingCollection.insertOne(booking);
            res.send(bookings)
        })

    }
    finally {

    }
}
run().catch(error => console.error(error))


app.get('/', (req, res) => {
    res.send('Doctors Server is Running')
})

app.listen(port, () => {
    console.log(`Doctors Server is Running on port ${port}`)
})