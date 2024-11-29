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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      try {
        const response = await fetch("/api/users");
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const handleCreate = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: number) => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
          User Management System
        </h1>

        <div className="bg-gray-100 p-4 rounded-lg shadow-sm mb-6">
          <h2 className="text-xl font-semibold mb-4">Add New User</h2>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Name"
              className="border rounded-lg p-2 flex-1"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
            <input
              type="email"
              placeholder="Email"
              className="border rounded-lg p-2 flex-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
              onClick={handleCreate}
              disabled={loading}
            >
              Create
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">User List</h2>
          {loading ? (
            <div className="flex justify-center items-center">
              <div className="loader border-t-4 border-blue-500 w-8 h-8 rounded-full animate-spin"></div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center text-gray-600">No users found.</div>
          ) : (
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
                  {users.map((user) => (
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
                              disabled={loading}
                            />
                          </td>
                          <td className="p-3">
                            <input
                              type="email"
                              value={editingEmail}
                              onChange={(e) => setEditingEmail(e.target.value)}
                              className="border rounded-lg p-2 w-full"
                              disabled={loading}
                            />
                          </td>
                          <td className="p-3 flex gap-2">
                            <button
                              className="bg-green-600 text-white px-3 py-1 rounded-lg shadow hover:bg-green-700 transition"
                              onClick={() => handleUpdate(user.id)}
                              disabled={loading}
                            >
                              Save
                            </button>
                            <button
                              className="bg-gray-500 text-white px-3 py-1 rounded-lg shadow hover:bg-gray-600 transition"
                              onClick={() => setEditingId(null)}
                              disabled={loading}
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
                              className="bg-blue-500 text-white px-3 py-1 rounded-lg shadow hover:bg-blue-700 transition"
                              onClick={() => {
                                setEditingId(user.id);
                                setEditingName(user.name);
                                setEditingEmail(user.email);
                              }}
                              disabled={loading}
                            >
                              Update
                            </button>
                            <button
                              className="bg-red-500 text-white px-3 py-1 rounded-lg shadow hover:bg-red-600 transition"
                              onClick={() => handleDelete(user.id)}
                              disabled={loading}
                            >
                              Delete
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
