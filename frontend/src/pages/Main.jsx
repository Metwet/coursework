import React from "react";
import axios from "axios";
import { useState } from "react";
import {useNavigate } from "react-router-dom";
import { useEffect } from "react";
import noPoster from "../img/noposter.png";
import logoDelete from "../img/delete.svg";


const Main = ()=> {
    const [data, setData] = useState([])

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    useEffect(()=>{
        const fetchAllData = async ()=>{
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/`)
                setData(res.data);
            } catch(err) {
                console.log(err);
            }
        }
        fetchAllData();

    }, []);
  
    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post(`${process.env.REACT_APP_API_BASE_URL}/`, { title, description }).then(response => {
            console.log(response.data);
            window.location.reload();
        }).catch(error => {
            console.log(error);
        });
    };

    const handleDelete = (data)=>{ 
        axios.delete(`${process.env.REACT_APP_API_BASE_URL}/`+data.id);     
        window.location.reload()
    }

    return (
        <div>
            <div className="container ">
                <h1>Create a new item</h1>
                <form onSubmit={handleSubmit}>
                    <label className="form-label">
                        Title:
                        <input className="form-control" type="text" value={title} onChange={event => setTitle(event.target.value)} />
                    </label>
                    <br />
                    <label className="form-label">
                        Description:
                        <textarea className="form-control" value={description} onChange={event => setDescription(event.target.value)} />
                    </label>
                    <br />
                    <div className="btnBlock">
                        <button className="btn btn-primary" type="submit">add</button>
                    </div>
                </form>
                <div className="cardsBlock">
                    {data.map((data)=>(
                        <div className="card itemCard d-flex justify-content-center align-items-center" key={data.id}>
                            <div className="posterCard">
                                <img src={noPoster} className="card-img-top" alt="poster"></img>
                            </div>
                            <h5 className="card-title">Title: {data.title}</h5>
                            <p className="card-text">Description: {data.description}</p>
                            <div className="buttonCard">
                                <button type="button" className="btn btn-danger btnTable" onClick={()=>handleDelete(data)}><img src={logoDelete}></img></button>
                                <button type="button" className="btn btn-warning btnTable" onClick={()=>handleDelete(data)}><img src={logoDelete}></img></button>
                            </div>
                        </div>                  
                    )).reverse()}
                </div>
            </div>
        </div>
    )
}

export default Main