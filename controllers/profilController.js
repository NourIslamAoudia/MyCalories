// controllers/profilController.js
const User = require('../models/UserModel');

/**
 * Helper to extract user from the authenticated request
 */
const getUserFromRequest = async (req) => {
  const userId = req.user?.id;
  if (!userId) throw new Error("User ID not found in request");

  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  return user;
};

/**
 * GET /profil
 * Get user profile details
 */
exports.getProfil = async (req, res) => {
  try {
    const user = await getUserFromRequest(req);

    res.json({
      username: user.username,
      age: user.age,
      height: user.height,
      weight: user.weight,
      sex: user.sex
    });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

/**
 * PUT /profil
 * Update user profile (age, height, weight, sex)
 */
exports.updateProfil = async (req, res) => {
  try {
    const user = await getUserFromRequest(req);
    const { age, height, weight, sex } = req.body;

    if (age !== undefined) user.age = age;
    if (height !== undefined) user.height = height;
    if (weight !== undefined) user.weight = weight;
    if (sex !== undefined) user.sex = sex;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        username: user.username,
        age: user.age,
        height: user.height,
        weight: user.weight,
        sex: user.sex
      }
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * GET /profil/bmr?activityFactor=1.4
 * Calculate BMR and daily calorie needs
 */
exports.getCalories = async (req, res) => {
  try {
    const user = await getUserFromRequest(req);
    const activityFactor = parseFloat(req.query.activityFactor) || 1.2;

    const result = user.calculateCalories(activityFactor); // This method should exist in UserModel

    res.json({
      bmr: result.bmr,
      maintenance: result.maintenance,
      lose: result.lose,
      gain: result.gain
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getCaloriesGoal = async (req, res) => {
  try {
    const user = await getUserFromRequest(req);
    res.json({ caloriesGoal: user.caloriesGoal });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

exports.updateCaloriesGoal = async (req, res) => {
  try {
    const user = await getUserFromRequest(req);
    const { caloriesGoal } = req.body;

    if (caloriesGoal < 0) {
      return res.status(400).json({ error: 'Calories goal must be positive' });
    }

    user.caloriesGoal = caloriesGoal;
    await user.save();

    res.json({ message: 'Calories goal updated successfully', caloriesGoal: user.caloriesGoal });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
