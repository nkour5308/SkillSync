import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";

const StatCard = ({ label, value }) => (
  <div className="bg-white rounded-xl border p-5 shadow-sm">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-2xl font-bold mt-1">{value}</p>
  </div>
);

const AdminOverview = () => {
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);

  const load = () => {
    api.get("/admin/overview").then((res) => setOverview(res.data));
    api.get("/admin/users").then((res) => setUsers(res.data));
    api.get("/admin/reports").then((res) => setReports(res.data));
  };

  useEffect(() => {
    load();
  }, []);

  const toggleBlock = async (id) => {
    await api.patch(`/admin/users/${id}/block`);
    load();
  };

  const verify = async (id) => {
    await api.patch(`/admin/users/${id}/verify`);
    load();
  };

  const resolveReport = async (id) => {
    await api.patch(`/admin/reports/${id}`, { status: "Resolved" });
    load();
  };

  if (!overview) return <DashboardLayout><p>Loading...</p></DashboardLayout>;

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Users" value={overview.totalUsers} />
        <StatCard label="Active Sessions" value={overview.activeSessions} />
        <StatCard label="Matches Made" value={overview.totalMatches} />
        <StatCard label="Pending Reports" value={overview.pendingReports} />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border rounded-xl p-5">
          <h2 className="font-semibold mb-3">Top Skills</h2>
          <ul className="space-y-2 text-sm">
            {overview.topSkills.map((s) => (
              <li key={s.skill} className="flex justify-between border-b pb-1">
                <span>{s.skill}</span>
                <span className="text-gray-400">{s.count}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white border rounded-xl p-5">
          <h2 className="font-semibold mb-3">Recent Reports</h2>
          <ul className="space-y-2 text-sm">
            {reports.slice(0, 5).map((r) => (
              <li key={r._id} className="flex justify-between items-center border-b pb-1">
                <span>{r.reportedUser?.name} — {r.reason}</span>
                {r.status !== "Resolved" ? (
                  <button onClick={() => resolveReport(r._id)} className="text-xs text-primary font-medium">
                    Resolve
                  </button>
                ) : (
                  <span className="text-xs text-green-600">Resolved</span>
                )}
              </li>
            ))}
            {reports.length === 0 && <p className="text-gray-400">No reports.</p>}
          </ul>
        </div>
      </div>

      <div className="bg-white border rounded-xl p-5">
        <h2 className="font-semibold mb-3">Manage Users</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="py-2">Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Verified</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b">
                <td className="py-2">{u.name}</td>
                <td>{u.email}</td>
                <td>{u.isBlocked ? "Blocked" : "Active"}</td>
                <td>{u.badges?.verifiedTeacher ? "Yes" : "No"}</td>
                <td className="text-right space-x-2">
                  {!u.badges?.verifiedTeacher && (
                    <button onClick={() => verify(u._id)} className="text-xs text-primary font-medium">
                      Verify
                    </button>
                  )}
                  <button onClick={() => toggleBlock(u._id)} className="text-xs text-red-500 font-medium">
                    {u.isBlocked ? "Unblock" : "Block"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default AdminOverview;
