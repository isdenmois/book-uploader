/**
 * @jest-environment jsdom
 */
import { screen, render } from 'solid-testing-library'
import '@testing-library/jest-dom'

import { Button } from '../button'

test('<Button />', () => {
  render(() => <Button>hello</Button>)

  expect(screen.getByText('hello')).toBeInTheDocument()
})
