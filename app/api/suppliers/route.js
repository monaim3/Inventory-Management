import db from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await db.query("SELECT * FROM suppliers");
    return Response.json(rows);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name, email, phone, address } = await request.json();
    const [result] = await db.query(
      "INSERT INTO suppliers (name, email, phone, address) VALUES (?, ?, ?, ?)",
      [name, email, phone, address],
    );
    return Response.json({ message: "Supplier created!", id: result.insertId });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
