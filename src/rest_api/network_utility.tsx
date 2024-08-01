import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import FormData from 'form-data';
import path from 'path';

// Assuming PrefData and other dependencies are available
// import { getSessionToken } from './prefdata';
// import { isNetworkAvailable } from './network_status';
import { BASE_URL, APP_TOKEN } from '../configs';
import { getAccessToken } from '../pages/Protected';

const isNetworkAvailable =  () => true;

enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  DELETE = 'DELETE',
  PUT = 'PUT'
}

export async function buildHeaderTokens(isStripePayment: boolean = false, request?: any): Promise<Record<string, string>> {
  const userToken = getAccessToken()?.toString() || '';

  const header: Record<string, string> = {
    // 'Cache-Control': 'no-cache',
    // 'Access-Control-Allow-Headers': '*',
    // 'Access-Control-Allow-Origin': '*',
    // 'Content-Type': 'application/json; charset=UTF-8',
    // 'usertoken': userToken,
    'Authorization': `${userToken}`,
    'Accept': 'application/json; charset=utf-8'
  };

  return header;
}

async function buildHttpResponse(
  // endPoint: string,
  // method: HttpMethod = HttpMethod.GET,
  // request?: any,
  // isStripePayment: boolean = false,
  // customHeader?: Record<string, string>
  {
    endPoint,
    method = HttpMethod.GET,
    body,
    isStripePayment = false,
    customHeader
  }: {
    endPoint: string,
    method?: HttpMethod,
    body?: any,
    isStripePayment?: boolean,
    customHeader?: Record<string, string>
  
  }
): Promise<any> {
  if (await isNetworkAvailable()) {
    const headers = await buildHeaderTokens(isStripePayment, body);
    const url = buildBaseUrl(endPoint);

    const config: AxiosRequestConfig = {
      method,
      url,
      headers: customHeader ?? headers,
      data: body,
      responseType: 'json'
    };

    try {
      const response: AxiosResponse = await axios(config);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error(`Error (${method}) ${error.response.status}: ${error.response.data}`);
          throw error.response.data.message || 'Something Went Wrong';
        } else {
          throw 'Your internet is not working';
        }
      } else {
        throw 'An unknown error occurred';
      }
    }
  } else {
    throw 'Your internet is not working';
  }
}

export function buildBaseUrl(endPoint: string): string {
  if (!endPoint.startsWith('http')) return `${BASE_URL}/${endPoint}`;
  return endPoint;
}

async function handleResponse(response: AxiosResponse, avoidTokenError?: boolean): Promise<any> {
  if (!await isNetworkAvailable()) {
    throw 'Your internet is not working';
  }
  if (response.status === 401) {
    throw 'Token Expired';
  }

  if (response.status >= 200 && response.status <= 206) {
    return response.data;
  } else {
    throw response.data.message || 'Something Went Wrong';
  }
}

function handleErrorResponse(response: AxiosResponse): Record<string, any> {
  return {
    status: response.status,
    message: 'Something Went Wrong',
  };
}


// export async function buildHttpReq(
//   {
//     endpoint, 
//     method = 'GET',
//     body = null,
//     header= {},
//     customUrl
    
//   }:
//   {
//     endpoint?: string,
//     method?: string,
//     body?: any,
//     header?: any
//     customUrl?: string
//   }
// ){
//   // convert body to form data
//   const formData = new FormData();
//   Object.keys(body).forEach(key => formData.append(key, body[key]));
//   const response = await fetch(endpoint != null ? buildUrl(endpoint) : customUrl != null ? customUrl: ""  , {
//     method: method,
//     headers: {
//       ...header
//     },
//     body: formData
//   });
//   return await response.json();
// }

export async function buildFormDataRequest(
  {
    endpoint, 
    method = 'GET',
    body = null,
    customUrl 
  }:
  {
    endpoint?: string,
    method?: string,
    body?: any,
    customUrl?: string
  }){
    const formData = new FormData();
    Object.keys(body).forEach(key => formData.append(key, body[key]));
    const response = await fetch(endpoint != null ? buildBaseUrl(endpoint) : customUrl != null ? customUrl: ""  , {
      method: method,
      headers:await buildHeaderTokens(),
      body: formData as any
    });

    return await response.json();

  }

// Example usage


export {
    buildHttpResponse,
    handleResponse,
    HttpMethod,
    // buildMultipartRequest,
    handleErrorResponse
    };
