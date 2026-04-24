import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || '';

export default function Admin() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [bonusUser, setBonusUser] = useState('');
  const [bonusAmount, setBonusAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const headers = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    if (!token) navigate('/login');
    if (!user?.is_admin) navigate('/dashboard');
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, paymentsRes, withdrawalsRes] = await Promise.all([
        axios.get(`${API_URL}/api/admin/users`, headers),
        axios.get(`${API_URL}/api/admin/payments`, headers),
        axios.get(`${API_URL}/api/admin/withdrawals`, headers)
      ]);
      setUsers(usersRes.data);
      setPayments(paymentsRes.data);
      setWithdrawals(withdrawals.data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const approvePayment = async (paymentId, userId) => {
    if (!confirm('Approve this payment? 2000 RWF bonus will be added.')) return;
    try {
      await axios.post(`${API_URL}/api/admin/approve-payment`, { payment_id: paymentId, user_id: userId }, headers);
      setSuccess('Payment approved!');
      setTimeout(() => { setSuccess(''); fetchData(); }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Approval failed');
      setTimeout(() => setError(''), 3000);
    }
  };

  const approveWithdrawal = async (withdrawalId) => {
    if (!confirm('Approve this withdrawal?')) return;
    try {
      await axios.post(`${API_URL}/api/admin/approve-withdrawal`, { withdrawal_id: withdrawalId }, headers);
      setSuccess('Withdrawal approved!');
      setTimeout(() => { setSuccess(''); fetchData(); }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Approval failed');
      setTimeout(() => setError(''), 3000);
    }
  };

  const giveBonus = async () => {
    if (!bonusUser || !bonusAmount) return;
    try {
      const res = await axios.post(`${API_URL}/api/admin/give-bonus`, { user_id: bonusUser, amount: bonusAmount }, headers);
      setSuccess(res.data.message);
      setBonusUser('');
      setBonusAmount('');
      setTimeout(() => { setSuccess(''); fetchData(); }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to give bonus');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#00d4ff' }}>GETPROFIT Admin</h1>
        <button onClick={() => { logout(); navigate('/login'); }} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Logout</button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#00d4ff' }}>{users.length}</div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>Total Users</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#00d4ff' }}>{payments.length}</div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>Total Payments</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#00d4ff' }}>{payments.filter(p => p.status === 'pending').length}</div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>Pending Payments</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#00d4ff' }}>{withdrawals.filter(w => w.status === 'pending').length}</div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>Pending Withdrawals</div>
        </div>
      </div>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={() => setTab('users')} className="btn" style={{ background: tab === 'users' ? '#00d4ff' : 'rgba(255,255,255,0.1)', color: tab === 'users' ? '#1a1a2e' : '#fff' }}>All Users</button>
        <button onClick={() => setTab('payments')} className="btn" style={{ background: tab === 'payments' ? '#00d4ff' : 'rgba(255,255,255,0.1)', color: tab === 'payments' ? '#1a1a2e' : '#fff' }}>Payments</button>
        <button onClick={() => setTab('withdrawals')} className="btn" style={{ background: tab === 'withdrawals' ? '#00d4ff' : 'rgba(255,255,255,0.1)', color: tab === 'withdrawals' ? '#1a1a2e' : '#fff' }}>Withdrawals</button>
        <button onClick={() => setTab('bonus')} className="btn" style={{ background: tab === 'bonus' ? '#00d4ff' : 'rgba(255,255,255,0.1)', color: tab === 'bonus' ? '#1a1a2e' : '#fff' }}>Give Bonus</button>
      </div>

      {tab === 'users' && (
        <div className="card">
          <h3 style={{ marginBottom: '20px', color: '#00d4ff' }}>All Users</h3>
          <table className="table">
            <thead><tr><th>ID</th><th>Name</th><th>Phone</th><th>Email</th><th>Balance</th><th>Joined</th></tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id || u.id}>
                  <td>{u._id || u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.phone}</td>
                  <td>{u.email}</td>
                  <td>{u.balance} RWF</td>
                  <td>{new Date(u.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'payments' && (
        <div className="card">
          <h3 style={{ marginBottom: '20px', color: '#00d4ff' }}>All Payments</h3>
          <table className="table">
            <thead><tr><th>User</th><th>Amount</th><th>Type</th><th>Code</th><th>Status</th><th>Date</th><th>Action</th></tr></thead>
            <tbody>
              {payments.map(pay => (
                <tr key={pay._id}>
                  <td>{pay.user?.[0]?.name || 'User'}</td>
                  <td>{pay.amount}</td>
                  <td>{pay.payment_type}</td>
                  <td>{pay.payment_code}</td>
                  <td><span className={`status ${pay.status}`}>{pay.status}</span></td>
                  <td>{new Date(pay.created_at).toLocaleDateString()}</td>
                  <td>
                    {pay.status === 'pending' && (
                      <button onClick={() => approvePayment(pay._id || pay.id, pay.user?.[0]?._id || pay.user_id)}
                        style={{ background: '#4ade80', color: '#1a1a2e', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}>
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'withdrawals' && (
        <div className="card">
          <h3 style={{ marginBottom: '20px', color: '#00d4ff' }}>Withdrawal Requests</h3>
          <table className="table">
            <thead><tr><th>User</th><th>Amount</th><th>Phone</th><th>Status</th><th>Date</th><th>Action</th></tr></thead>
            <tbody>
              {withdrawals.map(w => (
                <tr key={w._id}>
                  <td>{w.user?.[0]?.name || 'User'}</td>
                  <td>{w.amount}</td>
                  <td>{w.phone}</td>
                  <td><span className={`status ${w.status}`}>{w.status}</span></td>
                  <td>{new Date(w.created_at).toLocaleDateString()}</td>
                  <td>
                    {w.status === 'pending' && (
                      <button onClick={() => approveWithdrawal(w._id || w.id)}
                        style={{ background: '#4ade80', color: '#1a1a2e', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}>
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'bonus' && (
        <div className="card">
          <h3 style={{ marginBottom: '20px', color: '#00d4ff' }}>Give Bonus to User</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', maxWidth: '600px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px' }}>Select User</label>
              <select value={bonusUser} onChange={(e) => setBonusUser(e.target.value)}>
                <option value="">Select user...</option>
                {users.map(u => (
                  <option key={u._id || u.id} value={u._id || u.id}>{u.name} - {u.phone}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px' }}>Amount (RWF)</label>
              <input type="number" value={bonusAmount} onChange={(e) => setBonusAmount(e.target.value)} placeholder="Enter amount" />
            </div>
          </div>
          <button onClick={giveBonus} className="btn btn-green" style={{ marginTop: '15px' }}>Give Bonus</button>
        </div>
      )}
    </div>
  );
}