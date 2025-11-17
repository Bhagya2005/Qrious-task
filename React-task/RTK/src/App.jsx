// import { useDispatch } from 'react-redux'
// import './App.css'
// import Header from './Header'
// import Product from './Product'
// import { clearAllItems } from './redux/slice';
// import { BrowserRouter, Route, Routes } from 'react-router-dom';
// import CartList from './CartList';
// function App() {
// const dispatch=useDispatch();
//   return (
//     <>
// <BrowserRouter>
//  <Header />

//  <Routes>
// <Route path="/" element={ <Product />}></Route>
// <Route path="/cart" element={<CartList />}></Route>

//  </Routes>
// </BrowserRouter>
//     </>
//   )
// }

// export default App


import './App.css'
import Header from './Header'
import Product from './Product'
import { clearAllItems } from './redux/slice';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CartList from './CartList';
function App() {

  return (
    <>
<BrowserRouter>
 <Header />

 <Routes>
<Route path="/" element={ <Product />}></Route>
<Route path="/cart" element={<CartList />}></Route>

 </Routes>
</BrowserRouter>
    </>
  )
}

export default App
