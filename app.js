import express from 'express';
import mongoose from 'mongoose';
import router from './routes/user-routes.js';
import blogRouter from './routes/blog-routes.js';



const app = express();
app.use(express.json());
app.use('/api/user', router);
app.use('/api/blog', blogRouter);


try {
    mongoose.connect('mongodb+srv://dmytroorach:lord21153@cluster0.atpdsa7.mongodb.net/Blog?retryWrites=true&w=majority')
    app.listen(5000, ()=> console.log('SERVER IS WORKING ON PORT 5000'));
} catch(error) {
    console.log(error);
}
