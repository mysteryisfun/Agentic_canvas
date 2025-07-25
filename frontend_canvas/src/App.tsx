import './App.css';
import './InfoPanel.css';
import CanvasContainer from './CanvasContainer';
import Toolbar from './Toolbar';
import ColorPalette from './ColorPalette';

function App() {
  return (
    <div className="app-container">
      <Toolbar />
      <CanvasContainer />
      <ColorPalette />
    </div>
  );
}

export default App;