import './App.css';
import {useEffect, useState} from 'react'
import randomWords from 'random-words';
import { v4 as uuidv4 } from 'uuid';

function App() {

  const KEYS = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]

  const [startMenu, setStartMenu] = useState();

  const [gameWord, setGameWord] = useState("");
  const [gameWordDisplay, setGameWordDisplay] = useState();

  const [totalGuesses, setTotalGuesses] = useState(0);
  const [correctGuesses, setCorrectGuesses] = useState([]);
  const [guessesRemaining, setGuessesRemaining] = useState(8);

  const [loserScreen, setLoserScreen] = useState();
  const [winnerScreen, setWinnerScreen] = useState();
  
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

  // Anytime the game word or total guesses change, set gameWordDisplay
  useEffect(() => {
    setGameWordDisplay(renderedGameWord);
  }, [gameWord, totalGuesses])

  // Anytime the correct guesses change see if the user WON
  useEffect(() => {

    if (correctGuesses.length > 0 && gameWord) {

      // Remove diplicate letters from gameWord and correctGuesses arrays
      const gameWordNoDuplicates = [...new Set(gameWord)];
      const correctGuessesNoDuplicates = [...new Set(correctGuesses)];

      // If the gameWord and correctGuesses are the same, the user has WON
      if(gameWordNoDuplicates.sort().join(',') === correctGuessesNoDuplicates.sort().join(',')) {
        setWinnerScreen(
          <div className='winnerScreenContainer'>
            <h1>You Won!</h1>
          </div>
        )
      }
    }
  }, [correctGuesses])

  // Anytime guesses remaining changes, check if user LOST
  useEffect(() => {

    // If there are no more guesses remaining, the user has LOST
    if (guessesRemaining === 0) {
      setLoserScreen(
        <div className='loserScreenContainer'>
          <h1>You Lost!</h1>
        </div>
      )
    }

  }, [guessesRemaining])

  // Run game vs computer
  const playAgainstComputer = () => {

    // Remove start menu overlay
    setStartMenu();

    // Get random word as an array of characters
    const randomlyGeneratedWord = randomWords().split('');
    
    console.log(randomlyGeneratedWord);

    setGameWord(randomlyGeneratedWord);

    console.log("PLAYING AGAINST COMPUTER");
  }

  // Run game vs player
  const playAgainstPlayer = () => {

    // Remove start menu overlay
    setStartMenu();

    console.log("PLAY AGAINST PLAYER")
  }

  // Handles each guess
  const letterGuess = (letter) => {

    // Variable to track if the guess is incorrect or not
    let correctGuess = false;

    // Search the game word for the clicked letter
    for(let i = 0; i < gameWord.length; i++) {

      // If there is a match
      if (gameWord[i] === letter) {

        // Add letter to correct guesses array
        const correctGuessesCopy = [...correctGuesses];
        correctGuessesCopy.push(letter);
        setCorrectGuesses(correctGuessesCopy);

        // Set correctGuess variable to true so we bypass the incorrect guesses
        correctGuess = true;
      }
    }
    // No match, increase incorrect guesses count and check if user lost
    if(!correctGuess) {
      setGuessesRemaining(guessesRemaining - 1);
    }

    // Incriment total guesses
    setTotalGuesses(totalGuesses + 1);
  }

  // Rendered Word Display
  const renderedGameWord = (
    <>
      {gameWord
        ? 
        <>
        {gameWord.map((character) => {
          return(
            <div className='gameWord-character' key={uuidv4()}>
              {(correctGuesses.includes(character))
                ?<p>{character}</p>
                :<></>
              }
            </div>
          )
        })}
        </>
        :<></>
      }
    </>
  )

  return (
    <div className="App">

      {startMenu /* Overlay that will give options for playing against computer or player */}
      {winnerScreen /* Overlay for winner */}
      {loserScreen /* Overlay for loser */}

      <h1>Hangman</h1>
      <div className="gallowsContainer"></div>
      
      <div>
        <p>Guesses Remaining: {guessesRemaining}</p>
      </div>

      <div className="gameWordContainer">
        {gameWordDisplay}
      </div>
      
      <div className='keyboardContainer'>
        {KEYS.map(key => {
          return (
            <button key={key} onClick={() => letterGuess(key)}>{key}</button>
          )
        })}
      </div>
    </div>
  );
}

export default App;
