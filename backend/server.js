import express from "express";
import mysql from "mysql2";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser  from "cookie-parser";
import sessions  from "express-session";
import MySQLStore from 'express-mysql-session';
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

app.use(sessions({
    key: "userId",
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: false,
    cookie: { expires: 60 * 60 * 24, httpOnly: true},
    resave: false
  }));

app.use(cookieParser());

const authorization = (req, res, next) => {
  console.log('in auth function')
  const token = req.cookies.access_token;
  console.log(token);
  console.log(req.cookies);
  if (!token) {
    return res.sendStatus(403);
  }
  try {
    const data = jwt.verify(token, "jwtSecret"); // decrypted from cookie (token)
    req.userId = data.id;
    console.log("test authorization")
    console.log(req.userId)
    //req.userRole = data.role;
    return next();
  } catch {
    return res.sendStatus(403);
  }
};

app.get("/authorization", authorization, (req, res)=> {
  const q = `SELECT * FROM users WHERE id = ${req.userId}`
  connection.query(q, (err,data)=>{
      if(err) return res.json(err)
      return res.json(data)
  })
})

// main page
app.get("/main/items", (req, res)=> {
  const q = `SELECT items.*, collections.name 
    FROM items 
    INNER JOIN collections ON items.collection_id = collections.id;`;
  connection.query(q, (error, results) => {
  if (error) {
  console.log(error);
  return res.status(500).json({ error: "Internal Server Error" });
  }
  const promises = results.map((result) => {
  const tagIds = JSON.parse(result.tag_ids);
  if (tagIds) {
  const query = `SELECT tagname FROM tags WHERE id IN (?)`;
  return new Promise((resolve, reject) => {
  connection.query(query, [tagIds], (err, results) => {
  if (err) reject(err);
  const tagsName = results.map((tag) => tag.tagname);
  const item = {
    id: result.id,
    title: result.title,
    description: result.description,
    name: result.name,
    tags: tagsName,
  };
  resolve(item);
  });
  });
  } else {
  const item = {
  id: result.id,
  title: result.title,
  description: result.description,
  name: result.name,
  tags: [],
  };
  return Promise.resolve(item);
  }
  });
  Promise.all(promises)
  .then((items) => {
  return res.json(items);
  })
  .catch((err) => {
  console.log(err);
  return res.status(500).json({ error: "Internal Server Error" });
  });
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

app.get("/items/:id", (req, res) => {
  const id = req.params.id;
  const q = `SELECT items.*, collections.name 
             FROM items 
             INNER JOIN collections ON items.collection_id = collections.id
             WHERE items.collection_id = ${id};`;
  connection.query(q, (error, results) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    const promises = results.map((result) => {
      const tagIds = JSON.parse(result.tag_ids);
      if (tagIds) {
        const query = `SELECT tagname FROM tags WHERE id IN (?)`;
        return new Promise((resolve, reject) => {
          connection.query(query, [tagIds], (err, results) => {
            if (err) reject(err);
            const tagsName = results.map((tag) => tag.tagname);
            const item = {
              id: result.id,
              title: result.title,
              description: result.description,
              name: result.name,
              tags: tagsName,
            };
            resolve(item);
          });
        });
      } else {
        const item = {
          id: result.id,
          title: result.title,
          description: result.description,
          name: result.name,
          tags: [],
        };
        return Promise.resolve(item);
      }
    });
    Promise.all(promises)
      .then((items) => {
        return res.json(items);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error" });
      });
  });
});

app.get("/item/:id", (req, res)=> {
    const id = req.params.id;
    const q = `SELECT items.*, collections.name
    FROM items
    INNER JOIN collections ON items.collection_id = collections.id
    WHERE items.id =  ${id};`
    connection.query(q, (error, results) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      const promises = results.map((result) => {
        const tagIds = JSON.parse(result.tag_ids);
        if (tagIds) {
          const query = `SELECT tagname FROM tags WHERE id IN (?)`;
          return new Promise((resolve, reject) => {
            connection.query(query, [tagIds], (err, results) => {
              if (err) reject(err);
              const tagsName = results.map((tag) => tag.tagname);
              const item = {
                id: result.id,
                title: result.title,
                description: result.description,
                name: result.name,
                tags: tagsName,
              };
              resolve(item);
            });
          });
        } else {
          const item = {
            id: result.id,
            title: result.title,
            description: result.description,
            name: result.name,
            tags: [],
          };
          return Promise.resolve(item);
        }
      });
      Promise.all(promises)
        .then((items) => {
          return res.json(items);
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).json({ error: "Internal Server Error" });
        });
    });
})

app.post("/items", (request, response) => {
    if (!request.body) return response.sendStatus(400);
    try {
      const { title, descriptionItem, id, tags } = request.body;
      const tagIds = [];
  
      const q = `INSERT INTO items (title, description, collection_id, tag_ids) VALUES('${title}', '${descriptionItem}', '${id}', '[]')`;
      connection.query(q, (err, results) => {
        if (err) {
          console.error(err);
          return response.status(500).json({ message: "Ошибка сервера" });
        }
        const itemId = results.insertId;  
        tags.forEach((tagName) => {
          const tagQuery = `SELECT id FROM tags WHERE tagname = '${tagName}'`;
          connection.query(tagQuery, (err, tagResult) => {
            if (err) {
              console.error(err);
              return response.status(500).json({ message: "Ошибка сервера" });
            }
  
            if (tagResult.length > 0) {
              tagIds.push(tagResult[0].id);
              if (tagIds.length === tags.length) {
                const updateQuery = `UPDATE items SET tag_ids = '${JSON.stringify(
                  tagIds
                )}' WHERE id = ${itemId}`;
                connection.query(updateQuery, (err, updateResult) => {
                  if (err) {
                    console.error(err);
                    return response
                      .status(500)
                      .json({ message: "Ошибка сервера" });
                  }
                  response.json({ message: "Данные отправлены" });
                });
              }
            } else {
              const insertTagQuery = `INSERT INTO tags (tagname, item_id) VALUES ('${tagName}', ${itemId})`;
              connection.query(insertTagQuery, (err, insertResult) => {
                if (err) {
                  console.error(err);
                  return response
                    .status(500)
                    .json({ message: "Ошибка сервера" });
                }
                tagIds.push(insertResult.insertId);
                if (tagIds.length === tags.length) {
                  const updateQuery = `UPDATE items SET tag_ids = '${JSON.stringify(
                    tagIds
                  )}' WHERE id = ${itemId}`;
                  connection.query(updateQuery, (err, updateResult) => {
                    if (err) {
                      console.error(err);
                      return response
                        .status(500)
                        .json({ message: "Ошибка сервера" });
                    }
                    response.json({ message: "Данные отправлены" });
                  });
                }
              });
            }
          });
        });
      });
    } catch (error) {
      console.log(error);
      response.status(500).json({ message: "Ошибка сервера" });
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

app.post("/signup", (req, res) => {
    if (!req.body || !req.body.username || !req.body.email || !req.body.password) {
      return res.status(400).json({ error: "Username, email, and password fields are required" });
    }
  
    const { username, email, password } = req.body;
    console.log(req.body)
    const date = new Date();
    const registrationDate = date.toISOString().slice(0, 18);
    const data = [registrationDate];
  
    const emailQuery = `SELECT * FROM users WHERE email='${email}'`;
    connection.query(emailQuery, (emailErr, emailResults) => {
      if (emailErr) return res.status(500).json({ error: "Database error" });
      if (emailResults.length > 0) return res.status(400).json({ error: "Email already exists" });
  
      const q = `INSERT INTO users(name, email, password, reg_date, login_date) VALUES('${username}', '${email}', '${password}', '${data}', '${data}')`;
  
      connection.query(q, (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        console.log("user created");
  
        const qLogin = "SELECT * FROM users WHERE email = ? AND password = ?";
        connection.query(qLogin, [email, password], (error, result) => {
          if (error) {
            res.send({ error: error });
          }
          if (result.length > 0) {
            if (result[0].password == password) {
              const id = result[0].id;
              const token = jwt.sign({ id }, "jwtSecret", {
                expiresIn: 300,
              });
              req.session.user = result;
              console.log(req.session.user);
              res.json({ loggedIn: true, user: req.session.user, auth: true, token: token });
  
              const date = new Date();
              const registrationDate = date.toISOString().slice(0, 18);
  
              const sql = `UPDATE users SET login_date = ? WHERE id = ?`;
              const data = [registrationDate, id];
              connection.query(sql, data, function (err, result) {
                if (err) throw err;
              });
            }
          } else {
            res.json({ auth: false, message: "no user exists" });
          }
        });
      });
    });
  });

app.get('/login', (req, res)=>{
    console.log("get login");
    if(req.session.user){
        const id = req.session.user.id;
        const token = jwt.sign({id}, "jwtSecret", {
            expiresIn: 300,
        })
        const q = `SELECT * FROM users WHERE id = ?`;
        connection.query(q, [req.session.user[0].id], function(error, results) {
            if (error) throw error;
            console.log(results);
            if (results.length>0){
                console.log(req.session.user);
                req.session.user = results;
                console.log(req.session.user);
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
    console.log("post login");
    const email = req.body.email;
    const password = req.body.password;
    const q = "SELECT * FROM users WHERE email = ? AND password = ?";

    connection.query(q, [email, password], (error, result)=>{
        if(error){
            res.send({error: error});
        }
        console.log(result);
        if(result.length > 0){
            if(result[0].password == password){
                const id = result[0].id;
                const token = jwt.sign({id}, "jwtSecret", {
                    expiresIn: 300,
                })
                req.session.user = result;
                console.log("before cookie");
                res.cookie("access_token", token, {
                  httpOnly: true,
                  secure: process.env.NODE_ENV === "production",
                  expires: new Date(new Date().getTime()+5*60*1000),
                  // sameSite: 'none'
                }).json({loggedIn: true, user: req.session.user, auth: true, token: token});
                console.log(token);

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