"use client";

import { useEffect, useState } from "react";
import { pin, Category } from "../types";
import type { Map as LeafletMap } from "leaflet";

type SidebarProps = {
  pins: pin[];
  selectedPin: pin | null;
  onSelectPin: (pin: pin) => void;
  onDeletePin: (id: string) => void;
  onEditPin: (pin: pin) => void;
  filter: string;
  setFilter: (value: string) => void;
  cursorLocation: { lat: number; lng: number } | null;
  categories: Category[];
  onAddCategory: (cat: Category) => void;
  mapRef: React.MutableRefObject<LeafletMap | null>;
};


export default function Sidebar({pins,selectedPin,onSelectPin,onDeletePin,onEditPin,filter,setFilter,cursorLocation,categories,onAddCategory,mapRef}: SidebarProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCatForm, setShowCatForm] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [newCat, setNewCat] = useState<Category>({
    name: "",
    color: "#000000",
  });
  useEffect(() => {
    const stored = localStorage.getItem("categories");
    if (stored) {
      JSON.parse(stored).forEach((cat: Category) => onAddCategory(cat));
    }
  }, [onAddCategory]);

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCategory(newCat);

    const updated = [...categories, newCat];
    localStorage.setItem("categories", JSON.stringify(updated));

    setNewCat({ name: "", color: "#000000" });
    setShowCatForm(false);
  };

  const deleteCategory = (name: string) => {
    const updated = categories.filter((c) => c.name !== name);
    localStorage.setItem("categories", JSON.stringify(updated));
    setFilter("All");
    window.location.reload();
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-20 left-2 z-[10000] bg-blue-500 text-white px-3 py-2 rounded"
      >
        ☰
      </button>

      <aside
        className={`fixed top-0 left-0 z-[10001] w-72 h-screen bg-white p-4 flex flex-col gap-4
        transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:static`}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="md:hidden self-end text-xl"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold">Saved Pins</h2>

        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-full flex justify-between items-center px-3 py-2 border rounded-md"
          >
            <span>{filter === "All" ? "All Categories" : filter}</span>
            <span>▾</span>
          </button>

          {showDropdown && (
            <ul className="absolute z-20 mt-2 w-full bg-white border rounded-md shadow">
              <li
                onClick={() => {
                  setFilter("All");
                  setShowDropdown(false);
                }}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              >
                All
              </li>

              {categories.map((c) => (
                <li
                  key={c.name}
                  className="flex justify-between items-center px-3 py-2 hover:bg-gray-100"
                >
                  <span
                    onClick={() => {
                      setFilter(c.name);
                      setShowDropdown(false);
                    }}
                    className="cursor-pointer"
                  >
                    {c.name}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteCategory(c.name);
                    }}
                    className="text-red-600"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          onClick={() => setShowCatForm(!showCatForm)}
          className="w-full py-2 bg-blue-600 text-white rounded"
        >
          + Add Category
        </button>

        {showCatForm && (
          <form onSubmit={handleAddCategory} className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="Category"
              value={newCat.name}
              required
              onChange={(e) =>
                setNewCat({ ...newCat, name: e.target.value })
              }
              className="border px-2 py-1 rounded"
            />
            <input
              type="color"
              value={newCat.color}
              onChange={(e) =>
                setNewCat({ ...newCat, color: e.target.value })
              }
            />
            <button className="bg-green-600 text-white py-1 rounded">
              Add
            </button>
          </form>
        )}

        <ul className="flex-1 overflow-auto space-y-2">
          {pins.map((pin) => (
            <li
              key={pin.id}
              onClick={() => {
                onSelectPin(pin);
                setIsOpen(false);
                console.log(typeof mapRef)
                
              //   window.map?.flyTo([pin.lat, pin.lng], 8, {
              //     animate: true,
              //     duration: 1.5,
              //   });
              // }}
               mapRef.current?.flyTo([pin.lat, pin.lng], 8, {
                    animate: true,
                    duration: 1.5,
                  });
                }}
              className={`p-2 border-l-4 rounded cursor-pointer flex justify-between ${
                selectedPin?.id === pin.id
                  ? "bg-blue-50"
                  : "hover:bg-gray-50"
              }`}
              style={{ borderColor: pin.color }}
            >
              <span>{pin.name}</span>

              <div className="flex gap-2 text-sm">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditPin(pin);
                  }}
                  className="text-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeletePin(pin.id);
                  }}
                  className="text-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>

        {cursorLocation && (
          <p className="text-xs text-gray-500">
            Lat: {cursorLocation.lat.toFixed(5)} <br />
            Lng: {cursorLocation.lng.toFixed(5)}
          </p>
        )}

        <h2 className="text-center text-sm text-gray-400">
          Bhagya Patel
        </h2>
      </aside>
    </>
  );
}

