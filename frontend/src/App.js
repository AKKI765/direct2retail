import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from './AppLayout';
import Home from './Pages/Home';
import LoginSignup from './Pages/Authentication/Login';
import Signup from './Pages/Authentication/LoginSignup';
import Cart from './Pages/Cart';
import OrderPlaced from './Pages/OrderPlaced';
import AdminSignup from './Pages/Authentication/AdminSignup';
import History from './Pages/History';
import ErrorTransaction from './Pages/ErrorTransaction';
import MerchantSignup from './Pages/Authentication/MerchantSignup';
import MerchantOrders from './Pages/Merchant/MerchantOrders';
import ItemCreate from './Pages/Merchant/ItemCreate';
import ManageMerchantRack from './Pages/Merchant/ManageMerchantRack';
import ManageRack from './Pages/Admin/ManageRack';
import MerchantList from './Pages/Admin/MerchantList';
import UsersList from './Pages/Admin/UsersList';
import AdminHome from './Pages/Admin/AdminHome';
import UserSupportChat from './Pages/UserSupportChat';
import ChatSupport from './Pages/Admin/ChatSupport';
import MerchantChat from './Pages/Merchant/MerchantChat';
import MerchantHistory from './Pages/Merchant/MerchantHistory';
import MerchantSupportChat from './Pages/Merchant/MerchantSupportChat';
import Landing from './Pages/Landing';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Landing />}/>
            <Route path="/rack-store" element={<Home />} />

            <Route path="/cart" element={<Cart />}/>
            <Route path="/order-placed" element={<OrderPlaced />}/>
            <Route path="/transaction-error" element={<ErrorTransaction />}/>

            <Route path="/login" element={<LoginSignup />}/>
            <Route path="/signup" element={<Signup />}/>

            <Route path="/merchant-signup" element={<MerchantSignup />}/>
            <Route path="/merchant-orders" element={<MerchantOrders />}/>
            <Route path="/merchant-create" element={<ItemCreate />}/>
            <Route path="/merchant-manage" element={<ManageMerchantRack />}/>
            <Route path="/merchant-history" element={<MerchantHistory />}/>



            {/* <Route path="/admin-orders" element={<DisplayOrders />}/> */}
            <Route path="/admin-home" element={<AdminHome />}/>
            <Route path="/admin-manage" element={<ManageRack />}/>
            <Route path="/merchants-list" element={<MerchantList />}/>
            <Route path="/users-list" element={<UsersList />}/>

            <Route path="/admin-signup" element={<AdminSignup />}/>

            <Route path="/history" element={<History />}/>


            <Route path="/chat" element={<UserSupportChat />}/>
            <Route path="/help-support" element={<MerchantSupportChat />}/>

            <Route path="/chat-users" element={<ChatSupport />}/>
            <Route path="/merchant-chat" element={<MerchantChat />}/>








          </Route>

        

        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
