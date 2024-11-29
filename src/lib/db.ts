import { sql, QueryResultRow } from "@vercel/postgres";

export const query = async <T extends QueryResultRow>(
  query: TemplateStringsArray,
  ...params: (string | number | null)[]
): Promise<T[]> => {
  try {
    const { rows } = await sql<T>(query, ...params);
    return rows;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Unknown database error"
    );
  }
};
