import dict from '../assets/words.txt'
import { useState, useEffect } from 'react'

export interface Word{
    [key: string]: string[]
}

function WordManger(){
    const [words, setWords] = useState<Word>({})
    
    // Processing the file
    useEffect(() => {
        
        fetch(dict)
        .then(response => response.text())
        .then(text => {
            const tokens = text.split('\n')
            const dict: Word = {}

            for (let i=0; i < tokens.length - 1; i++){
                const parsedLine = JSON.parse(tokens[i])
                const word = parsedLine.text.trim().split(' ');
                if (word.length == 2){
                    if (dict[word[0]]){
                        dict[word[0].toLowerCase()].push(word[1].toLowerCase())
                    } else{
                        dict[word[0].toLowerCase()] = [word[1].toLowerCase()]
                    }   
                }
            }

            setWords(dict)
        })
    }, [])
    
    return words
        
}


export default WordManger