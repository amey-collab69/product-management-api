import React from 'react'
import { NavLink } from 'react-router-dom'
import '../styles/sidebar.css'

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/products', label: 'Products', icon: '🧾' },
  { to: '/products/new', label: 'Add Product', icon: '➕' }
]

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="logo">PM</div>
        <div>
          <div className="brandTitle">Product Management</div>
          <div className="brandSub">json-server + React</div>
        </div>
      </div>

      <nav className="nav">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) => (isActive ? 'navLink active' : 'navLink')}
          >
            <span className="navIcon">{l.icon}</span>
            <span className="navText">{l.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebarFooter">Manage inventory with CRUD</div>
    </aside>
  )
}

