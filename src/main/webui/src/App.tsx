import './App.scss';
import { AttackBoard } from './features/attack/attack-board';
import { HomeBoard } from './features/home/home-board';

function App() {
  return (
    <div className="container">
      <HomeBoard />
      <AttackBoard />
    </div>
  );
}

export default App;
