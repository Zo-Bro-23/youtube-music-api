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
            const key = req.query.key

            if (!key) {
                throw new Error('No key provided')
            }

            assert.string(key)

            const keysCollection = db.collection('keys')

            let keys = await keysCollection.find({ _id: key }).toArray()
            keys = keys.map(key => key._id)

            if (keys.length == 0) {
                throw new Error('Invalid key')
            }

            const statusCollection = db.collection('status')
            const status = await statusCollection.find({ _id: key }).toArray()

            if (status.length == 0 || status[0].expiry < Date.now()) {
                return res.send('No status!')
            }

            if (req.query.type == 'svg') {
                if (req.query.format == 'minimal') {
                    return res.send(`<svg width="180" height="300">
  <rect width="180" height="300" rx="10" style="fill: #bd78bb;"/>
  <image href="${status[0].imageSrc}" width="155" x="12.5" y="12.5" style="clip-path: inset(0px round 30px);"/>
  <text x="90" y="210" fill="#fed1ff" font-size="16pt" font-weight="bold" style="text-anchor: middle;">${status[0].title}</text>
  <text x="90" y="235" style="text-anchor: middle;" fill="#cca5c6">${status[0].artist}</text>
</svg>`)
                }
            } else {
                return res.send(status[0])
            }
        }

        if (req.method == 'POST') {
            const keysCollection = db.collection('keys')

            const {
                key,
                title,
                artist,
                views,
                uploadDate,
                imageSrc,
                isPaused,
                songDuration,
                elapsedSeconds,
                url,
                album
            } = req.body

            if (!key) {
                throw new Error('No key provided')
            }

            if (!title) {
                throw new Error('No title provided')
            }

            if (!artist) {
                throw new Error('No artist provided')
            }

            assert.string(key)
            assert.string(title)
            assert.string(artist)
            views ? assert.string(views) : false
            uploadDate ? assert.string(uploadDate) : false
            imageSrc ? assert.string(imageSrc) : false
            isPaused ? assert.boolean(isPaused) : false
            songDuration ? assert.string(songDuration) : false
            elapsedSeconds ? assert.number(elapsedSeconds) : false
            url ? assert.string(url) : false
            album ? assert.string(album) : false

            let keys = await keysCollection.find({ _id: key }).toArray()
            keys = keys.map(key => key._id)

            if (keys.length == 0) {
                throw new Error('Invalid key')
            }

            const statusCollection = db.collection('status')

            const expiry = Date.now() + 600000

            await statusCollection.replaceOne({ _id: key }, {
                _id: key,
                title,
                artist,
                views,
                uploadDate,
                imageSrc,
                isPaused,
                songDuration,
                elapsedSeconds,
                url,
                album,
                expiry
            }, { upsert: true })

            res.send({
                key,
                title,
                artist,
                views,
                uploadDate,
                imageSrc,
                isPaused,
                songDuration,
                elapsedSeconds,
                url,
                album,
                expiry
            })
        }
    } catch (err) {
        console.log('Error!', err)
        res.status(400).send({ error: err.message })
    }
}