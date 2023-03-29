import { MongoClient } from 'mongodb'
import * as dotenv from 'dotenv'
import * as randomstring from 'randomstring'
import { assert } from '@sindresorhus/is'

let client
let pendingControls = {}

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

            if (!pendingControls[key]) {
                return res.send({ controls: [] })
            }

            const tempControls = pendingControls[key]
            pendingControls[key] = undefined

            return res.send({ controls: tempControls })
        }

        if (req.method == 'POST') {
            console.log(req.body)
            const keysCollection = db.collection('keys')

            const key = req.body.key
            let controls = req.body.controls

            if (!key) {
                throw new Error('No key provided')
            }

            if (!controls) {
                throw new Error('No controls provided')
            }

            if (typeof controls == 'string') {
                controls = [controls]
            }

            assert.string(key)
            assert.array(controls, assert.string)

            const allowedControls = ['previous', 'next', 'playPause', 'play', 'pause', 'like', 'dislike', 'go10sBack', 'go10sForward', 'go1sBack', 'go1sForward', 'shuffle', 'switchRepeat', 'volumeMinus10', 'volumePlus10', 'fullscreen', 'muteUnmute', 'maximizeMinimisePlayer', 'goToHome', 'goToLibrary', 'goToSettings', 'goToExplore', 'search', 'showShortcuts']

            controls.forEach(control => {
                if (!allowedControls.includes(control)) {
                    throw new Error(`Control ${control} is not permitted`)
                }
            })

            let keys = await keysCollection.find({ _id: key }).toArray()
            keys = keys.map(key => key._id)

            if (keys.length == 0) {
                throw new Error('Invalid key')
            }

            pendingControls[key] = pendingControls[key].concat(controls)

            res.send({
                key,
                controls
            })
        }
    } catch (err) {
        console.log('Error!', err)
        res.status(400).send({ error: err.message })
    }
}