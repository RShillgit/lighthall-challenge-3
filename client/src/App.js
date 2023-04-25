import './App.css';

function App() {

  const KEYS = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
  
  return (
    <div className="App">
      <h1>Hangman</h1>
      <div className="gallowsContainer"></div>
      <div className="gameWordContainer"></div>
      
      <div className='keyboardContainer'>
        {KEYS.map(key => {
          return (
            <button key={key}>{key}</button>
          )
        })}
      </div>
    </div>
  );
}

export default App;
