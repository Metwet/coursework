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

app.delete("/:id", (req, res)=>{
    console.log("tyt")
    const userId = req.params.id;
    const q = "DELETE FROM items WHERE id = ?";
    connection.query(q, [userId], (err, data) => {
        if(err) return res.json(err);
        return res.json("Row has been deleted successfully!");
    });
})

// CRUD collections

app.get("/collections", (req, res)=> {
    const q = `SELECT collections.id, collections.name, collections.description, themes.theme 
    FROM collections
    INNER JOIN themes ON collections.theme_id = themes.id;`
    connection.query(q, (err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
})

app.get('/collections/:id', (req, res) => {
    const id = req.params.id;
    const query = `SELECT collections.id, collections.name, collections.description, collections.theme_id, themes.theme 
    FROM collections
    INNER JOIN themes ON collections.theme_id = themes.id
    WHERE collections.id = ${id};`
  
    connection.query(query, (error, results, fields) => {
      if (error) {
        console.log(error);
        res.status(500).send('Error retrieving data from database');
        return;
      }
      res.send(results[0]);
    });
});

app.post("/collections", (request, response)=> {
    if(!request.body) return response.sendStatus(400);
    console.log(request.body);
    try {
        const q = `INSERT INTO collections (name, description, theme_id) VALUES('${request.body.title}', '${request.body.description}', '${request.body.theme}')`;
        connection.query(q, (err, results)=>{
            if(err) return results.json(err);
            response.json({message: 'Данные отправлены'})
        });
    } catch (error) {
        console.log(error);
        response.status(500).json({ message: 'Ошибка сервера' });
    }
    
});

app.delete("/collections/:id", (req, res)=>{
    const userId = req.params.id;
    const q = "DELETE FROM collections WHERE id = ?";
    connection.query(q, [userId], (err, data) => {
        if(err) return res.json(err);
        return res.json("Row has been deleted successfully!");
    });
})

app.put('/collections/:id', (req, res) => {
    const id = req.params.id;
    const { name, description, theme } = req.body;
    const q = `UPDATE collections SET name=?, description=?, theme_id=? WHERE id=?`;
  
    connection.query(q, [name, description, theme, id], (err, result) => {
      if (err) {
        return res.status(400).json(err);
      }
  
      return res.status(200).json({ message: `Collection with id ${id} has been updated successfully.` });
    });
});

// CRUD items

app.get("/items/:id", (req, res)=> {
    const id = req.params.id;
    const q = `SELECT items.*, collections.name
    FROM items
    INNER JOIN collections ON items.collection_id = collections.id
    WHERE items.collection_id =  ${id};`
    connection.query(q, (err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
})

app.get("/item/:id", (req, res)=> {
    const id = req.params.id;
    const q = `SELECT items.*, collections.name
    FROM items
    INNER JOIN collections ON items.collection_id = collections.id
    WHERE items.id =  ${id};`
    connection.query(q, (err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
})

app.post("/items", (request, response)=> {
    if(!request.body) return response.sendStatus(400);
    try {
        const q = `INSERT INTO items (title, description, collection_id) VALUES('${request.body.title}', '${request.body.descriptionItem}', '${request.body.id}')`;
        connection.query(q, (err, results)=>{
            if(err) return results.json(err);
        });
        response.json({message: 'Данные отправлены'})
    } catch (error) {
        console.log(error);
        response.status(500).json({ message: 'Ошибка сервера' });
    }
    
});

app.delete("/item/:id", (req, res)=>{
    const userId = req.params.id;
    const q = "DELETE FROM items WHERE id = ?";
    connection.query(q, [userId], (err, data) => {
        if(err) return res.json(err);
        return res.json("Row has been deleted successfully!");
    });
})

app.put('/item/:id', (req, res) => {
    const id = req.params.id;
    const { title, description } = req.body;
    const q = `UPDATE items SET title=?, description=? WHERE id=?`;
  
    connection.query(q, [title, description, id], (err, result) => {
      if (err) {
        return res.status(400).json(err);
      }
  
      return res.status(200).json({ message: `Item with id ${id} has been updated successfully.` });
    });
});

// signup & login

app.get('/signup', (req, res)=>{
    if(req.session.user){
        res.send({loggedIn: true, user: req.session.user})
    } else {
        res.send({loggedIn: false})
    }
});

app.post("/signup", function (request, response) {
    if(!request.body) return response.sendStatus(400);

    const date = new Date();
    const registrationDate = date.toISOString().slice(0, 18);
    const data = [registrationDate];
    
    const q = `INSERT INTO users(name, email, password, reg_date, login_date) VALUES('${request.body.username}', '${request.body.email}', '${request.body.password}', '${data}', '${data}')`;
 
    connection.query(q, (err, results)=>{
        if(err) return results.json(err);
        console.log("user created")
    });

});

app.get('/login', (req, res)=>{
    if(req.session.user){
        const id = req.session.user.id;
        const token = jwt.sign({id}, "jwtSecret", {
            expiresIn: 300,
        })

        const q = `SELECT * FROM users WHERE id = ?`;
        connection.query(q, [req.session.user[0].id], function(error, results) {
            if (error) throw error;
            if (results.length>0){
                req.session.user = results;
                res.json({loggedIn: true, user: req.session.user, auth: true, token: token});
            } else {
                res.send({loggedIn: false, message: "DELETE"})
            }
        });
    } else {
        res.send({loggedIn: false, message: "no user exists"})
    }
});

app.post("/login", (req, res)=>{
    const email = req.body.email;
    const password = req.body.password;
    const q = "SELECT * FROM users WHERE email = ? AND password = ?";

    connection.query(q, [email, password], (error, result)=>{
        if(error){
            res.send({error: error});
        }
        if(result.length > 0){
            if(result[0].password == password){
                const id = result[0].id;
                const token = jwt.sign({id}, "jwtSecret", {
                    expiresIn: 300,
                })
                req.session.user = result;
                res.json({auth: true, token: token, result: result});

                const date = new Date();
                const registrationDate = date.toISOString().slice(0, 18);

                const sql = `UPDATE users SET login_date = ? WHERE id = ?`;
                const data = [registrationDate, id];
                connection.query(sql, data, function (err, result) {
                    if (err) throw err;
                });
            }     
        }else{
            res.json({auth: false, message: "no user exists"})
        }   
    })
})

app.get("/table", (req, res)=>{
    const q = "SELECT * FROM users"
    connection.query(q, (err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
})

app.delete("/table/:id", (req, res)=>{
    const userId = req.params.id;
    const q = "DELETE FROM users WHERE id = ?";
    connection.query(q, [userId], (err, data) => {
        if(err) return res.json(err);
        return res.json("Row has been deleted successfully!");
    });
})

app.put("/table/:id", (req, res)=>{
    const userId = req.params.id;
    const status = req.body.ban_status;
    const q = "UPDATE users SET ban_status = ? WHERE id = ?";
    connection.query(q, [status, userId], (err, data) => {
        if(err) return res.json(err);
        return res.json("Row has been baned successfully!");
    });
})