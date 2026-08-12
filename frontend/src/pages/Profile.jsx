import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import api from "../api/axios";

const emptySkill = { name: "", level: "Beginner", proofUrl: "" };

const SkillEditor = ({ title, skills, setSkills }) => {
  const update = (idx, field, value) => {
    const next = [...skills];
    next[idx] = { ...next[idx], [field]: value };
    setSkills(next);
  };

  const remove = (idx) => setSkills(skills.filter((_, i) => i !== idx));
  const add = () => setSkills([...skills, { ...emptySkill }]);

  return (
    <div className="bg-white border rounded-xl p-5">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold">{title}</h2>
        <button onClick={add} className="text-sm text-primary font-medium">+ Add Skill</button>
      </div>
      <div className="space-y-2">
        {skills.map((s, idx) => (
          <div key={idx} className="flex gap-2 items-center">
            <input
              placeholder="Skill name"
              className="flex-1 px-3 py-2 border rounded-lg text-sm"
              value={s.name}
              onChange={(e) => update(idx, "name", e.target.value)}
            />
            <select
              className="px-2 py-2 border rounded-lg text-sm"
              value={s.level}
              onChange={(e) => update(idx, "level", e.target.value)}
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
            <button onClick={() => remove(idx)} className="text-red-500 text-sm">✕</button>
          </div>
        ))}
        {skills.length === 0 && <p className="text-sm text-gray-400">No skills added yet.</p>}
      </div>
    </div>
  );
};

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/auth/me").then((res) => setProfile(res.data.user));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const res = await api.put("/users/profile", {
        bio: profile.bio,
        city: profile.city,
        skillsToTeach: profile.skillsToTeach,
        skillsToLearn: profile.skillsToLearn,
      });
      setProfile(res.data);
      alert("Profile updated!");
    } finally {
      setSaving(false);
    }
  };

  if (!profile) return <DashboardLayout><p>Loading...</p></DashboardLayout>;

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-1">My Profile</h1>
      <p className="text-gray-500 mb-6">Keep your skills up to date for better matches</p>

      <div className="bg-white border rounded-xl p-5 mb-6">
        <label className="text-sm font-medium">Bio</label>
        <textarea
          className="w-full mt-1 mb-4 px-3 py-2 border rounded-lg text-sm"
          rows={3}
          value={profile.bio || ""}
          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
        />
        <label className="text-sm font-medium">City</label>
        <input
          className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
          value={profile.city || ""}
          onChange={(e) => setProfile({ ...profile, city: e.target.value })}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <SkillEditor
          title="Skills I Can Teach"
          skills={profile.skillsToTeach || []}
          setSkills={(skills) => setProfile({ ...profile, skillsToTeach: skills })}
        />
        <SkillEditor
          title="Skills I Want to Learn"
          skills={profile.skillsToLearn || []}
          setSkills={(skills) => setProfile({ ...profile, skillsToLearn: skills })}
        />
      </div>

      <button
        onClick={save}
        disabled={saving}
        className="px-6 py-2 rounded-lg bg-primary text-white font-medium disabled:opacity-60"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </DashboardLayout>
  );
};

export default Profile;
