const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json());

//========MongoDB==========

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bqfu1nq.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    //Database declaration
    const spotsCollection = client.db("spotsDB").collection("spots");
    const countriesCollection = client.db("spotsDB").collection("countries");

    app.get("/spots", async (req, res) => {
      const cursor = spotsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get('/countries', async(req, res) => {
      const cursor = countriesCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get("/spots/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await spotsCollection.findOne(query);
      res.send(result);
    });

    

    app.get("/mylist/:email", async (req, res) => {
      const Email = req.params.email;
      const query = { email: Email };
      const cursor = spotsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.put("/spots/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedSpot = req.body;
      const spot = {
        $set: {
          photo: updatedSpot.photo,
          name: updatedSpot.name,
          country: updatedSpot.country,
          location: updatedSpot.location,
          description: updatedSpot.description,
          average: updatedSpot.average,
          seasonality: updatedSpot.seasonality,
          time: updatedSpot.time,
          visitor: updatedSpot.visitor,
        },
      };
      const result = await spotsCollection.updateOne(filter, spot);
      res.send(result);
    });

    app.post("/spots", async (req, res) => {
      const newSpot = req.body;
      console.log(newSpot);
      const result = await spotsCollection.insertOne(newSpot);
      res.send(result);
    });

    app.delete('/spots/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await spotsCollection.deleteOne(query);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Ghure Asho Server is Running like a fox");
});

app.listen(port, () => {
  console.log(`Ghure Asho is running on port: ${port}`);
});
