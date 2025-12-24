import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import errorHandler from './middleware/errorHandler';
import morgan from 'morgan';
import { notFoundHandler } from './middleware/notFoundHandler';
import routes from './routes';


const app = express();


const cookie = {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 30 * 12,
};


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());


app.use('/api', routes);

app.use(notFoundHandler);
app.use(errorHandler);



console.log('Server started');
app.listen(3000, () => {
    console.log('Server started on port 3000');
});



