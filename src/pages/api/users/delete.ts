import { NextApiRequest, NextApiResponse } from "next";
import { query } from "../../../lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "DELETE") {
    const { id } = req.body;

    try {
      const result = await query`
        DELETE FROM users WHERE id = ${id} RETURNING *`;
      res.status(200).json(result[0]);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
