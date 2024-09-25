export const sampleChats = [

    {
        avatar: ["https://www.w3schools.com/w3images/avatar2.png"],
        name: "John Doe",
        _id: "1",
        groupChat: false,
        members: ["1", "2"],
    },

    {
        avatar: [
            "https://www.w3schools.com/w3images/avatar2.png"
        ],
        name: "John Boi",
        _id: "2",
        groupChat: true,
        members: ["1", "2"],
    },

];


export const sampleUsers = [

    {
        avatar: ["https://www.w3schools.com/howto/img_avatar2.png"],
        name: "John Doe",
        _id: "1",
    },

    {
        avatar: [
            "https://www.w3schools.com/howto/img_avatar2.png"
        ],
        name: "John Boi",
        _id: "2",
    },

];


export const sampleNotifications = [

    {
        sender: {
            avatar2: ["https://www.w3schools.com/howto/img_avatar2.png"],
            name: "John Doe",
        },
        _id: "1",
    },

    {
        sender: {
            avatar2: [
                "https://www.w3schools.com/howto/img_avatar2.png"
            ],
            name: "John Boi",
        },
        _id: "2",
    },

];


export const sampleMessage = [
    {
        attachment: [

        ],

        content: "Message aaya hai",
        _id: "asdwqewfdsfdsgsd",
        sender: {
            _id: "user._id",
            name: "Abdullah"
        },
        chat: "chatId",
        createdAt: "2024-03-22T14:30:00.630Z"
    },

    {
        attachment: [
            {
                public_id: "asdasdf 2",
                url: "https://www.w3schools.com/w3images/avatar6.png"
            },
        ],

        content: "",
        _id: "asdwqewfdsfffdsgsd",
        sender: {
            _id: "sdfssdfsdf",
            name: "Abdullah 2"
        },
        chat: "chatId",
        createdAt: "2024-03-22T14:30:00.630Z"
    },
];

export const dashboardData = {

    users: [
        {
            name: "Abdullah",
            avatar: "https://www.w3schools.com/w3images/avatar6.png",
            _id: "1",
            username: "Abdullah2000",
            friends: 20,
            groups: 5
        },

        {
            name: "Abdullah Boy",
            avatar: "https://www.w3schools.com/w3images/avatar6.png",
            _id: "2",
            username: "Abdullah5833",
            friends: 20,
            groups: 25
        }
    ],

    chats: [
        {
            name: "Abdullah",
            avatar: ["https://www.w3schools.com/w3images/avatar6.png"],
            _id: "1",
            groupChat: "false",
            members: [{ _id: "1", avatar: "https://www.w3schools.com/howto/img_avatar2.png" }, { _id: "2", avatar: "https://www.w3schools.com/w3images/avatar6.png" }],
            totalMembers: 2,
            totalMessages: 20,
            creator: {
                name: "Abdullah Boy",
                avatar: "https://www.w3schools.com/w3images/avatar6.png"
            },
        },

        {
            name: "Abdullah",
            avatar: ["https://www.w3schools.com/w3images/avatar6.png"],
            _id: "2",
            groupChat: "false",
            members: [{ _id: "1", avatar: "https://www.w3schools.com/howto/img_avatar2.png" }, { _id: "2", avatar: "https://www.w3schools.com/w3images/avatar6.png" }],
            totalMembers: 2,
            totalMessages: 20,
            creator: {
                name: "Abdullah Boy",
                avatar: "https://www.w3schools.com/w3images/avatar6.png"
            },
        },
    ],

    messages: [
        {
            attachments: [],
            content: "Labadbass group ka message aaya ha",
            _id: "sdfsdfdsfsdgfdgd",
            sender: {
                avatar: "https://www.w3schools.com/w3images/avatar6.png",
                name: "Abdullah2"
            },
            chat: "chatId",
            groupChat: false,
            createdAt: "2024-02-12T10:41:30.630Z",
        },

        {
            attachments: [
                {
                    public_id: "asdsd 2",
                    url: "https://www.w3schools.com/w3images/avatar5.png"
                }
            ],
            content: "Labadbass group ka message aaya ha",
            _id: "sdfsdfdsfsdgfdgd",
            sender: {
                avatar: "https://www.w3schools.com/w3images/avatar6.png",
                name: "Abdullah"
            },
            chat: "chatId",
            groupChat: false,
            createdAt: "2024-02-12T10:41:30.630Z",
        }
    ]



};