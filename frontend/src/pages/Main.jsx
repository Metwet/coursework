import React from "react";
import axios from "axios";
import { useState } from "react";
import {useNavigate } from "react-router-dom";
import { useEffect } from "react";
import noPoster from "../img/noposter.png";
import logoDelete from "../img/delete.svg";
import { Link } from 'react-router-dom';
import base_url from "../shared/constants";
import BackButton from "../common/BackButton";
import Header from "../common/Header";


const Main = ()=> {
    const [items, setItems] = useState([])
    const [collections, setCollections] = useState([])
    const navigate = useNavigate()

    const fetchAllCollections = async ()=>{
        try {
            const res = await axios.get(`${base_url}/main/collections`)
            setCollections(res.data);
        } catch(err) {
            console.log(err);
        }
    }

    const fetchAllItems = async ()=>{
        try {
            const res = await axios.get(`${base_url}/main/items`)
            setItems(res.data);
        } catch(err) {
            console.log(err);
        }
    }

    useEffect(()=>{    
        fetchAllCollections();
        fetchAllItems();
    }, []);

    return (
        <div className="container ">
            <div className="d-flex justify-content-between block_back btnBlock">
                <Header />
            </div>
            <div className="mycontainer">
                <button type="submit" className="btn btn-primary mybtn" onClick={()=>{navigate("/collections")}}>My collections</button>
                <div className="items_main_block row">
                    <h2>All items:</h2>
                    {items && items.map((item)=>(
                        <div className="col-3 card itemCard d-flex justify-content-top align-items-center" key={item.id}>
                            <Link to={`/item/${item.id}`}>
                                    <h5 className="card-title">Title: {item.title}</h5>
                            </Link>
                            <p className="card-text">Description: {item.description}</p>
                            <p className="card-text">Tags: {item.tag_ids}</p>
                        </div>                  
                    )).reverse()}
                </div>
            </div>
        </div>
    )
}

export default Main