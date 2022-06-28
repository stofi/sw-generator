import 'dotenv/config'
import { TwitterApi } from 'twitter-api-v2'

const {
    TWITTER_oauth_token,
    TWITTER_oauth_token_secret,
    TWITTER_API_KEY,
    TWITTER_API_SECRET,
    // TWITTER_user_id,
    // TWITTER_ACCESS_TOKEN,
    // TWITTER_ACCESS_TOKEN_SECRET,
    // TWITTER_screen_name,
    // TWITTER_BEARER_TOKEN,
    // TWITTER_CLIENT_ID,
    // TWITTER_CLIENT_SECRET,
} = process.env
if (
    !TWITTER_oauth_token ||
    !TWITTER_oauth_token_secret ||
    !TWITTER_API_KEY ||
    !TWITTER_API_SECRET
)
    throw new Error('Missing Twitter API keys')

const client = new TwitterApi({
    appKey: TWITTER_API_KEY,
    appSecret: TWITTER_API_SECRET,
    accessToken: TWITTER_oauth_token,
    accessSecret: TWITTER_oauth_token_secret,
})

export default client
