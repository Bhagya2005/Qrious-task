import MouseProvider from "./MouseProvider";
import PositionLabel from "./PositionLabel";

export default function App() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Render Props Pattern Example</h1>

      <MouseProvider
        render={(mouse) => (
          <PositionLabel x={mouse.x} y={mouse.y} />
        )}
      />
    </div>
  );
}
