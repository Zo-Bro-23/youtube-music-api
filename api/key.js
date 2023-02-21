module.exports = async (req, res) => {
    const { MongoClient } = require('mongodb')
    const dotenv = require('dotenv')
    dotenv.config()

    const url = process.env.MONGO_URL
    const client = new MongoClient(url)
    const dbName = 'youtube-music'

    await client.connect()

    if (req.method == 'GET') {
        
    }
}