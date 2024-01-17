const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(bodyParser.json());

//get all todos
app.get("/todos", (req, res) => {
  fs.readFile("todos.json", "utf8", (err, data) => {
    if (err) throw err;
    res.status(200).json(JSON.parse(data));
  });
});

app.get("/todos/:id", (req, res) => {
  let todoIndex = -1;
  fs.readFile("todos.json", "utf8", (err, data) => {
    if (err) throw err;
    const todos = JSON.parse(data);
    for (let i = 0; i < todos.length; i++) {
      if (todos[i].id === parseInt(req.params.id)) {
        todoIndex = i;
      }
    }
    if (todoIndex === -1) {
      res.status(404).send();
    } else {
      res.json(todos[todoIndex]);
    }
  });
});

// create a new todo
app.post("/todo", (req, res) => {
  const todo = {
    id: Math.floor(Math.random() * 1000000),
    title: req.body.title,
    description: req.body.description,
  };
  fs.readFile("todos.json", "utf8", (err, data) => {
    if (err) throw err;
    const todos = JSON.parse(data);
    todos.push(todo);
    fs.writeFile("todos.json", JSON.stringify(todos), (err) => {
      if (err) throw err;
      res.status(201).json(todo);
    });
  });
});

//edit a todo
app.put("/todos/:id", (req, res) => {
  let todoIndex = -1;
  fs.readFile("todos.json", "utf8", (err, data) => {
    if (err) throw err;
    const todos = JSON.parse(data);
    for (let i = 0; i < todos.length; i++) {
      if (todos[i].id === parseInt(req.params.id)) {
        todoIndex = i;
      }
    }
    if (todoIndex === -1) {
      res.status(404).send();
    } else {
      todos[todoIndex].title = req.body.title;
      todos[todoIndex].description = req.body.description;
      fs.writeFile("todos.json", JSON.stringify(todos), (err) => {
        if (err) throw err;
        res.status(200).send();
      });
    }
  });
});

app.delete("/todos/:id", (req, res) => {
  let todoIndex = -1;
  fs.readFile("todos.json", "utf8", (err, data) => {
    if (err) throw err;
    const todos = JSON.parse(data);
    for (let i = 0; i < todos.length; i++) {
      if (todos[i].id === parseInt(req.params.id)) {
        todoIndex = i;
      }
    }
    if (todoIndex === -1) {
      res.status(404).send();
    } else {
      todos.splice(todoIndex, 1);
      fs.writeFile("todos.json", JSON.stringify(todos), (err) => {
        if (err) throw err;
        res.status(200).json(req.params.id);
      });
    }
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
