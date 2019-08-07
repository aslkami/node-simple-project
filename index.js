const express = require('express');
const helmet = require('helmet'); // 保证请求头的安全性
const morgan = require('morgan'); // 记录 http 请求的日志
const config = require('config'); // 配置文件
const Joi = require('joi');  // 校验表单内容
const debug = require('debug')('app:startup'); // (export) DEBUG=app:startup,app:db.app:* nodemon index.js 表示设置完 DEBUG 变量后并开启服务，可以同时设置多个值，匹配所有则使用通配符 *
const app = express()
const winston = require('winston'); // 日志记录包
require('winston-mongodb'); // mongodb 日志记录包
require('express-async-errors'); // 错误处理包 不需要返回值

// 路由
const home = require('./routes/home.js');

// 中间件
const error = require('./middleware/error.js');


const port = process.env.PORT || 3000  // export/set PORT=3000
const env = process.env.NODE_ENV || app.get('env')  // app 获得的环境变量 默认为 development

process.on('uncaughtException', ex => {
  console.log(ex); // 捕获同步代码的错误
  process.exit(1)
})

// 捕捉异步代码错误方法一
process.on('unhandledRejection', ex => {
  console.log(ex); // 捕获异步代码的错误
  process.exit(1)
})

// 捕捉异步代码错误方法二
// winston.handleException(
//   winston.add(winston.transports.File, { filename: "unhandledRejection.log" })
// )

// 视频中版本的用法，最新的用法没去了解
// winston.add(winston.transports.File, { filename: "logfile.log" }) 
// 将日志记录到 mongodb数据库中， 如果level设置为 info， 则 error，warn，info的会被锁定
// winston.add(winston.transports.MongoDB, { db: "mongodb://localhost/school", level: 'error' }) 


app.set('view engine', 'pug') // 使用 pug 模板引擎， 不需要 require('pug')
app.set('views', './views') // 默认设置模板文件的路径

app.use('/home', home)

app.use(express.json())  // 将请求体 变成json
app.use(express.urlencoded({ extended: true })) // 解析复杂的参数
app.use(express.static('public'))  // 静态文件服务器，不会暴露路径
app.use(helmet())
if(env === 'development') {
  app.use(morgan("tiny"))
  console.log("morgan")
}






app.get('/', (req, res) => {
  res.render('index', { title: 'fate', message: 'saber'})
  // res.send('fate stay night')
})


app.use(error)



app.listen(port, () => {
  console.log(`server is running at port ${port}`);
})

