import React, { useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import MUIDeleteModal from './MUIDeleteModal'

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

    useEffect(() => {
        store.loadIdNamePairs();
    }, []);

    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
      };

    function handleCreateNewList() {
        store.createNewList();
    }
    let listCard = "";
    if (store) {
        listCard = 
            <Grid container sx={{p: 2}}>
                <Grid item xs={11}>
                        <CottageIcon 
                            sx={{fontSize: '2.8rem', m: 2}}
                        /> 
                        <GroupsIcon
                            sx={{fontSize: '2.8rem', m: 2}}
                        /> 
                        <PersonIcon
                            sx={{fontSize: '2.8rem', m: 2}}
                        />
                        <TextField 
                        id="Search-Bar" 
                        label="Search" 
                        variant="outlined" 
                        style={{width: '30%'}}
                        />
                </Grid>
                <Grid item xs={1}>
                    <SortIcon
                        sx={{fontSize: '2.8rem', m: 2}}
                    />
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
                        <Tabs value={value} onChange={handleChange}>
                            <Tab label="Video Player"{...a11yProps(0)} style={{color: 'black'}}/>
                            <Tab label="Comments" {...a11yProps(1)} style={{color: 'black'}}/>
                        </Tabs>
                    </Box>

                    <TabPanel value={value} index={0}>
                        <YouTubePlayer/>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        Comments
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
            <Box sx={{bgcolor:"background.paper"}} id="list-selector-list">
                {
                    listCard
                }
                <MUIDeleteModal />
            </Box>
        </div>)
}

export default HomeScreen;