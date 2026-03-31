import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [f, setF] = useState({ 
    title: '', 
    author: '', 
    year: '', 
    description: '', 
    genre: 'Фантастика', 
    price: '', 
    image_url: '',
    summary: '',
    stock: '' // 1. ҚОЙМАДАҒЫ САНЫ ҮШІН ЖАҢА ӨРІС
  });

  useEffect(() => {
    const userRole = localStorage.getItem('role');
    if (userRole !== 'ADMIN') {
      alert("Сізге бұл бетке кіруге рұқсат жоқ!");
      navigate('/home');
    } else {
      fetchBooks();
    }
  }, [navigate]);

  const fetchBooks = async () => {
    try {
      const res = await axios.get('https://ebookstore-backend-eubu.onrender.com/api/books');
      setBooks(res.data);
    } catch (err) {
      console.error("Тізімді алу қатесі:", err);
    }
  };

  const deleteBook = async (id) => {
    if (window.confirm("Бұл кітапты өшіруге сенімдісіз бе?")) {
      try {
        await axios.delete(`https://ebookstore-backend-eubu.onrender.com/api/books/${id}`);
        alert("Кітап өшірілді! 🗑️");
        fetchBooks();
      } catch (err) {
        alert("Өшіру мүмкін болмады");
      }
    }
  };

  const submit = (e) => {
    e.preventDefault();
    const bookData = {
      ...f,
      year: parseInt(f.year),
      price: parseFloat(f.price),
      stock: parseInt(f.stock) // Санды бүтін санға айналдыру
    };

    axios.post('https://ebookstore-backend-eubu.onrender.com/api/books', bookData)
      .then(() => {
        alert("Кітап базаға сәтті қосылды! ✅");
        // ФОРМАНЫ ТАЗАЛАУ (stock-ты қоса)
        setF({ title: '', author: '', year: '', description: '', genre: 'Фантастика', price: '', image_url: '', summary: '', stock: '' });
        fetchBooks();
      })
      .catch(err => {
        alert("Қате: " + (err.response?.data?.error || "Сервер қатесі"));
      });
  };

  return (
    <div style={adminPageWrapper}>
      
      <button onClick={() => navigate('/home')} style={backBtnStyle}>
        ← БАСТЫ БЕТКЕ ҚАЙТУ
      </button>

      <form onSubmit={submit} style={formStyle}>
        <h2 style={{textAlign: 'center', color: '#0369A1', marginBottom: '10px'}}>Админ панель</h2>
        
        <input placeholder="Кітап атауы" style={adminInp} onChange={e => setF({...f, title: e.target.value})} value={f.title} required />
        <input placeholder="Авторы" style={adminInp} onChange={e => setF({...f, author: e.target.value})} value={f.author} required />
        
        <div style={{display: 'flex', gap: '10px'}}>
          <input placeholder="Жылы" type="number" style={{...adminInp, flex: 1}} onChange={e => setF({...f, year: e.target.value})} value={f.year} required />
          <input placeholder="Бағасы (₸)" type="number" style={{...adminInp, flex: 1}} onChange={e => setF({...f, price: e.target.value})} value={f.price} required />
        </div>

        {/* 2. ҚОЙМАДАҒЫ КІТАП САНЫН ЕНГІЗУ */}
        <input 
          placeholder="Қоймадағы саны (штук)" 
          type="number" 
          style={{...adminInp, border: '1px solid #10B981'}} // Ерекшеленуі үшін жасыл жиек
          onChange={e => setF({...f, stock: e.target.value})} 
          value={f.stock} 
          required 
        />

        <select style={adminInp} onChange={e => setF({...f, genre: e.target.value})} value={f.genre}>
          <option>Фантастика</option><option>Детектив</option><option>Бизнес</option>
          <option>Драма</option><option>Роман</option><option>Технология</option>
          <option>Психология</option>
        </select>

        <input placeholder="Сурет URL" style={adminInp} onChange={e => setF({...f, image_url: e.target.value})} value={f.image_url} required />
        
        <textarea 
          placeholder="Жалпы сипаттама..." 
          style={{...adminInp, height: '70px', resize: 'none'}} 
          onChange={e => setF({...f, description: e.target.value})} 
          value={f.description}
        ></textarea>

        <textarea 
          placeholder="Кітаптың қысқаша мазмұны (Пересказ)..." 
          style={{...adminInp, height: '100px', resize: 'none'}} 
          onChange={e => setF({...f, summary: e.target.value})} 
          value={f.summary}
        ></textarea>

        <button type="submit" style={saveBtn}>БАЗАҒА САҚТАУ</button>
      </form>

      <div style={listContainer}>
        <h3 style={{marginBottom: '15px', color: '#0369A1'}}>Қазіргі кітаптар ({books.length})</h3>
        <div style={{overflowX: 'auto'}}>
          <table style={{width: '100%', borderCollapse: 'collapse'}}>
            <thead>
  <tr style={{borderBottom: '2px solid #E0F2FE', textAlign: 'left'}}>
    <th style={thStyle}>Атауы</th><th style={thStyle}>Авторы</th><th style={thStyle}>Саны (Stock)</th><th style={thStyle}>Бағасы</th><th style={thStyle}>Әрекет</th>
  </tr>
</thead>
            <tbody>
              {books.map(book => (
                <tr key={book.id} style={{borderBottom: '1px solid #F1F5F9'}}>
                  <td style={tdStyle}>{book.title}</td>
                  <td style={tdStyle}>{book.author}</td>
                  <td style={{...tdStyle, fontWeight: 'bold', color: book.stock > 0 ? '#10B981' : '#EF4444'}}>
                    {book.stock} шт
                  </td>
                  <td style={tdStyle}>{book.price} ₸</td>
                  <td style={tdStyle}>
                    <button onClick={() => deleteBook(book.id)} style={deleteBtn}>Өшіру</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// СТИЛЬДЕР (Сенің стильдерің сақталды)
const adminPageWrapper = { padding: '50px 20px', background: '#E0F2FE', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' };
const backBtnStyle = { marginBottom: '20px', background: 'white', border: 'none', color: '#0369A1', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' };
const formStyle = { width: '100%', maxWidth: '500px', background: 'white', padding: '30px', borderRadius: '25px', display: 'flex', flexDirection: 'column', gap: '12px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' };
const adminInp = { padding: '12px', borderRadius: '10px', border: '1px solid #BAE6FD', outline: 'none', fontSize: '15px', background: '#F8FAFC' };
const saveBtn = { background: '#0EA5E9', color: 'white', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' };
const listContainer = { width: '100%', maxWidth: '800px', marginTop: '40px', background: 'white', padding: '25px', borderRadius: '25px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' };
const thStyle = { padding: '12px', color: '#64748B', fontSize: '14px' };
const tdStyle = { padding: '12px', fontSize: '14px', color: '#334155' };
const deleteBtn = { background: '#EF4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' };

export default Admin;