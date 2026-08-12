import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-dark text-white">
      <header className="flex items-center justify-between px-10 py-5">
        <div className="text-xl font-bold flex items-center gap-2">
          <span className="bg-primary rounded-md px-2 py-1">S</span> SkillSync
        </div>
        <nav className="hidden md:flex gap-8 text-sm text-gray-300">
          <a href="#how">How It Works</a>
          <a href="#about">About Us</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className="flex gap-3">
          <Link to="/login" className="px-4 py-2 text-sm rounded-lg border border-white/30">
            Log In
          </Link>
          <Link to="/register" className="px-4 py-2 text-sm rounded-lg bg-primary font-medium">
            Sign Up
          </Link>
        </div>
      </header>

      <section className="px-10 py-20 max-w-3xl">
        <span className="inline-block mb-4 px-3 py-1 rounded-full bg-white/10 text-xs">
          Learn. Teach. Grow Together.
        </span>
        <h1 className="text-5xl font-bold leading-tight mb-6">
          Swap Skills. <br />
          <span className="text-primary">Build Futures.</span>
        </h1>
        <p className="text-gray-300 mb-8">
          SkillSync is a peer-to-peer platform where you can teach what you know and learn what
          you don't — no course fees, just people trading knowledge.
        </p>
        <div className="flex gap-4">
          <Link to="/register" className="px-6 py-3 rounded-lg bg-primary font-medium">
            Get Started
          </Link>
          <Link to="/explore" className="px-6 py-3 rounded-lg border border-white/30">
            Explore Skills
          </Link>
        </div>
      </section>

      <section id="how" className="px-10 py-16 grid md:grid-cols-4 gap-6 bg-white text-dark">
        {[
          ["Peer to Peer Learning", "Real people, real skills — no gatekeeping."],
          ["Smart Matching", "Find the perfect swap partner based on goals."],
          ["Flexible Sessions", "Learn on your time, your way."],
          ["Trusted Community", "Reviews, badges, and a safe environment."],
        ].map(([title, desc]) => (
          <div key={title} className="p-5 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="font-semibold mb-2">{title}</h3>
            <p className="text-sm text-gray-500">{desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Home;
