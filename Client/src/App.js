import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import QuizPage from './pages/QuizPage';
import ResultPage from './pages/ResultPage';
import HistoryPage from './pages/HistoryPage';
import CreateQuizPage from './pages/CreateQuizPage';
import ManageQuizzesPage from './pages/ManageQuizzesPage';
import EditQuizPage from './pages/EditQuizPage';

function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="container main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/quiz/:id"
            element={
              <ProtectedRoute>
                <QuizPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/result/:attemptId"
            element={
              <ProtectedRoute>
                <ResultPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <HistoryPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/create-quiz"
            element={
              <ProtectedRoute>
                <CreateQuizPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manage-quizzes"
            element={
              <ProtectedRoute>
                <ManageQuizzesPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/edit-quiz/:id"
            element={
              <ProtectedRoute>
                <EditQuizPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;