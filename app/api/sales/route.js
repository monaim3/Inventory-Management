import db from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await db.query(`
      SELECT 
        s.id, s.quantity, s.unit_price, s.total_price, s.note, s.sale_date,
        c.name AS customer_name, c.phone AS customer_phone,
        p.name AS product_name
      FROM sales s
      LEFT JOIN customers c ON s.customer_id = c.id
      LEFT JOIN products p ON s.product_id = p.id
      ORDER BY s.sale_date DESC
    `);
    return Response.json(rows);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { customer_id, product_id, quantity, note } = await request.json();

    const [products] = await db.query(
      "SELECT price, quantity FROM products WHERE id = ?",
      [product_id],
    );
    if (products.length === 0)
      return Response.json({ error: "Product not found" }, { status: 404 });

    const product = products[0];
    if (product.quantity < quantity) {
      return Response.json({ error: "Not enough stock!" }, { status: 400 });
    }

    const unit_price = product.price;
    const total_price = unit_price * quantity;

    const [result] = await db.query(
      "INSERT INTO sales (customer_id, product_id, quantity, unit_price, total_price, note) VALUES (?, ?, ?, ?, ?, ?)",
      [customer_id, product_id, quantity, unit_price, total_price, note],
    );

    await db.query("UPDATE products SET quantity = quantity - ? WHERE id = ?", [
      quantity,
      product_id,
    ]);

    await db.query(
      "INSERT INTO stock_transactions (product_id, type, quantity, note) VALUES (?, ?, ?, ?)",
      [product_id, "OUT", quantity, `Sale #${result.insertId}`],
    );

    return Response.json({
      message: "Sale recorded!",
      id: result.insertId,
      total_price,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
