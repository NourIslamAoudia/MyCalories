// meal.seed.js
const mongoose = require('mongoose');
const Meal = require('../models/MealModel');
const Food = require('../models/FoodModel');
require('dotenv').config();

const userId = '687ba970a1fe685b1e30d5cb';
const foodIds = [
  '687be464eb8c18a58214d851',
  '687be464eb8c18a58214d855',
  '687be464eb8c18a58214d86b',
  '687be464eb8c18a58214d86d',
  '687be464eb8c18a58214d8a4',
  '687be464eb8c18a58214d8ae',
  '687be464eb8c18a58214d8a9',
  '687be464eb8c18a58214d85b',
  '687be464eb8c18a58214d85c',
  '687be464eb8c18a58214d86c',
  '687be464eb8c18a58214d85e'
];

const startDate = new Date('2025-03-01');
const endDate = new Date('2025-07-31');

async function seedMeals() {
  try {
    // Connexion à MongoDB
        await mongoose.connect(process.env.MONGO_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          serverSelectionTimeoutMS: 5000
        });
        console.log('✅ MongoDB connecté pour le seeding');

    // Charger tous les aliments
    const foods = await Food.find({ _id: { $in: foodIds } });
    if (foods.length !== foodIds.length) {
      console.error('❌ Certains aliments n’ont pas été trouvés dans la base.');
      process.exit(1);
    }

    const meals = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      for (let j = 0; j < 4; j++) { // 4 repas par jour
        // Sélectionner 4 aliments uniques aléatoirement
        const shuffledFoods = [...foods].sort(() => 0.5 - Math.random());
        const selectedFoods = shuffledFoods.slice(0, 4);

        const items = selectedFoods.map(food => ({
          food: food._id,
          amount: Math.floor(Math.random() * 150) + 50 // 50g à 200g
        }));

        const meal = new Meal({
          name: `Meal ${j + 1} - ${currentDate.toISOString().split('T')[0]}`,
          user: userId,
          items,
          calories: 0,
          proteinCalories: 0,
          carbCalories: 0,
          fatCalories: 0,
          date: new Date(currentDate)
        });

        // Injecter les objets food pour le calcul
        meal.items.forEach((i, idx) => {
          i.food = selectedFoods[idx]; // réinjecter l'objet food pour chaque item
        });

        meal.calculateTotalCaloriesFromItems();

        // Remettre les IDs pour l'enregistrement en DB
        meal.items.forEach(i => {
          i.food = i.food._id;
        });

        meals.push(meal);
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    await Meal.insertMany(meals);
    console.log('✅ Seeded meals successfully.');
    process.exit();
  } catch (err) {
    console.error('❌ Error while seeding meals:', err);
    process.exit(1);
  }
}

seedMeals();
