import { Component } from 'solid-js'
import { SearchInput } from './search-input'
import { SearchChips } from './search-chips'

interface Props {
  disabled?: boolean
  onSearch: () => void
}

export const SearchFilters: Component<Props> = props => {
  const onSubmit = (e: Event) => {
    e.preventDefault()
    props.onSearch()
  }

  return (
    <>
      <form onSubmit={onSubmit} class='px-4'>
        <SearchInput disabled={props.disabled} />
      </form>

      <div class='flex flex-row mt-4 mx-2 overflow-x-auto pb-2'>
        <SearchChips />
      </div>
    </>
  )
}
