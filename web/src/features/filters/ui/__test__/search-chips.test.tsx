/**
 * @jest-environment jsdom
 */
import { screen, render, fireEvent } from 'solid-testing-library'
import '@testing-library/jest-dom'

import { SearchChips } from '../search-chips'
import { $source, $ext } from '../../model'

describe('<SearchChips />', () => {
  it('should get filters from store', () => {
    render(() => <SearchChips />)

    expect(screen.getByText('Flibusta').classList).toContain('selected')
    expect(screen.getByText('ZLib').classList).not.toContain('selected')

    expect(screen.queryByText('EPUB')).toBeNull()
  })

  it('should show extenstion when zlib selected', () => {
    render(() => <SearchChips />)

    fireEvent.click(screen.getByText('ZLib'))

    expect($source.get()).toBe('ZLIB')

    expect(screen.getByText('Flibusta').classList).not.toContain('selected')
    expect(screen.getByText('ZLib').classList).toContain('selected')

    expect(screen.queryByText('EPUB')).toBeInTheDocument()
  })

  it('should hide extenstions back when flibusta selected', () => {
    $source.set('ZLIB')
    render(() => <SearchChips />)

    fireEvent.click(screen.getByText('Flibusta'))

    expect($source.get()).toBe('FLIBUSTA')

    expect(screen.getByText('Flibusta').classList).toContain('selected')
    expect(screen.getByText('ZLib').classList).not.toContain('selected')

    expect(screen.queryByText('EPUB')).not.toBeInTheDocument()
  })

  it('should change extenstions by click on them', () => {
    $source.set('ZLIB')
    $ext.set('pdf')
    render(() => <SearchChips />)

    const epubChip = screen.getByText('EPUB')
    const fb2Chip = screen.getByText('FB2')
    const pdfChip = screen.getByText('PDF')

    fireEvent.click(epubChip)
    expect($ext.get()).toBe('epub')

    expect(epubChip.classList).toContain('selected')
    expect(pdfChip.classList).not.toContain('selected')

    fireEvent.click(fb2Chip)
    expect($ext.get()).toBe('fb2')

    expect(epubChip.classList).not.toContain('selected')
    expect(fb2Chip.classList).toContain('selected')

    fireEvent.click(pdfChip)
    expect($ext.get()).toBe('pdf')

    expect(fb2Chip.classList).not.toContain('selected')
    expect(pdfChip.classList).toContain('selected')
  })
})
