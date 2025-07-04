const mongoose = require('mongoose');
const Account  = require('../models/account');
const UserType  = require('../models/account');
const User = require('../models/users')
const axios = require('axios');

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


// GET /api/users/search?q=<substring>
const searchUsers = async (req, res) => {
  const q = (req.query.q || '').trim();
  if (!q) {
    return res
      .status(400)
      .json({ msg: 'Query parameter "q" is required for searching' });
  }
  try {
    const accounts = await Account
      .find({ username: { $regex: q, $options: 'i' } })
      .limit(10)
      .select('_id');

    if (accounts.length === 0) {
      return res.json([]);
    }

    const ids = accounts.map(a => a._id);
    const users = await User
      .find({ account: { $in: ids } })
      .populate('account', '-password -__v')
      .select('-__v');

    return res.json(users);
  } catch (err) {
    console.error('Error searching users:', err);
    return res
      .status(500)
      .json({ msg: 'Error while searching users', err });
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

      console.log(id)

    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ msg: 'Error while obtaining user', err });
  }
};

// GET /api/users/:email
const getUserByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    const account = await Account
      .findOne({ email: email })
      .select('-password -__v');

    if (!account) return res.status(404).json({ msg: 'Account not found' });

    res.status(200).json(account);
  } catch (err) {
    res.status(500).json({ msg: 'Error while obtaining user', err });
  }
};

// GET /api/users/banned
const getBannedUsers = async (req, res) => {
  try {
    const users = await Account
      .find({ active: false })
      .select('-__v');
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Error while obtaining banned users', err });
  }
}

// POST /api/users 
const addUser = async (req, res) => {
  console.log('BODY RECEIVED ', req.body);

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
    console.error('AddUser error ', err);
    res.status(500).json({ msg: 'Error while creating user', err });
  }
};

// PUT /api/users/:id
const updateUserState = async (req, res) => {
  const { id } = req.params;
  const { active } = req.body;

  try {
    const account = await Account.findByIdAndUpdate(
      id,
      { active },
      { new: true },
    );

    if (!account) {
      return res.status(404).json({ msg: 'Account not found' });
    }

    res.json({
      msg: `User ${id} updated`,
    });
  } catch (err) {
    res.status(500).json({ msg: 'Error while updating user', err });
  } finally {
  }
};

// PATCH /api/users/edit/:id
const updateUser = async (req, res) => {
  const { id } = req.params;
  const {
    username, email, name,
    birthday, description, phone, website,
  } = req.body;

  try {
    const account = await Account.findByIdAndUpdate(
      id,
      { username, email, name },
      { new: true }
    );
    if (!account) {
      return res.status(404).json({ msg: 'Account not found' });
    }

    const profile = await User.findOneAndUpdate(
      { account: id },
      { birthday, description, phone, website },
      { new: true }
    );
    if (!profile) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const populated = await profile.populate('account', '-password -__v');
    return res.json({
      msg: `User ${id} updated`,
      user: populated,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Error while updating user', err });
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

// PATCH /api/users/:id/password
const changePassword = async (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const account = await Account.findOne({ account: id })

    if (!account || account.password !== currentPassword) {
        return res.status(401).json({ msg: 'Non matching credentials' });
    }

    await Account.findByIdAndUpdate(
      id,
      { newPassword },
    );

    if (!account) {
      await session.abortTransaction();
      return res.status(404).json({ msg: 'Account not found' });
    }

    await session.commitTransaction();

    res.status(204).json({
      msg: `User ${id} updated`,
    });
  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({ msg: 'Error while updating user', err });
  } finally {
    session.endSession();
  }
}

// PATCH /api/users/:id/email
const changeEmail = async (req, res) => {
  const { id } = req.params;
  const { verificationCode, newEmail } = req.body;

  const account = await Account.findOne({ _id: id})

  const payload = {
    email: account.email,
    code: verificationCode
  };

  const verifRes = await axios.post(
    `${process.env.EMAIL_API}/api/verify/existent/confirm`,
    payload
  );

  if (verifRes.status != 200) {
    res.status(verifRes.status).json({ msg: 'Código inválido o expirado' });
    return;
  }

  try {
    const account = await Account.findByIdAndUpdate(
      id,
      { email: newEmail },
      { new: true},
    );

    if (!account) {
      return res.status(404).json({ msg: 'Account not found' });
    }

    res.status(204).json({
      msg: `User ${id} updated`,
    });
  } catch (err) {
    res.status(500).json({ msg: 'Error while updating user', err });
  }
}

const addModeratorUser = async (req, res) => {
  console.log('BODY RECEIVED ', req.body);

  const {
    username, password, email, name,
    birthday, description, phone, website,
  } = req.body;

  try {
    const account = await Account.create({
      username, password, email, name, userType: 'Moderator'
    });
    console.log('Account created with ID:', account._id);

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
    console.error('AddUser error ', err);
    res.status(500).json({ msg: 'Error while creating user', err });
  }
};

const updateUserVerification = async (req, res) => {
  console.log("0")
  const { id } = req.params;
  const { verified } = req.body;
  console.log("1")
  if (verified === undefined) {
    return res.status(400).json({ msg: 'The verified parameter is required'})
  }
  console.log("2")
  let user;

  try {
  console.log("3")
    user = await User.findOneAndUpdate(
		{ account: id},
		{ verified: verified },
		{ new: true }
	);

    console.log("4")
  }
  catch (error) {
	console.error('Error while attempting to update a user verification: ' + error);
	return res.status(500).json({ msg: 'An error ocurred while attempting to update the user verification' })
  }
  
  if (!user) {
    return res.status(404).json({ msg: 'User not found' });
  }

  return res.status(200).json({ msg: `The user verification was ${verified? 'given' : 'withdrawn'}` });
}

module.exports = {getUsers, searchUsers, getUser, getBannedUsers, addUser, updateUserState ,updateUser,deleteUser,changePassword,changeEmail, addModeratorUser, updateUserVerification, getUserByEmail};
