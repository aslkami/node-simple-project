const express = require('express');
const Router = express.Router()

Router.get("/", (req, res) => {
  res.render("index", { title: "fate", message: "Hello Saber!" })
})
Router.get("/:id", (req, res) => {})
Router.post("/", (req, res) => {})
Router.put("/:id", (req, res) => {})
Router.delete("/:id", (req, res) => {})

// 这边简化成这种 id 的形式
// index.js 那边就 app.use('/home', home) 即可
// 这样可以不用每个路由带上 /home
module.exports = Router