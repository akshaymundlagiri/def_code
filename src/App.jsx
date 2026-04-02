import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Pages
const Home = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold mb-4">Code Battle</h1>
    <div className="flex gap-4">
      <button onClick={() => (window.location.href = "/battle")} className="bg-blue-600 text-white px-4 py-2 rounded">Start Battle</button>
      <button onClick={() => (window.location.href = "/practice")} className="bg-blue-600 text-white px-4 py-2 rounded">Practice</button>
    </div>
  </div>
);

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Editor from "@monaco-editor/react";

const socket = io("http://localhost:3000"); // backend URL

const Battle = () => {
  const [code, setCode] = useState("// Start coding...");
  const [status, setStatus] = useState("Waiting for opponent...");
  const [opponent, setOpponent] = useState(null);
  const [output, setOutput] = useState("");
  const [timeLeft, setTimeLeft] = useState(300);

  useEffect(() => {
    socket.emit("joinMatchmaking");

    socket.on("matchFound", (data) => {
      setOpponent(data.opponent);
      setStatus("Match found! Battle started ⚔️");
    });

    socket.on("battleUpdate", (data) => {
      setOutput(data.output);
    });

    socket.on("battleEnd", (data) => {
      setStatus(`Battle ended. Winner: ${data.winner}`);
    });

    return () => {
      socket.off("matchFound");
      socket.off("battleUpdate");
      socket.off("battleEnd");
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const submitCode = () => {
    socket.emit("submitCode", { code });
    setStatus("Code submitted...");
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">⚔️ Live Battle</h2>
        <div className="text-lg">⏳ {timeLeft}s</div>
      </div>

      <div className="flex justify-between">
        <div className="bg-gray-100 p-3 rounded w-1/2 mr-2">
          <p className="font-medium">You</p>
        </div>
        <div className="bg-gray-100 p-3 rounded w-1/2 ml-2 text-right">
          <p className="font-medium">{opponent || "Searching..."}</p>
        </div>
      </div>

      <div className="border rounded overflow-hidden">
        <Editor
          height="400px"
          defaultLanguage="javascript"
          value={code}
          onChange={(value) => setCode(value || "")}
        />
      </div>

      <div className="flex gap-4">
        <button
          onClick={submitCode}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Submit Code
        </button>
        <div className="text-gray-600">{status}</div>
      </div>

      <div className="bg-black text-green-400 p-3 rounded h-40 overflow-auto">
        <p>{output || "Execution output will appear here..."}</p>
      </div>
    </div>
  );
};

const Practice = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Practice Mode</h2>
      <textarea className="w-full h-64 border p-2" placeholder="Solve problem..."></textarea>
      <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">Run Code</button>
    </div>
  );
};

const Leaderboard = () => {
  const dummy = [
    { name: "User1", rating: 1500 },
    { name: "User2", rating: 1450 }
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Leaderboard</h2>
      <ul>
        {dummy.map((u, i) => (
          <li key={i} className="border p-2 mb-2">
            {u.name} - {u.rating}
          </li>
        ))}
      </ul>
    </div>
  );
};

const Dashboard = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold">Performance Dashboard</h2>
      <p>Graphs + stats will go here</p>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/battle" element={<Battle />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
