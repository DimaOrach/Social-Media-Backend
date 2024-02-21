import User from '../models/User.js';

export const getAllUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find();
    } catch (error) {
        console.log(error);
    }
    if (!users) {
        return res.status(404).json({ message: 'No Users Found' });
    }
    return res.status(200).json({ users });
};

export const signUp = async (req, res, next) => {
    const { name, email, password } = req.body;
    let existingUser;
    try {
        existingUser = await User.findOne({ email });
    } catch (error) {
        return console.log(error);
    }
    if (existingUser) {
        return res
            .status(400)
            .json({ message: 'User already exist! Login instead' });
    }
    const user = new User({
        name,
        email,
        password,
    });

    try {
        await user.save();
    } catch (error) {
        return console.log(error);
    }
    return res.status(201).json({ user });
};
