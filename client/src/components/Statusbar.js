import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { Typography } from '@mui/material'
import AuthContext from '../auth'

/*
    Our Status bar React component goes at the bottom of our UI.
    
    @author McKilla Gorilla
*/
function Statusbar() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    let text ="";   
    let x = <></>
    if (auth.user){
        if (store.currentList){
            text = store.currentList.name;
        }
        x = <div id="playlister-statusbar">
                <Typography variant="h4">{text}</Typography>
            </div>
    }
    return (
        <>{x}</>
        
    );
}

export default Statusbar;