import React, { createContext, useContext, useMemo, useState } from 'react'

const ToastContext = createContext(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const api = useMemo(
    () => ({
      success: (message) => addToast('success', message),
      error: (message) => addToast('error', message),
      info: (message) => addToast('info', message)
    }),
    []
  )

  function addToast(type, message) {
    // Avoid relying on crypto availability in all browser contexts.
    const id =
      (typeof crypto !== 'undefined' && crypto.randomUUID && typeof crypto.randomUUID === 'function')
        ? crypto.randomUUID()
        : `t_${Date.now()}_${Math.random().toString(16).slice(2)}`

    setToasts((t) => [...t, { id, type, message }])
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id))
    }, 3200)
  }


  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        style={{
          position: 'fixed',
          right: 16,
          top: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          zIndex: 1000
        }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className="toast"
            data-type={t.type}
            role="status"
            aria-live="polite"
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

