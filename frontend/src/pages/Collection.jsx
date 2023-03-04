import React from "react";
import axios from "axios";
import { useState } from "react";
import {useNavigate } from "react-router-dom";
import { useEffect } from "react";
import noPoster from "../img/noposter.png";
import logoDelete from "../img/delete.svg";
import logoDeleteTag from "../img/deletetag.svg";
import logoChande from "../img/wheel.svg";
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import BackButton from "../shared/components/BackButton";
import Header from "../shared/components/Header";
import base_url from "../shared/constants";




const Collection = ()=> {
    const [isEditing, setIsEditing] = useState(false);
    const { id } = useParams();
    const [data, setData] = useState({})
    const navigate = useNavigate()

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [theme, setTheme] = useState('1');

    const [title, setTitle] = useState('');
    const [descriptionItem, setDescriptionItem] = useState('');

    const [tag, setTag] = useState('');
    const [tags, setTags] = useState([]);

    const [items, setItems] = useState([]);

    const fetchCollection = async ()=>{
        try {
            const res = await axios.get(`${base_url}/collections/${id}`)
            setData(res.data);
            setName(res.data.name);
            setDescription(res.data.description);
            setTheme(res.data.theme_id);
        } catch(err) {
            console.log(err);
        }
    }

    const fetchAllItems = async ()=>{
        try {
            const res = await axios.get(`${base_url}/items/${id}`)
            setItems(res.data);
        } catch(err) {
            console.log(err);
        }
    }

    useEffect(()=>{    
        fetchCollection();
        fetchAllItems();
    }, []);


    const handleDelete = (data)=>{ 
        axios.delete(`${base_url}/collections/`+data.id);   
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
        axios.put(`${base_url}/collections/${id}`, { name, description, theme })
          .then(() => {
            setIsEditing(false);
            fetchCollection();
            fetchAllItems();
          })
          .catch((err) => {
            console.log(err);
          });
    };

    const handleCreateItem = (event) => {
        event.preventDefault();
        axios.post(`${base_url}/items`, { title, descriptionItem, id, tags}).then(response => {
            console.log(response.data);
            fetchAllItems();
        }).catch(error => {
            console.log(error);
        });
    };

    const handleAddTag = (event) => {
        event.preventDefault();
        if (!tag) {
            return;
        }
        
        if (tags.includes(tag)) {
            alert("This tag already exists");
            setTag('');
            return;
        }
        setTag('');
        setTags([...tags, tag]);
    }

    const handleDeleteTeg = (index) =>{
        setTags(tags.filter((_, i) => i !== index))
    }

    if (isEditing) {
        return (
            <div className="container mycontainer">
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
                    <button className="btn btn-success mybtn" onClick={handleSave}>Save</button>
                    <button className="btn btn-secondary mybtn" onClick={handleCancel}>Cancel</button>
                </div>
            </div>
        );
    } else {
        return (
            <div className="container">
                <div className="d-flex justify-content-between block_back btnBlock">
                    <Header />
                    <BackButton />
                </div>
                <div className="mycontainer collection_container ">
                    <div className="row collection_header">
                        <div className="col-3 poster_space">
                            <div className="posterCard">
                                <img src={noPoster} className="card-img-top" alt="poster"></img>
                            </div>
                        </div>
                        <div className="col-9 collection_about">
                            <h1>Collection "{data.name}"</h1>
                            <p>{data.description}</p>
                            <p className="text">Theme: {data.theme}</p>
                            <div className="btnBlock">
                                <button type="button" className="btn btn-danger mybtn" onClick={()=>handleDelete(data)}><img src={logoDelete}></img></button>
                                <button type="button" className="btn btn-warning mybtn" onClick={()=>handleChange(data)}><img src={logoChande}></img></button>
                            </div>
                        </div>
                    </div>
                    <div className="itemsBlock">
                        <div className= "row">
                            <div className = "col-8">
                            <h3>Items:</h3>
                            {items.map((item)=>(
                                <div className="card itemCard d-flex justify-content-center align-items-center" key={item.id}>
                                    <Link to={`/item/${item.id}`}>
                                        <h5 className="card-title">Title: {item.title}</h5>
                                    </Link>
                                    <p className="card-text">Description: {item.description}</p>
                                    <p className="card-text"> Collection is "{item.name}"</p>
                                    {item.tagname[0] && <div className="card-text  d-flex flex-row align-self-center"> Tags: {item.tagname.map((tag)=>(
                                        <span className="card mytag"> {tag} </span>
                                    ))}</div>}
                                </div>
                            )).reverse()}
                            </div>
                            <div className = "col-4">
                                <h3>Create a new item</h3>
                                <form onSubmit={handleCreateItem}>
                                    <label className="form-label">
                                        Title:
                                        <input className="form-control" type="text" value={title} onChange={event => setTitle(event.target.value)} />
                                    </label>
                                    <br />
                                    <label className="form-label">
                                        Description:
                                        <textarea className="form-control" value={descriptionItem} onChange={event => setDescriptionItem(event.target.value)} />
                                    </label>
                                    <br />
                                    <label className="form-label">
                                        Add tag:
                                        <input className="form-control" type="text" value={tag} onChange={event => setTag(event.target.value)} />                                    
                                    </label>
                                    <button className="btn btn-success mybtn" onClick={handleAddTag}>+</button>
                                    <br />
                                    <div className="showTags d-flex">
                                        {tags.map((tag, index)=>(
                                            <div className="mytag card d-flex flex-row align-self-center" key={index}>
                                                <span className="me-2">{tag}</span>
                                                <button type="button" className="btn btn-danger d-flex align-items-center justify-content-center" onClick={() => handleDeleteTeg(index)}>
                                                    <img src={logoDeleteTag} alt="delete" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <br />
                                    <div className="btnBlock">
                                        <button className="btn btn-success mybtn" type="submit">add</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    
}

export default Collection