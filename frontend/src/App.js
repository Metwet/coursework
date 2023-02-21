import {
  BrowserRouter,
  Routes,
  Route,
  createBrowserRouter,
  RouterProvider,
  useNavigate
} from "react-router-dom";

import Main from "./pages/Main";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Table from "./pages/Table";
import "./style.css";
import { useState } from "react";

function App() {

  const [movedToken, setToken] = useState('netoken');
  const updateToken  = (value)=>{
      setToken(value);
  }

  return (
    <div className="App">
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Main/>}/>
                <Route path="/signup" element={<Signup/>}/>
                <Route path="/login" element={<Login updateToken={updateToken}/>}/>
                <Route path="/table" element={<Table movedToken={movedToken}/>}/>
            </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;