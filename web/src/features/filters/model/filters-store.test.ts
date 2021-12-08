import { $ext, $query, $source } from './filters-store'

describe('Feature filters model', () => {
  it('should contain initial state', () => {
    expect($ext.get()).toBe('epub')
    expect($query.get()).toBe('')
    expect($source.get()).toBe('FLIBUSTA')
  })
})
