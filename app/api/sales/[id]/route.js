import db from "@/lib/db";

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await db.query("DELETE FROM sales WHERE id = ?", [id]);
    return Response.json({ message: "Deleted!" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
