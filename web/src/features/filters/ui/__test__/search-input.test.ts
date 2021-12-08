/**
 * @jest-environment jsdom
 */
import { mount } from '@vue/test-utils'

import SearchInput from '../search-input.vue'
import { $query } from '../../model'

describe('<SearchInput />', () => {
  it('should get query from store', () => {
    $query.set('Harry')

    const wrapper = mount(SearchInput)

    expect(wrapper.get<HTMLInputElement>('input').element.value).toBe('Harry')
  })

  it('should set query on event', async () => {
    const wrapper = mount(SearchInput)

    await wrapper.get<HTMLInputElement>('input').setValue('Hyperion')

    expect($query.get()).toBe('Hyperion')
  })
})
