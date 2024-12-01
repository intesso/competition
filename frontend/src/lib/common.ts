import { AxiosError } from 'axios'
import { toLower, upperFirst } from 'lodash'

export function snakeToPascal (text: string) {
  return text.split('-').map(str => upperFirst(toLower(str))).join(' ')
}

export function dedupe (text: string) {
  let memo = ''
  return text.split(' ').filter(it => {
    const keep = it !== memo
    memo = it
    return keep
  }).join(' ')
}

// eslint-disable-next-line n/handle-callback-err, @typescript-eslint/no-explicit-any
export function parseError (err: any) {
  if (err instanceof AxiosError) {
    const data = err.response?.data
    if (!data) return err.message
    // postgres error
    if (data?.error?.detail) return data?.error?.detail
  }
  return err.message
}

export function getPageName (page: string) {
  const segments = page.split('/')
  return segments[segments.length - 1].replace(/-/g, ' ')
}

export function toNumber (value: string | number | null | undefined) {
  if (typeof value === 'number') return value
  if (typeof value === 'string') return parseInt(value)
  return 0
}

type Compareable = string | number | null | undefined

/**
 * The `Array#sort` comparator to produce a
 * [natural sort order](https://en.wikipedia.org/wiki/Natural_sort_order).
 *
 * @memberOf util
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {number} Returns the sort order indicator for `value`.
 */
export const compareNatural = (an: Compareable, bn: Compareable) => {
  const isDefined = (c: Compareable) => c !== undefined && c !== null
  const isDigit = (c: number) => c >= '0'.charCodeAt(0) && c <= '9'.charCodeAt(0)
  const skipDigit = (c: string, p: number) => {
    for (p += 1; p < c.length; p++) {
      if (!isDigit(c.charCodeAt(p))) { return p }
    }
    return p
  }
  let i
  if (!isDefined(an) && !isDefined(bn)) return 0
  if (!isDefined(an)) return -1
  if (!isDefined(bn)) return 1
  const a = typeof an === 'number' ? an.toString() : an ?? ''
  const b = typeof bn === 'number' ? bn.toString() : bn ?? ''
  for (i = 0; i < (a?.length ?? 0); i++) {
    const ai = a?.charCodeAt(i) ?? 0
    const bi = b?.charCodeAt(i) ?? 0
    if (!bi) return 1
    if (isDigit(ai) && isDigit(bi)) {
      const k = skipDigit(a, i)
      const m = skipDigit(b, i)
      if (k > m) return 1
      if (k < m) return -1
      // Same number of digits! Compare them
      for (let j = i; j < k; j++) {
        const aj = a?.charCodeAt(j) ?? 0
        const bj = b?.charCodeAt(j) ?? 0
        if (aj < bj) return -1
        if (aj > bj) return 1
      }

      // Same number! Update the number of compared chars
      i = k - 1
    } else {
      // Compare alphabetic chars.
      if (ai > bi) return 1
      if (ai < bi) return -1
    }
  }
  return b?.charCodeAt(i) ? -1 : 0
}

export function compareNumbers (a: number, b: number) {
  if (a < b) {
    return -1
  } else if (a > b) {
    return 1
  }
  return 0
}

export function compareNumbersDescending (a: number, b: number) {
  if (a < b) {
    return 1
  } else if (a > b) {
    return -1
  }
  return 0
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function sortObjectByKey (object: Record<string, any>) {
  return Object.fromEntries(Object.entries(object).sort((a, b) => compareNatural(a[0], b[0])))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function sortObjectByKeyCaseInsensitive (object: Record<string, any>) {
  return Object.fromEntries(Object.entries(object).sort((a, b) => compareNatural((a[0] ?? '').toLowerCase(), (b[0] ?? '').toLowerCase())))
}

export type SortFunction = (a: Compareable, b: Compareable) => number
export function sortCombined (sortA: SortFunction, sortB: SortFunction) {
  if (!sortA || !sortB) {
    return 0
  }

  return function sort (a: Compareable, b: Compareable) {
    const sortResultA = sortA(a, b)

    if (sortResultA === 0) {
      return sortB(a, b)
    }
    return sortResultA
  }
}

/**
 * orderBy function like lodash orderBy, but instead of orders array with ['asc', 'desc'] etc. you provide sort functions.
 *
 * @param items {T extends Record<string, any>} Array containing Record items
 * @param keys {string[]} Record keys Array to sort after
 * @param sortFunctions {SortFunction[]} sort functions Array
 * @returns sorted items
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function orderByCustomFn<T extends Record<string, any>> (items: T[], keys: string[], sortFunctions: SortFunction[]) {
  if (!items) {
    return []
  }
  if (!keys || !keys.length || !sortFunctions || !sortFunctions.length) {
    return items
  }

  return items.sort((a, b) => {
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const sortFn = sortFunctions[i] ?? function noopSort () { return 0 }
      const sortResult = sortFn(a[key] as Compareable, b[key] as Compareable)
      if (sortResult === -1 || sortResult === 1 || i === (keys.length - 1)) {
        return sortResult
      }
    }
    return 0
  })
}
