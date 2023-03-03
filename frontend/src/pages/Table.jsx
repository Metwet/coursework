import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import {useNavigate } from "react-router-dom";
import BackButton from "../common/BackButton";
import Header from "../common/Header";
import base_url from "../shared/constants";
import logoUnblock from "../img/unblock.svg";
import logoDelete from "../img/delete.svg";

const Table = ()=> {
    const [data, setData] = useState([])
    const navigate = useNavigate();

    axios.defaults.withCredentials = true;

    const fetchAllData = async ()=>{
        try {
            const res = await axios.get(`${base_url}/table/`)
            setData(res.data);
        } catch(err) {
            console.log(err);
        }
    }

    useEffect(()=>{
        fetchAllData();

        axios.get(`${base_url}/login`).then((response)=>{
            if (response.data.loggedIn){
                if(response.data.user[0].ban_status) navigate("/login");
            } else {
                navigate("/login");
            }
        })
    }, []);

    const handleCheck = (e) =>{
        const { name, checked } = e.target;
        if (name === "allSelect") {
            let tempUser = data.map((user) => {
                return { ...user, isChecked: checked };
            });
            setData(tempUser);
        } else {
            let tempUser = data.map((user) =>
                user.id == name ? { ...user, isChecked: checked } : user
            );
            setData(tempUser);
        }
    }

    const handleDelete = (data)=>{      
        data.forEach((i)=>{
            if(i.isChecked) {
                axios.delete(`${base_url}/table/`+i.id);
            }              
        })
        fetchAllData();
    }

    const handleBlock = (data)=>{
        data.forEach((i)=>{
            if(i.isChecked) {
                axios.put(`${base_url}/table/`+i.id, {
                    ban_status: true
                });
            }              
        })
        fetchAllData();
    }

    const handleUnblock = (data)=>{
        console.log("in handleBan")
        data.forEach((i)=>{
            if(i.isChecked) {
                axios.put(`${base_url}/table/`+i.id, {
                    ban_status: false
                });
            }              
        })
        fetchAllData();
    }


    return (
        <div>
            <div className="container mycontent ">
                <div className="d-flex justify-content-between block_back btnBlock">
                    <BackButton />
                </div>
                <form action="get">
                    <div className="row title">
                        <div className="col">
                            <h1>Table</h1>
                        </div>
                    </div>
                    <div className="row toolbar">
                        <div className="col">
                            <button type="button" className="btn btn-danger mybtn" onClick={()=>handleBlock(data)}>Block</button>
                            <button type="button" className="btn btn-success mybtn" onClick={()=>handleUnblock(data)}><img src={logoUnblock} alt="unblock"></img></button>
                            <button type="button" className="btn btn-warning mybtn" onClick={()=>handleDelete(data)}><img src={logoDelete}></img></button>
                        </div>
                    </div>
                    <div className="row headline border">
                        <div className="col-1 checkAll">
                            <input type="checkbox" 
                              className="form-check-input" 
                              name="allSelect" 
                              checked={!data.some((user) => user?.isChecked !== true)} 
                              onChange={handleCheck}
                            />
                        </div>
                        <div className="col-1">id</div>
                        <div className="col-2">name</div>
                        <div className="col-2">email</div>
                        <div className="col-2">date of reg</div>
                        <div className="col-2">date of last log</div>
                        <div className="col-2">status</div>
                    </div>
                    <div className="row">
                        <div className="table">
                            {data.map((data)=>(
                                <div className="user row" key={data.id}>
                                    <div className="col-1 check_all">
                                        <input 
                                          type="checkbox" 
                                          className="form-check-input"
                                          name={data.id}
                                          checked={data?.isChecked || false} 
                                          onChange={handleCheck} 
                                        />
                                    </div>
                                    <div className="col-1">
                                        <label className="form-check-label">{data.id}</label>
                                    </div>
                                    <div className="col-2">{data.name}</div>
                                    <div className="col-2">{data.email}</div>
                                    <div className="col-2">{data.reg_date}</div>
                                    <div className="col-2">{data.login_date}</div>
                                    <div className="col-2">{data.ban_status&&"blocked"||"not blocked"}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Table