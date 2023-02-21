import React from "react";
import axios from "axios";
import { useState } from "react";
import {useNavigate } from "react-router-dom";
import { useEffect } from "react";


const Main = ()=> {
    const [data, setData] = useState([])

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


    return (
        <div>
            <div className="container">
                {data.map((data)=>(
                    <div key={data.id}>Hello {data.name}</div>
                ))}
            </div>
        </div>
    )
}

export default Main