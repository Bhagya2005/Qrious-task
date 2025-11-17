function ProductCard({ title, price }) {
  return (
    <>
      <h2>Product Info</h2>
      <p>Title: {title}</p>
      <p>Price: ₹{price}</p>
    </>
  );
}

export default ProductCard;
