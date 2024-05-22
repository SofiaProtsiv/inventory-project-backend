const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require("cors");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const { DB_HOST, PORT = 3000 } = process.env;

mongoose.connect(DB_HOST)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.log('MongoDB connection error:', err.message);
    process.exit(1);
  });

const inventorySchema = new mongoose.Schema({
  _id: { type: Object },
  item_id: { type: Number },
  quantity: { type: Number },
  date_production_start: { type: String },
  date_received_into_inventory: { type: String },
  date_shipped_from_inventory: { type: String },
}, { versionKey: false, timestamps: true });

const Inventory = mongoose.model('Inventory', inventorySchema);

app.get('/', async (req, res) => {
  try {
    console.log('Received request for /');
    const data = await Inventory.find();
    console.log('Data retrieved from MongoDB:', data);
    res.json(data);
  } catch (error) {
    console.log('Error fetching data:', error.message);
    res.status(500).send(error.message);
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});