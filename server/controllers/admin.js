import { tryCatch } from "../middlewares/error.js";
import { User } from "../models/user.js";
import { Chat } from "../models/chat.js";
import { Message } from "../models/message.js";
import { ErrorHandler } from "../utils/utility.js";
import jwt from "jsonwebtoken";
import { cookieOptions } from "../utils/features.js";
import { adminSecretKey } from "../app.js";



// const adminLogin = tryCatch(async (req, res, next) => {

//     const { secretKey } = req.body;

//     const isMatched = secretKey === adminSecretKey;

//     if (!isMatched) return next(new ErrorHandler("Invalid Admin Key", 401));

//     const token = jwt.sign(secretKey, process.env.ADMIN_SECRET_KEY);

//     return res.status(200).cookie("Chat-admin-token", token, { ...cookieOptions, maxAge: 1000 * 60 * 15 }).json({
//         success: true,
//         message: "Authenticated Successfully, Welcome BOSS",
//     });


// });

const adminLogin = tryCatch(async (req, res, next) => {
    const { secretKey } = req.body;

    const isMatched = secretKey === adminSecretKey;
    if (!isMatched) return next(new ErrorHandler("Invalid Admin Key", 401));

    const token = jwt.sign({ role: 'admin' }, process.env.ADMIN_SECRET_KEY, {
        expiresIn: '15m' 
    });

    return res.status(200).cookie("Chat-admin-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', 
        maxAge: 1000 * 60 * 15 
    }).json({
        success: true,
        message: "Authenticated Successfully, Welcome BOSS",
    });
});

const adminLogout = tryCatch(async (req, res, next) => {

    return res.status(200).cookie("Chat-admin-token", "", { ...cookieOptions, maxAge: 0 }).json({
        success: true,
        message: "Logged out Successfully",
    });


});

const getAdminData = tryCatch(async (req, res, next) => {

    return res.status(200).json({
        admin: true,
    });


});

const allUsers = tryCatch(async (req, res) => {

    const users = await User.find({});

    const transformedUsers = await Promise.all(
        users.map(async ({ name, username, avatar, _id }) => {

            const [groups, friends] = await Promise.all(
                [
                    Chat.countDocuments({ groupChat: true, members: _id }),
                    Chat.countDocuments({ groupChat: false, members: _id }),
                ]
            );

            return {
                name,
                username,
                avatar: avatar.url,
                _id,
                groups,
                friends
            }
        })
    );

    res.status(200).json({
        status: "success",
        users: transformedUsers,
    });

});

const allChats = tryCatch(async (req, res) => {

    const chats = await Chat.find({}).populate("members", "name avatar").populate("creator", "name avatar");

    const transformedChats = await Promise.all(
        chats.map(async ({ members, _id, groupChat, name, creator }) => {

            const totalMessages = await Message.countDocuments({ chat: _id });


            return {
                _id,
                groupChat,
                name,
                avatar: members.slice(0, 3).map((member) => member.avatar.url),
                members: members.map(({ _id, name, avatar }) => ({
                    _id,
                    name,
                    avatar: avatar.url,
                })),
                creator: {
                    name: creator?.name || "None",
                    avatar: creator?.avatar.url || ""
                },
                totalMembers: members.length,
                totalMessages,
            }
        })
    )

    res.status(200).json({
        status: "success",
        chats: transformedChats,
    });
});

const allMessages = tryCatch(async (req, res) => {

    const messages = await Message.find({}).populate("sender", "name avatar").populate("chat", "groupChat");

    const transformedMessages = messages.map(({ content, attachments, _id, sender, createdAt, chat }) => ({
        _id,
        attachments,
        content,
        createdAt,
        chat: chat._id,
        groupChat: chat.groupChat,
        sender: {
            _id: sender._id,
            name: sender.name,
            avatar: sender.avatar.url
        }
    }))

    return res.status(200).json({
        success: "true",
        messages: transformedMessages,
    });

});

const getDashboardStats = tryCatch(async (req, res) => {

    const [groupsChat, usersCount, messagesCount, totalChatsCount] = await Promise.all([
        Chat.countDocuments({ groupChat: true }),
        User.countDocuments(),
        Message.countDocuments(),
        Chat.countDocuments(),
    ]);

    const today = new Date();

    const last7days = new Date();
    last7days.setDate(last7days.getDate() - 7);

    const last7DaysMessages = await Message.find({
        createdAt: {
            $gte: last7days,
            $lte: today
        }
    }).select("createdAt");

    const messages = new Array(7).fill(0);
    const dayInMilliSeconds = 1000 * 60 * 60 * 24;

    last7DaysMessages.forEach((message) => {
        const indexApprox = (today.getTime() - message.createdAt.getTime()) / dayInMilliSeconds;

        const index = Math.floor(indexApprox);

        messages[6 - index]++;
    });

    const stats = {
        groupsChat,
        usersCount,
        messagesCount,
        totalChatsCount,
        messagesChart: messages,
    };

    return res.status(200).json({
        success: "true",
        stats,
    });

});


export {
    allUsers,
    allChats,
    allMessages,
    getDashboardStats,
    adminLogin,
    adminLogout,
    getAdminData
}