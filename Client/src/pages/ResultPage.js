import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { apiFetch } from '../api';

function ResultPage() {
  const { attemptId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResult = async () => {
      if (!attemptId || attemptId === 'undefined') {
        setError('Không tìm thấy mã kết quả');
        setLoading(false);
        return;
      }

      try {
        const data = await apiFetch(`/attempts/result/${attemptId}`);
        setResult(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [attemptId]);

  const questionMap = useMemo(() => {
    if (!result?.quizId?.questions) return {};
    return Object.fromEntries(result.quizId.questions.map((q) => [q._id, q]));
  }, [result]);

  if (loading) return <div className="empty-box">Đang tải kết quả...</div>;
  if (error) return <p className="error">{error}</p>;
  if (!result) return <div className="empty-box">Không có kết quả.</div>;

  return (
    <div className="page-stack">
      <section className="result-hero">
        <div>
          <p className="section-tag">Kết quả bài làm</p>
          <h1>{result.quizId.title}</h1>
          <p className="muted">
            Nộp bài lúc {new Date(result.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="score-box">
          <span>Điểm số</span>
          <strong>
            {result.score}/{result.totalPoints}
          </strong>
        </div>
      </section>

      <section className="page-stack">
        {result.answers.map((answer, index) => {
          const question = questionMap[answer.questionId];

          return (
            <article
              key={index}
              className={`result-card ${
                answer.isCorrect ? 'result-card-correct' : 'result-card-wrong'
              }`}
            >
              <div className="result-top">
                <span className="question-index">Câu {index + 1}</span>
                <span className="pill">
                  {answer.isCorrect ? 'Đúng' : 'Sai'}
                </span>
              </div>

              <h3>{question?.content}</h3>
              <p><strong>Bạn chọn:</strong> {answer.selectedAnswer || 'Chưa trả lời'}</p>
              <p><strong>Đáp án đúng:</strong> {question?.correctAnswer}</p>
              {question?.explanation && (
                <p><strong>Giải thích:</strong> {question.explanation}</p>
              )}
            </article>
          );
        })}
      </section>

      <div className="action-row">
        <Link className="btn btn-secondary" to="/history">
          Xem lịch sử
        </Link>
        <Link className="btn btn-primary" to="/">
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}

export default ResultPage;