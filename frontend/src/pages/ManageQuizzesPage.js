import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../api';

function ManageQuizzesPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const data = await apiFetch('/quizzes');
        setQuizzes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const handleDeleteQuiz = async (quizId) => {
    const confirmed = window.confirm('Bạn có chắc muốn xóa quiz này không?');
    if (!confirmed) return;

    try {
      await apiFetch(`/quizzes/${quizId}`, {
        method: 'DELETE',
      });

      setQuizzes((prev) => prev.filter((quiz) => quiz._id !== quizId));
    } catch (err) {
      alert(err.message || 'Xóa quiz thất bại');
    }
  };

  return (
    <div className="page-stack">
      <section className="panel">
        <div className="panel-head">
          <div>
            <p className="section-tag">Quản lý quiz</p>
            <h1>Danh sách quiz</h1>
            <p className="muted">Bạn có thể xem, làm thử hoặc sửa quiz tại đây.</p>
          </div>

          <Link className="btn btn-primary" to="/create-quiz">
            + Tạo quiz mới
          </Link>
        </div>

        {loading && <div className="empty-box">Đang tải danh sách quiz...</div>}
        {error && <p className="error">{error}</p>}

        <div className="manage-grid">
          {quizzes.map((quiz) => (
            <article className="manage-card" key={quiz._id}>
              <div className="manage-card-top">
                <div>
                  <h3>{quiz.title}</h3>
                  <p className="muted">
                    {quiz.category} · {quiz.difficulty}
                  </p>
                </div>
                <span className="pill">{quiz.questions.length} câu</span>
              </div>

              <div className="question-preview-list">
                {quiz.questions.slice(0, 3).map((q, index) => (
                  <div className="question-preview" key={q._id || index}>
                    {index + 1}. {q.content}
                  </div>
                ))}
              </div>

              <div className="action-row">
                <Link className="btn btn-secondary full-width" to={`/quiz/${quiz._id}`}>
                  Làm thử
                </Link>
                <Link className="btn btn-primary full-width" to={`/edit-quiz/${quiz._id}`}>
                  Sửa quiz
                </Link>
                <button
                  className="btn btn-danger full-width"
                  onClick={() => handleDeleteQuiz(quiz._id)}
                >
                  Xóa quiz
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default ManageQuizzesPage;