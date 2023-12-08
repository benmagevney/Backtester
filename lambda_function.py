import json
import os
import pathlib
import string
from configparser import ConfigParser

import yfinance as yf
import pandas as pd

def get_close(ticker: str, period: str) -> pd.Series:
    accepted_periods = ["1y", "2y", "5y", "10y", "ytd", "max"]
    if period not in accepted_periods:
        raise ValueError(f"period must be one of {accepted_periods}")
    stock = yf.Ticker(ticker)
    hist = stock.history(period=period, interval="1d")
    return hist["Close"]


def SMA(data: pd.Series, n_days: int) -> pd.Series:
    """
    Simple Moving Average
    Returns pd.Series with datetime index and SMA values
    drops null values
    """
    return data.rolling(n_days).mean().dropna()


def EMA(data, n_days) -> pd.Series:
    """
    Exponential Moving Average
    Returns pd.Series with datetime index and EMA values
    drops null values
    """
    return data.ewm(span=n_days, adjust=False).mean().dropna()

def MACD(data, fast_moving_avg_period, slow_moving_avg_period, signal_period) -> pd.Series:
    """
    Moving Average Convergence Divergence
    Returns 2 pd.Series with datetime index, MACD and signal 
    drops null values
    """
    fast_moving_avg = EMA(data, fast_moving_avg_period)
    slow_moving_avg = EMA(data, slow_moving_avg_period)
    macd = fast_moving_avg - slow_moving_avg
    macd_slope = macd.diff()
    signal = EMA(macd, signal_period)
    signal_slope = signal.diff()
    macd_signal_diff = macd-signal
    return macd, macd_slope, signal, signal_slope, macd_signal_diff

def RSI(data, n_days) -> pd.Series:
    """
    Relative Strength Index
    Returns pd.Series with datetime index and RSI values
    drops null values
    """
    delta = data.diff()
    up = delta.clip(lower=0)
    down = -1*delta.clip(upper=0)
    avg_up = SMA(up, n_days)
    avg_down = SMA(down, n_days)
    rs = avg_up/avg_down
    rsi = 100 - (100 / (1 + rs))
    rsi_slope = rsi.diff()
    return rsi, rsi_slope


def get_all_stats(data, param_dict: dict):
    sma = None
    macd = None
    macd_slope = None
    signal = None
    signal_slope = None
    macd_signal_diff = None
    rsi = None
    rsi_slope = None
    
    for stat, params in param_dict.items():
        if stat == "SMA":
            sma = SMA(data, params["n_days"])
        elif stat == "MACD":
            macd, macd_slope_temp, signal_temp, signal_slope_temp, macd_signal_diff_temp = MACD(
                data,
                params["fast_moving_avg_period"],
                params["slow_moving_avg_period"],
                params["signal_period"],
            )
            if "MACD_SLOPE" in params.keys():
                macd_slope = macd_slope_temp
            if "MACD_SIGNAL" in params.keys():
                signal = signal_temp
            if "MACD_SIGNAL_SLOPE" in params.keys():
                signal_slope = signal_temp
            if "MACD_SIGNAL_DIFF" in params.keys():
                macd_signal_diff = macd_signal_diff_temp
        elif stat == "RSI":
            rsi, rsi_slope_temp = RSI(data, params["n_days"])
            if "RSI_SLOPE" in params.keys():
                rsi_slope = rsi_slope_temp
        else:
            raise ValueError(f"stat must be one of {param_dict.keys()}")
    return sma, macd, macd_slope, signal, signal_slope, macd_signal_diff, rsi, rsi_slope


def backtest(
    ticker: str,
    period: str,
    buy_dict: dict,
    sell_dict: dict,
):
    data = get_close(ticker, period)

    buy_sma, buy_macd, buy_macd_slope, buy_signal, buy_signal_slope, buy_macd_signal_diff, buy_rsi, buy_rsi_slope = get_all_stats(data, buy_dict)
    sell_sma, sell_macd, sell_macd_slope, sell_signal, sell_signal_slope, sell_macd_signal_diff, sell_rsi, sell_rsi_slope = get_all_stats(data, sell_dict)
    signals_dict = {        
        "buy_sma": buy_sma,
        "buy_macd": buy_macd,
        "buy_macd_slope": buy_macd_slope,
        "buy_signal": buy_signal,
        "buy_signal_slope": buy_signal_slope,
        "buy_macd_signal_diff": buy_macd_signal_diff,
        "buy_rsi": buy_rsi,
        "buy_rsi_slope": buy_rsi_slope,
        "sell_sma": sell_sma,
        "sell_macd": sell_macd,
        "sell_macd_slope": sell_macd_slope,
        "sell_signal": sell_signal,
        "sell_signal_slope": sell_signal_slope,
        "sell_macd_signal_diff": sell_macd_signal_diff,
        "sell_rsi": sell_rsi,
        "sell_rsi_slope": sell_rsi_slope,
    }

    Not_None_Columns = []
    for key, value in signals_dict.items():
        if type(value) != type(None):
            Not_None_Columns.append(key)
    
    # Drop rows from buy/sell considerations that don't have all technical indicators yet
    analysis = pd.DataFrame(index=data.index, data= signals_dict)
    analysis = analysis.dropna(subset=Not_None_Columns)
    print(analysis)

    buy_dates = []
    sell_dates = []
    
    # To start, we do not hold a position
    curr_pos = False
    
    # Iterating through rows to get buy and sell dates
    for index, row in analysis.iterrows():
        
        # If current position is false, look at buy signals and consider buying
        if curr_pos == False:
            buy_signal = True
            buy_keys = {"buy_sma": "SMA", 
                        "buy_macd": "MACD", "buy_macd_slope": "MACD_SLOPE", 
                        "buy_signal": "MACD_SIGNAL", "buy_signal_slope": "MACD_SIGNAL_SLOPE",
                        "buy_macd_signal_diff": "MACD_SIGNAL_DIFF",
                        "buy_rsi": "RSI", "buy_rsi_slope": "RSI_SLOPE"}
            for dict_key, df_key in buy_keys.items():
                if row[dict_key] != None:
                    if df_key in buy_dict.keys():
                        if buy_dict[df_key]["symbol"] == "<=":
                            if row[dict_key] > buy_dict[df_key]["value"]:
                                buy_signal = False
                        elif buy_dict[df_key]["symbol"] == ">=":
                            if row[dict_key] < buy_dict[df_key]["value"]:
                                buy_signal = False
                    else:
                        outer_cat = df_key.split('_')[0]
                        if buy_dict[outer_cat][df_key]["symbol"] == "<=":
                            if row[dict_key] > buy_dict[outer_cat][df_key]["value"]:
                                buy_signal = False
                        elif buy_dict[outer_cat][df_key]["symbol"] == ">=":
                            if row[dict_key] < buy_dict[outer_cat][df_key]["value"]:
                                buy_signal = False                  
            if buy_signal == True:
                buy_dates.append(index)
                curr_pos = True
              
        # If current position is true, look at sell signals and consider selling
        elif curr_pos == True:
            sell_signal = True
            sell_keys = {"sell_sma": "SMA", 
                        "sell_macd": "MACD", "sell_macd_slope": "MACD_SLOPE", 
                        "sell_signal": "SIGNAL", "sell_signal_slope": "SIGNAL_SLOPE",
                        "sell_macd_signal_diff": "MACD_SIGNAL_DIFF",
                        "sell_rsi": "RSI", "sell_rsi_slope": "RSI_SLOPE"}
            for dict_key, df_key in sell_keys.items():
                if row[dict_key] != None:
                    if df_key in buy_dict.keys():
                        if sell_dict[df_key]["symbol"] == "<=":
                            if row[dict_key] > sell_dict[df_key]["value"]:
                                sell_signal = False
                        elif sell_dict[df_key]["symbol"] == ">=":
                            if row[dict_key] < sell_dict[df_key]["value"]:
                                sell_signal = False
                    else:
                        outer_cat = df_key.split('_')[0]
                        if sell_dict[outer_cat][df_key]["symbol"] == "<=":
                            if row[dict_key] > sell_dict[outer_cat][df_key]["value"]:
                                sell_signal = False
                        elif sell_dict[outer_cat][df_key]["symbol"] == ">=":
                            if row[dict_key] < sell_dict[outer_cat][df_key]["value"]:
                                sell_signal = False
            if sell_signal == True:
                sell_dates.append(index)
                curr_pos = False

    # Concatenate both lists
    combined_signals = buy_dates + sell_dates

    # Sort the combined list by time
    sorted_list = sorted(combined_signals, key=lambda x: x)
    
    #Convert buy and sell dates to string
    string_buy_dates = []
    string_sell_dates = []
    for date in buy_dates:
        string_buy_dates.append(str(date))
    for date in sell_dates:
        string_sell_dates.append(str(date))
    
    dates = []
    strategy_values = []
    underlier_values = []
    starting_value = 100
    first_underlier_value= None
    curr_pos = False
    
    for date in data.index:
        dates.append(str(date))
        if first_underlier_value == None:
            first_underlier_value = data[date]
            underlier_values.append(data[date]/first_underlier_value * 100)
            strategy_values.append(100)
            if curr_pos == False:
                if date in sorted_list:
                    curr_pos = True
        elif curr_pos == False:
            strategy_values.append(strategy_values[-1])
            underlier_values.append(data[date]/first_underlier_value * 100)
            if date in sorted_list:
                curr_pos = True
        elif curr_pos == True:    
            strategy_values.append(strategy_values[-1] * underlier_values[-1]/underlier_values[-2])
            underlier_values.append(data[date]/first_underlier_value * 100)
            if date in sorted_list:
                curr_pos = False
    return dates, string_buy_dates, string_sell_dates, strategy_values, underlier_values
    

def lambda_handler(event, context):
  try:
    print("**STARTING**")
    
    #
    # setup AWS based on config file:
    #
    config_file = 'config.ini'
    os.environ['AWS_SHARED_CREDENTIALS_FILE'] = config_file
    
    configur = ConfigParser()
    configur.read(config_file)
    body = json.loads(event["body"])
    
    if "ticker" in body:
        ticker = body["ticker"]
    if "period" in body:
        period = body["period"]
    if "buy_dict" in body:
        buy_dict = body["buy_dict"]
    if "sell_dict" in body:
        sell_dict = body["sell_dict"]

    if "ticker" not in body and "period" not in body and "buy_dict" not in body and "sell_dict" not in body:
        raise Exception("requires a ticker, period, and technical indicator conditions for both buys and sells")

    print("ticker:", ticker)
    print("period:", period)
    print("buy_dict:", buy_dict)
    print("sell_dict:", sell_dict)
    dates, buy_dates, sell_dates, strategy_values, underlier_values = backtest(ticker, period, buy_dict, sell_dict)

    data = {
          "dates": dates,
          "buy_dates": buy_dates,
          "sell_dates": sell_dates,
          "strategy_values": strategy_values,
          "underlier_values": underlier_values
          }

    return {
      'statusCode': 200,
      'body': json.dumps(
          data
          )
    }

  except Exception as err:
    return {
      'statusCode': 400,
      'body': json.dumps(str(err))
    }
