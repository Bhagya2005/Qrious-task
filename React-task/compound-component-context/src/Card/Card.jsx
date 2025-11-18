import React, { createContext } from "react";

export const CardContext = createContext();

function Card({ children, title, price }) {
  const value = { title, price };

  return (
    <CardContext.Provider value={value}>
      <div
        style={{
          width: "260px",
          padding: "20px",
          borderRadius: "12px",
          border: "1px solid #ddd",
          background: "#fff",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        {children}
      </div>
    </CardContext.Provider>
  );
}

export default Card;
