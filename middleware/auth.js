const jwt = require('jsonwebtoken');
const config = require('config');

function auth(req, res, next) {
  const token = req.header('x-auth-token')
  if (!token) {
    return res.status(401).send("Access denied")
  }

  try {
    // 利用私钥，验证由客户端传过去的token，如果有效返回 payload，也就是自己生成token的参数
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'))
    req.user = decoded
    next()
  } catch (ex) {
    res.status(400).send('Ivaid Token')
  }
}

module.exports = auth