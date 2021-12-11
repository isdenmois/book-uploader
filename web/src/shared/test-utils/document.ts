export function mockCreateElement<T extends HTMLElement = HTMLElement>(initial: any): T {
  const element = { ...initial }

  jest.spyOn(document, 'createElement').mockReturnValue(element)

  return element
}
