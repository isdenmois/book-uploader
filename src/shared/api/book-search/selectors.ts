import cheerio from 'react-native-cheerio'
import { SearchSelector } from './types'

export const textSelector = (cssSelector: string): SearchSelector => {
  return (entry: any) => entry.find(cssSelector)?.text().trim()
}

export const listTextSelector = (cssSelector: string): SearchSelector => {
  return entry => {
    const list = entry.find(cssSelector)

    if (list.length > 1) {
      return list
        .map((i, a) => cheerio(a).text().trim())
        .get()
        .join('; ')
    }

    if (list.length === 1) {
      return list.text().trim()
    }
  }
}

export const propertySelector = (cssSelector: string, attribute: string): SearchSelector => {
  return entry => entry.find(cssSelector)?.attr(attribute)
}

export const matchSelector = (cssSelector: string, regExp: RegExp): SearchSelector => {
  return entry => entry.find(cssSelector)?.text().match(regExp)?.[1]
}

export const cutSelector = (cssSelector: string, toReplace: string | RegExp): SearchSelector => {
  return entry => entry.find(cssSelector)?.text().replace(toReplace, '').trim()
}

export const value = (val: string): SearchSelector => {
  return () => val
}
