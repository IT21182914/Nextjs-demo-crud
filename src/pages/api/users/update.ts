import { NextApiRequest, NextApiResponse } from "next";
import { query } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    const { id, name, email } = req.body;

    if (!id || !name || !email) {
      return res
        .status(400)
        .json({ error: "ID, name, and email are required" });
    }

    try {
      const result = await query(
        "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *",
        [name, email, id]
      );
      res.status(200).json(result[0]);
    } catch (error: any) {
      console.error(error.message);
      res.status(500).json({ error: "Failed to update user" });
    }
  } else {
    res.setHeader("Allow", ["PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
