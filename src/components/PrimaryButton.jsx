import React from 'react'

export default function PrimaryButton({ children, onClick, type = 'submit', disabled }) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={{
        width: '100%',
        padding: '12px 14px',
        borderRadius: 12,
        border: '1px solid rgba(79,140,255,.45)',
        background: 'rgba(79,140,255,.18)',
        color: '#dbe7ff',
        fontWeight: 750,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1
      }}
    >
      {children}
    </button>
  )
}

