import fetch from 'node-fetch'
export async function GET(url: string) {
    const res = await fetch(url)
    const data = res
    return data
}