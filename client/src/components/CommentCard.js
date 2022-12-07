import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function CommentCard(props){
    const { user, comment } = props;

    let userText = "User: " + user
    let card = 
    <Box 
        sx={{bgcolor: '#8000F00F', borderRadius:"30px", borderTopLeftRadius:'27px', my:'9px'}}
        height= '100px'
        width='98%'
    >
        <Typography sx={{transform:"translate(7%,0%)", fontFamily:"Lexend Exa", fontSize:'18px'}}>
            {userText}
        </Typography>
        <Typography sx={{transform:"translate(10%,0%)", fontFamily:"Lexend Exa", fontSize:'18px'}} width='20vw'>
            {comment}
        </Typography>
    </Box>

    return card;
}

export default CommentCard