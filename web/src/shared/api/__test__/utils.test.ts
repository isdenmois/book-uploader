import { querystring } from '../utils'

test('querystring', () => {
  expect(querystring()).toBe('')
  expect(querystring({ field: 'value', list: ['one', 'two', 'three'] })).toBe(
    '?field=value&list[]=one&list[]=two&list[]=three',
  )
  expect(querystring({ field: 'тест test' })).toBe('?field=%D1%82%D0%B5%D1%81%D1%82%20test')
})
