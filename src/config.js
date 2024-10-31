const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb+srv://wrightcn1:StemSeminar_Inspirational@userauthen.ijfao.mongodb.net/TheJourney");

connect.then(() => {
    console.log("Database connected sucessfully");
})
.catch(() => {
    console.log("Database cannot be connected");
});

const LoginSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

const collection = new mongoose.model("users", LoginSchema)

module.exports = collection;