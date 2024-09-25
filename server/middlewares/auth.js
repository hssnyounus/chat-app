import { ErrorHandler } from '../utils/utility.js';
import jwt from 'jsonwebtoken';
import { adminSecretKey } from "../app.js";
import { tryCatch } from './error.js';
import { Chat_Token } from '../constants/config.js';
import { User } from '../models/user.js';

const isAuthenticated = tryCatch((req, res, next) => {

    const token = req.cookies[Chat_Token];

    if (!token) return next(new ErrorHandler("Please Login  to access this route", 401));

    const decodeData = jwt.verify(token, process.env.JWT_SECRET);

    console.log(decodeData);

    req.user = decodeData._id;

    next();
}
);

// const adminOnly = (req, res, next) => {

//     const token = req.cookies["Chat-admin-token"];

//     if (!token) return next(new ErrorHandler("Only admin can access", 401));

//     const secretKey = jwt.verify(token, process.env.JWT_SECRET);

//     const isMatched = secretKey === adminSecretKey;

//     if (!isMatched) return next(new ErrorHandler("Only admin can access", 401));

//     next();
// };

const adminOnly = (req, res, next) => {
    const token = req.cookies["Chat-admin-token"];

    if (!token) {
        return next(new ErrorHandler("Only admin can access", 401));
    }

    try {

        const decoded = jwt.verify(token, process.env.ADMIN_SECRET_KEY);

        if (decoded.role !== 'admin') {
            return next(new ErrorHandler("Only admin can access", 401));
        }

        next();
    } catch (error) {
        console.error("JWT Verification Error:", error);
        return next(new ErrorHandler("Only admin can access", 401));
    }
};



const socketAuthenticator = async (err, socket, next) => {
    try {

        if (err) return next(err);

        const authToken = socket.request.cookies[Chat_Token];

        if (!authToken) return next(new ErrorHandler("Please login to access this route", 401));

        const decodedData = jwt.verify(authToken, process.env.JWT_SECRET);

        const user = await User.findById(decodedData._id);

        if (!user) return next(new ErrorHandler("Please login to access this route", 401));

        socket.user = user;

        return next();

    } catch (error) {
        console.log(error);
        return next(new ErrorHandler("Please login to access this route", 401));
    }
};

export { isAuthenticated, adminOnly, socketAuthenticator };
