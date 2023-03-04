import React from "react";
import axios from "axios";
import { useState } from "react";
import {useNavigate } from "react-router-dom";
import { useEffect } from "react";
import noPoster from "../img/noposter.png";
import { Link } from 'react-router-dom';
import base_url from "../shared/constants";
import Header from "../shared/components/Header";


const Main = ()=> {
    const [items, setItems] = useState([])
    const [collections, setCollections] = useState([])
    const [user, setUser] = useState({})
    const navigate = useNavigate()

    const fetchUser = async ()=> {
        try {
            const res = await axios.get(`${base_url}/authorization`)
            console.log(res.data[0]);
            setUser(res.data[0]);
        } catch(err) {
            console.log(err);
        }
    }

    const fetchAllCollections = async ()=>{
        try {
            const res = await axios.get(`${base_url}/collections`)
            setCollections(res.data);
        } catch(err) {
            console.log(err);
        }
    }

    const fetchAllItems = async ()=>{
        try {
            const res = await axios.get(`${base_url}/main/items`);
            setItems(res.data);
        } catch(err) {
            console.log(err);
        }
    }

    useEffect(()=>{
        fetchUser();
        fetchAllCollections();
        fetchAllItems();
    }, []);

    return (
        <div className="container ">
            <div className="d-flex justify-content-between block_back btnBlock">
                <Header />
            </div>
            <div className="mycontainer">
                <div className="d-flex justify-content-between">
                    <h2>Hello {user.name}</h2>
                    <button type="submit" className="btn btn-primary mybtn ms-auto" onClick={()=>{navigate("/collections")}}>My collections</button>
                </div>
                <div className="items_main_block">
                    <h2>All items:</h2>
                    <div className="row">
                        {items && items.map((item)=>(
                            <div className="col-sm-6 col-md-4 col-lg-3 d-flex" key={item.id}>
                                <div className="card itemCard d-flex justify-content-top align-items-center">
                                    <Link to={`/item/${item.id}`}>
                                            <h5 className="card-title">{item.title}</h5>
                                    </Link>
                                    <p className="card-text">Description: {item.description}</p>
                                    <p className="card-text">Tags: {item.tag_ids}</p>
                                </div>
                            </div>                  
                        )).reverse()}
                    </div>                   
                </div>
                <div className="collectionsBlock row">
                    <h2>Collections:</h2>
                    {collections && collections.map((collection)=>(
                        <div className="col-sm-6 col-md-4 col-lg-3 d-flex" key={collection.id}>
                            <div className="card itemCard d-flex justify-content-top align-items-center">
                                <div className="posterCard">
                                    <img src={noPoster} className="card-img-top" alt="poster"></img>
                                </div>
                                <Link to={`/collection/${collection.id}`}>
                                    <h5 className="card-title">{collection.name}</h5>
                                </Link>
                                <p className="card-text">Description: {collection.description}</p>
                                <p className="card-text">Theme: {collection.theme}</p>
                            </div>
                        </div>                  
                    )).reverse()}
                </div>
            </div>
        </div>
    )
}

export default Main