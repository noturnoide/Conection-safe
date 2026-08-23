import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import SmoothScroll from "@/components/SmoothScroll";
import Landing from "@/pages/Landing";
import FormStep1 from "@/pages/FormStep1";
import FormStep2 from "@/pages/FormStep2";
import Protocol from "@/pages/Protocol";
import Consultar from "@/pages/Consultar";
import Review from "@/pages/Review";

function App() {
  return (
    <div className="App">
      <SmoothScroll>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/relatar" element={<FormStep1 />} />
            <Route path="/relatar/detalhes" element={<FormStep2 />} />
            <Route path="/protocolo" element={<Protocol />} />
            <Route path="/consultar" element={<Consultar />} />
            <Route path="/revisao" element={<Review />} />
          </Routes>
        </BrowserRouter>
      </SmoothScroll>
      <Toaster position="top-center" theme="light" richColors />
    </div>
  );
}

export default App;
