import React from 'react';
import './App.css';
import Header from './header/Header';
import SideNavbar from './Sidebar/Navbar';
import Main from './main/Main';
import { default as navItems } from './Sidebar/nav';

function App() {
  return (
    <div className="App">
      <Header />
      <SideNavbar items={navItems} />
      <Main />
    </div>
  );
}

export default App;
