require('dotenv').config();
const mongoose = require('mongoose');

class Database {

    constructor() {
        this._connect()
    }

    async _connect() {
        await mongoose.connect(process.env.MONGO_URL).then(res => {
            console.log(`number Connection: ${mongoose.connections.length}`)
        })
        .catch(err => console.log(err))
    }

    static getInstance() {
      
        if (!Database.instance) {
            Database.instance = new Database()
        }

        return Database.instance
    }
}


module.exports =  Database.getInstance()