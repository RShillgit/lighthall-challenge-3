import './App.css';
import {useEffect, useRef, useState} from 'react'
import randomWords from 'random-words';
import { v4 as uuidv4 } from 'uuid';
import { EmailShareButton, FacebookShareButton, TwitterShareButton, EmailIcon, FacebookIcon, TwitterIcon } from 'react-share';
import {CopyToClipboard} from 'react-copy-to-clipboard';

import CryptoJS from 'crypto-js';

import hangman0 from './assests/hangman-0.png';
import hangman1 from './assests/hangman-1.png';
import hangman2 from './assests/hangman-2.png';
import hangman3 from './assests/hangman-3.png';
import hangman4 from './assests/hangman-4.png';
import hangman5 from './assests/hangman-5.png';
import hangman6 from './assests/hangman-6.png';
import hangman7 from './assests/hangman-7.png';
import hangman8 from './assests/hangman-8.png';
import noose from './assests/nooselogo.png';

function App() {

  const KEYS = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]

  const [startMenu, setStartMenu] = useState();

  const [gameWord, setGameWord] = useState("");
  const [gameWordDisplay, setGameWordDisplay] = useState();

  const [totalGuesses, setTotalGuesses] = useState(0);
  const [correctGuesses, setCorrectGuesses] = useState([]);
  const [guessesRemaining, setGuessesRemaining] = useState(8);

  const [wordInputScreen, setWordInputScreen] = useState();
  const [invalidLinkScreen, setInvalidLinkScreen] = useState();
  const [loserScreen, setLoserScreen] = useState();
  const [winnerScreen, setWinnerScreen] = useState();
  const [leaderboardScores, setLeaderboardScores] = useState();
  const [hint, setHintScreen] = useState();

  const wordInput = useRef();
  const nameInput = useRef();

  const gamesWon = useRef();

  // Create an array of hangman images
  const hangmanImages = [hangman8, hangman7, hangman6, hangman5, hangman4, hangman3, hangman2, hangman1, hangman0];
  const [hangmanImage, setHangmanImage] = useState(hangmanImages[0]);
  const nooseLogo = noose;

  const serverURL = 'http://localhost:8000';

  // On mount 
  useEffect(() => {

    // Set games won to zero
    gamesWon.current = 0;

    // IF url has the query string
    if(window.location.search.includes('?word=')) {
      
      fetch(`${serverURL}/${window.location.search}`, {
        headers: { "Content-Type": "application/json" },
        mode: 'cors'
      })
      .then(res => res.json())
      .then(data => {

        // If link is valid, start game with decrpyted word
        if(data.success) {
          const decryptedGameWord = data.decryptedWord.split('');
          setGameWord(decryptedGameWord);
        }

        // If the link is invalid, display error overlay
        else {
          setInvalidLinkScreen(
            <div className='invalidLinkScreen'>
              <h1>{data.err}</h1>
              <a href='/'>
                <button>Main Menu</button>
              </a>
            </div>
          )
        }

      })
      .catch(err => console.log(err))
    } 

    // Else render start menu
    else {

      // Render start menu display
      setStartMenu(startMenuDisplay)
    }

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

    setGameWord(randomlyGeneratedWord);
  }

  // Run game vs player
  const playAgainstPlayer = () => {

    // Remove start menu overlay
    setStartMenu();

    setWordInputScreen(
      <div className='formContainer'>
        <form className='generateLink' onSubmit={urlGenerator}>
          <input className='playerWord' type="text" placeholder='Word' onChange={(e) => wordInput.current = e.target.value.toLowerCase()} required={true}/>
          <button className='linkButton'>Generate Link</button>
        </form>
      </div>
    )
  }

  // Handles each guess
  const letterGuess = (letter) => {
    let correctGuess = false;
    const letterClicked = document.getElementById(letter)
    letterClicked.disabled = true;
    
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
      const currentImageIndex = Math.max(0, hangmanImages.length - guessesRemaining);
      setHangmanImage(hangmanImages[currentImageIndex]);
    }
  
    setTotalGuesses(totalGuesses + 1);
  }  

  //extract definition
  async function getDefinition(word) {
    const response = await fetch(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=8be9f87e-3ee9-4572-8416-8cebdc1cfd92`);
    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      return data[0].shortdef.join('\n');
    } else {
      throw new Error('Word not found in the dictionary.');
    }
  }

  //get hint
  const handleGetHint = async () => {
    try {
      const definition = await getDefinition(gameWord);
      if(definition.length > 0){
        setHintScreen(`Definition: ${definition}`);
      }else{
        setHintScreen('No definition hint for this word.');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const urlGenerator = async (e) => {
    e.preventDefault();
  
    // Handle invalid inputs
    if (!/^[A-Za-z]*$/.test(wordInput.current)) {
      setWordInputScreen(
        <div className='formContainer'>
          <form className='generateLink' onSubmit={urlGenerator}>
            <input className='playerWord' type="text" placeholder='Word' onChange={(e) => wordInput.current = e.target.value.toLowerCase()}/>
            <button className='linkButton'>Generate Link</button>
            <p className='errorMessage'>Word must contain only letters</p>
          </form>
        </div>
      )
    } else {
      try {
        // Check if word exists in dictionary
        const definition = await getDefinition(wordInput.current);
        // Encrypt word
        const encryptedWord = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(wordInput.current));
        
        const playerURL = `http://localhost:3000/?word=${encryptedWord}`
        
        // Display URL with encrypted word 
        setWordInputScreen(
          <div className='generatedLinkContainer'>
          <div>
            <input className='generatedLink' type="text" value={playerURL} readOnly={true}/>
              <CopyToClipboard text={playerURL}>
                <button className='linkCopyButton'><i className="fa fa-clipboard" aria-hidden="true"></i> Copy</button>
              </CopyToClipboard>
              
    
              <EmailShareButton
                className='emailButton'
                url={playerURL}
                quote={'Play Hangman with me!'}
                hashtag="#hangman"
              >
                <EmailIcon size={64} round />
              </EmailShareButton>
    
              <FacebookShareButton
                className='facebookButton'
                url={playerURL}
                quote={'Play Hangman with me!'}
                hashtag="#hangman"
              >
                <FacebookIcon size={64} round />
              </FacebookShareButton>
    
              <TwitterShareButton
                className='twitterButton'
                url={playerURL}
                quote={'Play Hangman with me!'}
                hashtag="#hangman"
              >
                <TwitterIcon size={64} round />
              </TwitterShareButton>
            </div>
            
            <div>
            <button className='mainMenuButton' onClick={() => window.location = window.location.pathname}>Main Menu</button>
          </div>
          </div>
        );
      } catch (error) {
        // Word not found in dictionary
        setWordInputScreen(
          <div className='formContainer'>
            <form className='generateLink' onSubmit={urlGenerator}>
              <input className='playerWord' type="text" placeholder='Word' onChange={(e) => wordInput.current = e.target.value.toLowerCase()}/>
              <button className='linkButton'>Generate Link</button>
              <p className='errorMessage'>{"Word cannot be found"}</p>
            </form>
          </div>
        )
      }
    }
  }

  // Handles game over form submit
  const gameOverFormSubmit = (e) => {
    e.preventDefault();

    // clear all variables
    setTotalGuesses(0);
    setCorrectGuesses([]);
    setGuessesRemaining(8);
    setHangmanImage(hangmanImages[0]);
    setHintScreen();

    fetch(serverURL, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: nameInput.current,
        gamesWon: gamesWon.current
      })
    })
    .then(res => res.json())
    .then(data => {
      setLeaderboardScores(data.topHighScores);
      setLoserScreen();
    })
    .catch(err => console.log(err))
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
    setHintScreen();

    // Set keys back to normal
    const allKeys = document.querySelectorAll('.keyboardKey');
    allKeys.forEach(key => {
      key.disabled = false;
    })
    
    // Run play against computer function to create new word
    playAgainstComputer();
  }

  // Quit game button click
  const quitGame = () => {
    setWinnerScreen();
    setLoserScreen(gameOverDisplay);
  }

  // Get and display leaderboard
  const viewLeaderboard = () => {
    fetch(`${serverURL}/leaderboard`, {
      headers: { "Content-Type": "application/json" },
      mode: 'cors'
    })
    .then(res => res.json())
    .then(data => {
      setLeaderboardScores(data.topHighScores);
      setStartMenu();
    })
    .catch(err => console.log(err))
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

  // Start menu screen
  const startMenuDisplay = (
    <div className='startMenu-container'>
      <div className='startMenuTitle'>
        <h1>Hangman</h1>
      </div>
      <div className='logoContainer'>
        <img src={nooseLogo} alt='noose logo' width="256" height="256"></img>
      </div>
      <div className='startMenu-options'>
        <button onClick={playAgainstComputer}>Play Against Computer</button>
        <button onClick={playAgainstPlayer}>Play Against Friend</button>
      </div>
      <div className='viewLeaderboard'>
        <button onClick={viewLeaderboard}>High Scores</button>
      </div>
    </div>
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

  // Main game page
  const mainGame = (
    <>
      <div>
        <h1>Hangman</h1>
      </div>
      <div className="gallowsContainer">
        <img src={hangmanImage} alt="hangman" />
        <div className='gameScreen'>
          <p>Guesses Remaining: {guessesRemaining}</p>
          <div className="gameWordContainer">
          {gameWordDisplay}
          </div>
        </div>

      </div>
        
      <div className='hintContainer'>
        <div className='hintButton'>
        <p className='definitionHint'>{hint}</p>
          {guessesRemaining === 1 && <button onClick={handleGetHint}>Hint</button>}
        </div>
      </div>
      
      <div className='keyboardContainer'>
        {KEYS.map(key => {
          return (
            <button className='keyboardKey' id={key} key={key} onClick={() => letterGuess(key)}>{key}</button>
          )
        })}
      </div>

      <div className='computerGameQuit'>
        <button onClick={quitGame}>Quit</button>
      </div>
    </>
  )

  return (
    <div className="App">
    
      {(startMenu || winnerScreen || loserScreen || wordInputScreen || invalidLinkScreen || leaderboardScores)
        ? 
        <>
          {startMenu /* Overlay that will give options for playing against computer or player */}
          {winnerScreen /* Overlay for winner */}
          {loserScreen /* Overlay for loser */}
          {wordInputScreen /* Overlay for vs player word input */}
          {invalidLinkScreen /* Overlay for invalid link */}

          <>
            {(leaderboardScores)
              ?
              <div className='leaderboardContainer'>
                <div>
                  <h1>High Scores</h1>
                </div>
                <div className='scoreDisplay'>
                  <div className='scoreTitles'>
                    <p className='scoreNames'>Name</p>
                    <p className='scoreTotals'>Score</p>
                  </div>
                  {leaderboardScores.map((score, i) => {
                    return (
                      <div className='individualScore' key={score._id}>
                        <p><span>{i+1}.</span> {score.name}</p> 
                        <p>{score.gamesWon}</p>
                      </div>
                    )
                  })}
                </div>
                <div>
                  <button className='mainMenuButton' onClick={
                    () => {
                      setLeaderboardScores();
                      setStartMenu(startMenuDisplay);
                    }}
                    >Main Menu
                  </button>
                </div>
              </div>
              : <></>
            }
          </>
        </>
        : 
        <>
          {mainGame}
        </>
      }

    </div>
  ); 
}

export default App;
