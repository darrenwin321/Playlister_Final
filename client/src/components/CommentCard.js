import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function CommentCard(props){
    const { user, comment } = props;

    let userText = "User: " + user
    let card = 
    <Box>
        <Typography>
            {userText}
        </Typography>
        <Typography>
            {comment}
        </Typography>
    </Box>

    return card;
}

export default CommentCard