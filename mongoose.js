const mongoose = require('mongoose');

mongoose
  .connect("mongodb://localhost/school", { useNewUrlParser: true }) // 连接数据库，如果没有会创建
  .then(msg => "Connected")
  .catch(err => "Unconnected " + err)

mongoose.set("useFindAndModify", false)

const courseSchema = new mongoose.Schema({
  // 相当于 sql 表结构
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ["web", "mobile", "network"],
    // uppercase: true,
    // lowercase: true,
    trim: true
  },
  author: String,
  // tags: [String],
  tags: {
    type: Array,
    validate: {
      validator: function(v) {
        // 默认初始化了数组， 不能传 null
        return v && v.length > 0
      },
      // validator: function(v, cb) {
      //   setTimeout(() => {
      //     const res = v && v.length > 0
      //     cb(res)
      //   }, 4000)
      // },
      message: "应该包含一个标签"
    }
    /* isAsync: true,
    validate: function(v) {
      return new Promise(function(resolve, reject) {
        setTimeout(function() {
          resolve(v && v.length > 0)
        }, 4000);
      });
    } */
  },
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
  price: {
    type: Number,
    min: 10,
    max: 300,
    set: v => Math.round(v),  // 查询时候调用
    get: v => Math.round(v),  // 修改添加调用
    required: function() {
      return this.isPublished
    }
  }
})

courseSchema.methods.generateToken = function(){
  // 可以在 编译表结构生成表的对象上 挂载 方法， 这样增删改查返回的结果集 可以调用此方法
}

const Course = mongoose.model('course', courseSchema) // 相当于编译表结构生成表，第一个参数是表名

async function createCourse() {
  const course = new Course({    // 相当于填充数据
    name: 'Angular Course',
    category: 'web',
    author: 'Berserker',
    // tags: ['angular', 'frontend'],
    isPublished: false,
    price: 14
  })

  try {
    const result = await course.save()
    // console.log(result)
  } catch (ex) {
    // console.log(ex);
    for(field in ex.errors) {
      console.log(ex.errors[field].message)
    }
  }
}

createCourse()

async function getCourse() {
  // const result = await Course.find() // 查找全部
  const result = await Course
    .find({ isPublished: true }) // 查找条件
    .limit(10)  // 查10条
    .sort({ name: -1 }) // 根据某个字段升序降序排列， 1 升序 -1 降序
    .estimatedDocumentCount() // count 将来被移除， 这个是替代方法
    // .select({ tags: 1, author: 1 }) // 查找的字段
  console.log(result)
}

// getCourse()

async function updateCourse1(id) {
  const result = await Course.findById(id)
  if(!result) return

  result.isPublished = false
  const update = await result.save()
  console.log(update)
}

// updateCourse1("5d2ee0d96ab5a68a74371c37")

async function updateCourse2(id) {
  // update 被未来将被移除  Use updateOne, updateMany, or bulkWrite instead
  const result = await Course.updateOne({ _id: id}, {
    $set: {
      author: 'fate',
      isPublished: true
    }
  })
  console.log(result); // { n: 1, nModified: 1, ok: 1 }
}

// updateCourse2("5d2ee0d96ab5a68a74371c37")

async function updateCourse3(id) {
  // Mongoose: `findOneAndUpdate()` and `findOneAndDelete()` without the `useFindAndModify` option set to false are deprecated.
  // See: https://mongoosejs.com/docs/deprecations.html#-findandmodify-
  // mongoose.set("useFindAndModify", false) 顶部添加这个，即可不使用 useFindAndModify 方法，而使用 findByIdAndUpdate
  const result = await Course.findByIdAndUpdate(id, {
    $set: {
      author: 'Berserker',
      isPublished: true
    }
  }, { new: true }) // 不添加第三个参数， result 返回的是旧记录
  console.log(result);
}

// updateCourse3("5d2ee0d96ab5a68a74371c37")


async function deleteCourse(id) {
  const result = await Course.deleteOne(id)
  // const result = await Course.findByIdAndRemove(id)
  console.log(result);
}