import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';


import Home from './Home';
import CardList from './CardList';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/card-list" element={<CardList />} />
      </Routes>
    </Router>
  );
}

export default App;
