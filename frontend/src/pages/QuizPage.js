import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiFetch } from '../api';

function QuizPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const data = await apiFetch(`/quizzes/${id}`);
        setQuiz(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  const handleSelect = (questionId, option) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const payload = {
        answers: Object.entries(answers).map(([questionId, selectedAnswer]) => ({
          questionId,
          selectedAnswer,
        })),
      };

      const data = await apiFetch(`/attempts/${id}`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (!data.attemptId) {
        throw new Error('Không nhận được mã kết quả từ server');
      }

      navigate(`/result/${data.attemptId}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="empty-box">Đang tải quiz...</div>;
  if (error && !quiz) return <p className="error">{error}</p>;
  if (!quiz) return <div className="empty-box">Không tìm thấy quiz.</div>;

  return (
    <div className="page-stack">
      <section className="panel quiz-banner">
        <div>
          <p className="section-tag">Làm bài quiz</p>
          <h1>{quiz.title}</h1>
          <p className="muted">
            {quiz.category} · {quiz.difficulty} · {quiz.questions.length} câu hỏi
          </p>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="page-stack">
        {quiz.questions.map((question, index) => (
          <section className="question-card" key={question._id}>
            <div className="question-head">
              <span className="question-index">Câu {index + 1}</span>
              <span className="pill">{question.points || 1} điểm</span>
            </div>

            <h3>{question.content}</h3>

            {question.image && (
              <img className="question-image" src={question.image} alt="question" />
            )}

            <div className="answer-grid">
              {question.options.map((option) => {
                const checked = answers[question._id] === option;

                return (
                  <label
                    key={option}
                    className={`answer-card ${checked ? 'answer-card-active' : ''}`}
                  >
                    <input
                      type="radio"
                      name={question._id}
                      value={option}
                      checked={checked}
                      onChange={() => handleSelect(question._id, option)}
                    />
                    <span className="answer-dot" />
                    <span className="answer-text">{option}</span>
                  </label>
                );
              })}
            </div>
          </section>
        ))}

        {error && <p className="error">{error}</p>}

        <div>
          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting ? 'Đang nộp bài...' : 'Nộp bài'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default QuizPage;