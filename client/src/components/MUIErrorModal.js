import { useContext, useState } from 'react'
import GlobalStoreContext from '../store';
import * as React from 'react';
import { Alert, AlertTitle, IconButton, Modal } from "@mui/material";
import AuthContext from '../auth'
import CloseIcon from '@mui/icons-material/Close';
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


export default function MUIErrorModal() {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    let text = ""
    if (auth.error){
        text = auth.error
    }

    function handleClose() {
        auth.closeModal();
    }
    return (
        <Modal
            open={auth.error != null} 
        >
                <Alert variant="filled" severity="error" action={
                    <IconButton aria-label="close" color="inherit" size="small" onClick={handleClose}>
                        <CloseIcon fontSize="inherit"/>
                    </IconButton>
                }>
                    <AlertTitle><strong>Error</strong></AlertTitle>
                    <div className="error-modal-dialog">
                        <header className="dialog-header">
                            {text}
                        </header>
                    </div>
                </Alert>
        </Modal>
    );
}