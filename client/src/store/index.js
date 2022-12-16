import { createContext, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import jsTPS from '../common/jsTPS'
import api from './store-request-api'
import CreateSong_Transaction from '../transactions/CreateSong_Transaction'
import MoveSong_Transaction from '../transactions/MoveSong_Transaction'
import RemoveSong_Transaction from '../transactions/RemoveSong_Transaction'
import UpdateSong_Transaction from '../transactions/UpdateSong_Transaction'
import AuthContext from '../auth'

/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalStoreContext = createContext({});
console.log("create GlobalStoreContext");

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    EDIT_SONG: "EDIT_SONG",
    REMOVE_SONG: "REMOVE_SONG",
    HIDE_MODALS: "HIDE_MODALS",
    NAME_ERROR: "NAME_ERROR",
    DISPLAY_SONG: "DISPLAY_SONG",
    DISPLAY_PLAYLIST: "DISPLAY_PLAYLIST",
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

const CurrentModal = {
    NONE : "NONE",
    DELETE_LIST : "DELETE_LIST",
    EDIT_SONG : "EDIT_SONG",
    REMOVE_SONG : "REMOVE_SONG",
    ERROR : "ERROR",
    NAME_ERROR: "NAME_ERROR"
}

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalStoreContextProvider(props) {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        currentModal : CurrentModal.NONE,
        idNamePairs: [],
        currentList: null,
        currentSongIndex : -1,
        currentSong : null,
        newListCounter: 0,
        listNameActive: false,
        listIdMarkedForDeletion: null,
        listMarkedForDeletion: null,
        sortedBy: -1,
        display: [0,-1]

    });
    const history = useHistory();

    console.log("inside useGlobalStore");

    // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
    const { auth } = useContext(AuthContext);
    console.log("auth: " + auth);

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload.idNamePairs,
                    currentList: payload.playlist,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    sortedBy: store.sortedBy,
                    display: store.display,
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    sortedBy: store.sortedBy,
                    display: store.display,
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {                
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: payload,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    sortedBy: store.sortedBy,
                    display: store.display,
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload.pairsArray,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: 0,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    sortedBy: payload.sortedBy,
                    display: store.display,
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    currentModal : CurrentModal.DELETE_LIST,
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: payload.id,
                    listMarkedForDeletion: payload.playlist,
                    sortedBy: store.sortedBy,
                    display: store.display,
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    sortedBy: store.sortedBy,
                    display: store.display,
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: true,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    sortedBy: store.sortedBy,
                    display: store.display,
                });
            }
            // 
            case GlobalStoreActionType.EDIT_SONG: {
                return setStore({
                    currentModal : CurrentModal.EDIT_SONG,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: payload.currentSongIndex,
                    currentSong: payload.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    sortedBy: store.sortedBy,
                    display: store.display,
                });
            }
            case GlobalStoreActionType.REMOVE_SONG: {
                return setStore({
                    currentModal : CurrentModal.REMOVE_SONG,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: payload.currentSongIndex,
                    currentSong: payload.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    sortedBy: store.sortedBy,
                    display: store.display,
                });
            }
            case GlobalStoreActionType.HIDE_MODALS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    sortedBy: store.sortedBy,
                    display: store.display,
                });
            }
            case GlobalStoreActionType.NAME_ERROR: {
                return setStore({
                    currentModal : CurrentModal.NAME_ERROR,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    sortedBy: store.sortedBy,
                    display: store.display,
                });
            }

            case GlobalStoreActionType.DISPLAY_SONG: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: payload.index,
                    currentSong: payload.song,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    sortedBy: store.sortedBy,
                    display: store.display,
                });
            }

            case GlobalStoreActionType.DISPLAY_PLAYLIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload.idNamePairs,
                    currentList: null,
                    currentSongIndex: null,
                    currentSong: null,
                    newListCounter: 0,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    sortedBy: store.sortedBy,
                    display: payload.display,
                });
            }

            default:
                return store;
        }
    }

    store.tryAcessingOtherAccountPlaylist = function(){
        let id = "635f203d2e072037af2e6284";
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: playlist
                });
            }
        }
        asyncSetCurrentList(id);
        history.push("/playlist/635f203d2e072037af2e6284");
    }

    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {
        // GET THE LIST
        async function asyncChangeListName(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.name = newName;
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                                });
                                store.sortIdNamePairs(store.sortedBy)
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncChangeListName(id);
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
        tps.clearAllTransactions();
        if (store.display[0] === 0){
            store.loadIdNamePairs()
        }
        else{
            store.loadPublished()
        }
        
        // history.push("/");
    }

    // THIS FUNCTION CREATES A NEW LIST
    store.createNewList = async function () {
        let newListName = "Untitled" + store.newListCounter;
        for(let i = 0; i < store.idNamePairs.length; i++) {
            store.idNamePairs.map((pair) => {
                if(newListName === pair.name) {
                    store.newListCounter++;
                    newListName = "Untitled" + store.newListCounter;
                }
            });
        }
        store.newListCounter++;
        console.log(auth.user)
        const response = await api.createPlaylist(newListName, [], auth.user.email, false, [], auth.user.username);
        console.log("createNewList response: " + response);
        if (response.status === 201) {
            tps.clearAllTransactions();
            storeReducer({
                type: GlobalStoreActionType.CREATE_NEW_LIST,
                payload: store.newListCounter + 1
            }
            );

            // IF IT'S A VALID LIST THEN LET'S START EDITING IT
            store.loadIdNamePairs();
        }
        else {
            console.log("API FAILED TO CREATE A NEW LIST");
        }
    }
    store.duplicateList = async function () {
        let counter = 1;
        let name = store.currentList.name
        let newListName = name + " Copy " + counter++;
        for(let i = 0; i < store.idNamePairs.length; i++) {
            store.idNamePairs.map((pair) => {
                if(newListName === pair.name) {
                    newListName = name + " Copy " + counter++;
                }
            });
        }
        const response = await api.createPlaylist(newListName, store.currentList.songs, auth.user.email, false, [], auth.user.username);
        console.log("createNewList response: " + response);
        if (response.status === 201) {
            tps.clearAllTransactions();
            let newList = response.data.playlist;
            storeReducer({
                type: GlobalStoreActionType.CREATE_NEW_LIST,
                payload: store.newListCounter + 1
            }
            );

            // IF IT'S A VALID LIST THEN LET'S START EDITING IT
            // history.push("/playlist/" + newList._id);
            store.loadIdNamePairs(); //bug where name will not be unique if you copy other people's lists
        }
        else {
            console.log("API FAILED TO CREATE A NEW LIST");
        }
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS OF THE USER
    store.loadIdNamePairs = function () {
        async function asyncLoadIdNamePairs() {
            const response = await api.getPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                console.log(pairsArray);
                // storeReducer({
                //     type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                //     payload: {
                //         pairsArray: pairsArray,
                //         sortedBy: 0
                //     }
                // });
                if (store.display[0] !== 0){
                    storeReducer({
                        type: GlobalStoreActionType.DISPLAY_PLAYLIST,
                        payload: {
                            idNamePairs: pairsArray,
                            display: [0,-1]
                        }
                    });
                }
                else{
                    storeReducer({
                    type: GlobalStoreActionType.DISPLAY_PLAYLIST,
                    payload: {
                        idNamePairs: pairsArray,
                        display: [0,store.display[1]]
                    }
                });
                store.sortIdNamePairs(store.display[1], pairsArray)
                }
                
                
                // else{
                //     // store.sortIdNamePairs(store.sortedBy, pairsArray)
                // }
                
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs();
    }

    store.home = function () {
        store.loadIdNamePairs()
    }

    store.loadPublished = function (display) { //1 being all publish and 2 being user search
        async function asyncLoadIdNamePairs() {
            const response = await api.getPublishedPairs(); 
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                // storeReducer({
                //     type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                //     payload: {
                //         pairsArray: pairsArray,
                //         sortedBy: 3
                //     }
                // });
                if (store.display[0] === 0){
                    storeReducer({
                        type: GlobalStoreActionType.DISPLAY_PLAYLIST,
                        payload: {
                            idNamePairs: pairsArray,
                            display: [display, -1]
                        }
                    });
                }
                else{
                    storeReducer({
                        type: GlobalStoreActionType.DISPLAY_PLAYLIST,
                        payload: {
                            idNamePairs: pairsArray,
                            display: [display, store.display[1]]
                        }
                });
                store.sortIdNamePairs(store.display[1], pairsArray)
                }
                
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs();
    }

    store.sortIdNamePairs = async function (sort, List) {
        let list = List
        switch(sort){
            case 0: //alphabetical sort
            if (store.display[0] !== 0){
                return
            }
                list = 
                    list.sort((a,b) =>
                        a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1
                    )
                    console.log(list)
                    storeReducer({
                        type: GlobalStoreActionType.DISPLAY_PLAYLIST,
                        payload: {
                            idNamePairs: list,
                            display: [store.display[0], 0]
                        }
                    });
                    if(store.display > 0){
                        console.log('hello')
                    }
            break;

            case 1: //sort by published
                if (store.display[0] === 0){
                    return;
                }
                let published = []
                for (let i = 0; i < list.length; i++){
                    if (list[i].published){
                        published.push(list[i])
                    }
                }
                published = 
                    published.sort((a,b) =>
                        a.publishDate.toUpperCase() > b.publishDate.toUpperCase() ? -1 : 1
                    )
                let finalList = published
                storeReducer({
                    type: GlobalStoreActionType.DISPLAY_PLAYLIST,
                    payload: {
                        idNamePairs: finalList,
                        display: [store.display[0], 1]
                    }
                });
                
            break;

            case 2: //listens(high to low)
                if (store.display[0] === 0){
                    return;
                }
                list.sort(function(a,b){
                    return b.listens - a.listens;
                })
                storeReducer({
                    type: GlobalStoreActionType.DISPLAY_PLAYLIST,
                    payload: {
                        idNamePairs: list,
                        display: [store.display[0], 2]
                    }
                });
            break;

            case 3: //alphabetical sort but for published lists
                if (store.display[0] === 0){
                    return;
                }
                list = 
                    list.sort((a,b) =>
                        a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1
                    )
                    console.log(list)
                    storeReducer({
                        type: GlobalStoreActionType.DISPLAY_PLAYLIST,
                        payload: {
                            idNamePairs: list,
                            display: [store.display[0], 3]
                        }
                    });
                    if(store.display > 0){
                        console.log('hello')
                    }
            break;

            case 4: //sort by likes
                if (store.display[0] === 0){
                    return;
                }
                list.sort(function(a,b){
                    return b.likes.length - a.likes.length;
                })
                storeReducer({
                    type: GlobalStoreActionType.DISPLAY_PLAYLIST,
                    payload: {
                        idNamePairs: list,
                        display: [store.display[0], 4]
                    }
                });
            break;

            case 5: //sort by likes
                if (store.display[0] === 0){
                    return;
                }
                list.sort(function(a,b){
                    return b.dislikes.length - a.dislikes.length;
                })
                storeReducer({
                    type: GlobalStoreActionType.DISPLAY_PLAYLIST,
                    payload: {
                        idNamePairs: list,
                        display: [store.display[0], 5]
                    }
                });
            break;

            case 6: //sort by oldest-newest creation
                if (store.display[0] !== 0){
                    return
                }
                console.log(list)
                list = 
                    list.sort((a,b) =>
                        a.createdAt.toUpperCase() > b.createdAt.toUpperCase() ? 1 : -1
                    )
                    storeReducer({
                        type: GlobalStoreActionType.DISPLAY_PLAYLIST,
                        payload: {
                            idNamePairs: list,
                            display: [store.display[0], 6]
                        }
                    });
            break;

            case 7: //sort by most recent to oldest update
                if (store.display[0] !== 0){
                    return
                }
                console.log(list)
                list = 
                    list.sort((a,b) =>
                        a.updatedAt.toUpperCase() > b.updatedAt.toUpperCase() ? -1 : 1
                    )
                    storeReducer({
                        type: GlobalStoreActionType.DISPLAY_PLAYLIST,
                        payload: {
                            idNamePairs: list,
                            display: [store.display[0], 7]
                        }
                    });
            break;
        }
    }

    // THE FOLLOWING 5 FUNCTIONS ARE FOR COORDINATING THE DELETION
    // OF A LIST, WHICH INCLUDES USING A VERIFICATION MODAL. THE
    // FUNCTIONS ARE markListForDeletion, deleteList, deleteMarkedList,
    // showDeleteListModal, and hideDeleteListModal
    store.markListForDeletion = function (id) {
        async function getListToDelete(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                storeReducer({
                    type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
                    payload: {id: id, playlist: playlist}
                });
            }
        }
        getListToDelete(id);
    }
    store.deleteList = function (id) {
        async function processDelete(id) {
            let response = await api.deletePlaylistById(id);
            store.loadIdNamePairs();
            if (response.data.success) {
            }
        }
        processDelete(id);
    }
    store.deleteMarkedList = function() {
        store.deleteList(store.listIdMarkedForDeletion);
        store.hideModals();
        
    }
    // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
    // TO SEE IF THEY REALLY WANT TO DELETE THE LIST

    store.showEditSongModal = (songIndex, songToEdit) => {
        storeReducer({
            type: GlobalStoreActionType.EDIT_SONG,
            payload: {currentSongIndex: songIndex, currentSong: songToEdit}
        });        
    }
    store.showRemoveSongModal = (songIndex, songToRemove) => {
        storeReducer({
            type: GlobalStoreActionType.REMOVE_SONG,
            payload: {currentSongIndex: songIndex, currentSong: songToRemove}
        });        
    }
    store.showNameErrorModal = () => {
        storeReducer({
            type: GlobalStoreActionType.NAME_ERROR,
            payload: null    
        })
    }
    store.hideModals = () => {
        auth.errorMessage = null;
        storeReducer({
            type: GlobalStoreActionType.HIDE_MODALS,
            payload: {}
        });    
    }
    store.isDeleteListModalOpen = () => {
        return store.currentModal === CurrentModal.DELETE_LIST;
    }
    store.isEditSongModalOpen = () => {
        return store.currentModal === CurrentModal.EDIT_SONG;
    }
    store.isRemoveSongModalOpen = () => {
        return store.currentModal === CurrentModal.REMOVE_SONG;
    }
    store.isErrorModalOpen = () => {
        return store.currentModal === CurrentModal.ERROR;
    }
    store.isNameErrorModalOpen =() => {
        return store.currentModal === CurrentModal.NAME_ERROR;
    }

    // THE FOLLOWING 8 FUNCTIONS ARE FOR COORDINATING THE UPDATING
    // OF A LIST, WHICH INCLUDES DEALING WITH THE TRANSACTION STACK. THE
    // FUNCTIONS ARE setCurrentList, addMoveItemTransaction, addUpdateItemTransaction,
    // moveItem, updateItem, updateCurrentList, undo, and redo
    store.setCurrentList = function (id) {
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;

                response = await api.updatePlaylistById(playlist._id, playlist);
                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: playlist
                    });
                    // history.push("/playlist/" + playlist._id);
                }
            }
        }
        asyncSetCurrentList(id);
    }

    store.setCurrentList1 = function (id) {
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                if(playlist.published){
                    playlist.listens++;
                    console.log('hell')
                }
                response = await api.updatePlaylistById(playlist._id, playlist);
                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: playlist
                    });
                    // history.push("/playlist/" + playlist._id);
                }
            }
        }
        asyncSetCurrentList(id);
    }

    store.getPlaylistSize = function() {
        return store.currentList.songs.length;
    }
    store.addNewSong = function() {
        let index = this.getPlaylistSize();
        this.addCreateSongTransaction(index, "Untitled", "?", "dQw4w9WgXcQ");
    }
    // THIS FUNCTION CREATES A NEW SONG IN THE CURRENT LIST
    // USING THE PROVIDED DATA AND PUTS THIS SONG AT INDEX
    store.createSong = function(index, song) {
        let list = store.currentList;      
        list.songs.splice(index, 0, song);
        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION MOVES A SONG IN THE CURRENT LIST FROM
    // start TO end AND ADJUSTS ALL OTHER ITEMS ACCORDINGLY
    store.moveSong = function(start, end) {
        let list = store.currentList;

        // WE NEED TO UPDATE THE STATE FOR THE APP
        if (start < end) {
            let temp = list.songs[start];
            for (let i = start; i < end; i++) {
                list.songs[i] = list.songs[i + 1];
            }
            list.songs[end] = temp;
        }
        else if (start > end) {
            let temp = list.songs[start];
            for (let i = start; i > end; i--) {
                list.songs[i] = list.songs[i - 1];
            }
            list.songs[end] = temp;
        }

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION REMOVES THE SONG AT THE index LOCATION
    // FROM THE CURRENT LIST
    store.removeSong = function(index) {
        let list = store.currentList;      
        list.songs.splice(index, 1); 

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION UPDATES THE TEXT IN THE ITEM AT index TO text
    store.updateSong = function(index, songData) {
        let list = store.currentList;
        let song = list.songs[index];
        song.title = songData.title;
        song.artist = songData.artist;
        song.youTubeId = songData.youTubeId;

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    store.addNewSong = () => {
        let playlistSize = store.getPlaylistSize();
        store.addCreateSongTransaction(
            playlistSize, "Untitled", "?", "dQw4w9WgXcQ");
    }
    // THIS FUNCDTION ADDS A CreateSong_Transaction TO THE TRANSACTION STACK
    store.addCreateSongTransaction = (index, title, artist, youTubeId) => {
        // ADD A SONG ITEM AND ITS NUMBER
        let song = {
            title: title,
            artist: artist,
            youTubeId: youTubeId
        };
        let transaction = new CreateSong_Transaction(store, index, song);
        tps.addTransaction(transaction);
    }    
    store.addMoveSongTransaction = function (start, end) {
        let transaction = new MoveSong_Transaction(store, start, end);
        tps.addTransaction(transaction);
    }
    // THIS FUNCTION ADDS A RemoveSong_Transaction TO THE TRANSACTION STACK
    store.addRemoveSongTransaction = () => {
        let index = store.currentSongIndex;
        let song = store.currentList.songs[index];
        let transaction = new RemoveSong_Transaction(store, index, song);
        tps.addTransaction(transaction);
    }
    store.addUpdateSongTransaction = function (index, newSongData) {
        let song = store.currentList.songs[index];
        let oldSongData = {
            title: song.title,
            artist: song.artist,
            youTubeId: song.youTubeId
        };
        let transaction = new UpdateSong_Transaction(this, index, oldSongData, newSongData);        
        tps.addTransaction(transaction);
    }
    store.updateCurrentList = function() {
        async function asyncUpdateCurrentList() {
            const response = await api.updatePlaylistById(store.currentList._id, store.currentList);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: store.currentList
                });
            }
            store.setCurrentList(store.currentList._id);
        }
        asyncUpdateCurrentList();
    }

    store.updateCurrentList1 = function() {
        async function asyncUpdateCurrentList() {
            const response = await api.updatePlaylistById(store.currentList._id, store.currentList);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: store.currentList
                });
            }
            store.loadIdNamePairs();
        }
        asyncUpdateCurrentList();
    }

    store.addComment = function(comment) {
        let name = auth.user.username
        let newComment = {user: name, comment: comment}
        store.currentList.comments.push(newComment)
        async function asyncAddComment() {
            const response = await api.updatePlaylistByOther(store.currentList._id, store.currentList);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: store.currentList
                });
            }
        }
        asyncAddComment()
        console.log('hello')
    }

    store.likeList = function(email, id, type) { //0 add 1 remove 2 remove from other and add to this one
        async function asyncGetPlaylist(id){
            let response = await api.getPlaylistById(id)
            if (response.data.success){
                let playlist = response.data.playlist;
                if (type === 0){
                    playlist.likes.push(email);
                }
                else if(type === 1){
                    playlist.likes.splice(playlist.likes.indexOf(email), 1)
                }
                else{
                    playlist.dislikes.splice(playlist.dislikes.indexOf(email), 1)
                    playlist.likes.push(email);
                }
                async function updatePlaylist(id ,playlist){
                    response = await api.updatePlaylistByOther(id, playlist);
                    if (response.data.success){
                        if (store.display[0] === 0){
                            store.loadIdNamePairs();
                        }
                        else{
                            store.loadPublished(store.display[0])
                        }
                        
                    }
                }
                updatePlaylist(id, playlist)
            }
        }
        asyncGetPlaylist(id)
    }

    store.dislikeList = function(email, id, type) {
        async function asyncGetPlaylist(id){
            let response = await api.getPlaylistById(id)
            if (response.data.success){
                let playlist = response.data.playlist;
                if (type === 0){
                    playlist.dislikes.push(email);
                }
                else if(type === 1){
                    playlist.dislikes.splice(playlist.likes.indexOf(email), 1)
                }
                else{
                    playlist.likes.splice(playlist.likes.indexOf(email), 1)
                    playlist.dislikes.push(email);
                }
                async function updatePlaylist(id ,playlist){
                    response = await api.updatePlaylistByOther(id, playlist);
                    if (response.data.success){
                        if (store.display[0] === 0){
                            store.loadIdNamePairs();
                        }
                        else{
                            store.loadPublished(store.display[0])
                        }
                    }
                }
                updatePlaylist(id, playlist)
            }
        }
        asyncGetPlaylist(id)
    }

    store.displaySong = function(index, song) {
        storeReducer({
            type: GlobalStoreActionType.DISPLAY_SONG,
            payload: {song: song, index: index}
        });
    }

    store.publish = function (){
        store.currentList.published = true;
        store.currentList.publishDate = new Date()
        store.updateCurrentList1()
    }

    store.undo = function () {
        tps.undoTransaction();
    }
    store.redo = function () {
        tps.doTransaction();
    }
    store.canAddNewSong = function() {
        return (store.currentList !== null);
    }
    store.canUndo = function() {
        return ((store.currentList !== null) && tps.hasTransactionToUndo());
    }
    store.canRedo = function() {
        return ((store.currentList !== null) && tps.hasTransactionToRedo());
    }
    store.canClose = function() {
        return (store.currentList !== null);
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setIsListNameEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }

    function KeyPress(event) {
        if (!store.modalOpen && event.ctrlKey){
            if(event.key === 'z'){
                store.undo();
            } 
            if(event.key === 'y'){
                store.redo();
            }
        }
    }
  
    document.onkeydown = (event) => KeyPress(event);

    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };