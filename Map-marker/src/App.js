import React, { useState, useEffect } from "react";
import MapView from "./components/MapView";
import Sidebar from "./components/sidebar";
import PinForm from "./components/PinForm";
import "./index.css";

export default function App() {
  const [pins, setPins] = useState(null);
  const [selectedPin, setSelectedPin] = useState(null);
  const [filter, setFilter] = useState("All");
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState(null);
  const [cursorLocation, setCursorLocation] = useState(null);

const defaultCategories = [
  { name: "General", color: "#ff0000" },
  { name: "Food", color: "#FF6B6B" },
  { name: "Travel", color: "#4ECDC4" },
];

const [categories, setCategories] = useState(() => {
  const saved = localStorage.getItem("categories");
  return saved ? JSON.parse(saved) : defaultCategories;
});

useEffect(() => {
  localStorage.setItem("categories", JSON.stringify(categories));
}, [categories]);

const onAddCategory = (cat) => {
  setCategories(prev =>
    prev.some(c => c.name === cat.name)
      ? prev
      : [...prev, cat]
  );
};

  useEffect(() => {
    const storedPins = localStorage.getItem("pins");
    if (storedPins) setPins(JSON.parse(storedPins));
    else setPins([]);
  }, []);

  useEffect(() => {
    if (pins !== null) {
      localStorage.setItem("pins", JSON.stringify(pins));
    }
  }, [pins]);

  const handleAddPin = (pin) => {
    pin.lat = Number(pin.lat);
    pin.lng = Number(pin.lng);

    const cat = categories.find((c) => c.name === pin.category);
    pin.color = cat?.color || "#fa0707";

    if (pins.find((p) => p.id === pin.id)) {
      setPins(pins.map((p) => (p.id === pin.id ? pin : p)));
    } else {
      setPins([...pins, pin]);
    }
  };

  const handleUpdatePin = (updatedPin) => {
    const cat = categories.find((c) => c.name === updatedPin.category);
    updatedPin.color = cat.color;

    setPins(pins.map((p) => (p.id === updatedPin.id ? updatedPin : p)));
    setFormOpen(false);
    setSelectedPin(null);
  };

  const handleDeletePin = (id) => {
    setPins(pins.filter((p) => p.id !== id));
  };

  const openForm = (pin = null) => {
    setFormData(pin);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setFormData(null);
  };

  if (pins === null) return <p>Loading map...</p>;

  const filteredPins =
    filter === "All" ? pins : pins.filter((p) => p.category === filter);

  return (
    <div className="app">
      <Sidebar
        pins={filteredPins}
        selectedPin={selectedPin}
        onSelectPin={(pin) => setSelectedPin(pin)}
        onDeletePin={handleDeletePin}
        onEditPin={(pin) => openForm(pin)}
        filter={filter}
        setFilter={setFilter}
        cursorLocation={cursorLocation}
        categories={categories}
        onAddCategory={onAddCategory}
      />

      <MapView
        pins={filteredPins}
        onMapClick={(latlng) =>
          openForm({
            id: Date.now(),
            name: "",
            desc: "",
            category: "General",
            lat: latlng.lat,
            lng: latlng.lng,
          })
        }
        onMouseMove={setCursorLocation}
        setSelectedPin={setSelectedPin}
      />

      {formOpen && (
        <PinForm
          pin={formData}
          categories={categories}
          onSave={(pin) => {
            if (pins.find((p) => p.id === pin.id)) handleUpdatePin(pin);
            else handleAddPin(pin);
          }}
          onClose={closeForm}
        />
      )}
    </div>
  );
}
