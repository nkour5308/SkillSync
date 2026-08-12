import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const statusColor = {
  Pending: "bg-yellow-100 text-yellow-700",
  Accepted: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
  Completed: "bg-gray-200 text-gray-700",
};

const MyMatches = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);

  const load = () => {
    api.get("/matches/mine").then((res) => setMatches(res.data));
  };

  useEffect(() => {
    load();
  }, []);

  const respond = async (id, status) => {
    await api.patch(`/matches/${id}/status`, { status });
    load();
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-1">My Matches</h1>
      <p className="text-gray-500 mb-6">Track your skill swap requests</p>

      <div className="space-y-3">
        {matches.map((m) => {
          const isRecipient = m.recipient._id === user.id;
          const other = isRecipient ? m.requester : m.recipient;
          return (
            <div key={m._id} className="bg-white border rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">
                  {other.name} — {m.skillRequested} ↔ {m.skillOffered}
                </p>
                <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${statusColor[m.status]}`}>
                  {m.status}
                </span>
              </div>
              <div className="flex gap-2">
                {isRecipient && m.status === "Pending" && (
                  <>
                    <button
                      onClick={() => respond(m._id, "Accepted")}
                      className="px-3 py-1.5 text-sm rounded-lg bg-primary text-white"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => respond(m._id, "Rejected")}
                      className="px-3 py-1.5 text-sm rounded-lg border"
                    >
                      Decline
                    </button>
                  </>
                )}
                {m.status === "Accepted" && (
                  <Link to={`/matches/${m._id}`} className="px-3 py-1.5 text-sm rounded-lg border">
                    Open Chat
                  </Link>
                )}
              </div>
            </div>
          );
        })}
        {matches.length === 0 && <p className="text-gray-400">No match requests yet.</p>}
      </div>
    </DashboardLayout>
  );
};

export default MyMatches;
