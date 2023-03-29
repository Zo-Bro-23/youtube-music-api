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

            if (!controls[key]) {
                return res.send('No pending controls!')
            }

            return res.send(controls[key])
        }

        if (req.method == 'POST') {
            const keysCollection = db.collection('keys')

            const {
                key,
                controls
            } = req.body

            if (!key) {
                throw new Error('No key provided')
            }

            if (!controls) {
                throw new Error('No controls provided')
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

            pendingControls[key] = controls

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