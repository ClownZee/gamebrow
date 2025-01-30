import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GameList from "./components/GameList"; // Pastikan path sesuai
import GameDetail from "./components/GameDetail";
import OnlineGameList from "./components/OnlineGameList"; // Pastikan path sesuai
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GameList />} /> {/* Tambahkan daftar game di halaman utama */}
        <Route path="/game/:slug" element={<GameDetail />} /> {/* Rute detail game */}
        <Route path="/onlinegames" element={<OnlineGameList />} />
      </Routes>
    </Router>
  );
}

export default App;
