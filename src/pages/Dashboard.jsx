import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || '';

export default function Dashboard() {
  const { user, token, logout, updateBalance } = useAuth();
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [packages, setPackages] = useState([]);
  const [myPackages, setMyPackages] = useState([]);
  const [payments, setPayments] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [depAmount, setDepAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const headers = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    if (!token) navigate('/login');
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [balanceRes, packagesRes, myPackagesRes, paymentsRes, withdrawalsRes] = await Promise.all([
        axios.get(`${API_URL}/api/balance`, headers),
        axios.get(`${API_URL}/api/packages`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/api/my-packages`, headers),
        axios.get(`${API_URL}/api/my-payments`, headers),
        axios.get(`${API_URL}/api/my-withdrawals`, headers)
      ]);
      setBalance(balanceRes.data.balance || 0);
      setPackages(packagesRes.data);
      setMyPackages(myPackagesRes.data);
      setPayments(paymentsRes.data);
      setWithdrawals(withdrawalsRes.data);
      updateBalance(balanceRes.data.balance || 0);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const handleBuyPackage = async (pkg) => {
    if (balance < pkg.price) {
      setError('Insufficient balance! Deposit more money.');
      setTimeout(() => setError(''), 3000);
      return;
    }
    try {
      const res = await axios.post(`${API_URL}/api/buy-package-balance`, { package_id: pkg._id || pkg.id }, headers);
      setSuccess(res.data.message);
      setTimeout(() => { setSuccess(''); fetchData(); }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Purchase failed');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDeposit = async () => {
    if (!depAmount || depAmount <= 0) return;
    try {
      const res = await axios.post(`${API_URL}/api/deposit`, {
        amount: depAmount,
        payment_code: '1261484'
      }, headers);
      setSuccess(res.data.message);
      setDepAmount('');
      setTimeout(() => { setSuccess(''); fetchData(); }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Deposit failed');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    const amount = e.target.amount.value;
    const phone = e.target.phone.value;
    if (!amount || amount <= 0) return;
    try {
      const res = await axios.post(`${API_URL}/api/withdraw`, { amount, phone }, headers);
      setSuccess(res.data.message);
      e.target.reset();
      setTimeout(() => { setSuccess(''); fetchData(); }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Withdrawal failed');
      setTimeout(() => setError(''), 3000);
    }
  };

  const carImages = [
    'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400',
    'https://images.unsplash.com/photo-1542362567-b07e54358753?w=400',
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400',
    'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=400',
    'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400'
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#00d4ff' }}>GETPROFIT</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span>{user?.name}</span>
          <button onClick={() => { logout(); navigate('/login'); }} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Logout</button>
        </div>
      </header>

      <div className="card" style={{ background: 'linear-gradient(135deg, #00d4ff, #0099cc)', borderRadius: '16px', padding: '30px', marginBottom: '30px' }}>
        <h2 style={{ color: '#1a1a2e', fontSize: '18px' }}>Your Balance</h2>
        <div style={{ color: '#1a1a2e', fontSize: '42px', fontWeight: '700', marginTop: '10px' }}>{balance} RWF</div>
      </div>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div className="card">
          <h3 style={{ marginBottom: '20px', color: '#00d4ff' }}>Deposit Funds</h3>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Amount (RWF)</label>
            <input type="number" value={depAmount} onChange={(e) => setDepAmount(e.target.value)} placeholder="Enter amount" />
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
            <p>Payment Code: <strong style={{ color: '#ffcc00' }}>1261484</strong></p>
            <p>Account Name: Placide</p>
          </div>
          <button onClick={handleDeposit} className="btn btn-green" style={{ width: '100%' }}>Confirm Deposit</button>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '20px', color: '#00d4ff' }}>Withdraw Earnings</h3>
          <form onSubmit={handleWithdraw}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>Amount (RWF)</label>
              <input type="number" name="amount" placeholder="Enter amount" required />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>Phone (MTN/Moov)</label>
              <input type="tel" name="phone" placeholder="Enter phone number" required />
            </div>
            <button type="submit" className="btn" style={{ width: '100%' }}>Withdraw</button>
          </form>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '20px', color: '#00d4ff' }}>Purchase Vehicle Package</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
          {packages.map((pkg, i) => {
            const canAfford = balance >= pkg.price;
            return (
              <div key={pkg._id || pkg.id} onClick={() => canAfford && handleBuyPackage(pkg)}
                style={{ background: canAfford ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '10px', cursor: canAfford ? 'pointer' : 'not-allowed', opacity: canAfford ? 1 : 0.5, border: selectedPackage === pkg._id ? '2px solid #4ade80' : '2px solid transparent', transition: 'all 0.3s' }}>
                <img src={carImages[i] || carImages[0]} alt={pkg.name} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px' }} />
                <div style={{ fontWeight: '600', marginTop: '8px' }}>{pkg.name}</div>
                <div style={{ color: '#00d4ff', fontSize: '18px', fontWeight: '700' }}>{pkg.price} RWF</div>
                <div style={{ color: '#4ade80', fontSize: '13px' }}>+{pkg.profit_amount} RWF in {pkg.duration_days} days</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '20px', color: '#00d4ff' }}>My Packages</h3>
        <table className="table">
          <thead><tr><th>Package</th><th>Price</th><th>Profit</th><th>Duration</th><th>Status</th></tr></thead>
          <tbody>
            {myPackages.map(p => (
              <tr key={p._id}>
                <td>{p.package?.[0]?.name || 'Package'}</td>
                <td>{p.package?.[0]?.price || 0}</td>
                <td>{p.package?.[0]?.profit_amount || 0}</td>
                <td>{p.package?.[0]?.duration_days || 0} days</td>
                <td><span className={`status ${p.status}`}>{p.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '20px', color: '#00d4ff' }}>Payment History</h3>
        <table className="table">
          <thead><tr><th>Amount</th><th>Type</th><th>Status</th><th>Date</th></tr></thead>
          <tbody>
            {payments.map(pay => (
              <tr key={pay._id}>
                <td>{pay.amount}</td>
                <td>{pay.payment_type}</td>
                <td><span className={`status ${pay.status}`}>{pay.status}</span></td>
                <td>{new Date(pay.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '20px', color: '#00d4ff' }}>Withdrawal History</h3>
        <table className="table">
          <thead><tr><th>Amount</th><th>Phone</th><th>Status</th><th>Date</th></tr></thead>
          <tbody>
            {withdrawals.map(w => (
              <tr key={w._id}>
                <td>{w.amount}</td>
                <td>{w.phone}</td>
                <td><span className={`status ${w.status}`}>{w.status}</span></td>
                <td>{new Date(w.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}