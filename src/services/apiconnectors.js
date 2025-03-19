import axios from "axios"
// JS library used to make HTTP requests from the browser or Node.js. It provides an easy-to-use API for handling API calls, including GET, POST, PUT, DELETE, and more.

export const axiosInstance = axios.create({});

export const apiConnector = (method, url, bodyData, headers, params) => {
    return axiosInstance({
        method: `${method}`,
        url: `${url}`,
        data: bodyData ? bodyData : null,
        headers: headers ? headers : null,
        params: params ? params : null
    })
};

