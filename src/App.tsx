import { useState } from 'react';

import { dummyData } from './utils/post-data';

import './App.css';
import { DataType, MACDInput, RSIInput, SMAInput } from './utils/App.type';
import getData from './utils/App-client';
import { LineChart } from './components/LineChart';
import { InputSelector } from './components/InputSelector';
import '@mantine/core/styles.css';
import { Loader, MantineProvider, createTheme } from '@mantine/core';

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
      {backtesterData ? <LineChart data={backtesterData} /> : null}
    </MantineProvider>
  );
}



export default App;
