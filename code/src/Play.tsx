import React, {useState, useEffect, useCallback } from "react"
import WordManger from "./components/WordManager"
import styled from '@mui/styled-engine'
import { TextField, Box, Typography } from "@mui/material"
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

function Play(){
    // Styling
    const main = {
        width: '100%',
        position: 'relative',
        margin: '0 auto',
    }

    const container = {
        position: 'relative',
        maxWidth: '1000px',
        margin: '0 auto'
    }

    const Title = styled(Typography)({
        position: 'relative',
        textAlign: 'center',
        fontWeight: 800,
        fontSize: 25,
        display: 'block',
        textShadow: '0 0 10px #5A4EAE, 0 0 20px #5A4EAE, 0 0 30px #5A4EAE, 0 0 40px #5A4EAE, 0 0 50px #5A4EAE, 0 0 60px #5A4EAE, 0 0 70px #5A4EAE',
    })

    const Timer = styled('div')({
        position: 'relative',
        textAlign: 'center',
        fontWeight: 800,
        fontSize: 40,
        display: 'block',
        marginTop: '5%',
    })


    const playzone = {
        position: 'relative',
        display: 'block',
        margin: '0 auto',
        width: 'fit-content',
        verticalAlign: 'middle',
        height: '70px',
        marginTop: '15%'
    }

    const Prefix = styled('div')({
        position: 'relative',
        display: 'inline-block',
        verticalAlign: 'middle',
        borderRadius: '10px 0px 0px 10px',
        background: '#A47CF3',
        color:'#0D042A',
        height: '100%',
        paddingLeft: '70px',
        paddingRight: '70px'
    })

    const playerAnswer = {
        position: 'relative',
        display: 'inline-block',
        backgroundColor: 'white',
        borderRadius: '0px 10px 10px 0px',
        fontWeight: 800,
        height: '100%',
        width: '400px',
        '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
                borderColor: 'transparent'
            },
            '&:hover fieldset': {
            borderColor: 'transparent',
            },
            '& .MuiInputBase-input': {
                fontWeight: 800,
                fontSize: 30,
                color: '#0D042A'
            },
            '& fieldset': { 
            border: 'none', 
            },
        },
    }

    const dialogbttn = {
        backgroundColor: '#A47CF3',
        color: 'white',
        fontWeight: 800,
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: '#5A4EAE',
            cursor: 'pointer',
        }
    }

    // Game Logic
    const [CURRENT_STATE, SET_CURRENT_STATE] = useState<string>('lose')
    const words = WordManger()
    const [prefix, setPrefix] = useState<string>('')
    const [tagAnswer, setTagAnswer] = useState<string[]>([])
    const [isCorrect, setIsCorrect] = useState<boolean>(false)
    const [correctAsnwer, setCorrectAnswer] = useState<number>(0)
    

    // Timer and time constraints
    const [timer, setTimer] = useState(15)
    const [timeConstraint, setTimeConstraint] = useState(14)

    // Player answer
    const [answer, setAnswer] = useState('')
    const checkAnswer = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter'){
            setAnswer('')
            if (tagAnswer.includes(answer)){
                setIsCorrect(true)
            }else{
                setAnswer('')
            }
        }
    }

    //Restart timer and randomize the word
    const restart = useCallback(() => {
        setTimer(15)
        setTimeConstraint(14)
        setAnswer('')
    }, [])

    // Randomize the word
    const randomWord = useCallback(() => {
        const keys = Object.keys(words).filter(key => words[key].length > 8)
        const key = keys[Math.floor(Math.random() * keys.length)]
        const value = words[key] as string[]
        setPrefix(key)
        setTagAnswer(value)
    }, [words, setPrefix, setTagAnswer])


    // Initialize a word
    useEffect(() => {
        if (Object.keys(words).length > 0 && prefix === '') {
            randomWord()
        }
    }, [words, prefix, randomWord])
    
    // Reset timer if no correct guess and with time constraint if corrrect guess
    useEffect(() => {
        // if (isCorrect){ // this part keep running twice
        //     setTimer(timeConstraint)
        //     if (timeConstraint > 5){
        //         setTimeConstraint(timeConstraint - 1)
        //     }
        //     const tmp = prefix + answer
        //     if (!correctAsnwer.includes(tmp)){
        //         correctAsnwer.push(tmp)
        //         console.log(correctAsnwer)
        //     }
        //     setIsCorrect(false)
        //     randomWord()
        // }
        if (timer > 0) {
            const id = setInterval(() => {
                setTimer(timer - 1)
            }, 1000)

            return () => clearInterval(id)

        } else{
            setTimer(timeConstraint)
            if (timeConstraint > 5){
                setTimeConstraint(timeConstraint - 1)
            }
            if (!isCorrect){
                setOpen(true)
                SET_CURRENT_STATE('lose')
                restart()
            }
            randomWord()
            setAnswer('')
        }
    }, [timer, timeConstraint, isCorrect, correctAsnwer, prefix, answer, randomWord, restart])

    useEffect(() => {
        if (isCorrect){ 
            setTimer(timeConstraint)
            if (timeConstraint > 5){
                setTimeConstraint(timeConstraint - 1)
            }
            setCorrectAnswer(correctAsnwer + 1)
            setIsCorrect(false)  
            randomWord()
        }
    }, [isCorrect, timeConstraint, correctAsnwer, randomWord])

    useEffect(() => {
        if (correctAsnwer == 15){
            setOpen(true)
            SET_CURRENT_STATE('win')
        }
    
    }, [correctAsnwer])

    
    // Dialog Popup
    const [open, setOpen] = useState(false)
    const toggleDialog = () => (setOpen(!open))

    return (
    <>
        <Box sx={main}>
            <Box sx={container}>
                <Title sx={{marginTop: '2%'}}>TECHDAY 2024</Title>
                <Title> NỐI TỪ</Title>
                <Timer>{timer}</Timer>
                Correct: {correctAsnwer} / 15
                <Box sx={playzone}>
                    <Prefix>
                        <Typography sx={{color: 'black', 
                            fontWeight: 800, fontSize: 30, 
                            position:'absolute',
                            top: 'calc(50% - 20px)',
                            transform: 'translateX(-50%)'}}>
                            {prefix}
                        </Typography>
                    </Prefix>
                    <TextField
                        sx={playerAnswer}
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        onKeyDown={checkAnswer}
                        autoComplete="off"/>
                </Box>
            </Box>
        </Box>
        {open &&(
            <>
            <React.Fragment>
                <Dialog
                    open={open}
                    onClose={toggleDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    PaperProps={{
                        style: {
                            backgroundColor: 'white',
                        },
                    }}
                >
                    <DialogTitle sx={{fontSize: 25, fontWeight: 900, textAlign: 'center'}} id="alert-dialog-title">
                    {CURRENT_STATE == 'lose' ? 'Trò chơi đã kết thúc!': ''}
                    {CURRENT_STATE == 'win' ? 'Chúc mừng bạn đã chiến thắng!': ''}
                    </DialogTitle>
                    <DialogContent>
                    <DialogContentText sx={{fontSize: 15, textAlign:'center'}}id="alert-dialog-description">
                        {CURRENT_STATE == 'lose' ? 'Bạn đã thua cuộc, hãy thử lại nhé =))' : ''}
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    <Button sx={dialogbttn} onClick={toggleDialog}>Ok</Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
            </>
        )}
    </>
    )
}

export default Play