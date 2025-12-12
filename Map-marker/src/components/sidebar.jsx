import React, { useState ,useEffect} from "react";

export default function Sidebar({pins,selectedPin,onSelectPin,onDeletePin,onEditPin,filter,setFilter,cursorLocation,categories,onAddCategory})
 {
  const [showCatForm, setShowCatForm] = useState(false);
  const [newCat, setNewCat] = useState({ name: "", color: "#000000" });

  useEffect(() => {
  const storedCategories = localStorage.getItem('categories');  
  if (storedCategories) {
    const parsedCategories = JSON.parse(storedCategories);
    parsedCategories.forEach(cat => onAddCategory(cat));
  }
}, []);

  const handleAddCategory = (e) => {
    e.preventDefault();
    onAddCategory(newCat);
    setNewCat({ name: "", color: "#000000" });
    setShowCatForm(false);
  };

  return (
    <aside className="sidebar">
      <h2>Saved Pins</h2>

      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option>All</option>
          {categories.map((c) => (
            <option key={c.name}>{c.name}</option>
          ))}
        </select>

        <button onClick={() => setShowCatForm(!showCatForm)}>+ Category</button>
      </div>

      {showCatForm && (
        <form className="cat-form" onSubmit={handleAddCategory}>
          <input type="text" placeholder="Category name" value={newCat.name} required
            onChange={(e) =>
              setNewCat({ ...newCat, name: e.target.value })
            }
          />
          <input type="color" value={newCat.color}
            onChange={(e) =>
              setNewCat({ ...newCat, color: e.target.value })
            }
          />
          <button type="submit">Add</button>
        </form>
      )}

      <ul>
        {pins.map((pin) => (
          <li
            key={pin.id}
            className={selectedPin?.id === pin.id ? "selected" : ""}
            style={{ borderLeft: `4px solid ${pin.color}`, cursor: "pointer" }}
            onClick={() => {
              onSelectPin(pin);
              if (window.map) {
                window.map.flyTo([pin.lat, pin.lng], 8, {
                  animate: true,
                  duration: 1.5,
                });
              }
            }}
          >
            <span>{pin.name}</span>

            <div className="pin-actions">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEditPin(pin);
                }}
              >
                Edit
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeletePin(pin.id);
                }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {cursorLocation && (
        <p>
          Mouse:<br />
          Lat: {cursorLocation.lat.toFixed(5)} <br />
          Lng: {cursorLocation.lng.toFixed(5)}
        </p>
      )}
    </aside>
  );
}
