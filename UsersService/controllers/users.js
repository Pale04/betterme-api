const mongoose = require('mongoose');
const Account  = require('../models/account');
const User = require('../models/users')

// GET /api/users
const getUsers = async (req, res) => {
  try {
    const users = await User
      .find()
      .populate('account', '-password -__v')
      .select('-__v');
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Error while obtaining users', err });
  }
};

// GET /api/users/:id
const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User
      .findOne({ account: id })
      .populate('account', '-password -__v')
      .select('-__v');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Error while obtaining user', err });
  }
};

// POST /api/users 
const addUser = async (req, res) => {
  console.log('BODY RECEIVED ➜', req.body);

  const {
    username, password, email, name,
    birthday, description, phone, website,
  } = req.body;

  try {
    const account = await Account.create({
      username, password, email, name
    });

    const profile = await User.create({
      account: account._id,
      birthday,
      description,
      phone,
      website
    });

    const populated = await profile.populate('account', '-password -__v');
    res.status(201).json({
      msg: `Account ${username} created`,
      user: populated,
    });
  } catch (err) {
    res.status(500).json({ msg: 'Error while creating user', err });
  }
};

// PUT /api/users/:id
const updateUser = async (req, res) => {
  const { id } = req.params;
  const {
    username, email, name, active, userType,
    birthday, description, phone, website,
  } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const account = await Account.findByIdAndUpdate(
      id,
      { username, email, name, active, userType },
      { new: true, session },
    );
    if (!account) {
      await session.abortTransaction();
      return res.status(404).json({ msg: 'Account not found' });
    }

    const profile = await User.findOneAndUpdate(
      { account: id },
      { birthday, description, phone, website },
      { new: true, session },
    );

    await session.commitTransaction();

    const populated = await profile.populate('account', '-password -__v');
    res.json({
      msg: `User ${id} updated`,
      user: populated,
    });
  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({ msg: 'Error while updating user', err });
  } finally {
    session.endSession();
  }
};

// DELETE /api/users/:id
const deleteUser = async (req, res) => {
  const { id } = req.params;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const profile = await User.findOneAndDelete({ account: id }, { session });
    const account = await Account.findByIdAndDelete(id, { session });
    if (!profile || !account) {
      await session.abortTransaction();
      return res.status(404).json({ msg: 'User not found' });
    }

    await session.commitTransaction();
    res.json({ msg: `User ${id} deleted` });
  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({ msg: 'Error while deleting user', err });
  } finally {
    session.endSession();
  }
};

module.exports = {getUsers,getUser,addUser,updateUser,deleteUser};
