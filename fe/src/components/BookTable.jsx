import React from 'react';

export default function BookTable({ books, onDetail, onEdit, onDelete }) {
  if (books.length === 0) {
    return <p className="empty-msg">No books found.</p>;
  }

  return (
    <table className="book-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Title</th>
          <th>Author</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Published Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {books.map((book, idx) => (
          <tr key={book.id}>
            <td>{idx + 1}</td>
            <td>{book.title}</td>
            <td>{book.author}</td>
            <td>{book.price}</td>
            <td>{book.quantity}</td>
            <td>{book.published_date}</td>
            <td className="actions">
              <button className="btn btn-sm btn-secondary" onClick={() => onDetail(book.id)}>Detail</button>
              <button className="btn btn-sm btn-primary" onClick={() => onEdit(book)}>Edit</button>
              <button className="btn btn-sm btn-danger" onClick={() => onDelete(book)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
