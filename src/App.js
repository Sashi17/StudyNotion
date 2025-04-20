import "./App.css";
import { Route,Routes } from "react-router-dom";
import OpenRoute from "./components/core/Auth/OpenRoute";
import { Home } from "./pages/Home";
import {Navbar} from "./components/common/Navbar"
import { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import { ForgotPw } from "./pages/ForgotPw";
import { UpdatePw } from "./pages/UpdatePw";
import { VerifyEmail } from "./pages/VerifyEmail";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { MyProfile } from "./components/core/Dashboard/MyProfile";
import { PrivateRoute } from "./components/core/Auth/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import {Error} from "./pages/Error"



function App() {
  //when hover on catalog..(become an instructor) is hidden
  const [hovering, setHovering] = useState(false);

  // const dispatch = useDispatch();
  // const navigate = useNavigate();
  
  // const { user } = useSelector((state) => state.profile)

  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
      <Navbar setHovering={setHovering} />
      <Routes>
        <Route path="/" element={<Home hovering={hovering}/>} />
        
        <Route
          path="/login"
          element={
            <OpenRoute>
              <Login/>
            </OpenRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <OpenRoute>
              <Signup/>
            </OpenRoute>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <OpenRoute>
              <ForgotPw/>
            </OpenRoute>
          }
        />

        <Route
          path="/verify-email"
          element={
            <OpenRoute>
              <VerifyEmail/>
            </OpenRoute>
          }
        />

        <Route
          path="/update-password/:id"
          element={
            <OpenRoute>
              <UpdatePw/>
            </OpenRoute>
          }
        />

        <Route
          path="/about"
          element={
              <About/>
          }
        />

        <Route 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route path="dashboard/my-profile" element={<MyProfile />} />
        </Route>



        <Route path="/contact" element={<Contact />} />








        <Route path="*" element={<Error />} />

      </Routes>
    </div>
  );
}

export default App;
