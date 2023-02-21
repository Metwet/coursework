import React from "react";
import axios from "axios";
import { useState } from "react";
import {useNavigate } from "react-router-dom";
import { useEffect } from "react";


const Signup = ()=> {
    const [data, setData] = useState ({
        username: "",
        email: "",
        password: ""
    });

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    axios.defaults.withCredentials = true;

    const handleChange  = (e)=> {
        setData ((prev)=>({...prev, [e.target.name]: e.target.value}));
        if(e.target.name=="email")
        setEmail(e.target.value)
        if(e.target.name=="password")
        setPassword(e.target.value)
    };

    const handelClick = (e)=>{
        e.preventDefault()
        console.log(process.env.REACT_APP_API_BASE_URL)
        axios.post(`${process.env.REACT_APP_API_BASE_URL}/`, data);
        axios.post(`${process.env.REACT_APP_API_BASE_URL}/login`, {
                email: email,
                password: password
            }).then((response)=>{
                if(!response.data.auth){
                } else {
                    navigate("/table");
                }
            })
    }

    const handelClickSecond = ()=>{navigate("/login")}

    return (
        <div>
            <div className="container mycontent d-flex align-items-center justify-content-center">
                <form className="row g-3" method="post">
                    <div className="row title">
                        <div className="col">
                            <h1>Sign up</h1>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-3">
                            <label for="inputUsername" className="form-label">Username</label>
                            <input type="text" className="form-control" name="username" onChange={handleChange} id="inputUsername" />
                        </div>
                        <div className="col-3">
                            <label for="inputEmail" className="form-label">Email address</label>
                            <input type="email" className="form-control" name="email" onChange={handleChange} id="inputEmail" />
                        </div>
                        <div className="col-3">
                            <label for="inputPassword" className="form-label">Password</label>
                            <input type="password" className="form-control" name="password" onChange={handleChange} id="inputPassword" />
                        </div>
                    </div>
                    <div className="row btnBlock align-items-center">
                        <div className="col">
                            <button type="submit" className="btn btn-primary btnTable" onClick={handelClick}>sign up</button>
                            <button type="submit" className="btn btn-secondary" onClick={handelClickSecond}>log in</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Signup