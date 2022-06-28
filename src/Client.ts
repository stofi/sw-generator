import fetch from 'node-fetch'

interface ListResponse<T> {
    count: number
    next: string | null
    previous: string | null
    results: T[]
}
interface Item {
    url: string
}

class Client {
    baseUrl: string
    constructor(url: string) {
        this.baseUrl = url
    }

    async getResource(url: string) {
        const res = await fetch(`${this.baseUrl}${url}`)
        if (!res.ok) {
            throw new Error(`Could not fetch ${url}`)
        }
        try {
            return await res.json()
        } catch (e) {
            throw new Error(`Could not parse ${url}`)
        }
    }
    async getItem<T extends Item>(url: string): Promise<T> {
        const res = await this.getResource(url)
        return res as unknown as T
    }
    async listItems<T extends Item>(url: string): Promise<ListResponse<T>> {
        const res = await this.getResource(url)
        return res as unknown as ListResponse<T>
    }
    async listAllItems<T extends Item>(url: string): Promise<ListResponse<T>> {
        let res = await this.listItems(url)
        const items = res.results
        while (res.next) {
            const stripBase = res.next.replace(this.baseUrl, '')
            const nextRes = await this.getResource(stripBase)
            items.push(...(nextRes as unknown as ListResponse<T>).results)
            res = nextRes
        }
        res.next = null
        res.previous = null
        res.results = items
        return res as unknown as ListResponse<T>
    }
}

export default Client
