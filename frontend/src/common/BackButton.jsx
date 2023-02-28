import React from 'react';
import { useNavigate } from 'react-router-dom';

function BackButton() {
    const navigate = useNavigate();

    return (
        <div className="d-flex justify-content-between">
            <button className="btn btn-primary ms-auto mybtn" onClick={()=>{navigate(-1)}}>Back</button>
        </div>
    );
}

export default BackButton;