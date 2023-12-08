
import { TextInput, Select, Button } from '@mantine/core';
import './InputSelector.css';
import { useState } from 'react';
import { RSISelector } from './RSISelector';
import { MACDSelector } from './MACDSelector';
import { SMASelector } from './SMASelector';
import { DataType, PostInput, StrategyDict, SupportedSignal, SymbolValueObject } from '../utils/App.type';
import getData from '../utils/App-client';


type SelectorProps = {
    setBacktesterData: React.Dispatch<React.SetStateAction<DataType | void>>,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
};

export function InputSelector({ setBacktesterData, setIsLoading }: SelectorProps) {

    const [invalidPost, setInvalidPost] = useState<boolean>(false);
    const [ticker, setTicker] = useState<string | null>(null);
    const [period, setPeriod] = useState<string | null>(null);

    const invalidTickerPeriod = ticker === null || period === null;

    const [useBuyRSI, setUseBuyRSI] = useState<boolean>(false);
    const [useBuyMACD, setUseBuyMACD] = useState<boolean>(false);
    const [useBuySMA, setUseBuySMA] = useState<boolean>(false);
    const [useSellRSI, setUseSellRSI] = useState<boolean>(false);
    const [useSellMACD, setUseSellMACD] = useState<boolean>(false);
    const [useSellSMA, setUseSellSMA] = useState<boolean>(false);

    const invalidStrategy = (!(useBuyMACD || useBuyRSI || useBuySMA) || !(useSellMACD || useSellRSI || useSellSMA));


    // RSI states
    const [buyRSIDays, setBuyRSIDays] = useState<number | undefined>(undefined);
    const [buyRSISymbol, setBuyRSISymbol] = useState<SupportedSignal | undefined>(undefined);
    const [buyRSIValue, setBuyRSIValue] = useState<number | undefined>(undefined);
    const [sellRSIDays, setSellRSIDays] = useState<number | undefined>(undefined);
    const [sellRSISymbol, setSellRSISymbol] = useState<SupportedSignal | undefined>(undefined);
    const [sellRSIValue, setSellRSIValue] = useState<number | undefined>(undefined);

    // RSI optionalStates
    const defaultSymbolValueObject: SymbolValueObject = {
        symbol: undefined,
        value: undefined,
    };
    const [buyRSISlope, setBuyRSISlope] = useState<SymbolValueObject>(defaultSymbolValueObject);
    const [sellRSISlope, setSellRSISlope] = useState<SymbolValueObject>(defaultSymbolValueObject);

    // MACD states
    const [buyMACDFast, setBuyMACDFast] = useState<number | undefined>(undefined);
    const [buyMACDSlow, setBuyMACDSlow] = useState<number | undefined>(undefined);
    const [buyMACDSignal, setBuyMACDSignal] = useState<number | undefined>(undefined);
    const [buyMACDSymbol, setBuyMACDSymbol] = useState<SupportedSignal | undefined>(undefined);
    const [buyMACDValue, setBuyMACDValue] = useState<number | undefined>(undefined);
    const [sellMACDFast, setSellMACDFast] = useState<number | undefined>(undefined);
    const [sellMACDSlow, setSellMACDSlow] = useState<number | undefined>(undefined);
    const [sellMACDSignal, setSellMACDSignal] = useState<number | undefined>(undefined);
    const [sellMACDSymbol, setSellMACDSymbol] = useState<SupportedSignal | undefined>(undefined);
    const [sellMACDValue, setSellMACDValue] = useState<number | undefined>(undefined);

    // MACD optionalStates
    const [buyMACDSlope, setBuyMACDSlope] = useState<SymbolValueObject>(defaultSymbolValueObject);
    const [sellMACDSlope, setSellMACDSlope] = useState<SymbolValueObject>(defaultSymbolValueObject);
    const [buyMACDSignalOptional, setBuyMACDSignalOptional] = useState<SymbolValueObject>(defaultSymbolValueObject);
    const [sellMACDSignalOptional, setSellMACDSignalOptional] = useState<SymbolValueObject>(defaultSymbolValueObject);
    const [buyMACDSignalSlope, setBuyMACDSignalSlope] = useState<SymbolValueObject>(defaultSymbolValueObject);
    const [sellMACDSignalSlope, setSellMACDSignalSlope] = useState<SymbolValueObject>(defaultSymbolValueObject);
    const [buyMACDSignalDiff, setBuyMACDSignalDiff] = useState<SymbolValueObject>(defaultSymbolValueObject);
    const [sellMACDSignalDiff, setSellMACDSignalDiff] = useState<SymbolValueObject>(defaultSymbolValueObject);


    // SMA states
    const [buySMADays, setBuySMADays] = useState<number | undefined>(undefined);
    const [buySMASymbol, setBuySMASymbol] = useState<SupportedSignal | undefined>(undefined);
    const [buySMAValue, setBuySMAValue] = useState<number | undefined>(undefined);
    const [sellSMADays, setSellSMADays] = useState<number | undefined>(undefined);
    const [sellSMASymbol, setSellSMASymbol] = useState<SupportedSignal | undefined>(undefined);
    const [sellSMAValue, setSellSMAValue] = useState<number | undefined>(undefined);

    const createPostRequest = (): PostInput | void => {
        if (invalidTickerPeriod) {
            console.error("Ticker and period must be defined");
            return;
        }
        if (invalidStrategy) {
            console.error("Must have at least one buy and sell strategy");
            return;
        }
        const buyDict: StrategyDict = {};
        if (useBuyRSI) {
            if (buyRSIDays === undefined || buyRSISymbol === undefined || buyRSIValue === undefined) {
                console.error("Buy RSI values must be defined");
                return;
            }
            buyDict.RSI = {
                n_days: buyRSIDays,
                symbol: buyRSISymbol,
                value: buyRSIValue,
            };
            if (buyRSISlope.symbol !== undefined && buyRSISlope.value !== undefined) {
                buyDict.RSI.RSI_SLOPE = buyRSISlope;
            }
        };
        if (useBuyMACD) {
            if (buyMACDFast === undefined || buyMACDSlow === undefined || buyMACDSignal === undefined || buyMACDSymbol === undefined || buyMACDValue === undefined) {
                console.error("Buy MACD values must be defined");
                return;
            }
            buyDict.MACD = {
                fast_moving_avg_period: buyMACDFast,
                slow_moving_avg_period: buyMACDSlow,
                signal_period: buyMACDSignal,
                symbol: buyMACDSymbol,
                value: buyMACDValue,
            };
            if (buyMACDSlope.symbol !== undefined && buyMACDSlope.value !== undefined) {
                buyDict.MACD.MACD_SLOPE = buyMACDSlope;
            }
            if (buyMACDSignalOptional.symbol !== undefined && buyMACDSignalOptional.value !== undefined) {
                buyDict.MACD.MACD_SIGNAL = buyMACDSignalOptional;
            }
            if (buyMACDSignalSlope.symbol !== undefined && buyMACDSignalSlope.value !== undefined) {
                buyDict.MACD.MACD_SIGNAL_SLOPE = buyMACDSignalSlope;
            }
            if (buyMACDSignalDiff.symbol !== undefined && buyMACDSignalDiff.value !== undefined) {
                buyDict.MACD.MACD_SIGNAL_DIFF = buyMACDSignalDiff;
            }
        };
        if (useBuySMA) {
            if (buySMADays === undefined || buySMASymbol === undefined || buySMAValue === undefined) {
                console.error("Buy SMA values must be defined");
                return;
            }
            buyDict.SMA = {
                n_days: buySMADays,
                symbol: buySMASymbol,
                value: buySMAValue,
            };
        };
        const sellDict: StrategyDict = {};
        if (useSellRSI) {
            if (sellRSIDays === undefined || sellRSISymbol === undefined || sellRSIValue === undefined) {
                console.error("Sell RSI values must be defined");
                return;
            }
            sellDict.RSI = {
                n_days: sellRSIDays,
                symbol: sellRSISymbol,
                value: sellRSIValue,
            };
            if (sellRSISlope.symbol !== undefined && sellRSISlope.value !== undefined) {
                sellDict.RSI.RSI_SLOPE = sellRSISlope;
            }
        };
        if (useSellMACD) {
            if (sellMACDFast === undefined || sellMACDSlow === undefined || sellMACDSignal === undefined || sellMACDSymbol === undefined || sellMACDValue === undefined) {
                console.error("Sell MACD values must be defined");
                return;
            }
            sellDict.MACD = {
                fast_moving_avg_period: sellMACDFast,
                slow_moving_avg_period: sellMACDSlow,
                signal_period: sellMACDSignal,
                symbol: sellMACDSymbol,
                value: sellMACDValue,
            };
            if (sellMACDSlope.symbol !== undefined && sellMACDSlope.value !== undefined) {
                sellDict.MACD.MACD_SLOPE = sellMACDSlope;
            }
            if (sellMACDSignalOptional.symbol !== undefined && sellMACDSignalOptional.value !== undefined) {
                sellDict.MACD.MACD_SIGNAL = sellMACDSignalOptional;
            }
            if (sellMACDSignalSlope.symbol !== undefined && sellMACDSignalSlope.value !== undefined) {
                sellDict.MACD.MACD_SIGNAL_SLOPE = sellMACDSignalSlope;
            }
            if (sellMACDSignalDiff.symbol !== undefined && sellMACDSignalDiff.value !== undefined) {
                sellDict.MACD.MACD_SIGNAL_DIFF = sellMACDSignalDiff;
            }
        };
        if (useSellSMA) {
            if (sellSMADays === undefined || sellSMASymbol === undefined || sellSMAValue === undefined) {
                console.error("Sell SMA values must be defined");
                return;
            }
            sellDict.SMA = {
                n_days: sellSMADays,
                symbol: sellSMASymbol,
                value: sellSMAValue,
            };
        };

        return {
            ticker: ticker,
            period: period,
            buy_dict: buyDict,
            sell_dict: sellDict,
        };
    };


    const handleSubmit = () => {
        const postBody = createPostRequest();
        console.log(postBody);
        if (postBody === undefined || postBody === null) {
            setInvalidPost(true);
            return;
        }
        setInvalidPost(false);
        setIsLoading(true);
        setBacktesterData(void 0);
        getData(postBody).then((data) => {
            setIsLoading(false);
            setBacktesterData(data);
        });
        console.log("Submit");
    };

    return (
        <>
            {invalidPost ? <div className="error">Invalid post input. Fix errors and submit again.</div> : null}
            {invalidTickerPeriod ? <div className="error">Ticker and period must be defined</div> : null}
            <div className='topGroup'>
                <TextInput className="selectItem" label="Stock Ticker" placeholder={"Ticker"} value={ticker === null ? undefined : ticker}
                    onChange={(event) => setTicker(event.currentTarget.value)}
                    error={ticker === null} />
                <Select className="selectItem" label="Period" placeholder="Period range"
                    data={[
                        { value: '1y', label: '1 Year' },
                        { value: '2y', label: '2 Years' },
                        { value: '5y', label: '5 Years' },
                        { value: '10y', label: '10 Years' },
                        { value: 'ytd', label: 'YTD' },
                        { value: 'max', label: 'Max' },
                    ]}
                    onChange={(value) => setPeriod(value)}
                    error={period == undefined} />
                <Button variant="filled" onClick={handleSubmit} color="red">Submit</Button>
            </div>
            {invalidStrategy ? <div className="error">Must have at least one buy and sell strategy</div> : null}
            <div className="strategies">
                <div className="strategyColumn">
                    <div className="title">Buy Strategy</div>
                    <RSISelector useRSI={useBuyRSI} setRSI={setUseBuyRSI} RSIDays={buyRSIDays} setRSIDays={setBuyRSIDays} RSISymbol={buyRSISymbol} setRSISymbol={setBuyRSISymbol} RSIValue={buyRSIValue} setRSIValue={setBuyRSIValue} RSISlope={buyRSISlope} setRSISlope={setBuyRSISlope} />
                    <MACDSelector useMACD={useBuyMACD} setMACD={setUseBuyMACD} MACDFast={buyMACDFast} setMACDFast={setBuyMACDFast} MACDSlow={buyMACDSlow} setMACDSlow={setBuyMACDSlow} MACDSignal={buyMACDSignal} setMACDSignal={setBuyMACDSignal} MACDSymbol={buyMACDSymbol} setMACDSymbol={setBuyMACDSymbol} MACDValue={buyMACDValue} setMACDValue={setBuyMACDValue} MACDSlope={buyMACDSlope} setMACDSlope={setBuyMACDSlope} MACDSignalOptional={buyMACDSignalOptional} setMACDSignalOptional={setBuyMACDSignalOptional} MACDSignalSlope={buyMACDSignalSlope} setMACDSignalSlope={setBuyMACDSignalSlope} MACDSignalDiff={buyMACDSignalDiff} setMACDSignalDiff={setBuyMACDSignalDiff} />
                    <SMASelector useSMA={useBuySMA} setSMA={setUseBuySMA} SMADays={buySMADays} setSMADays={setBuySMADays} SMASymbol={buySMASymbol} setSMASymbol={setBuySMASymbol} SMAValue={buySMAValue} setSMAValue={setBuySMAValue} />
                </div>
                <div className="strategyColumn">
                    <div className="title">Sell Strategy</div>
                    <RSISelector useRSI={useSellRSI} setRSI={setUseSellRSI} RSIDays={sellRSIDays} setRSIDays={setSellRSIDays} RSISymbol={sellRSISymbol} setRSISymbol={setSellRSISymbol} RSIValue={sellRSIValue} setRSIValue={setSellRSIValue} RSISlope={sellRSISlope} setRSISlope={setSellRSISlope} />
                    <MACDSelector useMACD={useSellMACD} setMACD={setUseSellMACD} MACDFast={sellMACDFast} setMACDFast={setSellMACDFast} MACDSlow={sellMACDSlow} setMACDSlow={setSellMACDSlow} MACDSignal={sellMACDSignal} setMACDSignal={setSellMACDSignal} MACDSymbol={sellMACDSymbol} setMACDSymbol={setSellMACDSymbol} MACDValue={sellMACDValue} setMACDValue={setSellMACDValue} MACDSlope={sellMACDSlope} setMACDSlope={setSellMACDSlope} MACDSignalOptional={sellMACDSignalOptional} setMACDSignalOptional={setSellMACDSignalOptional} MACDSignalSlope={sellMACDSignalSlope} setMACDSignalSlope={setSellMACDSignalSlope} MACDSignalDiff={sellMACDSignalDiff} setMACDSignalDiff={setSellMACDSignalDiff} />
                    <SMASelector useSMA={useSellSMA} setSMA={setUseSellSMA} SMADays={sellSMADays} setSMADays={setSellSMADays} SMASymbol={sellSMASymbol} setSMASymbol={setSellSMASymbol} SMAValue={sellSMAValue} setSMAValue={setSellSMAValue} />
                </div>

            </div>


        </>
    )
};
