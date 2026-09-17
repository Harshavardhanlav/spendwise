import React from 'react';
import { AlertTriangleIcon, TrashIcon } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

interface ConfirmDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
  /** State the consequence plainly. Never "Are you sure?" alone. */
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'danger' | 'warning';
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  onCancel,
  onConfirm,
  title,
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  tone = 'danger',
  loading
}: ConfirmDialogProps) {
  const Icon = tone === 'danger' ? TrashIcon : AlertTriangleIcon;

  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      size="sm"
      footer={
      <>
          <Button variant="secondary" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant={tone === 'danger' ? 'danger' : 'primary'} onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </>
      }>
      
      <div className="flex gap-3.5">
        <span
          className={
          tone === 'danger' ?
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-expense-bg text-expense' :
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-warning-bg text-warning'
          }>
          
          <Icon className="h-4.5 w-4.5" aria-hidden="true" />
        </span>
        <p className="pt-1 text-body text-ink-600">{message}</p>
      </div>
    </Modal>);

}