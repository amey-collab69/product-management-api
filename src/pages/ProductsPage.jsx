import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { productsApi } from '../services/api'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import { useToast } from '../components/ToastProvider.jsx'
import '../styles/toast.css'
import '../styles/buttons.css'

function ProductsPage() {
  const toast = useToast()

  const [products, setProducts] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [confirmId, setConfirmId] = useState(null)

  async function load() {
    setLoading(true)
    setError('')
    try {
      const res = await productsApi.getAll()
      setProducts(res.data)
    } catch (e) {
      setError('Failed to fetch products. Make sure json-server is running on port 3001.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean))
    return ['all', ...Array.from(set)]
  }, [products])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return products.filter((p) => {
      const matchesSearch = !q || String(p.name).toLowerCase().includes(q)
      const matchesCategory = category === 'all' || p.category === category
      return matchesSearch && matchesCategory
    })
  }, [products, search, category])

  async function onDelete(id) {
    try {
      await productsApi.remove(id)
      toast.success('Product deleted successfully')
      setConfirmId(null)
      await load()
    } catch (e) {
      toast.error('Delete failed')
    }
  }

  return (
    <div className="grid" style={{ gap: 16 }}>
      <div className="row" style={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 900 }}>Products</div>
          <div style={{ color: 'var(--muted)', marginTop: 6 }}>Search, filter, and manage inventory</div>
        </div>
        <Link to="/products/new" className="badge">➕ Add Product</Link>
      </div>

      <div className="card" style={{ padding: 14 }}>
        <div className="grid" style={{ gridTemplateColumns: '1fr', gap: 10 }}>
          <div className="grid" style={{ gridTemplateColumns: '1fr', gap: 10 }}>
            <label style={{ color: 'var(--muted)', fontSize: 13 }}>Search by name</label>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="e.g., mouse"
              style={inputStyle}
            />
          </div>

          <div className="grid" style={{ gridTemplateColumns: '1fr', gap: 10 }}>
            <label style={{ color: 'var(--muted)', fontSize: 13 }}>Filter by category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
              {categories.map((c) => (
                <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="card" style={{ padding: 18, color: 'var(--muted)' }}>Loading products...</div>
      ) : error ? (
        <div className="card" style={{ padding: 18, borderColor: 'rgba(255,77,77,.45)' }}>
          <div style={{ fontWeight: 850, marginBottom: 6 }}>Error</div>
          <div style={{ color: 'var(--muted)' }}>{error}</div>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
          <div style={{ padding: 14, borderBottom: '1px solid var(--border)' }}>
            <div className="badge">Showing {filtered.length} of {products.length}</div>
          </div>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Category</th>
                <th style={thStyle}>Price</th>
                <th style={thStyle}>Qty</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td style={tdStyle}>
                    <Link to={`/products/${p.id}`} style={{ fontWeight: 800 }}>{p.name}</Link>
                    <div style={{
                      color: 'var(--muted)',
                      fontSize: 12,
                      marginTop: 3,
                      maxWidth: 420,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {p.description}
                    </div>
                  </td>
                  <td style={tdStyle}>{p.category}</td>
                  <td style={tdStyle}>${Number(p.price).toFixed(2)}</td>
                  <td style={tdStyle}>{p.quantity}</td>
                  <td style={tdStyle}>
                    <div className="row" style={{ flexWrap: 'wrap' }}>
                      <Link to={`/products/${p.id}/edit`} className="btn">Edit</Link>
                      <button className="btn danger" onClick={() => setConfirmId(p.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {!filtered.length && (
                <tr>
                  <td colSpan={5} style={{ padding: 18, color: 'var(--muted)' }}>No products match your filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={confirmId !== null}
        title="Delete product?"
        description="This action cannot be undone. The product will be removed from the backend."
        confirmText="Delete"
        cancelText="Cancel"
        onCancel={() => setConfirmId(null)}
        onConfirm={() => onDelete(confirmId)}
      />
    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 12,
  border: '1px solid var(--border)',
  background: 'rgba(255,255,255,.03)',
  color: 'var(--text)',
  outline: 'none'
}

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  minWidth: 760
}

const thStyle = {
  textAlign: 'left',
  padding: '12px 14px',
  color: 'var(--muted)',
  borderBottom: '1px solid var(--border)',
  fontSize: 13,
  whiteSpace: 'nowrap'
}

const tdStyle = {
  padding: '14px 14px',
  borderBottom: '1px solid var(--border)',
  verticalAlign: 'top'
}

export default ProductsPage

