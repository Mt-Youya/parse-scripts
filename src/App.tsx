import { BrowserRouter } from "react-router-dom";
import { Toaster } from "@/ui/sonner";
import { devRoutes } from "./routes/devRoutes";
import { LazyLoad } from "./components/LazyLoadComponent";
import Home from "./pages/Home";
import Contrast from "./pages/Contrast";
import NotFound from "./pages/Results/404";
import BackToTop from "./layouts/BackToTop";
import QRCodeGenerator from "./pages/QRCodeGenerator";

function App() {
  return (
    <>
      <Toaster richColors position="top-center" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contrast" element={<Contrast />} />
          <Route path="/qr-code-generator" element={<QRCodeGenerator />} />
          <Route path="*" element={<NotFound />} />
          {devRoutes.map((route) => (
            <Route
              path={route.path}
              element={<LazyLoad component={route.component} />}
            />
          ))}
        </Routes>
      </BrowserRouter>
      <BackToTop />
    </>
  );
}

export default App;
