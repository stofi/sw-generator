import 'dotenv/config'
import { Configuration, OpenAIApi } from 'openai'

const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(config)

export const getPrediction = async (text: string) => {
    const response = await openai
        .createCompletion({
            model: 'text-davinci-002',
            prompt: `Expand this description of a Star Wars TV show to up to 280 characters: ${text}`,
            temperature: 0.9,
            max_tokens: 220,
            frequency_penalty: -0.1,
        })
        .then(({ data }) => data)

    if (!response.choices || !response.choices.length) {
        throw new Error('No choices found')
    }
    const choice = response.choices[0]
    if (!choice.text) {
        throw new Error('No text found')
    }
    return choice.text?.trim() ?? ''
}
