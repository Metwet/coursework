import React from "react";
import axios from "axios";
import { useState } from "react";
import {useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Login = ()=> {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [banStatus, setBanStatus] = useState(false);
    const [wrongData, setWrongData] = useState("");


    const navigate = useNavigate();

    axios.defaults.withCredentials = true;

    const handelClick = (e)=>{
        e.preventDefault()
        axios.post(`${process.env.REACT_APP_API_BASE_URL}/login`, {
            email: email,
            password: password
        }).then((response)=>{
            if(!response.data.auth){
                setBanStatus(false);
                setWrongData("Wrong password or email.")
            } else if (response.data.result[0].ban_status) {
                setWrongData("")
                setBanStatus(true);
            } else {
                setBanStatus(false);
                setWrongData("")
                navigate("/table");
            }
        })
    }

    const handelClickSecond = ()=>{navigate("/")}

    return (
        <div>
            <div className="container mycontent d-flex align-items-center justify-content-center">
                <form className="row g-3" method="post">
                    <div className="row title">
                        <div className="col">
                            <h1>Log in</h1>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-3">
                            <label for="inputEmail" className="form-label">Email address</label>
                            <input type="email" className="form-control" name="email" onChange={(e)=>(setEmail(e.target.value))} id="inputEmail" />
                        </div>
                        <div className="col-3">
                            <label for="inputPassword" className="form-label">Password</label>
                            <input type="password" className="form-control" name="password" onChange={(e)=>(setPassword(e.target.value))} id="inputPassword" />
                        </div>
                    </div>
                    <div className="row btnBlock align-items-center">
                        <div className="col">
                            <button type="submit" className="btn btn-primary btnTable" onClick={handelClick}>log in</button>
                            <button type="submit" className="btn btn-secondary" onClick={handelClickSecond}>sign up</button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            {banStatus && "Someone has blocked you. Maybe it was you."}{wrongData}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login