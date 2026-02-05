import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Sorting from './pages/Sorting';
import Searching from './pages/Searching';

import Graphs from './pages/Graphs';
import Structures from './pages/Structures';
import DynamicProgramming from './pages/DynamicProgramming';
import Backtracking from './pages/Backtracking';
import Patterns from './pages/Patterns';
import Greedy from './pages/Greedy';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sorting" element={<Sorting />} />
          <Route path="/searching" element={<Searching />} />
          <Route path="/graphs" element={<Graphs />} />
          <Route path="/structures" element={<Structures />} />
          <Route path="/dp" element={<DynamicProgramming />} />
          <Route path="/patterns" element={<Patterns />} />
          <Route path="/backtracking" element={<Backtracking />} />
          <Route path="/greedy" element={<Greedy />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
