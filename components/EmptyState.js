export default function EmptyState({ message = "No data found", colSpan = 100 }) {
  return (
    <tr>
      <td colSpan={colSpan} className="py-16 text-center">
        <div className="flex flex-col items-center gap-3">
          <span className="text-5xl">📭</span>
          <p className="text-[#7AB2B2] text-sm font-medium">{message}</p>
        </div>
      </td>
    </tr>
  );
}
