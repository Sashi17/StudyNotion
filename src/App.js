import "./App.css";
import { Route,Routes, useNavigate } from "react-router-dom";
import OpenRoute from "./components/core/Auth/OpenRoute";
import { Home } from "./pages/Home";
import {Navbar} from "./components/common/Navbar"
import { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import { ForgotPw } from "./pages/ForgotPw";

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
          path="/forgotpw"
          element={
            <OpenRoute>
              <ForgotPw/>
            </OpenRoute>
          }
        />


      </Routes>
    </div>
  );
}

export default App;
