import withCard from "./components/withCard/withCard";
import UserCard from "./components/withCard/UserCard";
import ProductCard from "./components/withCard/ProductCard";

const UserCardWithWrapper = withCard(UserCard);
const ProductCardWithWrapper = withCard(ProductCard);

export default function App() {
  return (
    <div style={{ padding: "30px" }}>
      <UserCardWithWrapper name="Bhagya" age={21} />

      <ProductCardWithWrapper title="MacBook Air" price={99999} />
    </div>
  );
}
