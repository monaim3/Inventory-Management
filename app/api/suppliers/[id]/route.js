import db from "@/lib/db";

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { name, email, phone, address } = await request.json();
    await db.query(
      "UPDATE suppliers SET name = ?, email = ?, phone = ?, address = ? WHERE id = ?",
      [name, email, phone, address, id],
    );
    return Response.json({ message: "Supplier updated!" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await db.query("DELETE FROM suppliers WHERE id = ?", [id]);
    return Response.json({ message: "Supplier deleted!" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
