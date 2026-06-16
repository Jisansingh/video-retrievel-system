import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Library from './pages/Library';
import History from './pages/History';
import About from './pages/About';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<About />} />
        <Route path="/search" element={<Home />} />
        <Route path="/library" element={<Library />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </Router>
  );
}

export default App;
