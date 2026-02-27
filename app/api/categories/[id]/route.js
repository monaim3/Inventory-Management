import db from "@/lib/db";

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { name, description } = await request.json();
    await db.query(
      "UPDATE categories SET name = ?, description = ? WHERE id = ?",
      [name, description, id],
    );
    return Response.json({ message: "Category updated!" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await db.query("DELETE FROM categories WHERE id = ?", [id]);
    return Response.json({ message: "Category deleted!" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
