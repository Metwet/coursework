import React from "react";
import axios from "axios";
import { useState } from "react";
import {useNavigate } from "react-router-dom";
import { useEffect } from "react";
import noPoster from "../img/noposter.png";
import logoDelete from "../img/delete.svg";
import logoChande from "../img/wheel.svg";
import { useParams } from 'react-router-dom';
import BackButton from "../shared/components/BackButton";
import Header from "../shared/components/Header";
import base_url from "../shared/constants";


const Item = ()=> {
    const [isEditing, setIsEditing] = useState(false);
    const { id } = useParams();
    const [item, setItem] = useState({})
    const navigate = useNavigate()

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState([]);

    const [user, setUser] = useState({});

    const fetchItem = async ()=>{
        try {
            const res = await axios.get(`${base_url}/item/${id}`)
            setItem(res.data[0]);
            setTitle(res.data[0].title);
            setDescription(res.data[0].description);
            setTags(res.data[0].tags);
        } catch(err) {
            console.log(err);
        }
    }

    useEffect(()=>{
        fetchItem();
        if(localStorage.getItem("crutchLogin") !== null){
            const showLogin = JSON.parse(localStorage.getItem("crutchLogin"));
            setUser(showLogin)
        }
    }, []);


    const handleDelete = (item)=>{ 
        axios.delete(`${base_url}/item/${id}`);   
        console.log(item) 
        navigate(-1);
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
                    <button className="btn btn-success mybtn" onClick={handleSave}>Save</button>
                    <button className="btn btn-secondary mybtn" onClick={handleCancel}>Cancel</button>
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
                    {tags.length > 0 && <div className="card-text  d-flex flex-row align-self-center"> Tags: {tags.map((tag, index)=>(
                        <span className="card mytag" key={index}> {tag} </span>
                    ))}</div>}
                    {user.id === item.user_id && <div className="btnBlock">
                        <button type="button" className="btn btn-danger mybtn" onClick={()=>handleDelete(item)}><img src={logoDelete}></img></button>
                        <button type="button" className="btn btn-warning mybtn" onClick={()=>handleChange(item)}><img src={logoChande}></img></button>
                    </div>}
                </div>
            </div>
        )
    }
    
}

export default Item