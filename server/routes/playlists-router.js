/*
    This is where we'll route all of the received http requests
    into controller response functions.
*/
const express = require('express')
const PlaylistController = require('../controllers/playlist-controller')
const router = express.Router()
const auth = require('../auth')

router.post('/playlist', auth.verify, PlaylistController.createPlaylist)
router.delete('/playlist/:id', auth.verify, PlaylistController.deletePlaylist)
router.get('/playlist/:id', auth.verify, PlaylistController.getPlaylistById)
router.get('/playlistpairs', auth.verify, PlaylistController.getPlaylistPairs)
router.get('/playlists', auth.verify, PlaylistController.getPublishedPairs)
router.put('/playlist/:id', auth.verify, PlaylistController.updatePlaylist)
router.put('/playlists/:id', auth.verify, PlaylistController.updatePlaylistByOther), 

module.exports = router