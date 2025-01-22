const Chat = require("../models/chat");
const User = require("../models/user");
const Message = require("../models/message");
const Media = require("../models/media");
const messageService = require("./message");
const he = require("he");
const { findSocket } = require("../utils");
const CustomError = require("../customError");

exports.createChat = async ({
  title,
  desc,
  members,
  admin,
  authUserId,
  io,
}) => {
  members = Array.from(new Set(members));

  if (members.length < 2) {
    throw new CustomError("Chat must contain at least 2 members", 400);
  }

  if (!members.includes(authUserId)) {
    throw new CustomError("Chat must contain auth user", 400);
  }

  const lastViewed = members.reduce(
    (acc, curr) => ({ ...acc, [curr]: Date.now() }),
    {}
  );

  let chat = new Chat({ members, lastViewed, title, desc, admin });
  await chat.save();
  await chat.populate({ path: "members", select: "-password" });

  let firstMessage;
  const unreadCount = await chat.getUnreadCount(authUserId);

  chat = chat.toObject();
  chat.unreadCount = unreadCount;
  chat.messages = firstMessage ? [firstMessage] : [];
  chat.images = [];
  chat.links = [];
  chat.typingUsers = [];

  emitNewChat(chat, authUserId, io);

  return chat;
};

const emitNewChat = (chat, authUserId, io) => {
  chat.members.forEach((member) => {
    const userId = member._id.toString();
    const socket = findSocket(io, userId);
    if (socket) {
      socket.join(chat._id.toString());
      if (userId !== authUserId) {
        io.to(userId).emit("new-chat", chat);
      }
    }
  });
};

exports.getChatList = async (authUserId) => {
  let chats = await Chat.find({ members: authUserId }).populate({
    path: "members",
    select: "-password",
  });

  const chatIds = chats.map((chat) => chat._id.toString());

  const [messages, images, links] = await Promise.all([
    Message.find({ chat: { $in: chatIds } })
      .populate({
        path: "images",
        populate: { path: "from", select: "-password" },
      })
      .populate({ path: "from", select: "-password" })
      .lean(),
    Media.find({ type: "image", chat: { $in: chatIds } })
      .populate({ path: "from", select: "-password" })
      .lean(),
    Media.find({ type: "link", chat: { $in: chatIds } })
      .populate({ path: "from", select: "-password" })
      .lean(),
  ]);

  const [messagesMap, imagesMap, linksMap] = [messages, images, links].map(
    (type) =>
      type.reduce((map, item) => {
        map[item.chat.toString()] = map[item.chat.toString()] || [];
        map[item.chat.toString()].push(item);
        return map;
      }, {})
  );

  let unreadCounts = await Promise.all(
    chats.map(async (chat) => {
      const unreadCount = await chat.getUnreadCount(authUserId);
      return { id: chat._id, unreadCount };
    })
  );

  unreadCounts = unreadCounts.reduce(
    (acc, curr) => ({ ...acc, [curr.id]: curr.unreadCount }),
    {}
  );

  chats = JSON.parse(he.decode(JSON.stringify(chats)));

  chats = chats.map((chat) => ({
    ...chat,
    messages: messagesMap[chat._id.toString()] || [],
    images: imagesMap[chat._id.toString()] || [],
    links: linksMap[chat._id.toString()] || [],
    typingUsers: [],
    unreadCount: unreadCounts[chat._id.toString()],
  }));

  return chats;
};

exports.readChat = async (authUserId, chatId) => {
  const chat = await Chat.findByIdAndUpdate(
    chatId,
    { $set: { [`lastViewed.${authUserId}`]: Date.now() } },
    { new: true }
  );
  if (!chat) {
    throw new CustomError("Chat not found", 404);
  }
  return chat;
};
