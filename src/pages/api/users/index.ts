import { NextApiRequest, NextApiResponse } from "next";
import { query } from "../../../lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const users = await query`SELECT * FROM users`;
    res.status(200).json(users || []);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
