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
import Collections from "./pages/Collections";
import Collection from "./pages/Collection";

function App() {

  const [movedToken, setToken] = useState('netoken');
  const updateToken  = (value)=>{
      setToken(value);
  }

  return (
    <div className="App">
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Collections/>}/>
                <Route path="/collection/:id" element={<Collection/>}/>
                <Route path="/main" element={<Main/>}/>
                <Route path="/signup" element={<Signup/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/table" element={<Table/>}/>
            </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;