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
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingEmail, setEditingEmail] = useState("");

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

  const handleUpdate = async (id: number) => {
    try {
      const response = await fetch("/api/users/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name: editingName, email: editingEmail }),
      });
      if (!response.ok) throw new Error("Failed to update user");
      const updatedUser = await response.json();
      setUsers((prev) =>
        prev.map((user) => (user.id === id ? updatedUser : user))
      );
      setEditingId(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch("/api/users/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) throw new Error("Failed to delete user");

      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
          User Management System
        </h1>

        {/* Create Form */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-sm mb-6">
          <h2 className="text-xl font-semibold mb-4">Add New User</h2>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Name"
              className="border rounded-lg p-2 flex-1"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              className="border rounded-lg p-2 flex-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
              onClick={handleCreate}
            >
              Create
            </button>
          </div>
        </div>

        {/* Users List */}
        <div>
          <h2 className="text-xl font-semibold mb-4">User List</h2>
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse bg-gray-50 rounded-lg shadow">
              <thead>
                <tr className="bg-blue-100 text-blue-600">
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-100 transition">
                      {editingId === user.id ? (
                        <>
                          <td className="p-3">{user.id}</td>
                          <td className="p-3">
                            <input
                              type="text"
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              className="border rounded-lg p-2 w-full"
                            />
                          </td>
                          <td className="p-3">
                            <input
                              type="email"
                              value={editingEmail}
                              onChange={(e) => setEditingEmail(e.target.value)}
                              className="border rounded-lg p-2 w-full"
                            />
                          </td>
                          <td className="p-3 flex gap-2">
                            <button
                              className="bg-green-600 text-white px-3 py-1 rounded-lg shadow hover:bg-green-700 transition"
                              onClick={() => handleUpdate(user.id)}
                            >
                              Save
                            </button>
                            <button
                              className="bg-gray-500 text-white px-3 py-1 rounded-lg shadow hover:bg-gray-600 transition"
                              onClick={() => setEditingId(null)}
                            >
                              Cancel
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="p-3">{user.id}</td>
                          <td className="p-3">{user.name}</td>
                          <td className="p-3">{user.email}</td>
                          <td className="p-3 flex gap-2">
                            <button
                              className="bg-yellow-500 text-white px-3 py-1 rounded-lg shadow hover:bg-yellow-600 transition"
                              onClick={() => {
                                setEditingId(user.id);
                                setEditingName(user.name);
                                setEditingEmail(user.email);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="bg-red-500 text-white px-3 py-1 rounded-lg shadow hover:bg-red-600 transition"
                              onClick={() => handleDelete(user.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center p-4 text-gray-600">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
