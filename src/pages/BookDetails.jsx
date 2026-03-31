import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/books/${id}`)
      .then(res => setBook(res.data))
      .catch(err => console.log("Қате:", err));
  }, [id]);

  // СЕБЕТКЕ ҚОСУ ФУНКЦИЯСЫ
  const addToCart = () => {
    // 1. Бұрыннан бар заттарды аламыз (немесе бос массив)
    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];

    // 2. Бұл кітап себетте бұрыннан бар ма, тексереміз
    const isBookInCart = existingCart.some(item => item.id === book.id);

    if (isBookInCart) {
      alert("Бұл кітап себетте бұрыннан бар! ");
    } else {
      // 3. Себетке қосамыз
      const updatedCart = [...existingCart, book];
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      alert("Кітап себетке сәтті қосылды! ");
    }
  };

  if (!book) return <div style={loadingStyle}>Жүктелуде... </div>;

  return (
    <div style={container}>
      <div style={card}>
        {/* Сол жақ: Кітап суреті */}
        <div style={imageSection}>
          <img src={book.image_url} alt={book.title} style={imgStyle} />
        </div>

        {/* Оң жақ: Ақпараттар */}
        <div style={infoSection}>
          <button onClick={() => navigate(-1)} style={backBtn}>← Артқа қайту</button>
          
          <h1 style={titleStyle}>{book.title}</h1>
          <p style={authorStyle}>Авторы: <span style={{color: '#1E293B'}}>{book.author}</span></p>
          
          <div style={tags}>
            <span style={tag}> {book.year} жыл</span>
            <span style={tag}> {book.genre}</span>
          </div>

          {book.summary && (
            <div style={summaryBox}>
              <h3 style={{marginBottom: '10px', color: '#0369A1', fontSize: '1.1rem'}}>
                 Автордан қысқаша мазмұн:
              </h3>
              <p style={summaryText}>
                "{book.summary}"
              </p>
            </div>
          )}

          <div style={descBox}>
            <h3 style={{marginBottom: '10px', color: '#0EA5E9'}}>Кітап туралы сипаттама:</h3>
            <p style={descText}>{book.description}</p>
          </div>

          <div style={priceContainer}>
            <span style={priceLabel}>Бағасы:</span>
            <p style={priceValue}>{book.price} ₸</p>
          </div>
          
          {/* onClick ЕСКЕРІЛДІ */}
          <button onClick={addToCart} style={buyBtn}>СЕБЕТКЕ ҚОСУ</button>
        </div>
      </div>
    </div>
  );
};

// --- СТИЛЬДЕР (Өзгеріссіз қалды) ---
const container = { padding: '60px 20px', background: '#E0F2FE', minHeight: '100vh', display: 'flex', justifyContent: 'center' };
const card = { display: 'flex', gap: '50px', maxWidth: '1100px', width: '100%', background: 'white', padding: '40px', borderRadius: '35px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)', flexWrap: 'wrap', alignItems: 'flex-start' };
const imageSection = { flex: '1', minWidth: '300px' };
const imgStyle = { width: '100%', borderRadius: '25px', boxShadow: '0 15px 35px rgba(0,0,0,0.15)', objectFit: 'cover' };
const infoSection = { flex: '1.5', minWidth: '300px' };
const backBtn = { background: 'none', border: 'none', color: '#0369A1', cursor: 'pointer', marginBottom: '20px', fontSize: '1rem', fontWeight: 'bold' };
const titleStyle = { fontSize: '2.5rem', color: '#0F172A', marginBottom: '10px' };
const authorStyle = { fontSize: '1.2rem', color: '#64748B', marginBottom: '20px' };
const tags = { display: 'flex', gap: '12px', marginBottom: '25px' };
const tag = { background: '#F0F9FF', color: '#0EA5E9', padding: '10px 18px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 'bold', border: '1px solid #BAE6FD' };
const summaryBox = { background: '#F0F9FF', padding: '25px', borderRadius: '20px', borderLeft: '6px solid #0EA5E9', marginBottom: '25px', boxShadow: '0 4px 15px rgba(14, 165, 233, 0.05)' };
const summaryText = { lineHeight: '1.8', color: '#1E293B', fontStyle: 'italic', fontSize: '1.05rem' };
const descBox = { background: '#F8FAFC', padding: '25px', borderRadius: '20px', marginBottom: '25px', border: '1px solid #F1F5F9' };
const descText = { lineHeight: '1.7', color: '#475569' };
const priceContainer = { display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '25px' };
const priceLabel = { fontSize: '1.2rem', color: '#64748B' };
const priceValue = { fontSize: '2.2rem', fontWeight: 'bold', color: '#0EA5E9' };
const buyBtn = { width: '100%', padding: '20px', background: '#0EA5E9', color: 'white', border: 'none', borderRadius: '18px', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 10px 25px rgba(14, 165, 233, 0.3)', transition: '0.3s' };
const loadingStyle = { textAlign: 'center', marginTop: '100px', fontSize: '1.5rem', color: '#0EA5E9', background: '#E0F2FE', height: '100vh' };

export default BookDetails;