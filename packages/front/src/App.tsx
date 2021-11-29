import { useState } from 'react';
import logo from './logo.svg';
import cls from './App.module.scss';

function App() {
  const [count, setCount] = useState(0);

  return (
      <div className={cls.App}>
        <header className={cls.AppHeader}>
          <img src={logo} className={cls.AppLogo} alt="logo" />
          <p>This is the base of the Thullo Frontend !</p>
          <p>
            <button
                className={cls.button}
                type="button"
                onClick={() => setCount((count) => count + 1)}
            >
              count is: {count}
            </button>
          </p>
          <p>
            Hello from <code>@thullo/front</code>.
          </p>
          <p>
            <a
                className={cls.AppLink}
                href="https://beta.reactjs.org/learn"
                target="_blank"
                rel="noopener noreferrer"
            >
              Learn React
            </a>
            {' | '}
            <a
                className={cls.AppLink}
                href="https://vitejs.dev/guide/features.html"
                target="_blank"
                rel="noopener noreferrer"
            >
              Vite Docs
            </a>
          </p>
        </header>
      </div>
  );
}

export default App;
