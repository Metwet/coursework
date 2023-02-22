import express from "express";
import mysql from "mysql2";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser  from "cookie-parser";
import sessions  from "express-session";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT;;
app.listen(port, ()=>{
    console.log('Server started');
});

const connection = mysql.createConnection(process.env.DATABASE_URL)
connection.connect(function(err) {
    if (err) throw err;
    console.log("MySQL connected!");
});

app.use(cors({
    origin: [`${process.env.ORIGIN_URL}`],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials:true,
    headers: ["Origin", "X-Requested-With", "Content-Type", "Accept"]
}));
app.use(express.json());

app.get("/", (req, res)=> {
    const q = "SELECT * FROM items"
    connection.query(q, (err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
})

  app.post("/", (request, response)=> {
    if(!request.body) return response.sendStatus(400);
    try {
        const q = `INSERT INTO items (title, description) VALUES('${request.body.title}', '${request.body.description}')`;
        connection.query(q, (err, results)=>{
            if(err) return results.json(err);
        });
        response.json({message: 'Данные отправлены'})
    } catch (error) {
        console.log(error);
        response.status(500).json({ message: 'Ошибка сервера' });
    }
    
});