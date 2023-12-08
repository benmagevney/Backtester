import { useState } from 'react';


import './App.css';
import { DataType } from './utils/App.type';
import { LineChart } from './components/LineChart';
import { InputSelector } from './components/InputSelector';
import '@mantine/core/styles.css';
import { Loader, MantineProvider, createTheme } from '@mantine/core';
import "./components/InputSelector.css"
import { BuySellChart } from './components/BuySellChart';

function App() {

  const [backtesterData, setBacktesterData] = useState<DataType | void>(void 0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  console.log(backtesterData);
  return (
    <MantineProvider>
      <div style={{ fontSize: "40px", textAlign: "center", fontWeight: "bold" }}>Stock Backtester</div>
      <InputSelector setBacktesterData={setBacktesterData} setIsLoading={setIsLoading} />
      {isLoading ?
        <div style={{ display: "flex", justifyContent: "center", paddingTop: "30px" }}>
          <Loader size={60} />
        </div> : null}
      {backtesterData ?
        <div className="chartContainer">
          <LineChart data={backtesterData} />
          <BuySellChart data={backtesterData} />
        </div> : null}
    </MantineProvider>
  );
}



export default App;
