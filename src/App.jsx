import { useState, useEffect } from "react";
import "./App.css";
import VoiceInputButton from "./VoiceInputButton";
import VirtualKeyboard from "./VirtualKeyboard";
import WordDisplay from "./WordDisplay";
import HangmanDrawing from "./HangmanDrawing";
import { wordList } from "./words";
import axios from "axios";

function App() {

  const speak = async (textArray) => {
    const text = textArray.join(" ");
    try {
      const response = await axios.post(
        "https://mangoshaykh.pythonanywhere.com/generate_speech",
        {
          text: text,
        },
        {
          responseType: "blob",
        }
      );

      const audioUrl = URL.createObjectURL(response.data);
      const audio = new Audio(audioUrl);
      audio.play();

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
      };
    } catch (error) {
      console.error("Error generating speech:", error);
    }
  };

  const getRandomWord = (words) => {
    return words[Math.floor(Math.random() * words.length)];
  };

  const [wordObj, setWordObj] = useState(getRandomWord(wordList));
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [incorrectGuesses, setIncorrectGuesses] = useState([]);

  const [hasWon, setHasWon] = useState(false);
  const [hasLost, setHasLost] = useState(false);

  const resetGame = () => {
    // Set all states to their initial values
    setWordObj(getRandomWord(wordList));
    setGuessedLetters([]);
    setIncorrectGuesses([]);
    setHasWon(false);
    setHasLost(false);
  };

  const handleLetterGuess = (letter) => {
    
    if (guessedLetters.includes(letter) || incorrectGuesses.includes(letter)) {
      return;
    }

    // If the letter is part of the word, add it to the guessedLetters.
    if (wordObj.word.includes(letter)) {
      setGuessedLetters((prevLetters) => [...prevLetters, letter]);
    } else {
      
      setIncorrectGuesses((prevIncorrect) => [...prevIncorrect, letter]);
    }

   
    setGuessedLetters((prevLetters) => {
      if (wordObj.word.split("").every((char) => prevLetters.includes(char))) {
        setHasWon(true);
      }
      return prevLetters;
    });

    
    setIncorrectGuesses((prevIncorrect) => {
      if (prevIncorrect.length >= 8) {
        setHasLost(true);
      }
      return prevIncorrect;
    });
  };

  useEffect(() => {
    const wordWithConsecutiveUnderscoresReplaced = wordObj.word
      .split("")
      .map((letter) => (guessedLetters.includes(letter) ? letter : "_"))
      .join("")
      .replace(/_+/g, "_");

    const currentWordStateArray = wordWithConsecutiveUnderscoresReplaced
      .split("_")
      .filter((fragment) => fragment.length > 0);

      if (currentWordStateArray.length > 0) {
        speak(currentWordStateArray);
      }
    
  }, [guessedLetters]);

  return (
    <div className="App">
      <h1>ہیلپفل ہینگمین</h1>

      {/* Game Status Messages */}
      {hasWon && (
        <div className="win-message">
          آپ جیت گئے! لفظ تھا: {wordObj.word.toUpperCase()}
          <button className="reset-button" onClick={resetGame}>
            دوبارہ کوشش کریں
          </button>
        </div>
      )}
      {hasLost && (
        <div className="loss-message">
          آپ ہار گئے! لفظ تھا: {wordObj.word.toUpperCase()}
          <button className="reset-button" onClick={resetGame}>
            دوبارہ کوشش کریں
          </button>
        </div>
      )}

      <div className="game-container" dir="rtl">
        <div className="left-column">
          <WordDisplay word={wordObj.word} guessedLetters={guessedLetters} />
          <div className="hint">اشارہ: {wordObj.hint}</div>
          <VirtualKeyboard
            onLetterClick={handleLetterGuess}
            disabledLettersCorrect={guessedLetters}
            disabledLettersIncorrect={incorrectGuesses}
          />
        </div>

        <div className="right-column">
          <div className="drawing-border">
            <HangmanDrawing incorrectGuessCount={incorrectGuesses.length} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
