import React from "react";
import axios from "axios";
import { useState } from "react";
import {useNavigate } from "react-router-dom";
import { useEffect } from "react";
import noPoster from "../img/noposter.png";
import logoDelete from "../img/delete.svg";
import logoChande from "../img/wheel.svg";
import { useParams } from 'react-router-dom';


const Item = ()=> {
    const [isEditing, setIsEditing] = useState(false);
    const { id } = useParams();
    const [data, setData] = useState({})
    const navigate = useNavigate()

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [theme, setTheme] = useState('1');

    const [items, setItems] = useState([]);

    useEffect(()=>{
        // const fetchAllData = async ()=>{
        //     try {
        //         const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/collections/${id}`)
        //         setData(res.data);
        //         setName(res.data.name);
        //         setDescription(res.data.description);
        //         setTheme(res.data.theme_id);
        //     } catch(err) {
        //         console.log(err);
        //     }
        // }
        // fetchAllData();
    }, []);


    const handleDelete = (data)=>{ 
        // axios.delete(`${process.env.REACT_APP_API_BASE_URL}/collections/`+data.id);   
        // console.log(data) 
        // navigate("/");
    }

    const handleChange = (data)=>{
        // setIsEditing(true);
    }

    const handleCancel = () => {
        // setIsEditing(false);
        // setName(data.name);
        // setDescription(data.description);
        // setTheme(data.theme_id);
    };
    
    const handleSave = () => {
        // axios.put(`${process.env.REACT_APP_API_BASE_URL}/collections/${id}`, { name, description, theme })
        //   .then(() => {
        //     setIsEditing(false);
        //     window.location.reload()
        //   })
        //   .catch((err) => {
        //     console.log(err);
        //   });
    };

    if (isEditing) {
        return (
            <div className="container">
                <h1>Change Item</h1>
            </div>
        );
    } else {
        return (
            <div className="container">
                <h1>Item</h1>
            </div>
        )
    }
    
}

export default Item