import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header/Header';
import { useState, useEffect } from 'react';
import Home from './pages/home/Home';
import { Feed } from './pages/feed/Feed';
import { AiChat } from './pages/aiChat/AiChat';
import Wherebuy from './pages/wherebuy/Wherebuy';

import { LoginPage } from './pages/LoginPage/LoginPage';
import { Footer } from './components/Footer/Footer';
import { Profile } from './pages/profile/Profile';
import AboutUs from './pages/abouUs/AboutUs';
import { supabase } from './supabaseClient';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);


  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
      setIsAdmin(data.session?.user?.email === 'admin@admin.com');
    };
    getSession();
  
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      setIsAdmin(session?.user?.email === 'admin@admin.com');
    });
  
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <Router>
      <Header 
        isAuthenticated={isAuthenticated} 
        isAdmin={isAdmin} 
        setIsAuthenticated={setIsAuthenticated} 
        setIsAdmin={setIsAdmin} 
      />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/aboutUs" element={<AboutUs />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/wherebuy" element={<Wherebuy />} />
          <Route path="/aichat" element={<AiChat />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
