"use client";

import { useState, useEffect } from "react";

interface User {
  id: number;
  name: string;
  email: string;
}

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("/api/users");
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchUsers();
  }, []);

  const handleCreate = async () => {
    try {
      const response = await fetch("/api/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      if (!response.ok) throw new Error("Failed to create user");
      const newUser = await response.json();
      setUsers((prev) => [...prev, newUser]);
      setName("");
      setEmail("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">User Management</h1>
      <div className="flex gap-4 my-4">
        <input
          type="text"
          placeholder="Name"
          className="border p-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="border p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2"
          onClick={handleCreate}
        >
          Create
        </button>
      </div>
      <ul className="list-disc">
        {users.length > 0 ? (
          users.map((user) => (
            <li key={user.id}>
              {user.name} - {user.email}
            </li>
          ))
        ) : (
          <li>No users available</li>
        )}
      </ul>
    </div>
  );
}
