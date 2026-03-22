import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiFetch } from '../api';
import { useAuth } from '../context/AuthContext';
import { FiEye, FiEyeOff } from 'react-icons/fi';

function LoginPage() {
  const [email, setEmail] = useState('admin@gmail.com');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      login(data.token, data.user);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-left">
        <p className="section-tag">Đăng nhập hệ thống</p>
        <h1>Chào mừng quay lại</h1>
        <p className="auth-desc">
          Đăng nhập để tạo quiz, chỉnh sửa câu hỏi, làm bài và xem lịch sử lưu trong MongoDB.
        </p>

        <div className="auth-feature-list">
          <div className="auth-feature-item">Quản lý quiz trực quan</div>
          <div className="auth-feature-item">Chỉnh sửa thêm câu hỏi bất kỳ lúc nào</div>
          <div className="auth-feature-item">Lưu lịch sử attempt riêng biệt</div>
        </div>
      </div>

      <div className="auth-card">
        <h2>Đăng nhập</h2>
        <p className="muted">Nhập tài khoản để sử dụng hệ thống.</p>

        <form onSubmit={handleSubmit} className="page-stack">
          <div>
            <label>Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email"
            />
          </div>

          <div>
            <label>Mật khẩu</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                style={{ paddingRight: '40px' }}
              />

              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer',
                  color: '#666',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </span>
            </div>
          </div>

          {error && <p className="error">{error}</p>}

          <button className="btn btn-primary full-width" type="submit" disabled={loading}>
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        <p className="auth-switch">
          Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;