import { NextApiRequest, NextApiResponse } from "next";
import { query } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "DELETE") {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    try {
      await query("DELETE FROM users WHERE id = $1", [id]);
      res.status(204).end(); // No Content
    } catch (error: any) {
      console.error(error.message);
      res.status(500).json({ error: "Failed to delete user" });
    }
  } else {
    res.setHeader("Allow", ["DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
