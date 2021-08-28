import { SearchSelector } from './types'

const find = (entry: HTMLElement, cssSelector: string) => entry.querySelector<HTMLElement>(cssSelector)

export const textSelector = (cssSelector: string): SearchSelector => {
  return entry => find(entry, cssSelector)?.innerText
}

export const listTextSelector = (cssSelector: string): SearchSelector => {
  return entry => {
    const list = entry.querySelectorAll<HTMLElement>(cssSelector)

    if (list.length > 1) {
      return Array.prototype.map.call(list, a => a.innerText).join('; ')
    }

    if (list.length === 1) {
      return list[0].innerText
    }
  }
}

export const linkSelector = (cssSelector: string): SearchSelector => {
  return entry => (find(entry, cssSelector)?.attributes as any).href?.value
}

export const matchSelector = (cssSelector: string, regExp: RegExp): SearchSelector => {
  return entry => find(entry, cssSelector)?.innerText.match(regExp)?.[1]
}

export const cutSelector = (cssSelector: string, toReplace: string | RegExp): SearchSelector => {
  return entry => find(entry, cssSelector)?.innerText.replace(toReplace, '').trim()
}

export const value = (val: string): SearchSelector => {
  return () => val
}
