import app from './App.module.css';
import { useNavigate } from 'react-router-dom';

function App() {
  const url = useNavigate();
  return (
    <body className={app.body}>
    <div className={app.background}>
      <div className={app.bucket}>
        <h1 className={app.h1}>大學性格遊戲</h1>
        <br/><br/><br/><br/><br/><br/>
        <button className={app.btn} onClick={() => {url("./vistor")}}>開始測試</button>
      </div>
    </div>
  </body>
  );
}

export default App;
