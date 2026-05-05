import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-5xl flex-col items-center justify-center gap-6 p-8 text-center">
      <h1 className="text-4xl font-semibold tracking-tight">Vite + React</h1>
      <div className="rounded-lg border border-border p-8">
        <button
          className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
          onClick={() => setCount((count) => count + 1)}
        >
          count is {count}
        </button>
        <p className="mt-4 text-sm text-muted-foreground">
          Edit <code>src/app/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="text-sm text-muted-foreground">
        Click on the Vite and React logos to learn more
      </p>
    </main>
  )
}

export default App
