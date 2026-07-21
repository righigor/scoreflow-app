// src/components/providers/app-provider.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Criamos o cliente do Query. Em apps reais, podemos customizar cache e retries aqui.
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Evita que o app trave a interface se o usuário perder internet (comum em ginásios)
        retry: 2,
        refetchOnWindowFocus: false, 
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}