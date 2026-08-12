import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const StatCard = ({ label, value }) => (
  <div className="bg-white rounded-xl border p-5 shadow-sm">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-2xl font-bold mt-1">{value}</p>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    api.get("/matches/mine").then((res) => setMatches(res.data)).catch(() => {});
    api.get("/sessions/mine").then((res) => setSessions(res.data)).catch(() => {});
  }, []);

  const upcoming = sessions.filter((s) => s.status === "Upcoming");

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-1">Welcome back, {user?.name}! 👋</h1>
      <p className="text-gray-500 mb-6">Keep learning, keep growing.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Matches" value={matches.length} />
        <StatCard label="Sessions" value={sessions.length} />
        <StatCard label="Upcoming" value={upcoming.length} />
        <StatCard label="Completed" value={sessions.filter((s) => s.status === "Completed").length} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border p-5">
          <h2 className="font-semibold mb-3">Recent Matches</h2>
          {matches.length === 0 && <p className="text-sm text-gray-400">No matches yet — explore skills to get started.</p>}
          <ul className="space-y-2">
            {matches.slice(0, 5).map((m) => (
              <li key={m._id} className="flex justify-between text-sm border-b pb-2">
                <span>{m.skillRequested} ↔ {m.skillOffered}</span>
                <span className="text-gray-400">{m.status}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-xl border p-5">
          <h2 className="font-semibold mb-3">Upcoming Sessions</h2>
          {upcoming.length === 0 && <p className="text-sm text-gray-400">Nothing scheduled yet.</p>}
          <ul className="space-y-2">
            {upcoming.slice(0, 5).map((s) => (
              <li key={s._id} className="flex justify-between text-sm border-b pb-2">
                <span>{s.skill}</span>
                <span className="text-gray-400">{new Date(s.scheduledAt).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
