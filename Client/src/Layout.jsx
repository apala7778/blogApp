import React from 'react';
import Header from './Header'
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
      <main>
        <Header />
        <Outlet />
        <div>Im a footrer</div>
      </main>
  )
}

export default Layout
