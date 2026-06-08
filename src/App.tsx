import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';
import Pending from '@/pages/Pending';
import Detail from '@/pages/Detail';
import Compare from '@/pages/Compare';
import Opinions from '@/pages/Opinions';
import Calendar from '@/pages/Calendar';
import Rules from '@/pages/Rules';
import Profile from '@/pages/Profile';

function AppContent() {
  const location = useLocation();
  const showBottomNav = ['/', '/opinions', '/calendar', '/rules', '/profile'].includes(
    location.pathname
  );

  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Pending />} />
        <Route path="/detail/:id" element={<Detail />} />
        <Route path="/compare/:id" element={<Compare />} />
        <Route path="/opinions" element={<Opinions />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      {showBottomNav && <BottomNav />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
