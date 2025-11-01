import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import EventList from './components/EventList';
import EventDetails from './components/EventDetails';
import EventForm from './components/EventForm';

function App() {
  return (
    <Router>
      <div className="min-vh-100 bg-light">
        <Routes>
          <Route path="/" element={<EventList />} />
          <Route path="/events" element={<Navigate to="/" replace />} />
          <Route path="/events/new" element={<EventForm />} />
          <Route path="/events/:id" element={<EventDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
