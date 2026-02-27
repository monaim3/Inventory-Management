import db from "@/lib/db";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [id]);
    if (rows.length === 0)
      return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json(rows[0]);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { name, price, quantity, category_id, supplier_id } =
      await request.json();
    await db.query(
      "UPDATE products SET name=?, price=?, quantity=?, category_id=?, supplier_id=? WHERE id=?",
      [name, price, quantity, category_id, supplier_id, id],
    );
    return Response.json({ message: "Updated!" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await db.query("DELETE FROM stock_transactions WHERE product_id = ?", [id]);
    await db.query("DELETE FROM sales WHERE product_id = ?", [id]);
    await db.query("DELETE FROM products WHERE id = ?", [id]);
    return Response.json({ message: "Deleted!" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
