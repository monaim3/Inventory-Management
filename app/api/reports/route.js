import db from "@/lib/db";

export async function GET() {
  try {
    const [leftJoin] = await db.query(`
      SELECT 
        p.name AS product_name, p.price, p.quantity,
        c.name AS category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
    `);

    const [rightJoin] = await db.query(`
      SELECT 
        s.name AS supplier_name, s.phone,
        p.name AS product_name, p.quantity
      FROM products p
      RIGHT JOIN suppliers s ON p.supplier_id = s.id
    `);

    // Stock history
    const [stockHistory] = await db.query(`
      SELECT 
        p.name AS product_name,
        t.type, t.quantity, t.note, t.created_at
      FROM stock_transactions t
      LEFT JOIN products p ON t.product_id = p.id
      ORDER BY t.created_at DESC
    `);

    // Low stock alert
    const [lowStock] = await db.query(`
      SELECT * FROM products WHERE quantity < 10
    `);

    return Response.json({ leftJoin, rightJoin, stockHistory, lowStock });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
