import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../api';

function HistoryPage() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await apiFetch('/attempts/mine/history');
        setAttempts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="page-stack">
      <section className="panel">
        <div className="panel-head">
          <div>
            <p className="section-tag">Lịch sử làm bài</p>
            <h1>Danh sách các lần làm quiz</h1>
          </div>
        </div>

        {loading && <div className="empty-box">Đang tải lịch sử...</div>}
        {error && <p className="error">{error}</p>}

        {!loading && !attempts.length && (
          <div className="empty-box">Chưa có lần làm bài nào.</div>
        )}

        {!!attempts.length && (
          <div className="history-list">
            {attempts.map((attempt) => {
              const quiz = attempt.quizId;

              return (
                <article className="history-card" key={attempt._id}>
                  <div className="history-main">
                    <div>
                      <h3>{quiz?.title || 'Quiz không còn tồn tại'}</h3>
                      <p className="muted">
                        {quiz
                          ? `${quiz.category} · ${quiz.difficulty}`
                          : 'Quiz gốc đã bị xóa hoặc không còn dữ liệu'}
                      </p>
                    </div>

                    <div className="history-score">
                      {attempt.score}/{attempt.totalPoints}
                    </div>
                  </div>

                  <div className="history-footer">
                    <span>{new Date(attempt.createdAt).toLocaleString()}</span>
                    <Link className="btn btn-secondary btn-sm" to={`/result/${attempt._id}`}>
                      Xem chi tiết
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default HistoryPage;