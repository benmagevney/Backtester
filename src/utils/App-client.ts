import { DataType } from "./App.type";
import axios from "axios";
import { postData } from "./post-data";

const data = JSON.stringify(postData);

const getData = async () => {
    const apiURL = "https://n57xcegk73.execute-api.us-east-2.amazonaws.com/prod/backtest";
    const body = data;

    return await axios.post<DataType>(apiURL, body)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.log(error);
        });
};

export default getData;
