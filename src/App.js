// import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import TableData from './Components/TableData'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TableData />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
