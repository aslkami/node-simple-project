const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

const authorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  website: String
});

const Author = mongoose.model('Author', authorSchema);

const Course = mongoose.model('Course', new mongoose.Schema({
  name: String,
  author: authorSchema
}));

async function createCourse(name, author) {
  const course = new Course({
    name, 
    author
  }); 
  
  const result = await course.save();
  console.log(result);
}

async function updateCourse(id) {
  const course = await Course.findById(id)
  course.author.name = 'Saber'
  course.save()
}

async function listCourses() { 
  const courses = await Course.find();
  console.log(courses);
}

// 5d2fdf7eb7891693a0019107
// createCourse('Node Course', new Author({ name: 'Mosh' }));

updateCourse("5d2fdf7eb7891693a0019107")  // 通过父级 id 修改 内容