import { Component, Show } from 'solid-js'
import { useSignal } from 'shared/lib/solid-nanostore'
import { Chip } from 'shared/ui'
import { $ext, $source } from '../model'

export const SearchChips: Component = () => {
  const source = useSignal($source)
  const ext = useSignal($ext)

  return (
    <>
      <Chip title='Flibusta' selected={source() === 'FLIBUSTA'} onSelect={() => $source.set('FLIBUSTA')} />
      <Chip title='Flibusta TOR' selected={source() === 'FLIBUSTA_TOR'} onSelect={() => $source.set('FLIBUSTA_TOR')} />
      <Chip title='ZLib' selected={source() === 'ZLIB'} onSelect={() => $source.set('ZLIB')} />

      <Show when={source() === 'ZLIB'}>
        <div class='w-4' />

        <Chip title='EPUB' selected={ext() === 'epub'} onSelect={() => $ext.set('epub')} />
        <Chip title='FB2' selected={ext() === 'fb2'} onSelect={() => $ext.set('fb2')} />
        <Chip title='PDF' selected={ext() === 'pdf'} onSelect={() => $ext.set('pdf')} />
      </Show>
    </>
  )
}
