import './App.css';
import CanvasContainer from './CanvasContainer';
import { CanvasProvider } from './context/CanvasContext';

function App() {
  return (
    <CanvasProvider>
      <CanvasContainer />
    </CanvasProvider>
  );
}

export default App;
