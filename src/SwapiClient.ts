import Client from './Client'
import fs from 'fs/promises'

export interface Person {
    name: string
    height: string
    mass: string
    hair_color: string
    skin_color: string
    gender: string
    homeworld: string
    films: string[]
    species: string[]
    vehicles: string[]
    starships: string[]
    created: string
    edited: string
    url: string
}
const cache_dir = './cache'

class Swapi extends Client {
    constructor() {
        super('https://swapi.dev/api/')
    }

    async getPerson(id: number): Promise<Person> {
        return this.getItem<Person>(`people/${id}/`)
    }

    async getPeople(): Promise<Person[]> {
        const result = await this.listItems<Person>('people/')
        return result.results
    }

    async getAllPeople(): Promise<Person[]> {
        if (await this.arePeopleCached()) {
            return this.loadPeopleFromCache()
        }
        const result = await this.listAllItems<Person>('people/')
        await this.savePeopleToCache(result.results)
        return result.results
    }

    async savePeopleToCache(people: Person[]): Promise<void> {
        await this.createCacheDir()
        await fs.writeFile(`${cache_dir}/people.json`, JSON.stringify(people))
    }

    async loadPeopleFromCache(): Promise<Person[]> {
        const people = await fs.readFile(`${cache_dir}/people.json`)
        return JSON.parse(people.toString())
    }

    async arePeopleCached(): Promise<boolean> {
        return fs
            .access(`${cache_dir}/people.json`)
            .then(() => true)
            .catch(() => false)
    }

    async createCacheDir(): Promise<void> {
        await fs.mkdir(cache_dir)
    }
}

export default Swapi
