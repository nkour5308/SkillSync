import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const tabs = ["Upcoming", "Completed", "Cancelled"];

const Sessions = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [tab, setTab] = useState("Upcoming");

  const load = () => {
    api.get("/sessions/mine").then((res) => setSessions(res.data));
  };

  useEffect(() => {
    load();
  }, []);

  const markCompleted = async (id) => {
    await api.patch(`/sessions/${id}`, { status: "Completed" });
    load();
  };

  const cancelSession = async (id) => {
    await api.patch(`/sessions/${id}`, { status: "Cancelled" });
    load();
  };

  const leaveReview = async (session) => {
    const revieweeId = session.participants.find((p) => p._id !== user.id)?._id;
    const rating = Number(prompt("Rate this session 1-5:"));
    if (!rating) return;
    const comment = prompt("Any comments?") || "";
    await api.post("/reviews", { sessionId: session._id, revieweeId, rating, comment });
    alert("Review submitted!");
  };

  const filtered = sessions.filter((s) => s.status === tab);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-1">My Sessions</h1>
      <p className="text-gray-500 mb-6">Manage your teaching and learning sessions</p>

      <div className="flex gap-2 mb-5">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 text-sm rounded-full ${
              tab === t ? "bg-primary text-white" : "bg-gray-100 text-gray-600"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((s) => {
          const other = s.participants.find((p) => p._id !== user.id);
          return (
            <div key={s._id} className="bg-white border rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">{s.skill}</p>
                <p className="text-xs text-gray-400">
                  with {other?.name} • {new Date(s.scheduledAt).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2">
                {s.status === "Upcoming" && (
                  <>
                    <a
                      href={s.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 text-sm rounded-lg bg-primary text-white"
                    >
                      Join Session
                    </a>
                    <button onClick={() => markCompleted(s._id)} className="px-3 py-1.5 text-sm rounded-lg border">
                      Mark Completed
                    </button>
                    <button onClick={() => cancelSession(s._id)} className="px-3 py-1.5 text-sm rounded-lg border text-red-500">
                      Cancel
                    </button>
                  </>
                )}
                {s.status === "Completed" && (
                  <button onClick={() => leaveReview(s)} className="px-3 py-1.5 text-sm rounded-lg border">
                    Leave Review
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && <p className="text-gray-400">No {tab.toLowerCase()} sessions.</p>}
      </div>
    </DashboardLayout>
  );
};

export default Sessions;
