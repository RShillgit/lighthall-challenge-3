import './App.css';
import {useEffect, useRef, useState} from 'react'
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

  const nameInput = useRef();

  const gamesWon = useRef();
  
  // On mount 
  useEffect(() => {

    // Set games won to zero
    gamesWon.current = 0;

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

        // Incriment number of games won
        gamesWon.current += 1;
        console.log("Games Won:", gamesWon.current)

        // Display winner screen
        setWinnerScreen(
          <div className='winnerScreenContainer'>
            <div className='overlayContent'>
              <h1>You Won!</h1>
              <div className='winnerButtons'>
                <button onClick={continueGame}>Continue</button>
                <button onClick={quitGame}>Quit</button>
              </div>
            </div>
          </div>
        )
      }
    }
  }, [correctGuesses])

  // Anytime guesses remaining changes, check if user LOST
  useEffect(() => {

    // If there are no more guesses remaining, the user has LOST
    if (guessesRemaining === 0) {
      setLoserScreen(gameOverDisplay);
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
    // No match, decrease incorrect guesses count
    if(!correctGuess) {
      setGuessesRemaining(guessesRemaining - 1);
    }

    // Incriment total guesses
    setTotalGuesses(totalGuesses + 1);
  }

  // Handles game over form submit
  const gameOverFormSubmit = (e) => {
    e.preventDefault();

    console.log("User's Name", nameInput.current)
    console.log("Games Won:", gamesWon.current)
  }

  // Continue game button click
  const continueGame = () => {

    // Remove winner screen
    setWinnerScreen();

    // Reset all variables
    setTotalGuesses(0);
    setCorrectGuesses([]);
    setGuessesRemaining(8);
    
    // Run play against computer function to create new word
    playAgainstComputer();
  }

  // Quit game button click
  const quitGame = () => {
    setWinnerScreen();
    setLoserScreen(gameOverDisplay);
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

  // Game over screen
  const gameOverDisplay = (
    <div className='loserScreenContainer'>
      <div className='overlayContent'>
        <h1>Game Over!</h1>
        <form onSubmit={gameOverFormSubmit} className='gameOverForm'>
          <input type="text" placeholder='Your Name' onChange={(e) => nameInput.current = e.target.value} required={true}/>
          <button>Submit</button>
        </form>
      </div>
    </div>
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

      <div className='computerGameQuit'>
        <button onClick={quitGame}>Quit</button>
      </div>
    </div>
  );
}

export default App;
