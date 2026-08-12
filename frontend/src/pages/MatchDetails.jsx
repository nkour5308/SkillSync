import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import DashboardLayout from "../components/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const socket = io("/", { autoConnect: false });

const MatchDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [match, setMatch] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [scheduleForm, setScheduleForm] = useState({ scheduledAt: "", skill: "" });
  const bottomRef = useRef(null);

  useEffect(() => {
    api.get(`/matches/${id}`).then((res) => setMatch(res.data));
    api.get(`/messages/${id}`).then((res) => setMessages(res.data)).catch(() => {});

    socket.connect();
    socket.emit("joinMatch", id);
    socket.on("newMessage", (msg) => setMessages((prev) => [...prev, msg]));

    return () => {
      socket.emit("leaveMatch", id);
      socket.off("newMessage");
      socket.disconnect();
    };
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const res = await api.post(`/messages/${id}`, { text });
    setMessages((prev) => [...prev, res.data]);
    setText("");
  };

  const scheduleSession = async (e) => {
    e.preventDefault();
    await api.post("/sessions", {
      matchId: id,
      skill: scheduleForm.skill || match.skillRequested,
      scheduledAt: scheduleForm.scheduledAt,
    });
    alert("Session scheduled!");
  };

  const reportUser = async () => {
    const reason = prompt("What's the reason for this report?");
    if (!reason) return;
    const otherId = match.requester._id === user.id ? match.recipient._id : match.requester._id;
    await api.post("/reports", { reportedUserId: otherId, reason });
    alert("Report submitted to admin.");
  };

  if (!match) return <DashboardLayout><p>Loading...</p></DashboardLayout>;

  const other = match.requester._id === user.id ? match.recipient : match.requester;

  return (
    <DashboardLayout>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white border rounded-xl p-5 md:col-span-1 h-fit">
          <h2 className="font-semibold">{other.name}</h2>
          <p className="text-sm text-gray-400 mb-3">Rating: {other.ratingAverage?.toFixed(1) || "—"} / 5</p>
          <p className="text-sm text-gray-600 mb-4">{other.bio || "No bio yet."}</p>

          <form onSubmit={scheduleSession} className="space-y-2">
            <p className="text-sm font-medium">Schedule a session</p>
            <input
              placeholder="Skill"
              className="w-full px-3 py-2 border rounded-lg text-sm"
              value={scheduleForm.skill}
              onChange={(e) => setScheduleForm({ ...scheduleForm, skill: e.target.value })}
            />
            <input
              type="datetime-local"
              required
              className="w-full px-3 py-2 border rounded-lg text-sm"
              value={scheduleForm.scheduledAt}
              onChange={(e) => setScheduleForm({ ...scheduleForm, scheduledAt: e.target.value })}
            />
            <button className="w-full py-2 rounded-lg bg-primary text-white text-sm font-medium">
              Request Session
            </button>
          </form>

          <button onClick={reportUser} className="mt-4 text-xs text-red-500 underline">
            Report this user
          </button>
        </div>

        <div className="bg-white border rounded-xl p-5 md:col-span-2 flex flex-col h-[600px]">
          <h2 className="font-semibold mb-3">Chat</h2>
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {messages.map((m) => (
              <div
                key={m._id}
                className={`max-w-[70%] px-3 py-2 rounded-xl text-sm ${
                  m.sender._id === user.id
                    ? "ml-auto bg-primary text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {m.text}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
          <form onSubmit={sendMessage} className="mt-3 flex gap-2">
            <input
              className="flex-1 px-3 py-2 border rounded-lg text-sm"
              placeholder="Type a message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium">
              Send
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MatchDetails;
