import React, {useState, useEffect } from "react"
import Game from "./components/game"

function Play(){
    
    const words = Game()
    const [word, setWord] = useState<string>('')
    const [tagAnswer, setTagAnswer] = useState<string[]>([])

    // Timer and time constraints
    const [timer, setTimer] = useState(10)
    const [timeConstraint, setTimeConstraint] = useState(9)

    // Player answer
    const [answer, setAnswer] = useState('')
    const checkAnswer = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter'){
            setAnswer('')
            if (tagAnswer.includes(answer)){
                console.log('Correct')
            }
            console.log(answer)
        }
    }

    // Initialize a word
    useEffect(() => {
        if (Object.keys(words).length > 0) {
            const keys = Object.keys(words)
            const key = keys[Math.floor(Math.random() * keys.length)]
            const value = words[key]
            setWord(key)
            setTagAnswer(value)
        }
    }, [words])

    // Randomize the word once the timer resets
    useEffect(() => {
        if (timer > 0) {
            const id = setInterval(() => {
                setTimer(timer - 1)
            }, 1000)
            return () => clearInterval(id)
        } else {
            setTimer(timeConstraint)
            if (timeConstraint > 5){
                setTimeConstraint(timeConstraint - 1)
            }
            const keys = Object.keys(words)
            const key = keys[Math.floor(Math.random() * keys.length)]
            const value = words[key]
            setWord(key)
            setTagAnswer(value)
        }
    }, [timer, words, timeConstraint])

    return (
    <>
        <span>{word}</span>
        <input onKeyDown={checkAnswer} 
        onChange={(e) => {setAnswer(e.target.value.trim().toLowerCase())}}
        value={answer}/>
        <span>Answer: {tagAnswer}</span>
        <span>{timer}</span>
    </>
    )
}

export default Play