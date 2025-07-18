require('dotenv').config();
const mongoose = require('mongoose');
const Food = require('../models/FoodModel');

// Tableau des aliments sains à insérer
const healthyFoods = [
  // --- Fruits (10 items) ---
  {
    name: 'Apple',
    category: 'Fruits',
    caloriesPer100g: 52,
    proteinPer100g: 0.3,
    carbsPer100g: 14,
    fatPer100g: 0.2,
    photoUrl: 'https://organicmandya.com/cdn/shop/files/Apples_bf998dd2-0ee8-4880-9726-0723c6fbcff3.jpg?v=1721368465&width=1000.jpg'
  },
  {
    name: 'Blueberries',
    category: 'Fruits',
    caloriesPer100g: 57,
    proteinPer100g: 0.7,
    carbsPer100g: 14,
    fatPer100g: 0.3,
    photoUrl: 'https://foodmarble.com/more/wp-content/uploads/2021/09/joanna-kosinska-4qujjbj3srs-unsplash-scaled.jpg'
  },
  {
    name: 'Banana',
    category: 'Fruits',
    caloriesPer100g: 89,
    proteinPer100g: 1.1,
    carbsPer100g: 23,
    fatPer100g: 0.3,
    photoUrl: 'https://images.stockcake.com/public/a/d/0/ad0a90cf-519e-4dc9-81d7-44268609ed3a_large/ripe-banana-peeled-stockcake.jpg'
  },
  {
    name: 'Strawberries',
    category: 'Fruits',
    caloriesPer100g: 33,
    proteinPer100g: 0.7,
    carbsPer100g: 8,
    fatPer100g: 0.3,
    photoUrl: 'https://cdn11.bigcommerce.com/s-kc25pb94dz/images/stencil/1280w/products/255/721/Strawberries__57434.1657116605.jpg'
  },
  {
    name: 'Orange',
    category: 'Fruits',
    caloriesPer100g: 47,
    proteinPer100g: 0.9,
    carbsPer100g: 12,
    fatPer100g: 0.1,
    photoUrl: 'https://www.fervalle.com/wp-content/uploads/2022/07/transparent-orange-apple5eacfeae85ac29.7815306015883956945475.png'
  },
  {
    name: 'Avocado',
    category: 'Fruits',
    caloriesPer100g: 160,
    proteinPer100g: 2,
    carbsPer100g: 9,
    fatPer100g: 15,
    photoUrl: 'https://cdn.britannica.com/72/170772-050-D52BF8C2/Avocado-fruits.jpg'
  },
  {
    name: 'Grapes',
    category: 'Fruits',
    caloriesPer100g: 69,
    proteinPer100g: 0.6,
    carbsPer100g: 18,
    fatPer100g: 0.2,
    photoUrl: 'https://farmfreshfundraising.com/wp-content/uploads/2017/10/271156-grapes.jpg'
  },
  {
    name: 'Mango',
    category: 'Fruits',
    caloriesPer100g: 60,
    proteinPer100g: 0.8,
    carbsPer100g: 15,
    fatPer100g: 0.4,
    photoUrl: 'https://exoticfruitbox.com/wp-content/uploads/2015/10/mango.jpg'
  },
  {
    name: 'Pineapple',
    category: 'Fruits',
    caloriesPer100g: 50,
    proteinPer100g: 0.5,
    carbsPer100g: 13,
    fatPer100g: 0.1,
    photoUrl: 'https://www.producemarketguide.com/media/user_RZKVrm5KkV/701/pineapple_commodity-page.png'
  },
  {
    name: 'Kiwi',
    category: 'Fruits',
    caloriesPer100g: 61,
    proteinPer100g: 1.1,
    carbsPer100g: 15,
    fatPer100g: 0.5,
    photoUrl: 'https://cdn.britannica.com/45/126445-050-4C0FA9F6/Kiwi-fruit.jpg'
  },

  // --- Vegetables (10 items) ---
  {
    name: 'Kale',
    category: 'Vegetables',
    caloriesPer100g: 35,
    proteinPer100g: 2.9,
    carbsPer100g: 4.4,
    fatPer100g: 1.5,
    photoUrl: 'https://www.veggycation.com.au/siteassets/veggycationvegetable/kale.jpg'
  },
  {
    name: 'Sweet Potato',
    category: 'Vegetables',
    caloriesPer100g: 86,
    proteinPer100g: 1.6,
    carbsPer100g: 20,
    fatPer100g: 0.1,
    photoUrl: 'https://japanesetaste.in/cdn/shop/articles/how-to-make-yaki-imo-baked-japanese-sweet-potato-japanese-taste.jpg?v=1737982163&width=5760.jpg'
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
    photoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_StkzMBYOPsjPSDqqQ4SNteGH0LViwPpUeg&s/jpg'
  },
  {
    name: 'Carrot',
    category: 'Vegetables',
    caloriesPer100g: 41,
    proteinPer100g: 0.9,
    carbsPer100g: 9.6,
    fatPer100g: 0.2,
    photoUrl: 'https://www.lovefoodhatewaste.com/sites/default/files/styles/open_graph_image/public/2022-06/Carrots.jpg.webp?itok=aBgglla9.jpg'
  },
  {
    name: 'Bell Pepper (Red)',
    category: 'Vegetables',
    caloriesPer100g: 31,
    proteinPer100g: 1,
    carbsPer100g: 6,
    fatPer100g: 0.3,
    photoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxWdlKgytO_diyJkMxhaphD_xcJmLzNwhjGg&s.jpg'
  },
  {
    name: 'Cucumber',
    category: 'Vegetables',
    caloriesPer100g: 15,
    proteinPer100g: 0.7,
    carbsPer100g: 3.6,
    fatPer100g: 0.1,
    photoUrl: 'https://www.lovefoodhatewaste.com/sites/default/files/styles/16_9_two_column/public/2022-07/Cucumber.jpg.webp?itok=ijvKaGKr.jpg'
  },
  {
    name: 'Tomato',
    category: 'Vegetables',
    caloriesPer100g: 18,
    proteinPer100g: 0.9,
    carbsPer100g: 3.9,
    fatPer100g: 0.2,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Tomato_je.jpg/800px-Tomato_je.jpg'
  },
  {
    name: 'Zucchini',
    category: 'Vegetables',
    caloriesPer100g: 17,
    proteinPer100g: 1.2,
    carbsPer100g: 3.1,
    fatPer100g: 0.3,
    photoUrl: 'https://chefsmandala.com/wp-content/uploads/2018/03/Squash-Zucchini.jpg'
  },
  {
    name: 'Asparagus',
    category: 'Vegetables',
    caloriesPer100g: 20,
    proteinPer100g: 2.2,
    carbsPer100g: 3.9,
    fatPer100g: 0.2,
    photoUrl: 'https://themom100.com/wp-content/uploads/2024/04/how-to-make-roasted-asparagus-355b.jpg'
  },

  // --- Proteins (10 items) ---
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
  {
    name: 'Cod Fish',
    category: 'Proteins',
    caloriesPer100g: 82,
    proteinPer100g: 18,
    carbsPer100g: 0,
    fatPer100g: 0.7,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Atlantic_cod_fishing_port_of_Audierne.jpg/800px-Atlantic_cod_fishing_port_of_Audierne.jpg'
  },
  {
    name: 'Greek Yogurt (0% fat)',
    category: 'Proteins',
    caloriesPer100g: 59,
    proteinPer100g: 10,
    carbsPer100g: 3.6,
    fatPer100g: 0.4,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2d/Yogurt_%281%29.jpg'
  },
  {
    name: 'Turkey Breast',
    category: 'Proteins',
    caloriesPer100g: 147,
    proteinPer100g: 30,
    carbsPer100g: 0,
    fatPer100g: 2.1,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Raw_turkey_breast_fillets.jpg/800px-Raw_turkey_breast_fillets.jpg'
  },
  {
    name: 'Shrimp',
    category: 'Proteins',
    caloriesPer100g: 85,
    proteinPer100g: 20,
    carbsPer100g: 0.3,
    fatPer100g: 0.3,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Shrimp_2017.jpg/800px-Shrimp_2017.jpg'
  },
  {
    name: 'Lean Beef',
    category: 'Proteins',
    caloriesPer100g: 250,
    proteinPer100g: 26,
    carbsPer100g: 0,
    fatPer100g: 15,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Beef_steak_with_rosemary.jpg/800px-Beef_steak_with_rosemary.jpg'
  },

  // --- Grains (10 items) ---
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
  {
    name: 'Whole Wheat Bread',
    category: 'Grains',
    caloriesPer100g: 247,
    proteinPer100g: 13,
    carbsPer100g: 41,
    fatPer100g: 3.7,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Whole_Wheat_Bread_Loaf.jpg/800px-Whole_Wheat_Bread_Loaf.jpg'
  },
  {
    name: 'Barley',
    category: 'Grains',
    caloriesPer100g: 352,
    proteinPer100g: 12.5,
    carbsPer100g: 73.5,
    fatPer100g: 2.3,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Barley_seeds.jpg/800px-Barley_seeds.jpg'
  },
  {
    name: 'Buckwheat',
    category: 'Grains',
    caloriesPer100g: 343,
    proteinPer100g: 13,
    carbsPer100g: 72,
    fatPer100g: 3.4,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Buckwheat_groats.jpg/800px-Buckwheat_groats.jpg'
  },
  {
    name: 'Whole Wheat Pasta',
    category: 'Grains',
    caloriesPer100g: 345,
    proteinPer100g: 13,
    carbsPer100g: 69,
    fatPer100g: 2.5,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Whole_wheat_pasta.jpg/800px-Whole_wheat_pasta.jpg'
  },
  {
    name: 'Millet',
    category: 'Grains',
    caloriesPer100g: 378,
    proteinPer100g: 11,
    carbsPer100g: 73,
    fatPer100g: 4.2,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Millet_%28Pennisetum_glaucum%29.jpg/800px-Millet_%28Pennisetum_glaucum%29.jpg'
  },
  {
    name: 'Sorghum',
    category: 'Grains',
    caloriesPer100g: 329,
    proteinPer100g: 11,
    carbsPer100g: 72,
    fatPer100g: 3.3,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Sorghum_bicolor_inflorescence_detail.jpg/800px-Sorghum_bicolor_inflorescence_detail.jpg'
  },
  {
    name: 'Farro',
    category: 'Grains',
    caloriesPer100g: 337,
    proteinPer100g: 12,
    carbsPer100g: 70,
    fatPer100g: 2.5,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Farro_grains.jpg/800px-Farro_grains.jpg'
  },

  // --- Nuts and Seeds (10 items) ---
  {
    name: 'Chia Seeds',
    category: 'Seeds', // Kept original sub-category for consistency
    caloriesPer100g: 486,
    proteinPer100g: 17,
    carbsPer100g: 42,
    fatPer100g: 31,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/36/Chia_seeds_on_black_background.jpg'
  },
  {
    name: 'Almonds',
    category: 'Seeds', // Kept original sub-category for consistency
    caloriesPer100g: 579,
    proteinPer100g: 21,
    carbsPer100g: 22,
    fatPer100g: 50,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Almonds.jpg'
  },
  {
    name: 'Walnuts',
    category: 'Seeds', // Kept original sub-category for consistency
    caloriesPer100g: 654,
    proteinPer100g: 15,
    carbsPer100g: 14,
    fatPer100g: 65,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Walnuts_%28cracked%29.JPG/800px-Walnuts_%28cracked%29.JPG'
  },
  {
    name: 'Flaxseeds',
    category: 'Seeds', // Kept original sub-category for consistency
    caloriesPer100g: 534,
    proteinPer100g: 18,
    carbsPer100g: 29,
    fatPer100g: 42,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Flaxseeds.jpg/800px-Flaxseeds.jpg'
  },
  {
    name: 'Pistachios',
    category: 'Nuts',
    caloriesPer100g: 557,
    proteinPer100g: 20,
    carbsPer100g: 28,
    fatPer100g: 45,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Pistachios_in_shells.jpg/800px-Pistachios_in_shells.jpg'
  },
  {
    name: 'Cashews',
    category: 'Nuts',
    caloriesPer100g: 553,
    proteinPer100g: 18,
    carbsPer100g: 30,
    fatPer100g: 44,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Cashews.jpg/800px-Cashews.jpg'
  },
  {
    name: 'Peanuts',
    category: 'Legumes (often consumed as nuts)', // Clarified category for common usage
    caloriesPer100g: 567,
    proteinPer100g: 26,
    carbsPer100g: 16,
    fatPer100g: 49,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Peanuts_%28Arachis_hypogaea%29.jpg/800px-Peanuts_%28Arachis_hypogaea%29.jpg'
  },
  {
    name: 'Sunflower Seeds',
    category: 'Seeds',
    caloriesPer100g: 584,
    proteinPer100g: 21,
    carbsPer100g: 20,
    fatPer100g: 51,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Sunflower_seeds.jpg/800px-Sunflower_seeds.jpg'
  },
  {
    name: 'Pumpkin Seeds',
    category: 'Seeds',
    caloriesPer100g: 559,
    proteinPer100g: 24,
    carbsPer100g: 18,
    fatPer100g: 49,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Pumpkin_seeds_in_bowl.jpg/800px-Pumpkin_seeds_in_bowl.jpg'
  },
  {
    name: 'Hazelnuts',
    category: 'Nuts',
    caloriesPer100g: 628,
    proteinPer100g: 15,
    carbsPer100g: 17,
    fatPer100g: 61,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Hazelnuts_%28Corylus_avellana%29.jpg/800px-Hazelnuts_%28Corylus_avellana%29.jpg'
  },

  // --- Dairy (10 items) ---
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
  {
    name: 'Feta Cheese',
    category: 'Dairy',
    caloriesPer100g: 264,
    proteinPer100g: 14,
    carbsPer100g: 4.1,
    fatPer100g: 21,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Feta_cheese_block.jpg/800px-Feta_cheese_block.jpg'
  },
  {
    name: 'Kefir',
    category: 'Dairy',
    caloriesPer100g: 64,
    proteinPer100g: 3.8,
    carbsPer100g: 4.8,
    fatPer100g: 3.5,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Kefir_in_glass.jpg/800px-Kefir_in_glass.jpg'
  },
  {
    name: 'Parmesan Cheese',
    category: 'Dairy',
    caloriesPer100g: 431,
    proteinPer100g: 38,
    carbsPer100g: 4.1,
    fatPer100g: 29,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Parmesan_cheese.jpg/800px-Parmesan_cheese.jpg'
  },
  {
    name: 'Ricotta Cheese (Part-Skim)',
    category: 'Dairy',
    caloriesPer100g: 138,
    proteinPer100g: 11,
    carbsPer100g: 3,
    fatPer100g: 7,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Ricotta.jpg/800px-Ricotta.jpg'
  },
  {
    name: 'Swiss Cheese',
    category: 'Dairy',
    caloriesPer100g: 380,
    proteinPer100g: 27,
    carbsPer100g: 1.4,
    fatPer100g: 30,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Swiss_Cheese.jpg/800px-Swiss_Cheese.jpg'
  },
  {
    name: 'Buttermilk',
    category: 'Dairy',
    caloriesPer100g: 40,
    proteinPer100g: 3.3,
    carbsPer100g: 4.8,
    fatPer100g: 0.9,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Buttermilk.jpg/800px-Buttermilk.jpg'
  },
  {
    name: 'Skim Milk Powder',
    category: 'Dairy',
    caloriesPer100g: 362,
    proteinPer100g: 36,
    carbsPer100g: 52,
    fatPer100g: 0.8,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Skim_Milk_Powder.jpg/800px-Skim_Milk_Powder.jpg'
  },

  // --- Legumes (10 items) ---
  {
    name: 'Chickpeas',
    category: 'Legumes',
    caloriesPer100g: 164,
    proteinPer100g: 8.9,
    carbsPer100g: 27,
    fatPer100g: 2.6,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Garbanzo_beans_%28chickpeas%29.jpg/800px-Garbanzo_beans_%28chickpeas%29.jpg'
  },
  {
    name: 'Black Beans',
    category: 'Legumes',
    caloriesPer100g: 132,
    proteinPer100g: 8.9,
    carbsPer100g: 24,
    fatPer100g: 0.5,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Black_Beans.jpg/800px-Black_Beans.jpg'
  },
  {
    name: 'Kidney Beans',
    category: 'Legumes',
    caloriesPer100g: 127,
    proteinPer100g: 8.7,
    carbsPer100g: 23,
    fatPer100g: 0.5,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Kidney_Beans.jpg/800px-Kidney_Beans.jpg'
  },
  {
    name: 'Navy Beans',
    category: 'Legumes',
    caloriesPer100g: 128,
    proteinPer100g: 8.2,
    carbsPer100g: 24,
    fatPer100g: 0.5,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Navy_beans.jpg/800px-Navy_beans.jpg'
  },
  {
    name: 'Lima Beans',
    category: 'Legumes',
    caloriesPer100g: 115,
    proteinPer100g: 7.7,
    carbsPer100g: 20,
    fatPer100g: 0.4,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Lima_beans_in_pod.jpg/800px-Lima_beans_in_pod.jpg'
  },
  {
    name: 'Pinto Beans',
    category: 'Legumes',
    caloriesPer100g: 143,
    proteinPer100g: 9,
    carbsPer100g: 26,
    fatPer100g: 0.6,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Pinto_Beans_%283407981358%29.jpg/800px-Pinto_Beans_%283407981358%29.jpg'
  },
  {
    name: 'Split Peas',
    category: 'Legumes',
    caloriesPer100g: 118,
    proteinPer100g: 8.3,
    carbsPer100g: 21,
    fatPer100g: 0.4,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Split_peas.jpg/800px-Split_peas.jpg'
  },
  {
    name: 'Edamame',
    category: 'Legumes',
    caloriesPer100g: 122,
    proteinPer100g: 11,
    carbsPer100g: 10,
    fatPer100g: 5,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Edamame_beans.jpg/800px-Edamame_beans.jpg'
  },
  {
    name: 'Cannellini Beans',
    category: 'Legumes',
    caloriesPer100g: 139,
    proteinPer100g: 9.7,
    carbsPer100g: 24,
    fatPer100g: 0.6,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Cannellini_beans_%28dried%29.jpg/800px-Cannellini_beans_%28dried%29.jpg'
  },
  {
    name: 'Mung Beans',
    category: 'Legumes',
    caloriesPer100g: 347,
    proteinPer100g: 24,
    carbsPer100g: 63,
    fatPer100g: 1.3,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Mung_beans.jpg/800px-Mung_beans.jpg'
  },

  // --- Healthy Fats (10 items) ---
  {
    name: 'Olive Oil',
    category: 'Healthy Fats',
    caloriesPer100g: 884,
    proteinPer100g: 0,
    carbsPer100g: 0,
    fatPer100g: 100,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Olive_oil_bottle_and_olives.jpg/800px-Olive_oil_bottle_and_olives.jpg'
  },
  {
    name: 'Avocado Oil',
    category: 'Healthy Fats',
    caloriesPer100g: 884,
    proteinPer100g: 0,
    carbsPer100g: 0,
    fatPer100g: 100,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Avocado_Oil.jpg/800px-Avocado_Oil.jpg'
  },
  {
    name: 'Coconut Oil',
    category: 'Healthy Fats',
    caloriesPer100g: 862,
    proteinPer100g: 0,
    carbsPer100g: 0,
    fatPer100g: 100,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Coconut_oil_in_a_jar.jpg/800px-Coconut_oil_in_a_jar.jpg'
  },
  {
    name: 'Flaxseed Oil',
    category: 'Healthy Fats',
    caloriesPer100g: 884,
    proteinPer100g: 0,
    carbsPer100g: 0,
    fatPer100g: 100,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Flaxseed_oil_bottle.jpg/800px-Flaxseed_oil_bottle.jpg'
  },
  {
    name: 'Walnut Oil',
    category: 'Healthy Fats',
    caloriesPer100g: 884,
    proteinPer100g: 0,
    carbsPer100g: 0,
    fatPer100g: 100,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Walnut_oil.jpg/800px-Walnut_oil.jpg'
  },
  {
    name: 'Almond Butter',
    category: 'Healthy Fats',
    caloriesPer100g: 614,
    proteinPer100g: 21,
    carbsPer100g: 20,
    fatPer100g: 56,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Almond_Butter_Jar.jpg/800px-Almond_Butter_Jar.jpg'
  },
  {
    name: 'Peanut Butter (Natural)',
    category: 'Healthy Fats',
    caloriesPer100g: 588,
    proteinPer100g: 25,
    carbsPer100g: 20,
    fatPer100g: 50,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Peanut_butter_smooth.jpg/800px-Peanut_butter_smooth.jpg'
  },
  {
    name: 'Ghee (Clarified Butter)',
    category: 'Healthy Fats',
    caloriesPer100g: 896,
    proteinPer100g: 0.3,
    carbsPer100g: 0,
    fatPer100g: 99.5,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Ghee_%28clarified_butter%29.jpg/800px-Ghee_%28clarified_butter%29.jpg'
  },
  {
    name: 'Macadamia Nut Oil',
    category: 'Healthy Fats',
    caloriesPer100g: 884,
    proteinPer100g: 0,
    carbsPer100g: 0,
    fatPer100g: 100,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Macadamia_oil.jpg/800px-Macadamia_oil.jpg'
  },
  {
    name: 'Sesame Oil',
    category: 'Healthy Fats',
    caloriesPer100g: 884,
    proteinPer100g: 0,
    carbsPer100g: 0,
    fatPer100g: 100,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Sesame_oil.jpg/800px-Sesame_oil.jpg'
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