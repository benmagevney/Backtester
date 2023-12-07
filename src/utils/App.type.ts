type DataType = {
    dates: string[];
    buy_dates: string[];
    sell_dates: string[];
    strategy_values: number[];
    underlier_values: number[];
};

type SupportedSignal = '>' | '<' | '>=' | '<=';

type SymbolValueObject = {
    symbol: SupportedSignal;
    value: number;
}

type RSIInput = {
    n_days: number;
    symbol: SupportedSignal;
    value: number;
    RSI_SLOPE?: SymbolValueObject;
}

type MACDInput = {
    fast_moving_avg_period: number;
    slow_moving_avg_period: number;
    signal_period: number;
    symbol: SupportedSignal;
    value: number;
    MACD_SLOPE?: SymbolValueObject;
    MACD_SIGNAL?: SymbolValueObject;
    MACD_SIGNAL_SLOPE?: SymbolValueObject;
    MACD_SIGNAL_DIFF?: SymbolValueObject;
}

type SMAInput = {
    n_days: number;
    symbol: SupportedSignal;
    value: number;
}

type StrategyDict = {
    RSI?: RSIInput;
    MACD?: MACDInput;
    SMA?: SMAInput;
};

type PostInput = {
    ticker: string;
    period: string;
    buy_dict: StrategyDict;
    sell_dict: StrategyDict;
}


export type { SupportedSignal, StrategyDict, DataType, RSIInput, MACDInput, SMAInput, PostInput };

