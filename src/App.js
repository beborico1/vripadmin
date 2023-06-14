import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./helpers/firebaseConfig";
import ReportsScreen from "./screens/ReportsScreen";
import InicioSesion from "./screens/InicioSesion";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useEffect, useState } from "react";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return unsubscribe;
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/reports" /> : <Navigate to="/inicio-sesion" />} />
        <Route path="/reports" element={<ReportsScreen/>} />
        <Route path="/inicio-sesion" element={<InicioSesion />} />
      </Routes>
    </Router>
  );
}

export default App;
