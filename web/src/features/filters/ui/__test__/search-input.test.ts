/**
 * @jest-environment jsdom
 */
import { createTestingPinia } from '@pinia/testing'
import { mount } from '@vue/test-utils'

import SearchInput from '../search-input.vue'
import { useFilters } from '../../model'

describe('<SearchInput />', () => {
  it('should get query from store', () => {
    const pinia = createTestingPinia()
    const filters = useFilters()

    filters.setQuery('Harry')

    const wrapper = mount(SearchInput, { global: { plugins: [pinia] } })

    expect(wrapper.get<HTMLInputElement>('input').element.value).toBe('Harry')
  })

  it('should set query on event', async () => {
    const pinia = createTestingPinia()
    const filters = useFilters()

    const wrapper = mount(SearchInput, { global: { plugins: [pinia] } })

    await wrapper.get<HTMLInputElement>('input').setValue('Hyperion')

    expect(filters.query).toBe('Hyperion')
  })
})
