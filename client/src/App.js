import './App.css';
import {useEffect, useRef, useState} from 'react'
import randomWords from 'random-words';
import { v4 as uuidv4 } from 'uuid';

import hangman0 from './assests/hangman-0.png';
import hangman1 from './assests/hangman-1.png';
import hangman2 from './assests/hangman-2.png';
import hangman3 from './assests/hangman-3.png';
import hangman4 from './assests/hangman-4.png';
import hangman5 from './assests/hangman-5.png';
import hangman6 from './assests/hangman-6.png';
import hangman7 from './assests/hangman-7.png';
import hangman8 from './assests/hangman-8.png';


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

  // Create an array of hangman images
  const hangmanImages = [hangman8, hangman7, hangman6, hangman5, hangman4, hangman3, hangman2, hangman1, hangman0];
  const [hangmanImage, setHangmanImage] = useState(hangmanImages[0]);

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
    let correctGuess = false;

    for(let i = 0; i < gameWord.length; i++) {
      if (gameWord[i] === letter) {
        const correctGuessesCopy = [...correctGuesses];
        correctGuessesCopy.push(letter);
        setCorrectGuesses(correctGuessesCopy);

        correctGuess = true;
      }
    }

    if(!correctGuess) {
      setGuessesRemaining(guessesRemaining - 1);

      // Update the hangman image based on the remaining guesses
      const currentImageIndex = Math.max(0, hangmanImages.length - guessesRemaining);
      setHangmanImage(hangmanImages[currentImageIndex]);
    }

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
    setHangmanImage(hangmanImages[0]);
    
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
        <img src={hangmanImage} alt="hangman" />
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
