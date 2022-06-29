import Swapi from './SwapiClient'
import type { Person } from './SwapiClient'
import { getPrediction } from './OpenAI'
import { actions, adjectives, ageGroups, genre } from './Words'

export default class App {
    client = new Swapi()
    people: Person[] = []

    async initialize() {
        await this.loadData()
    }

    async loadData() {
        this.people = await this.client.getAllPeople()
    }

    getRandomPerson() {
        return this.people[Math.floor(Math.random() * this.people.length)]
    }

    getRandomPersonOtherThan(person: Person) {
        const otherPeople = this.people.filter((p) => p !== person)
        return otherPeople[Math.floor(Math.random() * otherPeople.length)]
    }

    getRandomAction() {
        return actions[Math.floor(Math.random() * actions.length)]
    }

    getRandomAdjective() {
        return adjectives[Math.floor(Math.random() * adjectives.length)]
    }
    getRandomGenre() {
        return genre[Math.floor(Math.random() * genre.length)]
    }

    getRandomAgeGroup() {
        return ageGroups[Math.floor(Math.random() * ageGroups.length)]
    }

    generateStory() {
        const person = this.getRandomPerson()
        const otherPerson = this.getRandomPersonOtherThan(person)
        const action = this.getRandomAction()
        const adjective = this.getRandomAdjective()
        const ageGroup = this.getRandomAgeGroup()
        const intro = this.getRandomGenre()
        const story = `${adjective} ${person.name} ${action} ${ageGroup} ${otherPerson.name}. Genre: ${intro}`
        // make first letter uppercase
        return {
            story: story.charAt(0).toUpperCase() + story.slice(1),
            adjective,
            person: person.name,
            action,
            ageGroup,
            otherPerson: otherPerson.name,
            intro,
        }
    }

    async generateStoryWithOpenAI() {
        const {
            story,
            person,
            otherPerson,
            action,
            adjective,
            ageGroup,
            intro,
        } = this.generateStory()
        const prediction = await getPrediction(story)
        return {
            prediction:
                prediction.charAt(0).toUpperCase() + prediction.slice(1),
            predictionLength: prediction.length,
            story,
            storyLength: story.length,
            adjective,
            person,
            action,
            ageGroup,
            intro,
        }
    }
}
