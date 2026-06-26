import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar.jsx'

export default function Layout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, paddingLeft: 0 }}>
        <div className="container">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export function SidebarNavLink({ to, label, icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => (isActive ? 'navLink active' : 'navLink')}
    >
      <span>{icon}</span>
      {label}
    </NavLink>
  )
}

