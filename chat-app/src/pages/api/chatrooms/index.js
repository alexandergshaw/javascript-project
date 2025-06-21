import dbConnect from "../../../lib/mongodb";
import ChatRoom from "../../../models/ChatRoom";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    // List all chat rooms
    const rooms = await ChatRoom.find({});
    return res.status(200).json(rooms);
  }

  if (req.method === "POST") {
    // Create a new chat room
    const { name, userId } = req.body;
    if (!name || !userId) return res.status(400).json({ error: "Missing name or userId" });

    const room = await ChatRoom.create({ name, members: [userId] });
    return res.status(201).json(room);
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}