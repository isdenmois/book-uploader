/**
 * @jest-environment jsdom
 */
import { render } from 'solid-testing-library'
import '@testing-library/jest-dom'

import { Spinner } from '../spinner'

test('<Spinner />', () => {
  const { container } = render(() => <Spinner />)

  expect(container.getElementsByClassName('circle')[0]).toBeInTheDocument()
})
