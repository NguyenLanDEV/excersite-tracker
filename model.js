const mongoose  = require("mongoose")


let exerciseSchema = new mongoose.Schema({
    username: String,
    description: String,
    duration: Number,
    date: Date,
}, {
    versionKey: false 
});

let userSchema = new mongoose.Schema({
    username: String,
}, {
    versionKey: false 
});

let logSchema = new mongoose.Schema({
    username: String,
    count: Number,
    log: Array
}, {
    versionKey: false 
});

module.exports =  {
    UserModel : mongoose.model("User", userSchema),
    ExerciseModel: mongoose.model("Exercise", exerciseSchema),
    LogModel : mongoose.model("Log", logSchema)
}