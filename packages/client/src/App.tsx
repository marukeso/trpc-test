import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { QueryClient, QueryClientProvider } from 'react-query'

import './index.scss'
import { trpc } from './trpc'

const client = new QueryClient()

const AppContent = () => {
  const getMessages = trpc.useQuery(['getMessages'])

  const [user, setUser] = useState('')
  const [message, setMessage] = useState('')
  const addMessage = trpc.useMutation(['addMessage'])
  const onAdd = () => {
    addMessage.mutate(
      {
        user,
        message,
      },
      {
        onSuccess: () => {
          client.invalidateQueries(['getMessages'])
        },
      }
    )
  }

  return (
    <div className="mt-10 text-3xl mx-auto max-w-6xl">
      <div>
        {(getMessages.data ?? []).map((row) => (
          <div key={row.message}>
            {row.user} : {row.message}
          </div>
        ))}
      </div>

      <div className="mt-10">
        <input
          type="text"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          className="p-5 border-2 border-gray-300 rounded-lg w-full"
          placeholder="User"
        />
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="p-5 border-2 border-gray-300 rounded-lg w-full"
          placeholder="Message"
        />
      </div>

      <button onClick={onAdd}>Add message</button>
    </div>
  )
}

const App = () => {
  const [trpcClient] = useState(() =>
    trpc.createClient({
      url: 'http://localhost:8080/trpc',
    })
  )

  return (
    <trpc.Provider client={trpcClient} queryClient={client}>
      <QueryClientProvider client={client}>
        <AppContent />
      </QueryClientProvider>
    </trpc.Provider>
  )
}

ReactDOM.render(<App />, document.getElementById('app'))
