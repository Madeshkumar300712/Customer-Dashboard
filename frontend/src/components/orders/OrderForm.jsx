import { useState } from "react";
import Modal from "../ui/Modal";

const EMPTY = {
  firstName: "", lastName: "", email: "", phone: "",
  street: "", city: "", state: "", postalCode: "", country: "",
  product: "", quantity: 1, unitPrice: "", status: "Pending", createdBy: "",
};

const COUNTRIES = ["India","United States","Canada","Australia","Singapore","Hong Kong"];
const PRODUCTS = ["Fiber Internet 300 Mbps","5G Unlimited Mobile Plan","Fiber Internet 1 Gbps","Business Internet 500 Mbps","VoIP Corporate Package"];
const STATUSES = ["Pending","In progress","Completed"];
const CREATORS = ["Mr. Manoj","Mr. Sultan","Ms. Deepika","Mr. Ganesan"];

const required = [
  "firstName","lastName","email","phone","street","city","state","postalCode",
  "country","product","quantity","unitPrice","status","createdBy"
];

export default function OrderForm({ initial, onClose, onSubmit }) {
  const [form, setForm] = useState(initial || EMPTY);
  const [errors, setErrors] = useState({
  customerName: "",
  product: "",
  quantity: 0,
  price: 0,
  status: "pending"
});

  const set = (k, v) => {
    const updated = { ...form, [k]: v };
    if (k === "quantity" || k === "unitPrice") {
      updated.totalAmount = (parseFloat(updated.quantity) || 0) * (parseFloat(updated.unitPrice) || 0);
    }
    setForm(updated);
    setErrors(e => ({ ...e, [k]: "" }));
  };

  const validate = () => {
    const e = {};
    required.forEach(k => { if (!form[k] && form[k] !== 0) e[k] = "Please fill the field"; });
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = () => { if (validate()) onSubmit(form); };

  const field = (k, label, type = "text", opts = null) => (
    <div key={k} style={{ marginBottom: 14 }}>
      <label>{label} <span style={{ color: "var(--danger)" }}>*</span></label>
      {opts ? (
        <select value={form[k]} onChange={e => set(k, e.target.value)}>
          <option value="">Select...</option>
          {opts.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} value={form[k]} onChange={e => set(k, e.target.value)} />
      )}
      {errors[k] && <span style={{ color: "var(--danger)", fontSize: 15 }}>{errors[k]}</span>}
    </div>
  );

  return (
    <Modal title={initial ? "Edit Order" : "Create Order"} onClose={onClose} width={640}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
        <div>
          <p style={{ fontFamily: "Syne", fontSize: 16, color: "var(--accent)", marginBottom: 12 }}>Customer Information</p>
          {field("firstName", "First Name")}
          {field("lastName", "Last Name")}
          {field("email", "Email ID")}
          {field("phone", "Phone Number")}
          {field("street", "Street Address")}
          {field("city", "City")}
          {field("state", "State / Province")}
          {field("postalCode", "Postal Code")}
          {field("country", "Country", "text", COUNTRIES)}
        </div>
        <div>
          <p style={{ fontFamily: "Syne", fontSize: 16, color: "var(--accent)", marginBottom: 12 }}>Order Information</p>
          {field("product", "Choose Product", "text", PRODUCTS)}
          <div style={{ marginBottom: 14 }}>
            <label>Quantity <span style={{ color: "var(--danger)" }}>*</span></label>
            <input type="number" min={1} value={form.quantity}
              onChange={e => set("quantity", Math.max(1, parseInt(e.target.value) || 1))} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label>Unit Price ($) <span style={{ color: "var(--danger)" }}>*</span></label>
            <input type="number" value={form.unitPrice} onChange={e => set("unitPrice", e.target.value)} />
            {errors.unitPrice && <span style={{ color: "var(--danger)", fontSize: 15 }}>{errors.unitPrice}</span>}
          </div>
          <div style={{ marginBottom: 14 }}>
            <label>Total Amount</label>
            <input readOnly value={`$${(form.totalAmount || 0).toFixed(2)}`} style={{ opacity: 0.7 }} />
          </div>
          {field("status", "Status", "text", STATUSES)}
          {field("createdBy", "Created By", "text", CREATORS)}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={handleSubmit}>Submit</button>
      </div>
    </Modal>
  );
}