const { response } = require('express');
const User = require('../models/users');

const getUsers = async (req, res = response) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ msg: 'Error while obtaining users', error });
    }
};

const getUser = async (req, res = response) => {
    const { id } = req.params;
    try {
        const usuario = await User.findById(id).select('-password');
        if (!usuario) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ msg: 'Error while obtaining user', error });
    }
};

const addUser = async (req, res = response) => {
    const { username, password, email, usertype, name, birthday } = req.body;
    try {
        const newUser = new User({ username, password, email, usertype, name, birthday });
        await newUser.save();
        res.status(201).json({
            msg: `The user ${username} has been created on the DB`,
            usuario: newUser
        });
    } catch (error) {
        res.status(500).json({ msg: 'Error while creating user', error });
    }
};

const updateUser = async (req, res = response) => {
    const { id } = req.params;
    try {
        const userUpdated = await User.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );
        if (!userUpdated) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json({
            msg: `The user with ID ${id} has been updated`,
            usuario: userUpdated
        });
    } catch (error) {
        res.status(500).json({ msg: 'Error while updating user', error });
    }
};

const deleteUser = async (req, res = response) => {
    const { id } = req.params;
    try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json({
            msg: `The user with ID ${id} has been deleted`,
            usuario: deletedUser
        });
    } catch (error) {
        res.status(500).json({ msg: 'Error while deleting user', error });
    }
};

module.exports = {getUsers,getUser,addUser,updateUser,deleteUser};
