import React from 'react';
import { Link } from 'react-router-dom';

const BookCard = ({ book }) => {
  return (
    <div style={card}>
      {/* Кітаптың суреті - бассаң ішкі бетіне өтеді */}
      <Link to={`/book/${book.id}`} style={{ textDecoration: 'none' }}>
        <div style={imageContainer}>
          <img src={book.image_url} alt={book.title} style={img} />
          <div style={genreTag}>{book.genre}</div>
        </div>
        <h4 style={title}>{book.title}</h4>
        <p style={author}>{book.author}</p>
      </Link>

      <div style={footer}>
        <span style={price}>{book.price} ₸</span>
        <button 
          style={addBtn} 
          onClick={() => alert(`${book.title} себетке қосылды!`)}
          title="Себетке қосу"
        >
          +
        </button>
      </div>
    </div>
  );
};

// СТИЛЬДЕР
const card = {
  background: 'white',
  padding: '15px',
  borderRadius: '20px',
  boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '100%',
  border: '1px solid #F1F5F9'
};

const imageContainer = {
  position: 'relative',
  width: '100%',
  height: '250px',
  borderRadius: '12px',
  overflow: 'hidden',
  marginBottom: '15px'
};

const img = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: '0.5s'
};

const genreTag = {
  position: 'absolute',
  top: '10px',
  left: '10px',
  background: 'rgba(14, 165, 233, 0.9)',
  color: 'white',
  padding: '4px 10px',
  borderRadius: '8px',
  fontSize: '0.75rem',
  fontWeight: 'bold'
};

const title = {
  fontSize: '1.1rem',
  color: '#1E293B',
  margin: '0 0 5px 0',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
};

const author = {
  fontSize: '0.9rem',
  color: '#64748B',
  marginBottom: '15px'
};

const footer = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: 'auto'
};

const price = {
  fontSize: '1.2rem',
  fontWeight: 'bold',
  color: '#0EA5E9'
};

const addBtn = {
  background: '#F0F9FF',
  color: '#0EA5E9',
  border: 'none',
  width: '35px',
  height: '35px',
  borderRadius: '10px',
  cursor: 'pointer',
  fontSize: '1.2rem',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: '0.2s'
};

export default BookCard;