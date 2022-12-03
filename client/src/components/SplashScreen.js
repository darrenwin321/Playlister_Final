import logo from './playlister_img.png'
export default function SplashScreen() {
    return (
        <div id="splash-screen">
            <img src={logo} alt="logo"/>
            <div>All your music in one place</div>
            <div style={{position: 'absolute', bottom: 0}}>By Darren Nguyen</div>
        </div>
    )
}