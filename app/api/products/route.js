import db from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.id, p.name, p.price, p.quantity, p.created_at,
        c.name AS category_name,
        s.name AS supplier_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN suppliers s ON p.supplier_id = s.id
      ORDER BY p.created_at DESC
    `);
    return Response.json(rows);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name, price, quantity, category_id, supplier_id } =
      await request.json();
    const [result] = await db.query(
      "INSERT INTO products (name, price, quantity, category_id, supplier_id) VALUES (?, ?, ?, ?, ?)",
      [name, price, quantity, category_id, supplier_id],
    );
    return Response.json({ message: "Product created!", id: result.insertId });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
