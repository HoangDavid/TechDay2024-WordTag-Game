import React, {useState, useEffect} from "react"
import WordManger from "./components/WordManager"
import styled from '@mui/styled-engine'
import { TextField, Box, Typography } from "@mui/material"
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import './play.css'
import bot from './assets/bot.gif'

const instructions= [
    'Chào mừng bạn đến AI là Vua Tiếng Việt!',
    'Trước khi chơi thì mình sẽ giải thích luật chơi nhé!',
    'Mình sẽ đưa ra một từ tiếng Việt, bạn cần phải nối từ tiếp theo mà bạn nghĩ đến.',
    'Để thắng cuộc, bạn cần phải trả lời đúng 15 câu hỏi.',
    'Không được trả lời trễ quá thời gian, nếu không bạn sẽ thua cuộc.',
    'Chúc bạn may mắn!',
]
let instruction_index = 0


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

    const Timer = styled('div')({
        position: 'relative',
        textAlign: 'center',
        fontWeight: 800,
        fontSize: 40,
        display: 'block',
        marginTop: '2%',
    })


    const playzone = {
        position: 'relative',
        display: 'block',
        margin: '0 auto',
        width: 'fit-content',
        verticalAlign: 'middle',
        height: '70px',
        marginTop: '5%'
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

    // GAME LOGIC
    const [CURRENT_STATE, SET_CURRENT_STATE] = useState<string>('start')
    const words = WordManger()
    const [prefix, setPrefix] = useState<string>('')
    const [tagAnswer, setTagAnswer] = useState<string[]>([])
    const [isCorrect, setIsCorrect] = useState<boolean>(false)
    const [enterPressed, setEnterPressed] = useState(false);
    const [correctAsnwer, setCorrectAnswer] = useState<number>(0)

    const [BotPrefix, setBotPrefix] = useState<string>('')

    // Timer and time constraints
    const [timer, setTimer] = useState(15)
    const [timeConstraint, setTimeConstraint] = useState(14)

    const getRandomWord = () => {
        const keys = Object.keys(words).filter(key => words[key].length > 10)
        const k = keys[Math.floor(Math.random() * keys.length)]
        const v = words[k] as string[]
        setBotPrefix(k)

        let tmp = 0
        let key = ''
        for (let i = 0; i < v.length; i++){
            if (v[i] in words && words[v[i]].length > tmp){
                tmp = words[v[i]].length
                key = v[i]
            }
        }
        
        const value = words[key] as string[]
        
        return [key, value]
    }
    // Initialize a word
    useEffect(() => {
        if (CURRENT_STATE == 'play' && Object.keys(words).length > 0 && prefix === '') {
            const [key, value] = getRandomWord()
            setPrefix(key as string)
            setTagAnswer(value as string[])
        }
    }, [words, CURRENT_STATE])

    // Get player answer
    const [answer, setAnswer] = useState('')
    const checkAnswer = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter'){
            if (tagAnswer.includes(answer)){
                setIsCorrect(true)
                setEnterPressed(prev => !prev)
                setAnswer('')
            }else{
                setAnswer('')
            }
        }
    }
    
    // Reset timer if no correct guess and with time constraint if corrrect guess
    useEffect(() => {
        if (CURRENT_STATE === 'play'){
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
                    setTimer(15)
                    setTimeConstraint(14)
                }
                setAnswer('')
            }
        }

    }, [timer, CURRENT_STATE])

    // Check if player answer is correct
    useEffect(() => {
        if (isCorrect){
            setCorrectAnswer(correctAsnwer + 1)
            setIsCorrect(false)
            
            // Check if player wins
            if (correctAsnwer == 14){
                setOpen(true)
                SET_CURRENT_STATE('win')
                setTimer(15)
                setTimeConstraint(14)
            }else{
                setTimer(timeConstraint)
                if (timeConstraint > 5){
                    setTimeConstraint(timeConstraint - 1)
                }
                setAnswer('')
                const [key, value] = getRandomWord()
                setPrefix(key as string)
                setTagAnswer(value as string[])
            }
        }
    }, [enterPressed])
    
    // Dialog Popup, stop timer and restart game
    const [open, setOpen] = useState(false)
    const toggleDialog = () => {
        setOpen(!open)
        SET_CURRENT_STATE('start')
        setCorrectAnswer(0)
        instruction_index = 0
    }

    // Bot typing effect
    const [displayResponse, setDisplayResponse] = useState('');
    const [completedTyping, setCompletedTyping] = useState(false);
    
    useEffect(() => {
        setCompletedTyping(false);
        let stringResponse = '';
        if (CURRENT_STATE == 'start'){
            stringResponse = instructions[instruction_index]
        }else if (CURRENT_STATE == 'play'){
            stringResponse = `Từ tiếp theo là: ${BotPrefix} ${prefix}`
        }
        let i = 0
        const intervalId = setInterval(() => {
          setDisplayResponse(stringResponse.slice(0, i));
      
          i++;
      
          if (i > stringResponse.length) {
            clearInterval(intervalId);
            setCompletedTyping(true);
            
            if (CURRENT_STATE == 'start' && instruction_index < instructions.length - 1) {
                setTimeout(() => {
                    instruction_index++;
                    setDisplayResponse('');
                    setCompletedTyping(false);
                }, 4000)
            }else if (CURRENT_STATE == 'start' && instruction_index == instructions.length - 1){
                setTimeout(() => {
                    setPrefix('')
                    SET_CURRENT_STATE('play')
                }, 4000)
            }
          }
        }, 20);

      
        return () => clearInterval(intervalId);
      }, [instructions, instruction_index, BotPrefix, CURRENT_STATE]);

    return (
    <>
        <Box sx={main}>
            <Box sx={container}>
            <div style={{position: 'absolute', left: 0, top: 15, fontSize: 20, fontWeight: 800}}>Correct: {correctAsnwer} / 15</div>
                <div className="title" style={{marginTop: '2%'}}>TECHDAY 2024</div>
                <div className="title">NỐI TỪ</div>
                <Timer>{timer}</Timer>
                <div style={{display: 'block',marginLeft: '10%'}}>
                    <img src={bot} alt="" style={{verticalAlign: 'middle'}}/>
                    <div className="talk-bubble tri-right left-in">
                        <span>
                        {displayResponse}
                        { !completedTyping && <svg
                        viewBox="8 4 8 16"
                        xmlns="http://www.w3.org/2000/svg"
                        className="cursor"
                        >
                        <rect x="10" y="6" width="4" height="12" fill="#fff" />
                        </svg>}
                        </span>
                    </div>
                </div>
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