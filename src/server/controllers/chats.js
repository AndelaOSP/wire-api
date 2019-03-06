const Chat = require('../models').Chats;
const User = require('../models').Users;

let userAttributes = {
    model: User,
    attributes: ['id', 'imageUrl', 'username'],
};

const findChatById = async id => {
    const chat = await Chat.findById(id, { include: userAttributes });

    return chat;
};

module.exports = {
    // add a chat
    create: async (req, res) => {
        const chat = await Chat.create({
            chat: req.body.chat,
            userEmail: req.body.userEmail,
            incidentId: req.params.id,
        });

        const data = await findChatById(chat.id, res);

        return res.status(201).send({ data, status: 'success' });
    },
};
