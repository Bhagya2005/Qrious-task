function PositionLabel({ x, y }) {
  return (
    <h3 style={{ margin: "10px" }}>
      Mouse Position → X: {x}, Y: {y}
    </h3>
  );
}

export default PositionLabel;
