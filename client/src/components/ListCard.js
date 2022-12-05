import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
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

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
        if (store.currentList){
            if (idNamePair._id === store.currentList._id){
                store.closeCurrentList()
            }
            else if (idNamePair._id !== store.currentList._id){
                store.setCurrentList(idNamePair._id);
            }
        }   
        else{
            store.setCurrentList(idNamePair._id);
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

    function handleLoadList(event, id) {
        console.log("handleLoadList for " + id);
        if (!event.target.disabled) {
            let _id = event.target.id;
            if (_id.indexOf('list-card-text-') >= 0)
                _id = ("" + _id).substring("list-card-text-".length);

            console.log("load " + event.target.id);

            // CHANGE THE CURRENT LIST
            if (store.currentList){
                if (id === store.currentList._id){
                    store.closeCurrentList()
                }
                else if (id !== store.currentList._id){
                    store.setCurrentList(id);
                }
            }   
            else{
                store.setCurrentList(id);
            }
            
        }
    }

    function handleToggleEdit(event) {
        event.stopPropagation();
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
        let _id = event.target.id;
        _id = ("" + _id).substring("delete-list-".length);
        store.markListForDeletion(id);
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            let id = event.target.id.substring("list-".length);
            store.changeListName(id, text);
            toggleEdit();
        }
    }
    function handleUpdateText(event) {
        setText(event.target.value);
    }

    let selectClass = "unselected-list-card";
    if (selected) {
        selectClass = "selected-list-card";
    }
    let cardStatus = false;
    if (store.isListNameEditActive) {
        cardStatus = true;
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
            onDoubleClick={toggleEdit}
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                id={idNamePair._id}
                key={idNamePair._id}
                sx={{borderRadius:"30px", p: "10px", bgcolor: '#8000F00F', marginTop: '15px', display: 'flex', p: 1, "&:hover":{backgroundColor: "white"}, }}
                style={{transform:"translate(0%,0%)", width: '100%', fontSize: '24pt' }}
            >
                 {/* <ListItem
                    
                    onClick={(event) => {
                        handleLoadList(event, idNamePair._id)
                    }}
                > */}
                    <Box sx={{ p: 1, flexGrow: 1 }} elevation={0}>{idNamePair.name}</Box>
                    <Box sx={{ p: 1 }} elevation={0}>
                         <IconButton >
                            <ThumbUpIcon style={{fontSize:'24pt'}} />
                        </IconButton> 
                    </Box>
                    <Box sx={{ p: 1 }} elevation={0}>
                         <IconButton>
                            <ThumbDownIcon style={{fontSize:'24pt'}} /> {/* use event.stoppropagation or prevent default */}
                        </IconButton> 
                    </Box>
                {/* </ListItem>  */}
            </AccordionSummary>
            <AccordionDetails>
                <Grid container sx={{alignItems: 'center', transform:"translate(0%,-10%)", bgcolor:''}} >
                    <Grid item xs={12} position='relative' height={'400px'} sx={{borderRadius:"30px"}}>
                            {songs}
                    </Grid>
                    <Grid item xs={10}>
                    </Grid>
                    <Grid item xs={2}>
                            <DeleteForeverIcon
                                sx={{fontSize: '2.8rem', m: 2}}
                            />
                            <ContentCopyIcon
                                sx={{fontSize: '2.8rem', m: 2}}
                            />
                    </Grid>
                    <Grid item>

                    </Grid>
                </Grid>
            </AccordionDetails>
            { modalJSX }
        </Accordion>
        
        

    if (editActive) {
        cardElement =
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
    return (
        cardElement
    );
}

export default ListCard;