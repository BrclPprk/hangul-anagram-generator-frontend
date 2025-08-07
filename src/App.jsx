import { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Welcome to My Frontend Project</h1>
      </header>
      <main className="app-main">
        <div className="counter">
          <p>Count: {count}</p>
          <button onClick={() => setCount((count) => count + 1)}>
            Increment
          </button>
        </div>
      </main>
      <footer className="app-footer">
        <p>© {new Date().getFullYear()} My Frontend Project</p>
      </footer>
    </div>
  );
}

export default App;
