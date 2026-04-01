import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("Мекенжай таңдалмады");
  const [paymentMethod, setPaymentMethod] = useState('cash');

  const [cardData, setCardData] = useState({ number: '', expiry: '', cvc: '' });
  const [deliveryDetails, setDeliveryDetails] = useState({ apartment: '', entrance: '', floor: '', intercom: '', comment: '' });

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(savedCart.map(item => ({ ...item, quantity: item.quantity || 1 })));

    if (window.ymaps) {
      window.ymaps.ready(() => {
        const mapContainer = document.getElementById("map");
        if (mapContainer && mapContainer.innerHTML === "") {
          const myMap = new window.ymaps.Map("map", { center: [51.1605, 71.4704], zoom: 12 });
          let myPlacemark;
          myMap.events.add('click', (e) => {
            const coords = e.get('coords');
            if (myPlacemark) myMap.geoObjects.remove(myPlacemark);
            myPlacemark = new window.ymaps.Placemark(coords, {}, { preset: 'islands#blueDotIconWithCaption' });
            myMap.geoObjects.add(myPlacemark);
            window.ymaps.geocode(coords).then(res => {
              setSelectedAddress(res.geoObjects.get(0).getAddressLine());
            });
          });
        }
      });
    }
  }, []);

  // СЕБЕТТЕН ТОЛЫҒЫМЕН ӨШІРУ ФУНКЦИЯСЫ
  const removeFromCart = (id) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const updateQuantity = (id, delta) => {
    const updatedCart = cartItems.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        if (delta > 0 && newQty > item.stock) {
          alert(`Кешіріңіз, қоймада бұл кітаптан тек ${item.stock} дана бар.`);
          return item;
        }
        return { ...item, quantity: Math.max(1, newQty) };
      }
      return item;
    });
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);

  const handleInputChange = (e) => {
    setDeliveryDetails({ ...deliveryDetails, [e.target.name]: e.target.value });
  };

  const handleCardChange = (e) => {
    setCardData({ ...cardData, [e.target.name]: e.target.value });
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return alert("Себет бос!");
    if (selectedAddress === "Мекенжай таңдалмады") return alert("Картадан мекенжайды таңдаңыз!");

    const storedUser = JSON.parse(localStorage.getItem('user'));
    const userId = localStorage.getItem('userId') || storedUser?.id;

    if (!userId) {
      alert("Тапсырыс беру үшін жүйеге кіріңіз!");
      window.location.href = '/login';
      return;
    }

    if (paymentMethod === 'online_card' && (cardData.number.length < 16 || !cardData.expiry || !cardData.cvc)) {
      return alert("Карта мәліметтерін толық толтырыңыз!");
    }

    const orderData = {
      userId: userId,
      items: cartItems.map(item => ({
        id: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity
      })),
      address: selectedAddress,
      details: deliveryDetails,
      paymentMethod: paymentMethod,
      totalPrice: totalPrice,
      date: new Date().toISOString()
    };

    try {
      const response = await axios.post('https://ebookstore-backend-eubu.onrender.com/api/orders', orderData);
      if (response.status === 200 || response.status === 201) {
        alert("Тапсырыс сәтті қабылданды! ");
        localStorage.removeItem('cart');
        setCartItems([]);
        window.location.href = '/profile';
      }
    } catch (err) {
      console.error("Жіберу қатесі:", err);
      alert(err.response?.data?.error || "Сервермен байланыс үзілді.");
    }
  };

  return (
    <div style={cartPageWrapper}>
      <h2 style={{ marginBottom: '30px', color: '#0369A1' }}>Себет </h2>
      
      <div style={layout}>
        <div style={cardStyle}>
          <h4 style={{ color: '#0369A1', marginBottom: '20px' }}>Тапсырыс тізімі</h4>
          {cartItems.length === 0 ? (
            <p style={{color: '#64748B'}}>Себет әзірге бос...</p>
          ) : (
            cartItems.map(item => (
              <div key={item.id} style={itemRow}>
                <img src={item.image_url} alt={item.title} style={miniImg} />
                <div style={{ flex: 1 }}>
                  <h5 style={{ margin: 0 }}>{item.title}</h5>
                  <p style={{ margin: '4px 0', color: '#0EA5E9', fontWeight: 'bold' }}>{item.price} ₸</p>
                  <small style={{ color: '#94A3B8', display: 'block' }}>Қоймада: {item.stock} дана</small>
                  
                  {/* ӨШІРУ БАТЫРМАСЫ */}
                  <button 
                    onClick={() => removeFromCart(item.id)} 
                    style={deleteBtn}
                  >
                    Өшіру
                  </button>
                </div>
                <div style={qtyContainer}>
                  <button onClick={() => updateQuantity(item.id, -1)} style={qtyBtn}>-</button>
                  <span style={qtyText}>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} style={qtyBtn}>+</button>
                </div>
              </div>
            ))
          )}
        </div>

        <div style={cardStyle}>
          <h4 style={{ color: '#0369A1' }}>Жеткізу мәліметтері</h4>
          <p style={addressBadge}>📍 {selectedAddress}</p>
          <div id="map" style={mapStyle}></div>

          <div style={addressForm}>
            <div style={inputGroup}>
              <input type="text" name="apartment" placeholder="Пәтер" style={smallInput} onChange={handleInputChange} />
              <input type="text" name="entrance" placeholder="Подъезд" style={smallInput} onChange={handleInputChange} />
              <input type="text" name="floor" placeholder="Қабат" style={smallInput} onChange={handleInputChange} />
              <input type="text" name="intercom" placeholder="Домофон" style={smallInput} onChange={handleInputChange} />
            </div>
            <textarea name="comment" placeholder="Курьерге түсініктеме..." style={textArea} onChange={handleInputChange}></textarea>
          </div>

          <div style={paymentSection}>
            <h4 style={{ color: '#0369A1', marginBottom: '10px', fontSize: '16px' }}>Төлем түрі</h4>
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} style={selectStyle}>
              <option value="cash">💵 Қолма-қол (Курьерге)</option>
              <option value="online_card">💳 Онлайн картамен төлеу</option>
              <option value="kaspi">📱 Kaspi аударым</option>
            </select>

            {paymentMethod === 'online_card' && (
              <div style={cardFormContainer}>
                <input type="text" name="number" placeholder="0000 0000 0000 0000" style={cardInput} onChange={handleCardChange} maxLength="16" />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input type="text" name="expiry" placeholder="ММ/ЖЖ" style={cardInput} onChange={handleCardChange} maxLength="5" />
                  <input type="password" name="cvc" placeholder="CVC" style={cardInput} onChange={handleCardChange} maxLength="3" />
                </div>
              </div>
            )}
          </div>
          
          <div style={totalSection}>
            <div style={totalRow}>
              <span>Жалпы сомма:</span>
              <span style={{ fontSize: '22px', fontWeight: 'bold', color: '#0EA5E9' }}>{totalPrice} ₸</span>
            </div>
            <button style={payBtn} onClick={handleCheckout}>
              ТАПСЫРЫСТЫ РӘСІМДЕУ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// СТИЛЬДЕР
const cartPageWrapper = { padding: '40px 20px', background: '#E0F2FE', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' };
const layout = { display: 'flex', gap: '30px', width: '100%', maxWidth: '1100px', flexWrap: 'wrap' };
const cardStyle = { flex: 1, minWidth: '380px', background: 'white', padding: '30px', borderRadius: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' };
const itemRow = { display: 'flex', alignItems: 'center', gap: '15px', padding: '15px 0', borderBottom: '1px solid #F1F5F9' };
const miniImg = { width: '50px', height: '75px', borderRadius: '8px', objectFit: 'cover' };
const addressForm = { marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' };
const inputGroup = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' };
const smallInput = { padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '14px', background: '#F8FAFC' };
const textArea = { padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '14px', background: '#F8FAFC', minHeight: '80px', resize: 'none' };
const qtyContainer = { display: 'flex', alignItems: 'center', gap: '10px', background: '#F1F5F9', padding: '5px 12px', borderRadius: '12px' };
const qtyBtn = { border: 'none', background: 'none', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold', color: '#0EA5E9' };
const qtyText = { fontSize: '16px', fontWeight: 'bold', color: '#1E293B' };
const mapStyle = { width: '100%', height: '200px', borderRadius: '15px', marginTop: '10px', border: '1px solid #BAE6FD' };
const addressBadge = { fontSize: '13px', color: '#0369A1', background: '#F0F9FF', padding: '12px', borderRadius: '12px', border: '1px dashed #BAE6FD' };
const totalSection = { marginTop: '20px', borderTop: '2px solid #F1F5F9', paddingTop: '15px' };
const totalRow = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' };
const payBtn = { width: '100%', padding: '18px', background: '#0EA5E9', color: 'white', border: 'none', borderRadius: '15px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', boxShadow: '0 5px 15px rgba(14, 165, 233, 0.3)' };
const paymentSection = { marginTop: '20px', padding: '15px', background: '#F0F9FF', borderRadius: '20px', border: '1px solid #BAE6FD' };
const selectStyle = { width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '14px', cursor: 'pointer', background: 'white', marginBottom: '10px' };
const cardFormContainer = { display: 'flex', flexDirection: 'column', gap: '10px', padding: '10px', background: '#E0F2FE', borderRadius: '12px' };
const cardInput = { padding: '10px', borderRadius: '8px', border: '1px solid #BAE6FD', outline: 'none', fontSize: '14px' };

// ӨШІРУ БАТЫРМАСЫНЫҢ СТИЛІ
const deleteBtn = {
  background: 'none',
  border: 'none',
  color: '#EF4444',
  fontSize: '12px',
  cursor: 'pointer',
  padding: '0',
  marginTop: '5px',
  textDecoration: 'underline',
  fontWeight: '500'
};

export default Cart;