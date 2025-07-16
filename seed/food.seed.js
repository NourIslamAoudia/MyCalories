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
  },

  // Proteins
  {
    name: 'Salmon',
    category: 'Proteins',
    caloriesPer100g: 208,
    proteinPer100g: 20,
    carbsPer100g: 0,
    fatPer100g: 13,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/39/Salmo_salar.jpg'
  },
  {
    name: 'Lentils',
    category: 'Proteins',
    caloriesPer100g: 116,
    proteinPer100g: 9,
    carbsPer100g: 20,
    fatPer100g: 0.4,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Lentils_bowl.jpg'
  },
  {
    name: 'Chicken Breast',
    category: 'Proteins',
    caloriesPer100g: 165,
    proteinPer100g: 31,
    carbsPer100g: 0,
    fatPer100g: 3.6,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Chicken_breast.jpg'
  },
  {
    name: 'Tofu',
    category: 'Proteins',
    caloriesPer100g: 76,
    proteinPer100g: 8,
    carbsPer100g: 1.9,
    fatPer100g: 4.8,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/fd/Nasoya_Tofu.jpg'
  },
  {
    name: 'Eggs',
    category: 'Proteins',
    caloriesPer100g: 155,
    proteinPer100g: 13,
    carbsPer100g: 1.1,
    fatPer100g: 11,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Eggs-freshly-laid.jpg/800px-Eggs-freshly-laid.jpg'
  },

  // Grains entiers
  {
    name: 'Quinoa',
    category: 'Grains',
    caloriesPer100g: 120,
    proteinPer100g: 4.4,
    carbsPer100g: 21,
    fatPer100g: 1.9,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Quinoa_-_BS.jpg'
  },
  {
    name: 'Brown Rice',
    category: 'Grains',
    caloriesPer100g: 111,
    proteinPer100g: 2.6,
    carbsPer100g: 23,
    fatPer100g: 0.9,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ed/Long_Grain_Brown_Rice.jpg'
  },
  {
    name: 'Oats',
    category: 'Grains',
    caloriesPer100g: 389,
    proteinPer100g: 16.9,
    carbsPer100g: 66.3,
    fatPer100g: 6.9,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Oats_closeup.jpg/800px-Oats_closeup.jpg'
  },

  // Noix et graines
  {
    name: 'Chia Seeds',
    category: 'Seeds',
    caloriesPer100g: 486,
    proteinPer100g: 17,
    carbsPer100g: 42,
    fatPer100g: 31,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/36/Chia_seeds_on_black_background.jpg'
  },
  {
    name: 'Almonds',
    category: 'Seeds',
    caloriesPer100g: 579,
    proteinPer100g: 21,
    carbsPer100g: 22,
    fatPer100g: 50,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Almonds.jpg'
  },
  {
    name: 'Walnuts',
    category: 'Seeds',
    caloriesPer100g: 654,
    proteinPer100g: 15,
    carbsPer100g: 14,
    fatPer100g: 65,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Walnuts_%28cracked%29.JPG/800px-Walnuts_%28cracked%29.JPG'
  },

  // Produits laitiers
  {
    name: 'Greek Yogurt',
    category: 'Dairy',
    caloriesPer100g: 59,
    proteinPer100g: 10,
    carbsPer100g: 3.6,
    fatPer100g: 0.4,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2d/Yogurt_%281%29.jpg'
  },
  {
    name: 'Cottage Cheese',
    category: 'Dairy',
    caloriesPer100g: 98,
    proteinPer100g: 11,
    carbsPer100g: 3.4,
    fatPer100g: 4.3,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Cottage_cheese_1.jpg'
  },
  {
    name: 'Milk (1% fat)',
    category: 'Dairy',
    caloriesPer100g: 42,
    proteinPer100g: 3.4,
    carbsPer100g: 5,
    fatPer100g: 1,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Milk_glass_and_bottle.jpg/800px-Milk_glass_and_bottle.jpg'
  },

  // Legumes (New Category)
  {
    name: 'Chickpeas',
    category: 'Legumes',
    caloriesPer100g: 164,
    proteinPer100g: 8.9,
    carbsPer100g: 27,
    fatPer100g: 2.6,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Garbanzo_beans_%28chickpeas%29.jpg/800px-Garbanzo_beans_%28chickpeas%29.jpg'
  },

  // Healthy Fats (New Category)
  {
    name: 'Olive Oil',
    category: 'Healthy Fats',
    caloriesPer100g: 884,
    proteinPer100g: 0,
    carbsPer100g: 0,
    fatPer100g: 100,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Olive_oil_bottle_and_olives.jpg/800px-Olive_oil_bottle_and_olives.jpg'
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