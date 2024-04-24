const express = require("express");
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;
// Dotenv
require('dotenv').config();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.vjc6ohr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // Database Information
    const database = client.db("eDash");
    const products = database.collection("products");

    app.get("/products", async(req, res)=> {
      const cursor = products.find();
      const result = await cursor.toArray();
      res.send(result)
      console.log(result);
    })

    // Insert product -> POST
    app.post("/products", async(req, res)=> {
        const product = req.body;
        const result = await products.insertOne(product);
        res.send(result);
        console.log(product);
    });


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req, res) => {
  res.send(`API server is running on port: ${port}`);
});

app.listen(port, () => {
  console.log(`Server app is listening on port: ${port}`);
});
