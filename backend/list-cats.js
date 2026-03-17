const mongoose = require('mongoose');
const Category = require('./src/models/Category');

async function listCategories() {
  try {
    await mongoose.connect('mongodb+srv://furqanSandsOrnaments:abcfrk123@cluster0.nywnexf.mongodb.net/');
    const categories = await Category.find({ metal: { $in: ['silver', 'gold', 'Silver', 'Gold'] } });
    console.log(JSON.stringify(categories, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

listCategories();
