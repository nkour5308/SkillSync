import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import api from "../api/axios";

const ExploreMatches = () => {
  const [results, setResults] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(null);

  const load = () => {
    setLoading(true);
    api
      .get("/users/explore")
      .then((res) => setResults(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const sendRequest = async (candidate) => {
    const skillRequested = candidate.theyCanTeachMeWhatIWantToLearn[0];
    const skillOffered = candidate.iCanTeachThemWhatTheyWantToLearn[0];

    if (!skillRequested || !skillOffered) {
      alert("Need a mutual skill match to send a request.");
      return;
    }

    setRequesting(candidate.user._id);
    try {
      await api.post("/matches", {
        recipientId: candidate.user._id,
        skillRequested,
        skillOffered,
      });
      alert("Match request sent!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send request");
    } finally {
      setRequesting(null);
    }
  };

  const filtered = results.filter((r) =>
    r.user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-1">Explore Matches</h1>
      <p className="text-gray-500 mb-6">Find the perfect skill swap partner for you</p>

      <input
        placeholder="Search by name..."
        className="w-full max-w-sm mb-6 px-3 py-2 border rounded-lg"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading && <p className="text-gray-400">Loading matches...</p>}

      <div className="space-y-3">
        {filtered.map((r) => (
          <div
            key={r.user._id}
            className="bg-white border rounded-xl p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                {r.user.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium">
                  {r.user.name} {r.isMutualMatch && <span className="ml-1 text-xs text-green-600">Mutual match</span>}
                </p>
                <p className="text-xs text-gray-400">{r.user.city}</p>
                <p className="text-xs mt-1">
                  <span className="text-gray-500">Can teach:</span>{" "}
                  {r.theyCanTeachMeWhatIWantToLearn.join(", ") || "—"}
                </p>
                <p className="text-xs">
                  <span className="text-gray-500">Wants to learn:</span>{" "}
                  {r.iCanTeachThemWhatTheyWantToLearn.join(", ") || "—"}
                </p>
              </div>
            </div>
            <button
              onClick={() => sendRequest(r)}
              disabled={requesting === r.user._id}
              className="px-4 py-2 text-sm rounded-lg bg-primary text-white font-medium disabled:opacity-60"
            >
              {requesting === r.user._id ? "Sending..." : "Request Swap"}
            </button>
          </div>
        ))}
        {!loading && filtered.length === 0 && (
          <p className="text-gray-400">
            No matches yet — add skills to your profile to see suggestions.
          </p>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ExploreMatches;
