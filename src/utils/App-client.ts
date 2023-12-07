import { DataType } from "./App.type";
import axios, { AxiosRequestConfig } from "axios";
import { postData } from "./post-data";

const data = JSON.stringify(postData);

// Replace 'YOUR_API_GATEWAY_ENDPOINT' with the actual endpoint URL
const apiGatewayEndpoint = "https://n57xcegk73.execute-api.us-east-2.amazonaws.com/prod/backtest";


// Configure the Axios request
const axiosConfig: AxiosRequestConfig = {
    method: 'post',
    url: apiGatewayEndpoint,
    headers: {
        'Content-Type': 'application/json',
        // Add any other headers if needed
    },
    data: data,
};

// Make the POST request
// axios(axiosConfig)
//     .then((response) => {
//         // Handle the success response
//         console.log('Response:', response.data);
//     })
//     .catch((error) => {
//         // Handle the error
//         console.error('Error:', error.message);
//     });

const getData = async () => {
    const apiURL = "https://n57xcegk73.execute-api.us-east-2.amazonaws.com/prod/backtest";
    const body = data;

    return await axios.post<DataType>(apiURL, body)
        .then((response) => {
            console.log("client", response.data);
            return response.data;
        })
        .catch((error) => {
            console.log(error);
        });
};

export default getData;
