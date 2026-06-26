import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { productsApi } from '../services/api'
import PrimaryButton from '../components/PrimaryButton.jsx'
import { useToast } from '../components/ToastProvider.jsx'

function EditProductPage() {
  const toast = useToast()
  const { id } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [form, setForm] = useState({
    name: '',
    category: '',
    price: '',
    quantity: '',
    description: ''
  })

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        setLoading(true)
        const res = await productsApi.getById(id)
        if (!mounted) return
        const p = res.data
        setForm({
          name: p.name ?? '',
          category: p.category ?? '',
          price: p.price ?? '',
          quantity: p.quantity ?? '',
          description: p.description ?? ''
        })
      } catch (e) {
        toast.error('Failed to load product')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [id])

  function validate() {
    const next = {}
    if (!form.name.trim()) next.name = 'Name is required'
    if (!form.category.trim()) next.category = 'Category is required'
    const price = Number(form.price)
    const quantity = Number(form.quantity)
    if (Number.isNaN(price) || price < 0) next.price = 'Price must be a valid non-negative number'
    if (Number.isNaN(quantity) || quantity < 0) next.quantity = 'Quantity must be a valid non-negative number'
    if (!form.description.trim()) next.description = 'Description is required'
    return next
  }

  async function onSubmit(e) {
    e.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    try {
      setSubmitting(true)
      await productsApi.update(id, {
        name: form.name.trim(),
        category: form.category.trim(),
        price: Number(form.price),
        quantity: Number(form.quantity),
        description: form.description.trim()
      })
      toast.success('Product updated successfully')
      navigate(`/products/${id}`)
    } catch (err) {
      toast.error('Update failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="grid" style={{ gap: 16 }}>
      <div>
        <div style={{ fontSize: 22, fontWeight: 900 }}>Edit Product</div>
        <div style={{ color: 'var(--muted)', marginTop: 6 }}>Update inventory details</div>
      </div>

      {loading ? (
        <div className="card" style={{ padding: 18, color: 'var(--muted)' }}>Loading product...</div>
      ) : (
        <form className="card" style={{ padding: 16 }} onSubmit={onSubmit}>
          <div className="grid" style={{ gap: 12 }}>
            <Field label="Name" error={errors.name}>
              <input style={inputStyle} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Field>
            <Field label="Category" error={errors.category}>
              <input style={inputStyle} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            </Field>
            <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="Price (USD)" error={errors.price}>
                <input style={inputStyle} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              </Field>
              <Field label="Quantity" error={errors.quantity}>
                <input style={inputStyle} value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
              </Field>
            </div>
            <Field label="Description" error={errors.description}>
              <textarea
                style={{ ...inputStyle, minHeight: 110, resize: 'vertical' }}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </Field>

            <PrimaryButton disabled={submitting}>{submitting ? 'Saving...' : 'Save Changes'}</PrimaryButton>
          </div>
        </form>
      )}
    </div>
  )
}

function Field({ label, children, error }) {
  return (
    <label style={{ display: 'grid', gap: 8 }}>
      <div style={{ color: 'var(--muted)', fontSize: 13, fontWeight: 700 }}>{label}</div>
      {children}
      {error && <div style={{ color: '#ffb3b3', fontSize: 12 }}>{error}</div>}
    </label>
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

export default EditProductPage

