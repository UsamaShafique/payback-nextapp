'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode, useState } from 'react'
import { WagmiConfig } from 'wagmi' // <-- correct provider
import { State } from 'wagmi'

import { getConfig } from '@/wagmi'

export function Providers(props: { children: ReactNode; initialState?: State }) {
  const [config] = useState(() => getConfig())
  const [queryClient] = useState(() => new QueryClient())

  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    </WagmiConfig>
  )
}
