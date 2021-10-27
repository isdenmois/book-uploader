/**
 * @jest-environment jsdom
 */
import { shallowMount } from '@vue/test-utils'

import SearchFilters from '../search-filters.vue'

describe('<SearchFilters />', () => {
  it('should emit search event', async () => {
    const wrapper = shallowMount(SearchFilters)

    await wrapper.get('form').trigger('submit')

    expect(wrapper.emitted('search')).toHaveLength(1)
  })
})
