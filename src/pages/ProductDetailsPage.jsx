import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { productsApi } from '../services/api'
import { useToast } from '../components/ToastProvider.jsx'

function ProductDetailsPage() {
  const toast = useToast()
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        setLoading(true)
        const res = await productsApi.getById(id)
        if (!mounted) return
        setProduct(res.data)
      } catch (e) {
        toast.error('Failed to load product details')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [id])

  if (loading) return <div className="card" style={{ padding: 18, color: 'var(--muted)' }}>Loading details...</div>
  if (!product) return <div className="card" style={{ padding: 18, color: 'var(--muted)' }}>Product not found.</div>

  return (
    <div className="grid" style={{ gap: 16 }}>
      <div className="row" style={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 900 }}>Product Details</div>
          <div style={{ color: 'var(--muted)', marginTop: 6 }}>Full information for product #{product.id}</div>
        </div>
        <div className="row" style={{ flexWrap: 'wrap' }}>
          <Link to="/products" className="badge">← Back to list</Link>
          <Link to={`/products/${product.id}/edit`} className="badge">Edit</Link>
        </div>
      </div>

      <div className="card" style={{ padding: 16 }}>
        <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 280 }}>
            <div className="badge">{product.category}</div>
            <div style={{ marginTop: 10, fontSize: 26, fontWeight: 950 }}>{product.name}</div>
            <div style={{ color: 'var(--muted)', marginTop: 10, lineHeight: 1.5 }}>{product.description}</div>
          </div>

          <div style={{ minWidth: 260, display: 'grid', gap: 10 }}>
            <div className="card" style={{ padding: 14, background: 'rgba(255,255,255,.02)' }}>
              <div className="badge">Price</div>
              <div style={{ fontSize: 22, fontWeight: 950, marginTop: 10 }}>${Number(product.price).toFixed(2)}</div>
            </div>
            <div className="card" style={{ padding: 14, background: 'rgba(255,255,255,.02)' }}>
              <div className="badge">Quantity</div>
              <div style={{ fontSize: 22, fontWeight: 950, marginTop: 10 }}>{product.quantity}</div>
            </div>
            <div className="card" style={{ padding: 14, background: 'rgba(255,255,255,.02)' }}>
              <div className="badge">Inventory Value</div>
              <div style={{ fontSize: 22, fontWeight: 950, marginTop: 10 }}>${(Number(product.price) * Number(product.quantity)).toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailsPage

