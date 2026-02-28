const WIDTHS = ["w-3/4", "w-1/2", "w-2/3", "w-5/6", "w-2/5", "w-1/3", "w-4/5"];

export default function SkeletonRow({ cols = 5, rows = 5 }) {
  return (
    <>
      {[...Array(rows)].map((_, i) => (
        <tr key={i} className="border-b border-[#f0f7f8]">
          {[...Array(cols)].map((_, j) => (
            <td key={j} className="px-3.5 py-3.5">
              <div
                className={`h-4 bg-gray-200 rounded-md animate-pulse ${WIDTHS[(i + j) % WIDTHS.length]}`}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
