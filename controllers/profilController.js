const User = require('../models/UserModel');

const getUserFromRequest = async (req) => {
  const userId = req.user?.id;
  if (!userId) throw new Error("User ID not found in request");
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  return user;
};

// GET /profil
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

// PUT /profil
exports.updateProfil = async (req, res) => {
  try {
    const user = await getUserFromRequest(req);
    const { age, height, weight, sex } = req.body;

    if (age !== undefined) user.age = age;
    if (height !== undefined) user.height = height;
    if (weight !== undefined) user.weight = weight;
    if (sex !== undefined) user.sex = sex;

    await user.save();
    res.json({ message: 'proil updated successfully', user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET /profil/bmr
exports.getCalories = async (req, res) => {
  try {
    const user = await getUserFromRequest(req);
    const activityFactor = parseFloat(req.query.activityFactor) || 1.2;
    const result = user.calculateCalories(activityFactor);//calculateCalories is a method in UserModel

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