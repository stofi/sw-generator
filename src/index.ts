import 'dotenv/config'
import * as express from 'express'
import * as http from 'http'
import bodyParser from 'body-parser'

import App from './App'
import TwitterClient from './Twitter'

const myApp = new App()
myApp.initialize().then(() => {
    const app = express.default()

    app.use(bodyParser.json())

    app.get('/', async (_req, res) => {
        res.send({
            uptime: process.uptime(),
            ...myApp.generateStory(),
        })
    })
    app.get('/ai', async (_req, res) => {
        res.send({
            uptime: process.uptime(),
            ...(await myApp.generateStoryWithOpenAI()),
        })
    })
    app.get('/tweet', async (req, res) => {
        try {
            const { prediction } = await myApp.generateStoryWithOpenAI()
            const tweet = `${prediction}`
            const result = await TwitterClient.v2.tweet(tweet)
            res.send({
                uptime: process.uptime(),
                tweet,
                tweetId: result.data.id,
            })
        } catch (e) {
            console.error(e)
            throw new Error('Failed to tweet')
        }
    })

    const server = http.createServer(app)

    server.listen(4040, () => {
        console.info('Server started')
    })
})
