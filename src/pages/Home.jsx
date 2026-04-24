import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <h1 style={{ fontSize: '48px', fontWeight: '700', color: '#00d4ff', marginBottom: '20px' }}>GETPROFIT</h1>
      <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.7)', marginBottom: '40px', textAlign: 'center' }}>
        Invest in vehicles and earn guaranteed profits
      </p>
      <div style={{ display: 'flex', gap: '15px' }}>
        <Link to="/register" className="btn">Get Started</Link>
        <Link to="/login" className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}>Login</Link>
      </div>
      <div style={{ marginTop: '60px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', maxWidth: '800px' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ color: '#00d4ff', fontSize: '32px', marginBottom: '10px' }}>5000+</h3>
          <p>Active Investors</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ color: '#00d4ff', fontSize: '32px', marginBottom: '10px' }}>2000</h3>
          <p>RWF Signup Bonus</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ color: '#00d4ff', fontSize: '32px', marginBottom: '10px' }}>3 Days</h3>
          <p>Profit Timeline</p>
        </div>
      </div>
    </div>
  );
}