const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
// Dotenv
require("dotenv").config();

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
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    // Database Information
    const database = client.db("eDash");
    const products = database.collection("products");
    const cart = database.collection("cart");

    // Find all products -> GET
    app.get("/products", async (req, res) => {
      const cursor = products.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Find a product by a specific id -> GET
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await products.findOne(query);
      res.send(result);
    });

    // Insert a product to DB -> POST
    app.post("/products", async (req, res) => {
      const product = req.body;
      const result = await products.insertOne(product);
      res.send(result);
    });

    // Update a product -> PUT
    app.put("/products/:id", async (req, res) => {
      const id = req.params.id;
      const selectedItem = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateProduct = {
        $set: {
          product_name: selectedItem.product_name,
          product_price: selectedItem.product_price,
          image_url: selectedItem.image_url,
          size: selectedItem.size,
          qty: selectedItem.qty,
          description: selectedItem.description,
        },
      };
      const result = await products.updateOne(filter, updateProduct, options);
      res.send(result);
    });

    // Delete a product based users req - Delete
    app.delete("/products/:id", async (req, res) => {
      const userReqDoc = req.params.id;
      const filter = { _id: new ObjectId(userReqDoc) };
      const result = await products.deleteOne(filter);
      res.send(result);
      // console.log(userReqDoc);
    });


    // Cart products Endpoints

    // Read all cart products
    app.get('/cart', async(req, res)=> {
      const cursor = cart.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Read user specific cart products that added to the cart by a user
    app.get("/cart/:userEmail", async(req, res)=> {
      const query = { userEmail: req.params.userEmail};
      const cursor = cart.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // inser cart products to db - POST
    app.post("/cart", async (req, res) => {
      const newCartProduct = req.body;
      const result = await cart.insertOne(newCartProduct);
      res.send(result);
      console.log(newCartProduct);
    });



    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
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
  res.send(`API server is running on port: ${port}`);
});

app.listen(port, () => {
  console.log(`Server app is listening on port: ${port}`);
});
