import React from 'react';
import { useNavigate } from 'react-router-dom';

function Header() {
    const navigate = useNavigate();

    const handelLogout = (e)=>{
        localStorage.removeItem("crutchLogin");
        window.location.reload();
    }
    if(localStorage.getItem("crutchLogin") !== null) {
        return (
            <div>
                <button type="submit" className="btn btn-info mybtn" onClick={(e)=>{handelLogout()}}>log out</button>
            </div>
        )
    } else {
        return (
            <div>
                <button type="submit" className="btn btn-info mybtn" onClick={()=>{navigate("/signup")}}>sign up</button>
                <button type="submit" className="btn btn-info mybtn" onClick={()=>{navigate("/login")}}>log in</button>
            </div>
        );
    }
}

export default Header;