require('dotenv').config();
const mongoose = require('mongoose');
const Food = require('../models/FoodModel');

// Tableau des aliments sains à insérer
const healthyFoods = [
  // Fruits
  {
    name: 'Apple',
    category: 'Fruits',
    caloriesPer100g: 52,
    proteinPer100g: 0.3,
    carbsPer100g: 14,
    fatPer100g: 0.2,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Red_Apple.jpg'
  },
  {
    name: 'Blueberries',
    category: 'Fruits',
    caloriesPer100g: 57,
    proteinPer100g: 0.7,
    carbsPer100g: 14,
    fatPer100g: 0.3,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Blueberries.jpg'
  },
  {
    name: 'Banana',
    category: 'Fruits',
    caloriesPer100g: 89,
    proteinPer100g: 1.1,
    carbsPer100g: 23,
    fatPer100g: 0.3,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg'
  },
  {
    name: 'Strawberries',
    category: 'Fruits',
    caloriesPer100g: 33,
    proteinPer100g: 0.7,
    carbsPer100g: 8,
    fatPer100g: 0.3,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/29/PerfectStrawberry.jpg'
  },
  {
    name: 'Orange',
    category: 'Fruits',
    caloriesPer100g: 47,
    proteinPer100g: 0.9,
    carbsPer100g: 12,
    fatPer100g: 0.1,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Oranges_-_whole_and_split.jpg/800px-Oranges_-_whole_and_split.jpg'
  },

  // Vegetables
  {
    name: 'Kale',
    category: 'Vegetables',
    caloriesPer100g: 35,
    proteinPer100g: 2.9,
    carbsPer100g: 4.4,
    fatPer100g: 1.5,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Kale-Bundle.jpg'
  },
  {
    name: 'Sweet Potato',
    category: 'Vegetables',
    caloriesPer100g: 86,
    proteinPer100g: 1.6,
    carbsPer100g: 20,
    fatPer100g: 0.1,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Sweet_potatoes.jpg'
  },
  {
    name: 'Broccoli',
    category: 'Vegetables',
    caloriesPer100g: 34,
    proteinPer100g: 2.8,
    carbsPer100g: 7,
    fatPer100g: 0.4,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/03/Broccoli_and_cross_section_edit.jpg'
  },
  {
    name: 'Spinach',
    category: 'Vegetables',
    caloriesPer100g: 23,
    proteinPer100g: 2.9,
    carbsPer100g: 3.6,
    fatPer100g: 0.4,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Spinacia_oleracea_Spinazie_bloeiend.jpg'
  },
  {
    name: 'Carrot',
    category: 'Vegetables',
    caloriesPer100g: 41,
    proteinPer100g: 0.9,
    carbsPer100g: 9.6,
    fatPer100g: 0.2,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Carrots_from_Marokko.JPG/800px-Carrots_from_Marokko.JPG'
  }
];


async function seedDB() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    console.log('✅ MongoDB connecté pour le seeding');

    // Suppression des anciens enregistrements
    await Food.deleteMany({});
    console.log('♻️ Anciennes données supprimées');

    // Insertion des nouvelles données
    const inserted = await Food.insertMany(healthyFoods);
    console.log(`🌱 ${inserted.length} aliments sains insérés avec succès !`);
    
    // Statistiques
    const categories = [...new Set(inserted.map(f => f.category))];
    console.log('\n📊 Statistiques :');
    console.log(`- Catégories : ${categories.join(', ')}`);
    
  } catch (err) {
    console.error('❌ Erreur de seeding :', err);
    process.exit(1);
  } finally {
    // Fermeture de la connexion
    await mongoose.connection.close();
    console.log('🔌 Connexion MongoDB fermée');
  }
}

// Exécution conditionnelle
if (require.main === module) {
  seedDB().then(() => {
    console.log('✨ Seeding terminé avec succès !');
    process.exit(0);
  });
}

module.exports = seedDB;