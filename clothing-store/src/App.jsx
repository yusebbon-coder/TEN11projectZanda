import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './Components/Navbar'
import HomePage from './pages/HomePage'
import Men from './pages/Men'
import Women from './pages/Women'
import Accessorise from './pages/Accessories'
import Detaill from './pages/Detaill'
import Checkout from "./pages/Checkout";
import Account from './pages/Account'
import Footer from './pages/Footer'
const App = () => {
  return (
    <>
      <Navbar/>
      <Routes>
        <Route path='/' element={<HomePage/>} />
        <Route path='/men' element={<Men/>}/>
        <Route path='/women' element={<Women />} />
        <Route path='/accessory' element={<Accessorise />} />
        <Route path='/products/:id' element={<Detaill />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/account" element={<Account />} />
      </Routes>
      <Footer/>
    </>
  )
}
export default App
