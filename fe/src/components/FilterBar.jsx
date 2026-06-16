import React from 'react';

export default function FilterBar({ filters, onChange, onSearch, onClear }) {
  return (
    <div className="filter-bar">
      <input
        type="text"
        placeholder="Search by title..."
        value={filters.title}
        onChange={e => onChange({ ...filters, title: e.target.value })}
      />
      <input
        type="text"
        placeholder="Search by author..."
        value={filters.author}
        onChange={e => onChange({ ...filters, author: e.target.value })}
      />
      <button className="btn btn-primary" onClick={onSearch}>Search</button>
      <button className="btn btn-secondary" onClick={onClear}>Clear</button>
    </div>
  );
}
