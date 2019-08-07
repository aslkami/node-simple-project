const mongoose = require('mongoose');

mongoose
  .connect("mongodb://localhost/playground", { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB..."))
  .catch(err => console.error("Could not connect to MongoDB...", err))

const Author = mongoose.model('Author', new mongoose.Schema({
  name: String,
  bio: String,
  website: String
}));

const Course = mongoose.model('Course', new mongoose.Schema({
  name: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author' // 相当于索引 关联另外一张集合（表）的ID
  }
}));

async function createAuthor(name, bio, website) { 
  const author = new Author({
    name, 
    bio, 
    website 
  });

  const result = await author.save();
  console.log(result);
}

async function createCourse(name, author) {
  const course = new Course({
    name, 
    author
  }); 
  
  const result = await course.save();
  console.log(result);
}

async function listCourses() { 
  const courses = await Course
    .find()
    .populate('author', 'name -_id') // 关联集合查询， 查询的时候通过引用id去查找另外一张表数据，并展示出来，第二个参数 - 表示排除不查找 _id 字段
    .select('name author');    //  等价下面的写法
    // .select({ name: 1, author: 1 });  // 等价上面的写法
  console.log(courses);
}

// createAuthor('Saber', 'My Honor', 'My Blood');

// createCourse("React Course", "5d2fd83be3b4b378e8579e5c")
// createCourse("Vue Course")

listCourses();