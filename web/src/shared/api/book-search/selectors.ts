import { SearchSelector } from './types'

const find = <T extends Element = HTMLElement>(entry: HTMLElement, cssSelector: string) =>
  entry.querySelector<T>(cssSelector)

export const textSelector = (cssSelector: string): SearchSelector => {
  return entry => find(entry, cssSelector)?.textContent?.trim()
}

export const listTextSelector = (cssSelector: string): SearchSelector => {
  return entry => {
    const list = entry.querySelectorAll<HTMLElement>(cssSelector)

    if (list.length > 1) {
      return Array.prototype.map.call(list, a => a.textContent?.trim()).join('; ')
    }

    if (list.length === 1) {
      return list[0].textContent?.trim()
    }
  }
}

export const linkSelector = (cssSelector: string): SearchSelector => {
  return entry => find<any>(entry, cssSelector)?.attributes.href?.value
}

export const matchSelector = (cssSelector: string, regExp: RegExp): SearchSelector => {
  return entry => find(entry, cssSelector)?.textContent.match(regExp)?.[1]
}

export const cutSelector = (cssSelector: string, toReplace: string | RegExp): SearchSelector => {
  return entry => find(entry, cssSelector)?.textContent.replace(toReplace, '').trim()
}

export const value = (val: string): SearchSelector => {
  return () => val
}
