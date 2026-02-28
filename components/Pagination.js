"use client";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className="flex items-center justify-between mt-5 pt-4 border-t border-[#f0f7f8]">
      <span className="text-sm text-gray-400">
        Page {currentPage} of {totalPages}
      </span>
      <div className="flex gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-[#EBF4F6] text-[#09637E] disabled:opacity-40 hover:bg-[#cce5ea] transition-colors cursor-pointer"
        >
          ‹ Prev
        </button>
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
              p === currentPage
                ? "bg-[#09637E] text-white"
                : "bg-[#EBF4F6] text-[#09637E] hover:bg-[#cce5ea]"
            }`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-[#EBF4F6] text-[#09637E] disabled:opacity-40 hover:bg-[#cce5ea] transition-colors cursor-pointer"
        >
          Next ›
        </button>
      </div>
    </div>
  );
}
