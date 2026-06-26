import React from 'react'
import '../styles/dialog.css'

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel
}) {
  if (!open) return null

  return (
    <div className="overlay" role="dialog" aria-modal="true">
      <div className="dialog card">
        <div className="dialogTitle">{title}</div>
        <div className="dialogDesc">{description}</div>
        <div className="dialogActions">
          <button className="btn secondary" onClick={onCancel}>
            {cancelText}
          </button>
          <button className="btn danger" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

