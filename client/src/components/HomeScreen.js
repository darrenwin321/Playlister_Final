import React, { useContext, useEffect } from 'react'
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


/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
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

    function handleDateSort() {
        handleClose()
        store.sortIdNamePairs(1, store.idNamePairs);
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

    let listCard = "";
    if (store) {
        listCard = 
            <Grid container sx={{p: 2}}>
                <Grid item xs={11}>
                    <IconButton disabled={guest}>
                        <CottageIcon 
                            sx={{fontSize: '2.8rem', m: 2, color: {color}}}
                        /> 
                    </IconButton>
                    <IconButton>
                        <GroupsIcon
                            sx={{fontSize: '2.8rem', m: 2, color: 'black'}}
                        />
                    </IconButton>    
                    <IconButton>
                        <PersonIcon
                            sx={{fontSize: '2.8rem', m: 2, color: 'black'}}
                        />
                    </IconButton>
                        
                        <TextField 
                        id="Search-Bar" 
                        label="Search" 
                        variant="outlined" 
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
                        <MenuItem onClick={handleDateSort}>Publish Date (Newest)</MenuItem>
                        <MenuItem>Listens (High - Low)</MenuItem>
                        <MenuItem>Likes (High - Low)</MenuItem>
                        <MenuItem>Dislikes (High - Low)</MenuItem>
                    </Menu>
                </Grid>
                <Grid item xs={8} overflow='scroll' height={'600px'}>
                    <List sx={{width: '100%', mb:"20px" }}>
                    {
                        store.idNamePairs.map((pair) => (
                            <ListCard
                                key={pair._id}
                                idNamePair={pair}
                                selected={false}
                            />
                        ))
                        
                    }
                    </List>    
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
                            <Grid item xs={12} height={'430px'} overflow='auto'>
                                {
                                    comments
                                }
                            </Grid>
                            <Grid item xs={12}>
                                <TextField 
                                    id="Comment-Bar" 
                                    label="Comment" 
                                    variant="outlined" 
                                    style={{width: '100%'}}
                                    onKeyPress={handleComment}
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
            >
                <AddIcon />
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