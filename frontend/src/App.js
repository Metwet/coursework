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
import Item from "./pages/Item";

function App() {

  return (
    <div className="App">
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Main/>}/>
                <Route path="/collections" element={<Collections/>}/>
                <Route path="/collection/:id" element={<Collection/>}/>
                <Route path="/item/:id" element={<Item/>}/>
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