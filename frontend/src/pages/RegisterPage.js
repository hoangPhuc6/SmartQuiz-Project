import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiFetch } from '../api';
import { useAuth } from '../context/AuthContext';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
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
        <p className="section-tag">Tạo tài khoản mới</p>
        <h1>Đăng ký để bắt đầu</h1>
        <p className="auth-desc">
          Tạo tài khoản để quản lý quiz, thêm câu hỏi mới và theo dõi kết quả học tập.
        </p>

        <div className="auth-feature-list">
          <div className="auth-feature-item">Tạo quiz không giới hạn</div>
          <div className="auth-feature-item">Chỉnh sửa quiz sau khi đã tạo</div>
          <div className="auth-feature-item">Giao diện tiếng Việt dễ dùng</div>
        </div>
      </div>

      <div className="auth-card">
        <h2>Đăng ký</h2>
        <p className="muted">Điền thông tin để tạo tài khoản.</p>

        <form onSubmit={handleSubmit} className="page-stack">
          <div>
            <label>Họ tên</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập họ tên"
            />
          </div>

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
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
            />
          </div>

          {error && <p className="error">{error}</p>}

          <button className="btn btn-primary full-width" type="submit" disabled={loading}>
            {loading ? 'Đang tạo tài khoản...' : 'Đăng ký'}
          </button>
        </form>

        <p className="auth-switch">
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;