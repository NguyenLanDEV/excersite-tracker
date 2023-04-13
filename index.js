const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const { ExerciseModel, LogModel, UserModel } = require("./model")
const _ = require("lodash")
require('dotenv').config()
require("./database")


// init middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())
app.use(express.static('public'))


// init router
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


app.get("/api/users", async (req, res, next) => {
  const { UserModel } = require("./model")
  return res.json(await UserModel.find({}))
})

app.post("/api/users", async (req, res, next) => {
  const { username } = req.body
  const user = new UserModel({
    username: username
  })

  user.save().then(result => {
    return res.json(result)
  }).catch(err => {
    console.log(err)
    return res.json({
      err
    })
  })

})
app.post("/api/users/:_id/exercises", async (req, res, next) => {
  const id = req.params._id
  let payload = req.body
  let user = await UserModel.findById(id).lean()
  payload.date = (payload.date !== undefined) ? new Date(payload.date) : new Date()

  const exercises = new ExerciseModel(Object.assign({ username: user.username }, payload))

  exercises.save()
    .then(result => {
      return res.send({
        _id: user._id,
        username: user.username,
        description: result['description'],
        duration: result['duration'],
        date: new Date(result['date']).toDateString()
      })
    })
    .catch(err => {
      return res.json(err)
    });
})

app.get("/api/users/:_id/logs", async (req, res, next) => {
  try {
    let { _id } = req.params
    let { from, to, limit } = req.query
    let foundUser = await UserModel.findById(_id)
    if (foundUser) {
      let findCondition = {}
      if (from) {
        Object.assign(findCondition, { date: { $gte: new Date(from) } })
      }

      if (to) {
        Object.assign(findCondition, { date: { $lte: new Date(to) } })
      }
      let foundExercises = await ExerciseModel.find({
        username: foundUser.username,
        ...findCondition
      }).limit(limit ? limit : 0).lean()

      foundExercises = foundExercises.map(exercise => {
        exercise.date = new Date(exercise.date).toDateString()
        return _.pick(exercise, ['description', 'duration', 'date']);
      })

      return res.json({
        _id: foundUser.id,
        username: foundUser.username,
        log: foundExercises,
        count: foundExercises.length
      })
    }
    
    return res.json({
      message: 'cant find user'
    })

  } catch (error) {
    console.log(error)
  }

})


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
