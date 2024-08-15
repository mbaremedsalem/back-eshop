import  { Container } from 'react-bootstrap'
import Header from './components/Header'
import Footer from './components/footer'
import HomeScreen from './screens/HomeScreen'
import { HashRouter as Router, Route, Routes } from 'react-router-dom'
import React from 'react';
import ProductScreen from './screens/ProductScreen'
import LoginScreen from './screens/LoginScreen'
import RegisterScreen from './screens/RegisterScreen'
import ProfileScreen from './screens/ProfileScreen' 
import CartScreen from './screens/CartScreen'
import PaymentScreen from './screens/PaymentScreen'
import ShippingScreen from './screens/ShippingScreen'
import PlaceOrderScreen from './screens/PlaceOrderScreen'
import OrderScreen from './screens/OrderScreen'
import UserListScreen from './screens/UserListScreen'
import UserEditScreen from './screens/UserEditScreen'
import ProductListScreen from './screens/ProductListScreen'
import ProductEditScreen from './screens/ProductEditScreen'
import OrderListScreen from './screens/OrderListScreen'


function App() {
  return (
    <div>
      <Router>
        <Header/>
            <main className='py-3'> 
              <Container> 
                  <Routes>
                          <Route path='/' element={<HomeScreen/>} exact />
                          <Route path='/login' element={<LoginScreen/>} />
                          <Route path='/register' element={<RegisterScreen/>} />
                          <Route path='/profile' element={<ProfileScreen/>} />
                          <Route path='/cart/:id?' element={<CartScreen/>} />
                          <Route path='/payment' element={<PaymentScreen/>} />
                          <Route path='/product/:id' element={<ProductScreen/>} />

                          <Route path='/login/shipping' element={<ShippingScreen/>} />
                          <Route path='/placeorder' element={<PlaceOrderScreen/>} />
                          <Route path='/order/:id' element={<OrderScreen/>} />
                          <Route path='/admin/userlist' element={<UserListScreen/>} />
                          <Route path='/admin/user/:id/edit' element={<UserEditScreen/>} />
                          <Route path='/admin/productlist' element={<ProductListScreen/>} />
                          <Route path='/admin/product/:id/edit' element={<ProductEditScreen />} />
                          <Route path='/admin/orderlist' element={<OrderListScreen/>} />
                  </Routes>
              </Container>
            </main>
        <Footer/>
      </Router>
    </div>
  );
}

export default App;



