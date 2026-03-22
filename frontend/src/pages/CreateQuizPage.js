import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../api';

const createEmptyQuestion = () => ({
  content: '',
  options: ['', '', '', ''],
  correctAnswer: '',
  explanation: '',
  points: 1,
  image: '',
});

function CreateQuizPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Database');
  const [difficulty, setDifficulty] = useState('easy');
  const [message, setMessage] = useState('');
  const [questions, setQuestions] = useState([createEmptyQuestion()]);

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
      await apiFetch('/quizzes', {
        method: 'POST',
        body: JSON.stringify({ title, category, difficulty, questions }),
      });

      setMessage('Tạo quiz thành công');
      setTimeout(() => navigate('/manage-quizzes'), 700);
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="page-stack">
      <section className="panel">
        <div className="panel-head">
          <div>
            <p className="section-tag">Tạo quiz</p>
            <h1>Tạo quiz mới</h1>
            <p className="muted">
              Bạn có thể thêm câu hỏi, thêm đáp án, giải thích, ảnh và điểm số.
            </p>
          </div>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="page-stack">
        <section className="panel form-grid">
          <div>
            <label>Tên quiz</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ví dụ: MongoDB nâng cao"
              required
            />
          </div>

          <div>
            <label>Chủ đề</label>
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Database"
              required
            />
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
                  placeholder="Nhập nội dung câu hỏi"
                  required
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
                      placeholder={`Đáp án ${optIndex + 1}`}
                      required
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
                    placeholder="Nhập đúng nội dung đáp án đúng"
                    required
                  />
                </div>

                <div>
                  <label>Giải thích</label>
                  <input
                    value={question.explanation}
                    onChange={(e) =>
                      handleQuestionChange(index, 'explanation', e.target.value)
                    }
                    placeholder="Giải thích ngắn"
                  />
                </div>

                <div>
                  <label>Ảnh minh họa (URL)</label>
                  <input
                    value={question.image}
                    onChange={(e) =>
                      handleQuestionChange(index, 'image', e.target.value)
                    }
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label>Điểm</label>
                  <input
                    type="number"
                    min="1"
                    value={question.points}
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
            Lưu quiz
          </button>
        </div>

        {message && <p className="success">{message}</p>}
      </form>
    </div>
  );
}

export default CreateQuizPage;