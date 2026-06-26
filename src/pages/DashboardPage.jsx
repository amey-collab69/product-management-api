import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { productsApi } from '../services/api'
import '../styles/toast.css'

function formatMoney(v) {
  const num = Number(v)
  if (Number.isNaN(num)) return '$0.00'
  return num.toLocaleString(undefined, { style: 'currency', currency: 'USD' })
}

export default function DashboardPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        setLoading(true)
        const res = await productsApi.getAll()
        if (!mounted) return
        setProducts(res.data)
        setError('')
      } catch (e) {
        if (!mounted) return
        setError('Failed to load products. Is the API running on port 3001?')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  const totals = useMemo(() => {
    const totalProducts = products.length
    const totalInventory = products.reduce((sum, p) => sum + (Number(p.quantity) || 0), 0)
    const inventoryValue = products.reduce((sum, p) => sum + (Number(p.price) || 0) * (Number(p.quantity) || 0), 0)
    return { totalProducts, totalInventory, inventoryValue }
  }, [products])

  return (
    <div className="grid" style={{ gap: 16 }}>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 900 }}>Dashboard</div>
          <div style={{ color: 'var(--muted)', marginTop: 6 }}>Overview of your inventory</div>
        </div>
        <Link to="/products" className="badge">Go to Products →</Link>
      </div>

      {loading ? (
        <div className="card" style={{ padding: 18, color: 'var(--muted)' }}>Loading dashboard...</div>
      ) : error ? (
        <div className="card" style={{ padding: 18, borderColor: 'rgba(255,77,77,.45)' }}>
          <div style={{ fontWeight: 850, marginBottom: 6 }}>Error</div>
          <div style={{ color: 'var(--muted)' }}>{error}</div>
        </div>
      ) : (
        <div className="grid cols3">
          <div className="card" style={{ padding: 16 }}>
            <div className="badge">Total Products</div>
            <div style={{ fontSize: 30, fontWeight: 950, marginTop: 10 }}>{totals.totalProducts}</div>
          </div>
          <div className="card" style={{ padding: 16 }}>
            <div className="badge">Total Inventory Value</div>
            <div style={{ fontSize: 30, fontWeight: 950, marginTop: 10 }}>{formatMoney(totals.inventoryValue)}</div>
          </div>
          <div className="card" style={{ padding: 16 }}>
            <div className="badge">Product Count Cards</div>
            <div style={{ fontSize: 30, fontWeight: 950, marginTop: 10 }}>{totals.totalProducts}</div>
            <div style={{ color: 'var(--muted)', marginTop: 8, fontSize: 13 }}>Use Products page for details</div>
          </div>
        </div>
      )}
    </div>
  )
}

