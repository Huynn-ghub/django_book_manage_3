import React, { useState, useEffect } from 'react';
import { getBook, createBook, updateBook, deleteBook } from '../api/bookApi';

const EMPTY_FORM = {
  title: '',
  author: '',
  published_date: '',
  price: '',
  quantity: '',
};

export default function BookModal({ type, book, onClose, onSaved }) {
  const [form, setForm]     = useState(EMPTY_FORM);
  const [detail, setDetail] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Load detail data for 'detail' and 'edit' types
  useEffect(() => {
    if (type === 'detail' && book?.id) {
      setLoading(true);
      getBook(book.id)
        .then(data => setDetail(data))
        .catch(() => setDetail(null))
        .finally(() => setLoading(false));
    }
    if (type === 'edit' && book) {
      setForm({
        title:          book.title          ?? '',
        author:         book.author         ?? '',
        published_date: book.published_date ?? '',
        price:          book.price          ?? '',
        quantity:       book.quantity       ?? '',
      });
    }
  }, [type, book]);

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(er => ({ ...er, [e.target.name]: null }));
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim())          errs.title = 'Title is required';
    if (!form.author.trim())         errs.author = 'Author is required';
    if (!form.published_date.trim()) errs.published_date = 'Published date is required';
    if (form.price !== '' && isNaN(Number(form.price)))       errs.price = 'Price must be a number';
    if (form.quantity !== '' && isNaN(Number(form.quantity))) errs.quantity = 'Quantity must be a number';
    return errs;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const payload = {
      title:          form.title.trim(),
      author:         form.author.trim(),
      published_date: form.published_date,
      price:          form.price    !== '' ? Number(form.price)    : undefined,
      quantity:       form.quantity !== '' ? Number(form.quantity) : undefined,
    };

    setLoading(true);
    try {
      if (type === 'add')  await createBook(payload);
      if (type === 'edit') await updateBook(book.id, payload);
      onSaved();
    } catch (err) {
      // Backend validation errors
      if (err && typeof err === 'object') setErrors(err);
      else setErrors({ general: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteBook(book.id);
      onSaved();
    } catch {
      setErrors({ general: 'Failed to delete book.' });
    } finally {
      setLoading(false);
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  const titles = { add: 'Add New Book', edit: 'Edit Book', detail: 'Book Detail', confirm: 'Confirm Delete' };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{titles[type]}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">

          {/* ── DETAIL ─────────────────────────────────────────── */}
          {type === 'detail' && (
            loading ? <p>Loading...</p> : detail ? (
              <table className="detail-table">
                <tbody>
                  <tr><td><strong>ID</strong></td><td>{detail.id}</td></tr>
                  <tr><td><strong>Title</strong></td><td>{detail.title}</td></tr>
                  <tr><td><strong>Author</strong></td><td>{detail.author}</td></tr>
                  <tr><td><strong>Published Date</strong></td><td>{detail.published_date}</td></tr>
                  <tr><td><strong>Price</strong></td><td>{detail.price}</td></tr>
                  <tr><td><strong>Quantity</strong></td><td>{detail.quantity}</td></tr>
                </tbody>
              </table>
            ) : <p>Could not load book details.</p>
          )}

          {/* ── CONFIRM DELETE ──────────────────────────────────── */}
          {type === 'confirm' && (
            <div className="confirm-content">
              <p>Are you sure you want to delete <strong>"{book?.title}"</strong>?</p>
              {errors.general && <p className="error-msg">{errors.general}</p>}
              <div className="modal-actions">
                <button className="btn btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
                <button className="btn btn-danger" onClick={handleDelete} disabled={loading}>
                  {loading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          )}

          {/* ── ADD / EDIT FORM ─────────────────────────────────── */}
          {(type === 'add' || type === 'edit') && (
            <form onSubmit={handleSubmit} className="book-form" noValidate>
              {errors.general && <p className="error-msg">{errors.general}</p>}

              <div className="form-group">
                <label>Title *</label>
                <input name="title" value={form.title} onChange={handleChange} />
                {errors.title && <span className="field-error">{errors.title}</span>}
              </div>

              <div className="form-group">
                <label>Author *</label>
                <input name="author" value={form.author} onChange={handleChange} />
                {errors.author && <span className="field-error">{errors.author}</span>}
              </div>

              <div className="form-group">
                <label>Published Date *</label>
                <input type="date" name="published_date" value={form.published_date} onChange={handleChange} />
                {errors.published_date && <span className="field-error">{errors.published_date}</span>}
              </div>

              <div className="form-group">
                <label>Price</label>
                <input type="number" step="0.01" min="0" name="price" value={form.price} onChange={handleChange} />
                {errors.price && <span className="field-error">{errors.price}</span>}
              </div>

              <div className="form-group">
                <label>Quantity</label>
                <input type="number" min="0" name="quantity" value={form.quantity} onChange={handleChange} />
                {errors.quantity && <span className="field-error">{errors.quantity}</span>}
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : type === 'add' ? 'Add Book' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
