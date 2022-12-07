import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import List from '@mui/material/List';
import SongCard from './SongCard.js'
import { Grid } from '@mui/material';
import MUIEditSongModal from './MUIEditSongModal';
import MUIRemoveSongModal from './MUIRemoveSongModal';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import MUINameErrorModal from './MUINameErrorModal';
import UndoIcon from '@mui/icons-material/Undo';
import AddIcon from '@mui/icons-material/Add';
import RedoIcon from '@mui/icons-material/Redo';
import PublishIcon from '@mui/icons-material/Publish';
import AuthContext from '../auth';;



/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [editActive, setEditActive] = useState(false);
    const [text, setText] = useState("");
    const { idNamePair, selected } = props;
    const [expanded, setExpanded] = React.useState(false);
    const { auth } = useContext(AuthContext);

    let guest = false
    if (auth.user && auth.user.email === 'Guest@guest.com'){
        guest = true
    }

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
        if (store.currentList){
            if (idNamePair._id === store.currentList._id){
                store.closeCurrentList()
            }
            else if (idNamePair._id !== store.currentList._id){
                store.closeCurrentList()
                store.setCurrentList1(idNamePair._id);
            }
        }   
        else{
            store.setCurrentList1(idNamePair._id);
        }

    };
    
    let open = false;
    if (!store.currentList){
        
    }
    else{
        if (store.currentList._id === idNamePair._id){
            open = true
        }
        else{
            open = false
        }
    }

    let modalJSX = "";
    if (store.isEditSongModalOpen()) {
        modalJSX = <MUIEditSongModal />;
    }
    else if (store.isRemoveSongModalOpen()) {
        modalJSX = <MUIRemoveSongModal />;
    }
    else if (store.isNameErrorModalOpen()){
        modalJSX = <MUINameErrorModal />
    }

    let songs = <></>

    if (open){
        songs = 
        <Box id="list-selector-list1" sx={{bgcolor:'Transparent'}}>
        <List 
            id="playlist-cards" 
            sx={{overflow: 'auto' , height: '100%', width: '100%', bgcolor: 'Transparent'}}
        >
            {
                store.currentList.songs.map((song, index) => (
                    <SongCard
                        id={'playlist-song-' + (index)}
                        key={'playlist-song-' + (index)}
                        index={index}
                        song={song}
                    />
                ))  
            }
         </List>            
         </Box>
    }

    function handleToggleEdit(event) {
        event.stopPropagation();
        handleUpdateText(event)
        if (store.listNameActive){
            return
        }
        store.setCurrentList(idNamePair._id);
        console.log(store)
        toggleEdit();
    }

    function toggleEdit() {
        let newActive = !editActive;
        if (newActive) {
            store.setIsListNameEditActive();
        }
        setEditActive(newActive);
    }

    async function handleDeleteList(event, id) {
        event.stopPropagation();
        // let _id = event.target.id;
        // _id = ("" + _id).substring("delete-list-".length);
        store.markListForDeletion(store.currentList._id);
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            if (text === ''){
                store.showNameErrorModal();
                return;
            }
            for (let i = 0; i < store.idNamePairs.length; i++){
                if (event.target.value === store.idNamePairs[i].name){
                    if (event.target.value === store.idNamePairs[i].name && store.currentList._id != store.idNamePairs[i]._id ){
                        console.log(store.idNamePairs.indexOf(store.currentList))
                        store.showNameErrorModal();
                        return;
                    }
                    
                }
            }
            let id = event.target.id.substring("list-".length);
            store.changeListName(id, event.target.value);
            toggleEdit();
        }
    }
    function handleUpdateText(event) {
        setText(event.target.value);
    }

    function handleAddNewSong(event) {
        event.stopPropagation();
        store.addNewSong();
    }
    function handleUndo(event) {
        event.stopPropagation();
        store.undo();
    }
    function handleRedo(event) {
        event.stopPropagation();
        store.redo();
    }
    function handleDuplicate() {
        store.duplicateList();
    }
    function handlePublish(){
        store.publish();
    }
    function handleLike(event){
        event.stopPropagation();
        if (idNamePair.likes.indexOf(auth.user.email) > -1){
            store.likeList(auth.user.email ,idNamePair._id, 1)
        }
        else{
            if (idNamePair.dislikes.indexOf(auth.user.email) > -1){
                store.likeList(auth.user.email ,idNamePair._id, 2)
            }
            else{
                store.likeList(auth.user.email ,idNamePair._id, 0)
            }
            
        }
        
    }
    function handleDislike(event){
        event.stopPropagation();
        if (idNamePair.dislikes.indexOf(auth.user.email) > -1){
            store.dislikeList(auth.user.email ,idNamePair._id, 1)
        }
        else{
            if (idNamePair.likes.indexOf(auth.user.email) > -1){
                store.dislikeList(auth.user.email ,idNamePair._id, 2)
            }
            else{
                store.dislikeList(auth.user.email ,idNamePair._id, 0)
            }
            
        }

    }

    let selectClass = "unselected-list-card";
    if (selected) {
        selectClass = "selected-list-card";
    }
    let cardStatus = false;
    if (store.isListNameEditActive) {
        cardStatus = true;
    }

    let published = <></>
    if (idNamePair.published){
        let date = new Date(idNamePair.publishDate)
        published = 
        <>
            <Grid container>
                <Grid item xs={10}>
                    <Typography sx={{fontFamily:"Lexend Exa", fontSize:'18px'}}>
                        Published: {date.toLocaleDateString()}     
                    </Typography>
                </Grid>
                <Grid item xs={2}>
                    <Typography sx={{transform:"translate(140%,-10%)", fontFamily:"Lexend Exa", fontSize:'18px'}}>
                        Views: {idNamePair.listens}
                    </Typography>
                </Grid>
                
            </Grid>
            
        </>
        
    }
    
    let dislikeColor = ''
    if (idNamePair.dislikes.indexOf(auth.user.email) > -1){
        dislikeColor = 'black'
    }
    let likeColor = ''
    if (idNamePair.likes.indexOf(auth.user.email) > -1){
        likeColor = 'black'
    }

    let likeDislike = <></>
    if (idNamePair.published){
        likeDislike = 
            <>
                <Box sx={{ p: 1 }} elevation={0}>
                    <IconButton onClick={handleLike} disabled={guest}>
                        <ThumbUpIcon style={{fontSize:'24pt'}} sx={{color: likeColor}}/>
                        <Typography sx={{transform:"translate(30%,0%)"}}>
                            {idNamePair.likes.length}
                        </Typography>
                    </IconButton> 
                </Box>
                <Box sx={{ p: 1 }} elevation={0}>
                    <IconButton onClick={handleDislike} disabled={guest}>
                        <ThumbDownIcon style={{fontSize:'24pt'}} sx={{color: dislikeColor}}/> {/* use event.stoppropagation */}
                        <Typography sx={{transform:"translate(30%,0%)"}}>
                            {idNamePair.dislikes.length}
                        </Typography>
                    </IconButton> 
                </Box>
            </>
    }

    let card = 
    <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        id={idNamePair._id}
        key={idNamePair._id}
        sx={{borderRadius:"30px", p: "10px", bgcolor: '#8000F00F', marginTop: '15px', display: 'flex', p: 1, "&:hover":{backgroundColor: "white"}, }}
        style={{transform:"translate(0%,0%)", width: '100%', fontSize: '24pt' }}
    >
        <Box sx={{ p: 1, flexGrow: 1 }} elevation={0} onDoubleClick={handleToggleEdit}>{idNamePair.name} 
        <Typography sx={{fontFamily:"Lexend Exa", fontSize:'18px'}}>
            By: {idNamePair.ownerName}
        </Typography>
            {published}
        </Box>
        {likeDislike}
    </AccordionSummary>
    if (editActive && open && !store.currentList.published){
        card = 
        <TextField
            margin="normal"
            required
            fullWidth
            id={"list-" + idNamePair._id}
            label="Playlist Name"
            name="name"
            autoComplete="Playlist Name"
            className='list-card'
            onKeyPress={handleKeyPress}
            onChange={handleUpdateText}
            defaultValue={idNamePair.name}
            inputProps={{style: {fontSize: 48}}}
            InputLabelProps={{style: {fontSize: 24}}}
            autoFocus
        />
    }

    let buttons = <></>
    let upload = <></>

    if (open && !store.currentList.published){
        buttons = 
        <>
            <IconButton onClick={handleUndo} disabled={!store.canUndo()} sx={{color:'black'}}>
            <   UndoIcon
                    sx={{fontSize: '2.8rem', m: 2}}
                />
            </IconButton>
            <IconButton onClick={handleAddNewSong} disabled={!store.canAddNewSong()}>
                <AddIcon
                    sx={{fontSize: '2.8rem', m: 2, color:'black'}}
                />
            </IconButton>
            <IconButton onClick={handleRedo} disabled={!store.canRedo()} sx={{color:'black'}}>
                <RedoIcon
                    sx={{fontSize: '2.8rem', m: 2}}
                />
            </IconButton>
        </>

        upload = 
        <>
            <IconButton sx={{color:'black'}} onClick={handlePublish}>
                <PublishIcon
                    sx={{fontSize: '2.8rem', m: 2}}
                />
            </IconButton>
        </>
        
    }
    let disabled = false
    if (guest || store.currentList && auth.user.email !== store.currentList.ownerEmail){
        console.log(auth.user.email)
        console.log(idNamePair.ownerEmail)
        disabled = true
    }


    let cardElement =
        <Accordion 
            // disabled={!open}
            expanded={open} 
            onChange={handleChange('panel' + idNamePair._id)} 
            // onClick={(event) => {
            //     handleLoadList(event, idNamePair._id)
            // }}
            sx={{bgcolor: '#8000F00F', borderRadius:"30px", borderTopLeftRadius:'27px'}}
            disableGutters={true}
        >
            {card}
            <AccordionDetails>
                <Grid container sx={{alignItems: 'center', transform:"translate(0%,-10%)", bgcolor:''}} >
                    <Grid item xs={12} position='relative' height={'400px'} sx={{borderRadius:"30px"}}>
                            {songs}
                    </Grid>
                    <Grid item xs={4}>
                        {buttons}
                    </Grid>
                    <Grid item xs={4}>
                    </Grid>
                    <Grid item xs={1}>
                        {upload}
                    </Grid>
                    <Grid item xs={3}>
                        <IconButton onClick={handleDeleteList} disabled={disabled} sx={{color: 'black'}}>
                            <DeleteForeverIcon
                                sx={{fontSize: '2.8rem', m: 2}}
                            />
                        </IconButton>
                        <IconButton onClick={handleDuplicate} disabled={guest} sx={{color: 'black'}}>
                            <ContentCopyIcon
                                sx={{fontSize: '2.8rem', m: 2}}
                            />
                        </IconButton>
                    </Grid>
                    <Grid item>

                    </Grid>
                </Grid>
            </AccordionDetails>
            { modalJSX }
        </Accordion>
        
    return (
        cardElement
    );
}

export default ListCard;