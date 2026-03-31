import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState({
    username: 'Пайдаланушы',
    email: 'email@example.kz',
    avatar: null,
    id: null
  });

  const [orders, setOrders] = useState([]); 
  const [isEditing, setIsEditing] = useState(false); 
  const [newName, setNewName] = useState('');

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) {
      setUser(savedUser);
      setNewName(savedUser.username || 'Пайдаланушы');
      // Бэкендтен тапсырыстарды алу
      fetchOrders(savedUser.id);
    }
  }, []);

  const fetchOrders = async (userId) => {
    if (!userId) return;
    try {
      // URL-ді бэкендтегі /api/my-orders/ жолына сәйкестендірдік
      const res = await axios.get(`http://localhost:5000/api/my-orders/${userId}`);
      if (Array.isArray(res.data)) {
        setOrders(res.data);
      }
    } catch (err) {
      console.error("Тапсырыстарды жүктеу қатесі:", err);
      setOrders([]); // Қате болса, экран құлап қалмас үшін бос массив қоямыз
    }
  };

  const handleSaveName = async () => {
    if (!newName.trim() || !user.id) return;

    try {
      // 1. Бэкендке (базаға) сақтау үшін сұраныс жібереміз
      const token = localStorage.getItem('token'); // Егер токен қолдансаң
      const res = await axios.put(`http://localhost:5000/api/user/update/${user.id}`, {
        username: newName
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.status === 200) {
        // 2. Егер базада сәтті сақталса, экранды және localStorage-ты жаңартамыз
        const updatedUser = { ...user, username: newName };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setIsEditing(false);
        alert("Атыңыз сәтті сақталды!");
      }
    } catch (err) {
      console.error("Атты жаңарту қатесі:", err);
      alert("Базаға сақтау мүмкін болмады. Қайта көріңіз.");
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newAvatar = reader.result;
        const updatedUser = { ...user, avatar: newAvatar };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };


// Токенді тексеретін функция (Middleware)
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN" бөліп алу

  if (!token) return res.sendStatus(401); // Токен жоқ болса

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Токен қате болса
    req.user = user; // Пайдаланушы мәліметін req-ке сақтау
    next(); // Келесі қадамға (роутқа) жіберу
  });
}

  return (
    <div style={container}>
      {/* СОЛ ЖАҚ: ПРОФИЛЬ */}
      <div style={sidebar}>
        <div style={avatarWrapper}>
          <div style={avatarCircle}>
            {user.avatar ? (
              <img src={user.avatar} alt="Avatar" style={avatarImg} />
            ) : (
              <span style={{ fontSize: '40px', color: 'white' }}>
                {user?.username ? user.username[0].toUpperCase() : 'P'}
              </span>
            )}
          </div>
          <label style={uploadBtn}>
             Фотоны өзгерту
            <input type="file" hidden onChange={handleAvatarChange} accept="image/*" />
          </label>
        </div>

        <div style={infoSection}>
          {isEditing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
              <input 
                value={newName} 
                onChange={(e) => setNewName(e.target.value)} 
                style={editInput}
              />
              <button onClick={handleSaveName} style={saveBtn}>Сақтау</button>
            </div>
          ) : (
            <>
              <h2 style={userName}>{user?.username || 'Пайдаланушы'}</h2>
            <p style={userEmail}>{user?.email || 'email@example.kz'}</p>
            </>
          )}
        </div>

        <div style={actionBtns}>
          <button style={editBtn} onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? "Бас тарту" : "Профильді өңдеу"}
          </button>
          <button style={logoutBtn} onClick={handleLogout}>Шығу</button>
        </div>
      </div>

      {/* ОҢ ЖАҚ: ТАРИХ */}
      <div style={mainContent}>
        <h3 style={historyTitle}>Сатып алу тарихы 📖</h3>
        <div style={historyList}>
          {orders.length === 0 ? (
            <div style={emptyState}>
              <p style={{ color: '#94A3B8', margin: 0 }}>Әзірге тапсырыстар жоқ.</p>
              <small style={{ color: '#CBD5E1' }}>Сіздің барлық тапсырыстарыңыз осында көрінеді</small>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} style={orderCard}>
                <div style={orderHeader}>
                  <span>Тапсырыс №{order.id}</span>
                  <span style={orderDate}>
                    {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'Күні белгісіз'}
                  </span>
                </div>
                <div style={orderItems}>
                  {/* Қауіпсіз JSON.parse: егер items жоқ болса немесе қате болса құламайды */}
                  {(() => {
                    try {
                      const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
                      return Array.isArray(items) ? items.map((item, index) => (
                        <div key={index} style={{marginBottom: '4px'}}>• {item.title} — {item.quantity} дана</div>
                      )) : "Мәлімет жоқ";
                    } catch (e) {
                      return "Тауарлар тізімін оқу мүмкін болмады";
                    }
                  })()}
                </div>
                <div style={orderPrice}>{order.total_price?.toLocaleString()} ₸</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// СТИЛЬДЕР
const container = { display: 'flex', padding: '40px', gap: '30px', background: '#F0F9FF', minHeight: '100vh', fontFamily: 'sans-serif' };
const sidebar = { flex: '0 0 350px', background: 'white', padding: '40px 30px', borderRadius: '30px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', height: 'fit-content' };
const avatarWrapper = { display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' };
const avatarCircle = { width: '120px', height: '120px', borderRadius: '50%', background: '#0EA5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxShadow: '0 5px 15px rgba(14, 165, 233, 0.3)', border: '4px solid white' };
const avatarImg = { width: '100%', height: '100%', objectFit: 'cover' };
const uploadBtn = { marginTop: '10px', fontSize: '13px', color: '#0EA5E9', cursor: 'pointer', fontWeight: '600' };
const infoSection = { textAlign: 'center', marginBottom: '30px', width: '100%' };
const userName = { margin: '10px 0 5px 0', color: '#1E293B', fontSize: '24px' };
const userEmail = { color: '#64748B', fontSize: '14px', margin: 0 };
const actionBtns = { width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' };
const editBtn = { padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', background: 'white', cursor: 'pointer', fontWeight: '600', transition: '0.3s' };
const logoutBtn = { padding: '12px', borderRadius: '12px', border: 'none', background: '#FEF2F2', color: '#EF4444', cursor: 'pointer', fontWeight: '600' };
const mainContent = { flex: 1, background: 'white', padding: '40px', borderRadius: '30px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' };
const historyTitle = { color: '#0369A1', marginBottom: '20px' };
const historyList = { display: 'flex', flexDirection: 'column', gap: '15px' };
const emptyState = { border: '2px dashed #E2E8F0', borderRadius: '20px', padding: '40px', textAlign: 'center' };

const editInput = { padding: '12px', borderRadius: '12px', border: '2px solid #0EA5E9', outline: 'none', textAlign: 'center', fontSize: '16px', width: '100%', boxSizing: 'border-box' };
const saveBtn = { padding: '12px', background: '#0EA5E9', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' };

const orderCard = { border: '1px solid #F1F5F9', padding: '20px', borderRadius: '20px', background: '#F8FAFC' };
const orderHeader = { display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: '#1E293B', borderBottom: '1px solid #E2E8F0', paddingBottom: '10px', marginBottom: '10px' };
const orderDate = { fontSize: '12px', color: '#94A3B8' };
const orderItems = { fontSize: '14px', color: '#64748B', lineHeight: '1.5' };
const orderPrice = { marginTop: '10px', textAlign: 'right', fontWeight: 'bold', color: '#0EA5E9', fontSize: '18px' };

export default Profile; 