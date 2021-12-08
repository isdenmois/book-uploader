import { extAtom, queryAtom, sourceAtom } from './filters-store'

describe('Feature filters model', () => {
  it('should contain initial state', () => {
    expect(extAtom.get()).toBe('epub')
    expect(queryAtom.get()).toBe('')
    expect(sourceAtom.get()).toBe('FLIBUSTA')
  })
})
