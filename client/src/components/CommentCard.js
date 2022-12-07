import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function CommentCard(props){
    const { user, comment } = props;

    let userText = user
    let card = 
    <Box 
        sx={{bgcolor: '#8000F00F', borderRadius:"30px", borderTopLeftRadius:'27px', my:'9px'}}
        width='93%'
    >
        <Typography sx={{transform:"translate(7%,10%)", fontFamily:"Lexend Exa", fontSize:'18px', fontWeight: 'bold'}}>
            {userText}
        </Typography>
        <Typography sx={{transform:"translate(8%,0%)", fontFamily:"Lexend Exa", fontSize:'18px'}} width='20vw' 
        style={{wordWrap: 'break-word'}}
        >
            {comment}
        </Typography>
    </Box>

    return card;
}

export default CommentCard