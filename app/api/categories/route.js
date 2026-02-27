import db from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await db.query("SELECT * FROM categories");
    return Response.json(rows);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name, description } = await request.json();
    const [result] = await db.query(
      "INSERT INTO categories (name, description) VALUES (?, ?)",
      [name, description],
    );
    return Response.json({ message: "Category created!", id: result.insertId });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
