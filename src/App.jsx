
import AudioChatApp from './components/AudioChatApp'
import Home from './components/Home'
import Navbar from './components/Navbar'
import TalkToHistoricalPersonality from './components/TalkToHistoricalPersonality'
import TextToVoice from './components/TextToVoice'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

function App() {

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path='/talk-to-lost-friend' element={<AudioChatApp />} />
          <Route exact path='/get-back-your-voice' element={<TextToVoice />} />
          <Route exact path='/talk-to-historical-personality' element={<TalkToHistoricalPersonality />} />
        </Routes>

      </Router>
    </>
  )
}

export default App
