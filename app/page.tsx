"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Sidebar from "./_components/Sidebar";
import PinForm from "./_components/PinForm";
import { pin, Category } from "./types";

// Leaflet must be dynamically imported (NO SSR)
const MapView = dynamic(() => import("./_components/MapView"), {
  ssr: false,
});

export default function HomePage() {
  
  const [pins, setPins] = useState<pin[]>([]);
  const [selectedPin, setSelectedPin] = useState<pin | null>(null);
  const [filter, setFilter] = useState<string>("All");
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<pin | null>(null);
  const [cursorLocation, setCursorLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  
  const defaultCategories: Category[] = [
    { name: "General", color: "#ff0000" },
    { name: "Food", color: "#FF6B6B" },
    { name: "Travel", color: "#4ECDC4" },
  ];

  const [categories, setCategories] =
    useState<Category[]>(defaultCategories);

  useEffect(() => {
    const storedCategories = localStorage.getItem("categories");
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    }

    const storedPins = localStorage.getItem("pins");
    if (storedPins) {
      setPins(JSON.parse(storedPins));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("categories", JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem("pins", JSON.stringify(pins));
  }, [pins]);

  const onAddCategory = (cat: Category) => {
    setCategories((prev) =>
      prev.some((c) => c.name === cat.name)
        ? prev
        : [...prev, cat]
    );
  };

  const handleAddPin = (newPin: pin) => {
    const category = categories.find(
      (c) => c.name === newPin.category
    );

    const pinWithColor: pin = {
      ...newPin,
      color: category?.color || "#fa0707",
    };

    setPins((prev) => [...prev, pinWithColor]);
    setFormOpen(false);
    setFormData(null);
  };

  const handleUpdatePin = (updatedPin: pin) => {
    const category = categories.find(
      (c) => c.name === updatedPin.category
    );

    const pinWithColor: pin = {
      ...updatedPin,
      color: category?.color || "#fa0707",
    };

    setPins((prev) =>
      prev.map((p) =>
        p.id === pinWithColor.id ? pinWithColor : p
      )
    );

    setFormOpen(false);
    setSelectedPin(null);
    setFormData(null);
  };

  const handleDeletePin = (id: string) => {
    setPins((prev) => prev.filter((p) => p.id !== id));
    setSelectedPin(null);
  };

  const openForm = (pin: pin | null = null) => {
    setFormData(pin);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setFormData(null);
  };

  const filteredPins =
    filter === "All"
      ? pins
      : pins.filter((p) => p.category === filter);

  return (
    <div className="app">
      <Sidebar
        pins={filteredPins}
        selectedPin={selectedPin}
        onSelectPin={setSelectedPin}
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
        onMapClick={(lat, lng) =>
          openForm({
            id: Date.now().toString(),
            name: "",
            description: "",
            category: "General",
            lat,
            lng,
            color: "#ff0000",
          })
        }
        onMouseMove={(lat, lng) =>
          setCursorLocation({ lat, lng })
        }
        setSelectedPin={setSelectedPin}
      />

      {formOpen && formData && (
        <PinForm
          pin={formData}
          categories={categories}
          onSave={(pin) =>
            pins.some((p) => p.id === pin.id)
              ? handleUpdatePin(pin)
              : handleAddPin(pin)
          }
          onClose={closeForm}
        />
      )}
    </div>
  );
}
