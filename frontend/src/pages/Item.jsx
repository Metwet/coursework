import React from "react";
import axios from "axios";
import { useState } from "react";
import {useNavigate } from "react-router-dom";
import { useEffect } from "react";
import noPoster from "../img/noposter.png";
import logoDelete from "../img/delete.svg";
import logoChande from "../img/wheel.svg";
import { useParams } from 'react-router-dom';
import BackButton from "../common/BackButton";
import base_url from "../shared/constants";


const Item = ()=> {
    const [isEditing, setIsEditing] = useState(false);
    const { id } = useParams();
    const [item, setItem] = useState({})
    const navigate = useNavigate()

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const fetchItem = async ()=>{
        try {
            const res = await axios.get(`${base_url}/item/${id}`)
            setItem(res.data[0]);
            setTitle(res.data[0].title);
            setDescription(res.data[0].description);
        } catch(err) {
            console.log(err);
        }
    }

    useEffect(()=>{
        fetchItem();
    }, []);


    const handleDelete = (item)=>{ 
        axios.delete(`${base_url}/item/${id}`);   
        console.log(item) 
        navigate("/");
    }

    const handleChange = ()=>{
        setIsEditing(true);
    }

    const handleCancel = () => {
        setIsEditing(false);
        setTitle(item.title);
        setDescription(item.description);
    };
    
    const handleSave = () => {
        axios.put(`${base_url}/item/${id}`, { title, description })
          .then(() => {
            setIsEditing(false);
            fetchItem();
          })
          .catch((err) => {
            console.log(err);
          });
    };

    if (isEditing) {
        return (
            <div className="container mycontainer">
                <h1> Change data of item "{item.title}"</h1>
                <label className="form-label">  Item title:
                    <input className="form-control" type="text" value={title} onChange={event => setTitle(event.target.value)} />
                </label> 
                <br />
                <label className="form-label">
                    Description:
                    <textarea className="form-control" value={description} onChange={event => setDescription(event.target.value)} />
                </label>
                <br />
                <div className="btnBlock">
                    <button className="btn btn-success btnTable" onClick={handleSave}>Save</button>
                    <button className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
                </div>
            </div>
        );
    } else {
        return (
            <div className="container">
                <BackButton />
                <div className="mycontainer item_container">
                    <h1>Item "{item.title}"</h1>
                    <p>{item.description}</p>
                    <p>Collection is "{item.name}"</p>
                    <div className="btnBlock">
                        <button type="button" className="btn btn-danger btnTable" onClick={()=>handleDelete(item)}><img src={logoDelete}></img></button>
                        <button type="button" className="btn btn-warning btnTable" onClick={()=>handleChange(item)}><img src={logoChande}></img></button>
                    </div>
                </div>
            </div>
        )
    }
    
}

export default Item