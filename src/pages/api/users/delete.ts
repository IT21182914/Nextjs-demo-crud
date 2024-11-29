import { NextApiRequest, NextApiResponse } from "next";
import { query } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "DELETE") {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }

    try {
      await query<unknown>("DELETE FROM users WHERE id = $1", [id]);
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
        res.status(500).json({ error: "Failed to delete user" });
      }
    }
  } else {
    res.setHeader("Allow", ["DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
