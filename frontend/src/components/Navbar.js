import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand">
          <div className="brand-badge">SQ</div>
          <div>
            <div className="brand-title">SmartQuiz</div>
          </div>
        </Link>

        <nav className="nav-menu">
          <NavLink to="/">Trang chủ</NavLink>
          {user && <NavLink to="/create-quiz">Tạo quiz</NavLink>}
          {user && <NavLink to="/manage-quizzes">Quản lý quiz</NavLink>}
          {user && <NavLink to="/history">Lịch sử</NavLink>}
        </nav>

        <div className="nav-right">
          {!user ? (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Đăng nhập
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Đăng ký
              </Link>
            </>
          ) : (
            <>
              <span className="user-badge">{user.name}</span>
              <button onClick={handleLogout} className="btn btn-danger btn-sm">
                Đăng xuất
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;