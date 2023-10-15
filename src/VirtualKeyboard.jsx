import React from 'react';

const VirtualKeyboard = ({ onLetterClick, disabledLettersCorrect, disabledLettersIncorrect }) => {
    
    const urduAlphabet = 'ا ب پ ت ٹ ث ج چ ح خ د ڈ ذ ر ڑ ز ژ س ش ص ض ط ظ ع غ ف ق ک گ ل م ن ں و ہ ھ ء ی ے'.split(' ');

    const handleClick = (letter) => {
        onLetterClick(letter);
    };

    const getButtonStyle = (letter) => {
        if (disabledLettersCorrect.includes(letter)) {
            return "correct";
        } 
        if (disabledLettersIncorrect.includes(letter)) {
            return "incorrect";
        }
        return "";
    };

    return (
        <div className="keyboard">
            {urduAlphabet.map(letter => (
                <button 
                    key={letter}
                    onClick={() => onLetterClick(letter)}
                    disabled={disabledLettersCorrect.includes(letter) || disabledLettersIncorrect.includes(letter)}
                    className={getButtonStyle(letter)}
                >
                    {letter}
                </button>
            ))}
        </div>
    );
};

export default VirtualKeyboard;
