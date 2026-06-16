import React from 'react';

export default function Pagination({ page, totalPages, pageSize, count, onPageChange, onPageSizeChange }) {
  return (
    <div className="pagination">
      <div className="pagination-info">
        Page <strong>{page}</strong> of <strong>{totalPages}</strong>
        <span className="pagination-count"> ({count} books total)</span>
      </div>
      <div className="pagination-controls">
        <button
          className="btn btn-secondary"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          ← Prev
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          Next →
        </button>
        <select
          value={pageSize}
          onChange={e => onPageSizeChange(Number(e.target.value))}
        >
          <option value={20}>20 / page</option>
          <option value={100}>100 / page</option>
        </select>
      </div>
    </div>
  );
}
