import express from "express";
import { acceptFriendRequest, getAllNotifications, getMyFriends, getMyProfile, login, newUser, searchUser, sendFriendRequest, userLogout } from "../controllers/user.js";
import { singleAvatar } from "../middlewares/multer.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { acceptRequestValidator, loginValidator, registerValidator, sendRequestValidator, validateHandler } from "../lib/validators.js";



const app = express.Router();

app.post("/new", singleAvatar, registerValidator(), validateHandler, newUser);
app.post("/login", loginValidator(), validateHandler, login);

//// After this user must be logged In to access the route

app.use(isAuthenticated);

app.get("/me", getMyProfile);

app.get("/logout", userLogout);

app.get("/search", searchUser);

app.put("/sendrequest", sendRequestValidator(), validateHandler, sendFriendRequest);

app.put("/acceptrequest", acceptRequestValidator(), validateHandler, acceptFriendRequest);

app.get("/notifications", getAllNotifications);

app.get("/friends", getMyFriends);

export default app;

