/**
 * @jest-environment jsdom
 */
import { mount } from '@vue/test-utils'

import SearchInput from '../search-input.vue'
import { queryAtom } from '../../model'

describe('<SearchInput />', () => {
  it('should get query from store', () => {
    queryAtom.set('Harry')

    const wrapper = mount(SearchInput)

    expect(wrapper.get<HTMLInputElement>('input').element.value).toBe('Harry')
  })

  it('should set query on event', async () => {
    const wrapper = mount(SearchInput)

    await wrapper.get<HTMLInputElement>('input').setValue('Hyperion')

    expect(queryAtom.get()).toBe('Hyperion')
  })
})
