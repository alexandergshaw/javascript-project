"use client";

import { useState, useEffect } from "react";

type ChatRoom = {
  _id: string;
  name: string;
  members: string[];
  createdAt: string;
};

export default function ChatRooms({ userId }: { userId: string }) {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [roomName, setRoomName] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch chat rooms
  useEffect(() => {
    fetch("/api/chatrooms")
      .then((res) => res.json())
      .then(setRooms);
  }, []);

  // Create a new chat room
  const createRoom = async () => {
    if (!roomName) return;
    setLoading(true);
    const res = await fetch("/api/chatrooms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: roomName, userId }),
    });
    setLoading(false);
    if (res.ok) {
      const newRoom = await res.json();
      setRooms((prev) => [...prev, newRoom]);
      setRoomName("");
    }
  };

  return (
    <div className="mt-8">
      <h2 className="font-bold mb-2">Chat Rooms</h2>
      <div className="flex gap-2 mb-4">
        <input
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="Room name"
          className="border p-1"
        />
        <button
          onClick={createRoom}
          className="border px-2 py-1"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Room"}
        </button>
      </div>
      <ul className="mt-4">
        {rooms.map((room) => (
          <li key={room._id}>{room.name}</li>
        ))}
      </ul>
    </div>
  )};