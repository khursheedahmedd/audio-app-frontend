import './App.css'
import AudioChatApp from './components/AudioChatApp'
import ErrorBoundary from './components/ErrorBoundary'
import TextToVoice from './components/TextToVoice'
import { useState } from 'react'

function App() {
  const [selectedComponent, setSelectedComponent] = useState(null)

  return (
    <>
      <div>
        {/* <h1>Choose an Option:</h1> */}
        <div>
          <button onClick={() => setSelectedComponent('audioChat')} className='bg-gray-600 text-white p-2 rounded-lg mr-2 mb-2'>Talk to lost friend</button>
          <button onClick={() => setSelectedComponent('textToVoice')} className='bg-gray-600 text-white p-2 rounded-lg mb-2'>Get back your voice</button>
        </div>

        {selectedComponent === 'audioChat' && (
          <ErrorBoundary>
            <AudioChatApp />
          </ErrorBoundary>
        )}

        {selectedComponent === 'textToVoice' && (
          <ErrorBoundary>
            <TextToVoice />
          </ErrorBoundary>
        )}
      </div>
    </>
  )
}

export default App
