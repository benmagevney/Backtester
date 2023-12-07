import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';


import logo from './logo.svg';
import axios from 'axios';
import { dummyData } from './utils/post-data';

import './App.css';
import { DataType } from './utils/App.type';
import getData from './utils/App-client';
import { LineChart } from './components/LineChart';
import { InputSelector } from './components/InputSelector';
import '@mantine/core/styles.css';
import { MantineProvider, createTheme } from '@mantine/core';



function App() {

  // const [backtesterData, setBacktesterData] = useState<DataType | void>(undefined);
  const [ticker, setTicker] = useState<string>("AAPL");
  const backtesterData: DataType = dummyData;
  // getData().then((data) => {
  //   setBacktesterData(data);
  // });
  // const { data, isLoading, isError } = useQuery("getDataKey", getData());

  console.log(backtesterData);
  return (
    <MantineProvider>
      <div style={{ fontSize: "2em", textAlign: "center" }}>Stock Backtester</div>
      <InputSelector
        ticker={ticker}
        setTicker={setTicker} />
      <LineChart data={backtesterData} />
    </MantineProvider>
  );
}



export default App;
