import React from "react";
import axios from "axios";
import { useState } from "react";
import {useNavigate } from "react-router-dom";
import { useEffect } from "react";
import noPoster from "../img/noposter.png";
import logoDelete from "../img/delete.svg";
import logoChande from "../img/wheel.svg";
import { Link } from 'react-router-dom';


const Collections = ()=> {
    const [data, setData] = useState([])

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [theme, setTheme] = useState('1');

    useEffect(()=>{
        const fetchAllData = async ()=>{
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/collections`)
                setData(res.data);
            } catch(err) {
                console.log(err);
            }
        }
        fetchAllData();
    }, []);
    
    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post(`${process.env.REACT_APP_API_BASE_URL}/collections`, { title, description, theme }).then(response => {
            console.log(response.data);
            window.location.reload();
        }).catch(error => {
            console.log(error);
        });
    };

    return (
        <div>
            <div className="container ">
                <h1>Create a new collection</h1>
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
                    <label>
                        Theme:
                        <select className="form-select" value={theme} onChange={(event) => setTheme(event.target.value)}>
                            <option value={1}>Books</option>
                            <option value={2}>Films</option>
                            <option value={3}>Songs</option>
                        </select>
                    </label>
                    <br />
                    <div className="btnBlock">
                        <button className="btn btn-primary" type="submit">add</button>
                    </div>                  
                </form>
                <div className="collectionsBlock">
                    {data && data.map((data)=>(
                        <div className="card itemCard d-flex justify-content-center align-items-center" key={data.id}>
                            <div className="posterCard">
                                <img src={noPoster} className="card-img-top" alt="poster"></img>
                            </div>
                            <Link to={`/collection/${data.id}`}>
                                <h5 className="card-title">Title: {data.name}</h5>
                            </Link>
                            <p className="card-text">Description: {data.description}</p>
                            <p className="card-text">Theme: {data.theme}</p>
                        </div>                  
                    )).reverse()}
                </div>
            </div>
        </div>
    )
}

export default Collections