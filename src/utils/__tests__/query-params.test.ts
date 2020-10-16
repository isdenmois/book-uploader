import { queryParams } from '../query-params';

test('queryParams', () => {
  expect(queryParams()).toBe('');
  expect(queryParams({ field: 'value', list: ['one', 'two', 'three'] })).toBe(
    'field=value&list[]=one&list[]=two&list[]=three',
  );
  expect(queryParams({ field: 'тест test' })).toBe('field=%D1%82%D0%B5%D1%81%D1%82%20test');
});
