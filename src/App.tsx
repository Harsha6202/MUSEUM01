import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import MuseumTimings from './components/MuseumTimings';
import ContactPage from './components/ContactPage';
import AboutPage from './components/AboutPage';
import BookingPage from './components/BookingPage';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isValidSession, setIsValidSession] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifySession = () => {
      try {
        const sessionTime = parseInt(sessionStorage.getItem('adminSession') || '0');
        const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true' && 
          Date.now() - sessionTime < 3600000; // 1 hour session
        setIsValidSession(isAuthenticated);
      } catch (error) {
        console.error('Session verification error:', error);
        setIsValidSession(false);
      } finally {
        setLoading(false);
      }
    };
    verifySession();
  }, []);

  if (loading) return <div className="p-4 text-center">Loading...</div>;

  return isValidSession ? (
    <ErrorBoundary fallback={<div className="p-4 text-red-600">Dashboard Error - Please reload</div>}>
      {children}
    </ErrorBoundary>
  ) : <Navigate to="/admin-login" />;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/timings" element={<MuseumTimings />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/book" element={<BookingPage />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;