import mongoose from "mongoose";

const ChatRoomSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  members: [{ type: String }], // store user IDs or emails
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.ChatRoom || mongoose.model("ChatRoom", ChatRoomSchema);