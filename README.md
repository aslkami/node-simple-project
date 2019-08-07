# node-simple-project
node-simple-project

将一些 密码 设置为环境变量， 例如： export pwd=123456
custom-environment-variables.json 里映射一下 变量 
```json
  {
    "password": "pwd"
  }
```
这样可以防止别人获取你的密码


------

导入数据
mongoimport --db mongo-exercises --collection courses --file exercise-data.json --jsonArray
--db 数据库
--collection 表名字
--file exercise-data.json 通过文件导入
--jsonArray 指明文件的类型是 数组型的json

------

_id : 5d2fdf7eb7891693a0019107
-- 12 bytes 
 -- 4 bytes : timestamp
 -- 3 bytes : machine identifier
 -- 2 bytes : process identifier
 -- 3 bytes : counter
1个字节2个字符，所有上面有12个字节(bytes) 1 byte = 8 bits
