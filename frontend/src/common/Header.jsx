import React from 'react';
import { useNavigate } from 'react-router-dom';

function Header() {
    const navigate = useNavigate();

    return (
        <div>
            <button type="submit" className="btn btn-info mybtn" onClick={()=>{navigate("/signup")}}>sign up</button>
            <button type="submit" className="btn btn-info mybtn" onClick={()=>{navigate("/login")}}>log in</button>
        </div>
    );
}

export default Header;