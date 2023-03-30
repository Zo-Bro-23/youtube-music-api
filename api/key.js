import { MongoClient } from 'mongodb'
import * as dotenv from 'dotenv'
import * as randomstring from 'randomstring'
import { assert } from '@sindresorhus/is'

import { sendResponse } from '../lib/utils.js'

let client

export default async (req, res) => {
    dotenv.config()

    try {
        const url = process.env.MONGO_URL
        const dbName = 'youtube-music'

        if (!client) {
            client = await (new MongoClient(url)).connect()
        }

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
            return sendResponse(res, { key }, 200)
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

            return sendResponse(res, { key: req.body.newKey }, 200)
        }
    } catch (err) {
        console.log('Error!', err)
        return sendResponse(res, { error: err.message }, 400)
    }
}