import { MongoClient } from 'mongodb'
import * as dotenv from 'dotenv'
import * as randomstring from 'randomstring'
import { assert } from '@sindresorhus/is'

export default async (req, res) => {
    dotenv.config()

    try {
        const url = process.env.MONGO_URL
        const client = new MongoClient(url)
        const dbName = 'youtube-music'

        await client.connect()
        const db = client.db(dbName)

        if (req.method == 'GET') {
            const keysCollection = db.collection('keys')
            let keys = await keysCollection.find({}).toArray()
            keys = keys.map(key => key._id)
            let key = randomstring.generate({ charset: 'alphabetic', length: 25, readable: true })
            while (keys.includes(key)) {
                key = randomstring.generate({ charset: 'alphabetic', length: 25, readable: true })
            }
            await keysCollection.insertOne({ _id: key })
            return res.send({ key })
        }

        if (req.method == 'PUT') {
            const keysCollection = db.collection('keys')

            assert.string(req.body.key)
            assert.string(req.body.newKey)

            if (!req.body.key) {
                throw new Error('No key provided')
            }

            if (!req.body.newKey) {
                throw new Error('New key is not provided')
            }

            let keys = await keysCollection.find({  }).toArray()
            keys = keys.map(key => key._id)

            console.log(keys)

            if (!keys.includes(req.body.key)) {
                throw new Error('Invalid key')
            }

            if (keys.includes(req.body.newKey)) {
                throw new Error('New key already exists')
            }

            await keysCollection.deleteOne({ _id: req.body.key })
            await keysCollection.insertOne({ _id: req.body.newKey })

            res.send({ key: req.body.newKey })
        }

        client.close()
    } catch (err) {
        console.log('Error!', err)
        res.status(400).send({ error: err.message })
    }
}