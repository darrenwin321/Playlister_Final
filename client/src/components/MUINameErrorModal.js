import { useContext, useState } from 'react'
import GlobalStoreContext from '../store';
import * as React from 'react';
import { Alert, AlertTitle, Box, IconButton, Modal } from "@mui/material";
import AuthContext from '../auth'
import CloseIcon from '@mui/icons-material/Close';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    height: 200,
    width: 400,
    border: '5px solid yellow',
    fontSize: "20px",
    p: 4
};


export default function MUINameErrorModal() {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    let text = "That name is already in use, try another one."

    function handleClose() {
        store.hideModals();
    }
    let open = false
    if (store.isNameErrorModalOpen()){
        open = true
    }
    return (
        <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Box
            sx={{backgroundImage:'linear-gradient(orange, white)', fontSize:'24px'}}
        >
            <DialogTitle id="alert-dialog-title">
            </DialogTitle>
                <DialogContent>
                    {text}
                </DialogContent>
            <DialogActions>
            <Button onClick={handleClose} variant={"text"}>Close</Button>
            </DialogActions>
        </Box>
        
      </Dialog>
    );
}