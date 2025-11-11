const mongoose = require('mongoose')

const connectionDb = async () => {
    try{
        const connect = await mongoose.connect(process.env.MONGO_URL)
        console.log(`mongodb connected: ${connect.connection.host}`)
    } catch {
        console.log(`Error: ${error.message}`)
        process.exit(1)        
    }
}

module.exports = connectionDb