import React, { Suspense } from 'react'
import { ActivityIndicator } from './activity-indicator'
import { Box } from './theme'

export function withSuspense<T>(Component: T): T {
  const CMP: any = Component

  return (props => {
    const loader = (
      <Box mt={2} flex={1}>
        <ActivityIndicator size='large' color='searchSelected' />
      </Box>
    )

    return (
      <Suspense fallback={loader}>
        <CMP {...props} />
      </Suspense>
    )
  }) as any
}
