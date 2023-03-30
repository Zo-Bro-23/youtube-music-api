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

            // if (status.length == 0 || status[0].expiry < Date.now()) {
            if (status.length == 0) {
                return sendResponse(res, {}, 200)
            }

            if (req.query.type == 'svg') {
                if (req.query.format == 'minimal') {
                    return sendResponse(res, `<svg width="180" height="300">
  <rect width="180" height="300" rx="10" style="fill: #bd78bb;"/>
  <image href="${status[0].imageSrc}" width="155" x="12.5" y="12.5" style="clip-path: inset(0px round 30px);"/>
  <text x="90" y="210" fill="#fed1ff" font-size="16pt" font-weight="bold" style="text-anchor: middle;">${status[0].title}</text>
  <text x="90" y="235" style="text-anchor: middle;" fill="#cca5c6">${status[0].artist}</text>
</svg>`, 200)
                }
            } else {
                return sendResponse(res, status[0], 200)
            }
        }

        if (req.method == 'POST') {
            const keysCollection = db.collection('keys')

            const {
                key,
                title,
                artist,
                views = 0,
                uploadDate = '1970-01-01',
                imageSrc = 'https://seeklogo.com/images/Y/youtube-music-logo-50422973B2-seeklogo.com.png',
                isPaused = false,
                songDuration = 0,
                elapsedSeconds = 0,
                url = 'https://music.youtube.com',
                album = 'Unknown Album'
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
                // expiry
            }, { upsert: true })

            return sendResponse(res, {
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
                // expiry
            }, 200)
        }
    } catch (err) {
        console.log('Error!', err)
        return sendResponse(res, { error: err.message }, 400)
    }
}