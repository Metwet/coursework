import React from "react";
import axios from "axios";
import { useState } from "react";
import {useNavigate } from "react-router-dom";
import { useEffect } from "react";
import noPoster from "../img/noposter.png";
import logoDelete from "../img/delete.svg";
import logoChande from "../img/wheel.svg";
import { useParams } from 'react-router-dom';


const Collection = ()=> {
    const [isEditing, setIsEditing] = useState(false);
    const { id } = useParams();
    const [data, setData] = useState({})
    const navigate = useNavigate()

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [theme, setTheme] = useState('1');

    useEffect(()=>{
        const fetchAllData = async ()=>{
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/collections/${id}`)
                setData(res.data);
                setName(res.data.name);
                setDescription(res.data.description);
                setTheme(res.data.theme_id);
            } catch(err) {
                console.log(err);
            }
        }
        fetchAllData();
    }, []);


    const handleDelete = (data)=>{ 
        axios.delete(`${process.env.REACT_APP_API_BASE_URL}/collections/`+data.id);   
        console.log(data) 
        navigate("/");
    }

    const handleChange = (data)=>{
        setIsEditing(true);
    }

    const handleCancel = () => {
        setIsEditing(false);
        setName(data.name);
        setDescription(data.description);
        setTheme(data.theme_id);
    };
    
    const handleSave = () => {
        axios.put(`${process.env.REACT_APP_API_BASE_URL}/collections/${id}`, { name, description, theme })
          .then(() => {
            setIsEditing(false);
            window.location.reload()
          })
          .catch((err) => {
            console.log(err);
          });
    };

    if (isEditing) {
        return (
            <div className="container">
                <h1> Change data of collection "{data.name}"</h1>
                <label className="form-label">  Collection name:
                    <input className="form-control" type="text" value={name} onChange={event => setName(event.target.value)} />
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
                <div className="btnBlock">
                    <button className="btn btn-success btnTable" onClick={handleSave}>Save</button>
                    <button className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
                </div>
            </div>
        );
    } else {
        return (
            <div className="container">
                <h1>Collection "{data.name}"</h1>
                <p>{data.description}</p>
                <p className="text">Theme: {data.theme}</p>
                <div className="buttonCard">
                    <button type="button" className="btn btn-danger btnTable" onClick={()=>handleDelete(data)}><img src={logoDelete}></img></button>
                    <button type="button" className="btn btn-warning btnTable" onClick={()=>handleChange(data)}><img src={logoChande}></img></button>
                </div>
            </div>
        )
    }
    
}

export default Collection