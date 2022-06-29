import 'dotenv/config'

import App from './App'
import TwitterClient from './Twitter'

const myApp = new App()

const DEBUG = process.env.DEBUG || false

myApp.initialize().then(async () => {
    try {
        let { prediction, story } = await myApp.generateStoryWithOpenAI()
        const max = 10
        while (max > 0 && prediction.length > 240) {
            ;({ prediction, story } = await myApp.generateStoryWithOpenAI())
        }
        const tweet = `${prediction}`
        if (DEBUG) {
            console.log(story)
            console.log(tweet)
            return
        }
        const result = await TwitterClient.v2.tweet(tweet)
        console.log({
            uptime: process.uptime(),
            tweet,
            tweetId: result.data.id,
        })
    } catch (e) {
        console.error(e)
        throw new Error('Failed to tweet')
    }
})
