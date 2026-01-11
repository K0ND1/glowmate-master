import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Join } from './pages/Join';
import { VerifyWaitlist } from './pages/VerifyWaitlist';
import './index.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/join" element={<Join />} />
                <Route path="/verify-waitlist" element={<VerifyWaitlist />} />
            </Routes>
        </Router>
    );
}

export default App;
