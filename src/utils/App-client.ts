import { DataType, PostInput } from "./App.type";
import axios from "axios";
import { postData } from "./post-data";

const data = JSON.stringify(postData);

const getData = async (postBody: PostInput) => {
    const apiURL = "https://n57xcegk73.execute-api.us-east-2.amazonaws.com/prod/backtest";
    const body = JSON.stringify(postBody);

    return await axios.post<DataType>(apiURL, body)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.log(error);
        });
};

export default getData;
