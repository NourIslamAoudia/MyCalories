// seed/meal.seed.js
// Usage: node seed/meal.seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const Meal = require('../models/mealModel');

// MongoDB URI: use .env or fallback to local
const MONGO_URI = process.env.MONGO_URI;

// IDs provided by user
const USER_ID = '68790a56a091e0454295dea7';
const FOOD_ID = '68792d86d8a575095eca5c56';

// Sample meal names
const mealNames = ['Breakfast', 'Lunch', 'Snack', 'Dinner'];

// Generate 3 items referencing same FOOD_ID
const generateItems = () => [
  { food: FOOD_ID, amount: 100 + Math.floor(Math.random() * 100) },
  { food: FOOD_ID, amount: 100 + Math.floor(Math.random() * 100) },
  { food: FOOD_ID, amount: 100 + Math.floor(Math.random() * 100) }
];

async function seedMeals() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    console.log('✅ MongoDB connected:', MONGO_URI);

    // Remove existing meals for this user
    const delRes = await Meal.deleteMany({ user: USER_ID });
    console.log(`♻️ Removed ${delRes.deletedCount} existing meals for user ${USER_ID}`);

    // Build new meals
    const mealsToInsert = mealNames.map(name => ({
      name,
      user: USER_ID,
      items: generateItems(),
      calories: 0,
      proteinCalories: 0,
      carbCalories: 0,
      fatCalories: 0
    }));

    // Insert and calculate via pre-validate hook
    const created = await Meal.create(mealsToInsert);
    console.log(`🌱 Created ${created.length} meals:`);
    created.forEach(m => console.log(`   - ${m.name} (ID: ${m._id})`));

  } catch (err) {
    console.error('❌ Error seeding meals:', err.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  }
}

// Exécution conditionnelle
if (require.main === module) {
  seedMeals().then(() => {
    console.log('✨ Seeding terminé avec succès !');
    process.exit(0);
  });
}