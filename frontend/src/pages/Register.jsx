import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", city: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-8 rounded-xl shadow-sm border">
        <h1 className="text-2xl font-bold mb-1">Create your account</h1>
        <p className="text-sm text-gray-500 mb-6">Start teaching and learning today.</p>

        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

        <label className="text-sm font-medium">Full name</label>
        <input
          required
          className="w-full mt-1 mb-4 px-3 py-2 border rounded-lg"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <label className="text-sm font-medium">Email</label>
        <input
          type="email"
          required
          className="w-full mt-1 mb-4 px-3 py-2 border rounded-lg"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <label className="text-sm font-medium">City</label>
        <input
          className="w-full mt-1 mb-4 px-3 py-2 border rounded-lg"
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
        />

        <label className="text-sm font-medium">Password</label>
        <input
          type="password"
          required
          minLength={6}
          className="w-full mt-1 mb-6 px-3 py-2 border rounded-lg"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          disabled={loading}
          className="w-full py-2 rounded-lg bg-primary text-white font-medium disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        <p className="text-sm text-gray-500 mt-4 text-center">
          Already have an account? <Link to="/login" className="text-primary font-medium">Log in</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
