import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../api';
import { useAuth } from '../context/AuthContext';

function HomePage() {
  const [quizzes, setQuizzes] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quizData, statData] = await Promise.all([
          apiFetch('/quizzes'),
          apiFetch('/attempts/stats/summary'),
        ]);

        setQuizzes(quizData);
        setStats(statData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statMap = useMemo(
    () => Object.fromEntries(stats.map((item) => [item.title, item])),
    [stats]
  );

  const totalQuestions = quizzes.reduce((sum, quiz) => sum + quiz.questions.length, 0);
  const totalAttempts = stats.reduce((sum, item) => sum + item.totalAttempts, 0);

  return (
    <div className="page-stack">
      <section className="hero-card">
        <div>
          <p className="section-tag">SmartQuiz</p>
          <h1>Hệ thống quiz để học tập</h1>
          <p className="hero-desc">
            Demo đăng nhập, làm bài, lưu lịch sử, quản lý quiz và thống kê bằng
            MongoDB document database.
          </p>
        </div>

        <div className="hero-actions">
          {user ? (
            <>
              <Link to="/create-quiz" className="btn btn-primary">
                + Tạo quiz mới
              </Link>
              <Link to="/manage-quizzes" className="btn btn-secondary">
                Quản lý quiz
              </Link>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary">
              Đăng nhập để demo
            </Link>
          )}
        </div>
      </section>

      <section className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Tổng quiz</span>
          <strong className="stat-value">{quizzes.length}</strong>
        </div>
        <div className="stat-card">
          <span className="stat-label">Tổng câu hỏi</span>
          <strong className="stat-value">{totalQuestions}</strong>
        </div>
        <div className="stat-card">
          <span className="stat-label">Tổng lượt làm</span>
          <strong className="stat-value">{totalAttempts}</strong>
        </div>
        <div className="stat-card">
          <span className="stat-label">Trạng thái</span>
          <strong className="stat-value">{user ? 'Đã đăng nhập' : 'Khách'}</strong>
        </div>
      </section>

      <section className="panel">
        <div className="panel-head">
          <div>
            <h2>Danh sách quiz</h2>
            <p className="muted">Chọn một quiz để làm bài hoặc trình bày trên lớp.</p>
          </div>
        </div>

        {loading && <div className="empty-box">Đang tải dữ liệu...</div>}
        {error && <p className="error">{error}</p>}

        <div className="quiz-grid">
          {quizzes.map((quiz) => {
            const stat = statMap[quiz.title];
            return (
              <article className="quiz-card" key={quiz._id}>
                <div className="quiz-card-top">
                  <div>
                    <span className="pill pill-soft">{quiz.category}</span>
                    <h3>{quiz.title}</h3>
                  </div>
                  <span className="pill">{quiz.difficulty}</span>
                </div>

                <div className="quiz-info">
                  <div>
                    <span>Số câu hỏi</span>
                    <strong>{quiz.questions.length}</strong>
                  </div>
                  <div>
                    <span>Lượt làm</span>
                    <strong>{stat?.totalAttempts || 0}</strong>
                  </div>
                  <div>
                    <span>Điểm TB</span>
                    <strong>{stat?.avgScore || 0}</strong>
                  </div>
                </div>

                {user ? (
                  <Link className="btn btn-primary full-width" to={`/quiz/${quiz._id}`}>
                    Làm quiz
                  </Link>
                ) : (
                  <Link className="btn btn-secondary full-width" to="/login">
                    Đăng nhập để làm
                  </Link>
                )}
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default HomePage;