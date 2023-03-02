import React from "react";
import axios from "axios";
import { useState } from "react";
import {useNavigate } from "react-router-dom";
import { useEffect } from "react";
import BackButton from "../common/BackButton";
import Header from "../common/Header";
import base_url from "../shared/constants";


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
        console.log(data)
        axios.post(`${base_url}/signup`, data);
        axios.post(`${base_url}/login`, {
                email: email,
                password: password
            }).then((response)=>{
                if(!response.data.auth){
                } else {
                    navigate("/table");
                }
            })
    }

    return (
        <div className="container">
            <div className="d-flex justify-content-between block_back btnBlock">
                <BackButton />
            </div>
            <div className="mycontent d-flex align-items-center justify-content-center">
                <form className="row g-3" method="post">
                    <div className="row title">
                        <div className="col">
                            <h1>Sign up</h1>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-3">
                            <label htmlFor="inputUsername" className="form-label">Username</label>
                            <input type="text" className="form-control" name="username" onChange={handleChange} id="inputUsername" />
                        </div>
                        <div className="col-3">
                            <label htmlFor="inputEmail" className="form-label">Email address</label>
                            <input type="email" className="form-control" name="email" onChange={handleChange} id="inputEmail" />
                        </div>
                        <div className="col-3">
                            <label htmlFor="inputPassword" className="form-label">Password</label>
                            <input type="password" className="form-control" name="password" onChange={handleChange} id="inputPassword" />
                        </div>
                    </div>
                    <div className="row btnBlock align-items-center">
                        <div className="col">
                            <button type="submit" className="btn btn-primary mybtn" onClick={handelClick}>sign up</button>
                            <button className="btn btn-secondary mybtn" onClick={()=>{navigate("/login")}}>log in</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Signup