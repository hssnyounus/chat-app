const corsOptions = {
    origin: ["http://localhost:5173", "http://localhost:4173", process.env.CLIENT_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,

};

const Chat_Token = "Chat-token";

export { corsOptions, Chat_Token };