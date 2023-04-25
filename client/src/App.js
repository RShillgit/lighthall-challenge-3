import './App.css';
import {useEffect, useState} from 'react'

function App() {

  const KEYS = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]

  const [startMenu, setStartMenu] = useState();
  
  // On mount 
  useEffect(() => {

    // Render start menu display
    setStartMenu(
      <div className='startMenu-container'>
        <div className='startMenu-options'>
          <button onClick={playAgainstComputer}>Play Against Computer</button>
          <button onClick={playAgainstPlayer}>Play Against Friend</button>
        </div>
      </div>
    )

  }, [])

  // Run game vs computer
  const playAgainstComputer = () => {

    // Remove start menu overlay
    setStartMenu();

    console.log("PLAYING AGAINST COMPUTER")
  }

  // Run game vs player
  const playAgainstPlayer = () => {

    // Remove start menu overlay
    setStartMenu();

    console.log("PLAY AGAINST PLAYER")
  }

  return (
    <div className="App">

      {startMenu /* Overlay that will give options for playing against computer or player */}

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
