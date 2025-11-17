import { useState } from "react";

function MouseProvider({ render }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMove = (e) => {
    setPos({
      x: e.clientX,
      y: e.clientY,
    });
  };

  return (
    <div
      style={{
        height: "200px",
        border: "2px solid black",
        marginTop: "20px",
      }}
      onMouseMove={handleMove}
    >
      {render(pos)}
    </div>
  );
}

export default MouseProvider;
