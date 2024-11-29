import { sql, QueryResultRow } from "@vercel/postgres";

export const query = async <T extends QueryResultRow>(
  query: TemplateStringsArray,
  ...params: (string | number | null | boolean)[]
): Promise<T[]> => {
  try {
    const { rows } = await sql<T>(query, ...params);
    return rows;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error(
      error instanceof Error ? error.message : "Unknown database error"
    );
  }
};
