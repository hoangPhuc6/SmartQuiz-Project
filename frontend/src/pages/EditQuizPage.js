import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiFetch } from '../api';

const createEmptyQuestion = () => ({
  content: '',
  options: ['', '', '', ''],
  correctAnswer: '',
  explanation: '',
  points: 1,
  image: '',
});

function EditQuizPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Database');
  const [difficulty, setDifficulty] = useState('easy');
  const [questions, setQuestions] = useState([createEmptyQuestion()]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const data = await apiFetch(`/quizzes/${id}`);
        setTitle(data.title);
        setCategory(data.category);
        setDifficulty(data.difficulty);
        setQuestions(data.questions);
      } catch (err) {
        setMessage(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  const handleQuestionChange = (index, field, value) => {
    const next = [...questions];
    next[index][field] = value;
    setQuestions(next);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const next = [...questions];
    next[qIndex].options[optIndex] = value;
    setQuestions(next);
  };

  const addQuestion = () => {
    setQuestions([...questions, createEmptyQuestion()]);
  };

  const removeQuestion = (index) => {
    if (questions.length === 1) return;
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const addOption = (index) => {
    const next = [...questions];
    next[index].options.push('');
    setQuestions(next);
  };

  const removeOption = (qIndex, optIndex) => {
    const next = [...questions];
    if (next[qIndex].options.length <= 2) return;
    next[qIndex].options = next[qIndex].options.filter((_, i) => i !== optIndex);
    setQuestions(next);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      await apiFetch(`/quizzes/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          title,
          category,
          difficulty,
          questions,
        }),
      });

      setMessage('Cập nhật quiz thành công');
      setTimeout(() => navigate('/manage-quizzes'), 700);
    } catch (err) {
      setMessage(err.message);
    }
  };

  if (loading) return <div className="empty-box">Đang tải dữ liệu quiz...</div>;

  return (
    <div className="page-stack">
      <section className="panel">
        <div className="panel-head">
          <div>
            <p className="section-tag">Chỉnh sửa quiz</p>
            <h1>Sửa quiz và thêm câu hỏi mới</h1>
            <p className="muted">
              Bạn có thể tạo trước 2 câu, sau này quay lại thêm tiếp 1–2 câu hoặc chỉnh đáp án.
            </p>
          </div>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="page-stack">
        <section className="panel form-grid">
          <div>
            <label>Tên quiz</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div>
            <label>Chủ đề</label>
            <input value={category} onChange={(e) => setCategory(e.target.value)} />
          </div>

          <div>
            <label>Độ khó</label>
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              <option value="easy">easy</option>
              <option value="medium">medium</option>
              <option value="hard">hard</option>
            </select>
          </div>
        </section>

        {questions.map((question, index) => (
          <section className="panel" key={index}>
            <div className="panel-head">
              <h3>Câu hỏi {index + 1}</h3>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => removeQuestion(index)}
              >
                Xóa câu hỏi
              </button>
            </div>

            <div className="page-stack">
              <div>
                <label>Nội dung câu hỏi</label>
                <input
                  value={question.content}
                  onChange={(e) =>
                    handleQuestionChange(index, 'content', e.target.value)
                  }
                />
              </div>

              <div className="page-stack">
                <div className="panel-head">
                  <label>Danh sách đáp án</label>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => addOption(index)}
                  >
                    + Thêm đáp án
                  </button>
                </div>

                {question.options.map((option, optIndex) => (
                  <div className="option-editor" key={optIndex}>
                    <input
                      value={option}
                      onChange={(e) =>
                        handleOptionChange(index, optIndex, e.target.value)
                      }
                    />
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => removeOption(index, optIndex)}
                    >
                      Xóa
                    </button>
                  </div>
                ))}
              </div>

              <div className="form-grid">
                <div>
                  <label>Đáp án đúng</label>
                  <input
                    value={question.correctAnswer}
                    onChange={(e) =>
                      handleQuestionChange(index, 'correctAnswer', e.target.value)
                    }
                  />
                </div>

                <div>
                  <label>Giải thích</label>
                  <input
                    value={question.explanation || ''}
                    onChange={(e) =>
                      handleQuestionChange(index, 'explanation', e.target.value)
                    }
                  />
                </div>

                <div>
                  <label>Ảnh minh họa</label>
                  <input
                    value={question.image || ''}
                    onChange={(e) =>
                      handleQuestionChange(index, 'image', e.target.value)
                    }
                  />
                </div>

                <div>
                  <label>Điểm</label>
                  <input
                    type="number"
                    min="1"
                    value={question.points || 1}
                    onChange={(e) =>
                      handleQuestionChange(index, 'points', Number(e.target.value))
                    }
                  />
                </div>
              </div>
            </div>
          </section>
        ))}

        <div className="action-row">
          <button type="button" className="btn btn-secondary" onClick={addQuestion}>
            + Thêm câu hỏi
          </button>
          <button type="submit" className="btn btn-primary">
            Lưu thay đổi
          </button>
        </div>

        {message && <p className="success">{message}</p>}
      </form>
    </div>
  );
}

export default EditQuizPage;