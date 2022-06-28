import 'dotenv/config'

import App from './App'
import TwitterClient from './Twitter'

const myApp = new App()

myApp.initialize().then(async () => {
    try {
        const { prediction } = await myApp.generateStoryWithOpenAI()
        const tweet = `${prediction}`
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
