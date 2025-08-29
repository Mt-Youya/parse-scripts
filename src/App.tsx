import { BrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import Contrast from './pages/Contrast';
import NotFound from './pages/Results/404';
import BackToTop from './layouts/BackToTop';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contrast" element={<Contrast />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <BackToTop />
    </>
  );
};

export default App;
