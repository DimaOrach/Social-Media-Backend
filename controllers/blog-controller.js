import Blog from '../models/Blog.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

export const getAllBlogs = async (req, res, next) => {
    let blogs;
    try {
        blogs = await Blog.find();
    } catch (error) {
        console.log(error);
    }
    if (!blogs) {
        return res.status(404).json({ message: 'Blogs Not Found' });
    }
    return res.status(200).json({ blogs });
};

export const addBlog = async (req, res, next) => {
    const { title, description, image, user } = req.body;
    let existingUser;
    try {
        existingUser = await User.findById(user);
    } catch (error) {
        return console.log(error);
    }
    if (!existingUser) {
        return res
            .status(400)
            .json({ message: 'Unable to find user by this ID' });
    }
    const blog = new Blog({ title, description, image, user });
    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        await blog.save({ session });
        existingUser.blogs.push(blog);
        await existingUser.save({ session });
        await session.commitTransaction();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error });
    }
    return res.status(200).json({ blog });
};

export const updateBlog = async (req, res, next) => {
    const { title, description } = req.body;
    const blogId = req.params.id;
    let blog;
    try {
        blog = await Blog.findByIdAndUpdate(blogId, { title, description });
    } catch (error) {
        return console.log(error);
    }
    if (!blog) {
        return res.status(500).json({ message: 'Unable To Update The Blog' });
    }
    return res.status(200).json({ blog });
};

export const getById = async (req, res, next) => {
    const id = req.params.id;
    let blog;
    try {
        blog = await Blog.findById(id);
    } catch (error) {
        console.log(error);
    }
    if (!id) {
        return res.status(404).json({ message: 'No Blog Find' });
    }
    return res.status(200).json({ blog });
};

export const deleteBlog = async (req, res, next) => {
    const id = req.params.id;
    let blog;
    try {
        blog = await Blog.findByIdAndDelete(id).populate('user');
        await blog.user.blogs.pull(blog);
        await blog.user.save();
    } catch (error) {
        console.log(error);
    }
    if (!blog) {
        return res.status(500).json({ message: 'Unable to delete' });
    }
    return res.status(200).json({ message: 'Successfully deleted' });
};

export const getByUserId = async (req, res, next) => {
    const userId = req.params.id;
    let userBlogs;
    try {
        userBlogs = await User.findById(userId).populate('blogs');
    } catch (error) {
        return console.log(error);
    }
    if (!userBlogs) {
        return res.status(404).json({ message: 'No Blogs Found' });
    }
    return res.status(200).json({ blogs: userBlogs });
};
