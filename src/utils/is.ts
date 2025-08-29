export function isJSON(str: any) {
    try {
        const json = JSON.parse(str)
        return json
    } catch (e) {
        return null
    }
}

