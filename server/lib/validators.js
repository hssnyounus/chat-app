import { body, param, validationResult } from "express-validator";
import { ErrorHandler } from "../utils/utility.js";


const validateHandler = (req, res, next) => {

    const errors = validationResult(req);

    const errorMessage = errors.array().map((error) => error.msg).join(", ");

    console.log(errorMessage);

    if (errors.isEmpty()) return next();
    else next(new ErrorHandler(errorMessage, 400));

};

const registerValidator = () => [
    body("name", "Please enter the Name").notEmpty(),
    body("username", "Please enter the Username").notEmpty(),
    body("password", "Please enter the Password").notEmpty(),
    body("bio", "Please enter the Bio").notEmpty(),
];

const loginValidator = () => [
    body("username", "Please enter the Username").notEmpty(),
    body("password", "Please enter the Password").notEmpty(),
];

const newGroupValidator = () => [
    body("name", "Please enter the Name").notEmpty(),
    body("members").notEmpty().withMessage("Please enter Members").isArray({ min: 2, max: 100 }).withMessage("Members should be 2-100"),
];

const addMemberValidator = () => [
    body("chatId", "Please enter the Chat ID").notEmpty(),
    body("members").notEmpty().withMessage("Please enter Members").isArray({ min: 1, max: 97 }).withMessage("Members should be 1-97"),
];

const removeMemberValidator = () => [
    body("chatId", "Please enter the Chat ID").notEmpty(),
    body("userId", "Please enter the User ID").notEmpty(),
];

const sendAttachmentsValidator = () => [
    body("chatId", "Please enter the Chat ID").notEmpty(),
];

const chatIdValidator = () => [
    param("id", "Please enter the Chat ID").notEmpty(),
];

const renameValidator = () => [
    param("id", "Please enter the Chat ID").notEmpty(),
    body("name", "Please enter the New Name").notEmpty(),
];

const sendRequestValidator = () => [
    body("userId", "Please enter the User ID").notEmpty(),
];

const acceptRequestValidator = () => [
    body("requestId", "Please enter the Request ID").notEmpty(),
    body("accept").notEmpty().withMessage("Please add Accept").isBoolean().withMessage("Accept must be Boolean"),
];

const adminLoginValidator = () => [
    body("secretKey", "Please Enter Secret Key").notEmpty()
];



export {
    acceptRequestValidator, addMemberValidator, adminLoginValidator, chatIdValidator, loginValidator,
    newGroupValidator, registerValidator, removeMemberValidator, renameValidator, sendAttachmentsValidator, sendRequestValidator, validateHandler
};
