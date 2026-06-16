import React, { useState, useEffect, useCallback } from 'react';
import { getBooks } from './api/bookApi';
import BookTable from './components/BookTable';
import Pagination from './components/Pagination';
import FilterBar from './components/FilterBar';
import BookModal from './components/BookModal';
import './App.css';

const EMPTY_FORM = { title: '', author: '', published_date: '', price: '', quantity: '' };

export default function App() {
  const [books, setBooks]           = useState([]);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(null);

  // Pagination
  const [page, setPage]             = useState(1);
  const [pageSize, setPageSize]     = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [count, setCount]           = useState(0);

  // Filters (applied)
  const [appliedFilters, setAppliedFilters] = useState({ title: '', author: '' });
  // Filters (draft while typing)
  const [draftFilters, setDraftFilters]     = useState({ title: '', author: '' });

  // Modal state
  const [modal, setModal] = useState(null);
  // { type: 'add'|'edit'|'detail'|'confirm', book: {...} }

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBooks({ page, page_size: pageSize, ...appliedFilters });
      setBooks(data.results);
      setTotalPages(data.total_pages);
      setCount(data.count);
    } catch (e) {
      setError('Failed to load books. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, appliedFilters]);

  useEffect(() => { fetchBooks(); }, [fetchBooks]);

  const handleSearch = () => {
    setPage(1);
    setAppliedFilters({ ...draftFilters });
  };

  const handleClear = () => {
    setDraftFilters({ title: '', author: '' });
    setAppliedFilters({ title: '', author: '' });
    setPage(1);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setPage(1);
  };

  const openAdd    = ()      => setModal({ type: 'add', book: null });
  const openEdit   = (book)  => setModal({ type: 'edit', book });
  const openDetail = (id)    => setModal({ type: 'detail', book: { id } });
  const openDelete = (book)  => setModal({ type: 'confirm', book });
  const closeModal = ()      => setModal(null);

  const handleSaved = () => { closeModal(); fetchBooks(); };

  return (
    <div className="app">
      <header className="app-header">
        <h1>📚 Book Management</h1>
      </header>

      <main className="app-main">
        <div className="toolbar">
          <FilterBar
            filters={draftFilters}
            onChange={setDraftFilters}
            onSearch={handleSearch}
            onClear={handleClear}
          />
          <button className="btn btn-primary" onClick={openAdd}>+ Add Book</button>
        </div>

        {error && <p className="error-msg">{error}</p>}
        {loading ? (
          <p className="loading-msg">Loading...</p>
        ) : (
          <BookTable
            books={books}
            onDetail={openDetail}
            onEdit={openEdit}
            onDelete={openDelete}
          />
        )}

        <Pagination
          page={page}
          totalPages={totalPages}
          pageSize={pageSize}
          count={count}
          onPageChange={setPage}
          onPageSizeChange={handlePageSizeChange}
        />
      </main>

      {modal && (
        <BookModal
          type={modal.type}
          book={modal.book}
          onClose={closeModal}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
