import Modal from "./Modal";

export default function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <Modal title="Confirm" onClose={onCancel} width={380}>
      <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>{message}</p>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button className="btn btn-danger" onClick={onConfirm}>Delete</button>
      </div>
    </Modal>
  );
}