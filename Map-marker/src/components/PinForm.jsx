import React, { useState, useEffect } from "react";

export default function PinForm({ pin, categories, onSave, onClose }) {
  const [formData, setFormData] = useState(pin);

  useEffect(() => {
    setFormData(pin);
  }, [pin]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="form-overlay">
      <div className="form-popup">
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Name" value={formData.name} required
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />
          <textarea style={{height:'200px' }} placeholder="Description" value={formData.desc} required
            onChange={(e) =>
              setFormData({ ...formData, desc: e.target.value })
            }
          />
          <select value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            {categories.map((c) => (
              <option key={c.name}>{c.name}</option>
            ))}
          </select>

          <div className="form-buttons">
            <button type="submit" className="btn save">Save</button>
            <button type="button" className="btn cancel" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
