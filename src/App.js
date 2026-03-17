import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar"
import Footer from "./components/Footer";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import UpdatePassword from "./pages/UpdatePassword";
import ForgetPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";
import Transactions from "./pages/Transactions";
import Transfer from "./pages/Transfer";
import AuditorDashBoard from "./pages/AuditorDashBoard";
import { CustomerRoute,AuditorRoute } from "./services/Guard";


function App() {
  return (
    <BrowserRouter>
      <NavBar />

      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Home />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/reset-password"   element={<ResetPassword />} />


        <Route path="/profile" element={<CustomerRoute element={<Profile/>} />} />
        <Route path="/change-password" element={<CustomerRoute element={<UpdatePassword />} />} />
        <Route path="/transactions" element={<CustomerRoute element={<Transactions />}/>} />
        <Route path="/transfer" element={<CustomerRoute element={<Transfer />} />} />
        <Route path="/audit" element={<AuditorRoute element={<AuditorDashBoard />}/>} />


        <Route path="*" element={<NotFound />} />

      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
