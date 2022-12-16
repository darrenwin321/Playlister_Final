import React, { useContext, useEffect, useState } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import MUIDeleteModal from './MUIDeleteModal'
import CommentCard from './CommentCard'

import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab'
import List from '@mui/material/List';
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import YouTubePlayer from './PlaylisterYouTubePlayer.js';
import logo from './playlister_img.png';
import CottageIcon from '@mui/icons-material/Cottage'
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import TextField from '@mui/material/TextField';
import SortIcon from '@mui/icons-material/Sort'
import { IconButton } from '@mui/material';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AuthContext from '../auth';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';


/*
    This React component lists all the top5 lists in the UI.
    
*/

function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  

const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);
    const [value, setValue] = React.useState(0);
    const handleTabChange = (event, newValue) => {
        setValue(newValue);
      };

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const [query, setQuery] = useState('');

    useEffect(() => {
        store.loadIdNamePairs();
    }, []);

    function handleCreateNewList() {
        store.createNewList();
        // if (store.sortedBy !== -1){
        //     store.sortIdNamePairs(store.sortedBy)
        // }
        
    }

    const { auth } = useContext(AuthContext);
    let guest = false
    let color = 'black'
    if (auth.user && auth.user.email === 'Guest@guest.com'){
        guest = true
        color = ''
    }

    function handleAlphaSort() {
        handleClose()
        store.sortIdNamePairs(0, store.idNamePairs);
    }

    function handleAlphaSort1() {
        handleClose()
        store.sortIdNamePairs(3, store.idNamePairs);
    }

    function handleDateSort() {
        handleClose()
        store.sortIdNamePairs(1, store.idNamePairs);
    }

    function handleListensSort() {
        handleClose()
        store.sortIdNamePairs(2, store.idNamePairs);
    }

    function handleLikeSort() {
        handleClose()
        store.sortIdNamePairs(4, store.idNamePairs);
    }

    function handleDislikeSort() {
        handleClose()
        store.sortIdNamePairs(5, store.idNamePairs);
    }

    function handleCreateSort() {
        handleClose()
        store.sortIdNamePairs(6, store.idNamePairs);
    }

    function handleUpdateSort() {
        handleClose()
        store.sortIdNamePairs(7, store.idNamePairs);
    }

    function handleComment(event) {
        if (event.code === "Enter"){
            if (event.target.value === '' || !store.currentList){
                return;
            }
            store.addComment(event.target.value, auth.user);
            event.target.value = ''
        }
    }

    let comments = <></>
    if (store.currentList && store.currentList.comments){
        comments = 
        store.currentList.comments.map((x) => (
            <CommentCard
                user={x.user}
                comment={x.comment}
            />
        ))
    }

    let disallowComments = false
    if ((store.currentList && !store.currentList.published) || (!store.currentList)){
        disallowComments = true
    }

    function handleHome(){
        store.loadIdNamePairs();
    }

    function handleGroup(){
        store.loadPublished(1)
    }
    function handleUser(){
        store.loadPublished(2)
    }
    function handleQueryChange(event){
        setQuery(event.target.value)
    }

    let menu = 
        <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
                'aria-labelledby': 'basic-button',
            }}
        >
            <MenuItem onClick={handleAlphaSort1}>Name (A - Z)</MenuItem>
            <MenuItem onClick={handleDateSort}>Publish Date (Newest)</MenuItem>
            <MenuItem onClick={handleListensSort}>Views (High - Low)</MenuItem>
            <MenuItem onClick={handleLikeSort}>Likes (High - Low)</MenuItem>
            <MenuItem onClick={handleDislikeSort}>Dislikes (High - Low)</MenuItem>
        </Menu>
    if (store.display[0] === 0){
        menu = 
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={handleAlphaSort}>Name (A - Z)</MenuItem>
                <MenuItem onClick={handleCreateSort}>Creation Date (Old - New)</MenuItem>
                <MenuItem onClick={handleUpdateSort}>Last Edit (New - Old)</MenuItem>
            </Menu>
        
    }

    let search =
    <List sx={{width: '100%', mb:"20px" }}>
        {
        store.idNamePairs.filter(pair => pair.name.toUpperCase().includes(query.toUpperCase())).map((pair) => 
        (
            <ListCard
                key={pair._id}
                idNamePair={pair}
                selected={false}
                            />
        ))
                        
                    }
    </List>

    if (store.display[0] === 2) {
        search = 
        <List sx={{width: '100%', mb:"20px" }}>
                    {
                        store.idNamePairs.filter(pair => pair.ownerName.toUpperCase().includes(query.toUpperCase())).map((pair) => (
                            <ListCard
                                key={pair._id}
                                idNamePair={pair}
                                selected={false}
                            />
                        ))
                        
                    }
                    </List>
    }

    let listCard = "";
    if (store) {
        listCard = 
            <Grid container sx={{p: 2}}>
                <Grid item xs={11}>
                    <IconButton disabled={guest || store.display[0] === 0} onClick={handleHome} sx={{color: 'black'}}>
                        <CottageIcon 
                            sx={{fontSize: '2.8rem', m: 2}}
                        /> 
                    </IconButton>
                    <IconButton onClick={handleGroup} disabled={store.display[0] === 1} sx={{color: 'black'}}>
                        <GroupsIcon
                            sx={{fontSize: '2.8rem', m: 2}}
                        />
                    </IconButton>    
                    <IconButton onClick={handleUser} disabled={store.display[0] === 2} sx={{color: 'black'}}>
                        <PersonIcon
                            sx={{fontSize: '2.8rem', m: 2}}
                        />
                    </IconButton>
                        
                        <TextField 
                        onChange={handleQueryChange}
                        id="Search-Bar" 
                        label="Search" 
                        variant="outlined" 
                        sx={{bgcolor: 'white', borderRadius: '5px', transform:"translate(0%, 10%)"}}
                        style={{width: '30%'}}
                        />
                </Grid>
                <Grid item xs={1}>
                    Sort By
                    <IconButton>
                        <SortIcon
                            sx={{fontSize: '2.8rem'}}
                            onClick={handleClick}
                            aria-controls={open ? 'basic-menu' : undefined}
                            aria-expanded={open ? 'true' : undefined}
                            aria-haspopup="true"
                        />
                    </IconButton>
                    {menu}
                </Grid>
                <Grid item xs={8} overflow='scroll' height={'600px'}>
                    {search}  
                </Grid>

                <Grid item xs={4}>
                    <Box >
                        <Tabs value={value} onChange={handleTabChange}>
                            <Tab label="Video Player"{...a11yProps(0)} style={{color: 'black'}}/>
                            <Tab label="Comments" {...a11yProps(1)} style={{color: 'black'}} disabled={!store.currentList}/> {/*   */}
                        </Tabs>
                    </Box>

                    <TabPanel value={value} index={0}>
                        <YouTubePlayer/>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <Grid container>
                            <Grid item xs={12} height={'400px'} overflow='auto'>
                                {
                                    comments
                                }
                            </Grid>
                            <Grid item xs={12}>
                                <TextField 
                                    disabled={disallowComments}
                                    id="Comment-Bar" 
                                    label="Comment" 
                                    variant="outlined" 
                                    style={{width: '100%'}}
                                    onKeyPress={handleComment}
                                    sx={{bgcolor: 'white', borderRadius: '0px', transform:"translate(0%, -10%)"}}
                                />
                            </Grid>
                        </Grid>
                    </TabPanel>
                </Grid>
                
            </Grid>
    }
    return (
        <div id="playlist-selector">
            <div id="list-selector-heading">
            <Fab sx={{transform:"translate(-20%, 0%)"}}
                color="primary" 
                aria-label="add"
                id="add-list-button"
                onClick={handleCreateNewList}
                disabled={store.display[0] != 0 || guest}
            >
                <PlaylistAddIcon />
            </Fab>
                <img style={{ width: 260, height: 100 }} src={logo} alt="logo"/>
            </div>
            <Box sx={{bgcolor:"background.paper", borderTopLeftRadius:'0px'}} id="list-selector-list" elevation={0}>
                {
                    listCard
                }
                <MUIDeleteModal />
            </Box>
        </div>)
}

export default HomeScreen;