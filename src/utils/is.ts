export function isJSON(...args: Parameters<JSON['parse']>) {
    try {
        const json = JSON.parse(...args)
        return json
    } catch (e) {
        return null
    }
}

const toString = Object.prototype.toString

export function isString(val: unknown): val is string {
    return toString.call(val) === "[object String]"
}

export function isStringArray(values: unknown[]): values is string[] {
    if (!Array.isArray(values)) {
        return false
    }
    for (const value of values) {
        if (!isString(value)) {
            return false
        }
    }
    return true
}
