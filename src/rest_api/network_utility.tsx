import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import FormData from 'form-data';
import path from 'path';

// Assuming PrefData and other dependencies are available
// import { getSessionToken } from './prefdata';
// import { isNetworkAvailable } from './network_status';
import { BASE_URL, APP_TOKEN } from '../configs';

const isNetworkAvailable =  () => true;

enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  DELETE = 'DELETE',
  PUT = 'PUT'
}

async function buildHeaderTokens(isStripePayment: boolean = false, request?: any): Promise<Record<string, string>> {
  const userToken = "random_token";

  const header: Record<string, string> = {
    // 'Cache-Control': 'no-cache',
    // 'Access-Control-Allow-Headers': '*',
    // 'Access-Control-Allow-Origin': '*',
    // 'Content-Type': 'application/json; charset=UTF-8',
    // 'usertoken': userToken,
    // 'Authorization': `Bearer ${APP_TOKEN}`,
    'Accept': 'application/json; charset=utf-8'
  };

  return header;
}

async function buildHttpResponse(
  endPoint: string,
  method: HttpMethod = HttpMethod.GET,
  request?: any,
  isStripePayment: boolean = false,
  customHeader?: Record<string, string>
): Promise<any> {
  if (await isNetworkAvailable()) {
    const headers = await buildHeaderTokens(isStripePayment, request);
    const url = buildBaseUrl(endPoint);

    const config: AxiosRequestConfig = {
      method,
      url,
      headers: customHeader ?? headers,
      data: request,
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

function buildBaseUrl(endPoint: string): string {
  if (!endPoint.startsWith('http')) return `${BASE_URL}${endPoint}`;
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

// async function buildMultipartRequest(
//   endPoint: string,
//   fields: Record<string, string>,
//   file?: File,
//   fileFieldName: string = 'file'
// ): Promise<any> {
//   if (await isNetworkAvailable()) {
//     const headers = await buildHeaderTokens();
//     const url = buildBaseUrl(endPoint);

//     const formData = new FormData();
//     Object.keys(fields).forEach(key => {
//       formData.append(key, fields[key]);
//     });

//     if (file) {
//       const fileStream = await fs.readFile(file.name);
//       formData.append(fileFieldName, fileStream, path.basename(file.name));
//     }

//     const config: AxiosRequestConfig = {
//       method: 'POST',
//       url,
//       headers: {
//         ...headers,
//         ...formData.getHeaders()
//       },
//       data: formData
//     };

//     try {
//       const response = await axios(config);
//       return response.data;
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         if (error.response) {
//           console.error(`Error (POST) ${error.response.status}: ${error.response.data}`);
//           throw error.response.data.message || 'Something Went Wrong';
//         } else {
//           throw 'Your internet is not working';
//         }
//       } else {
//         throw 'An unknown error occurred';
//       }
//     }
//   } else {
//     throw 'Your internet is not working';
//   }
// }

function handleErrorResponse(response: AxiosResponse): Record<string, any> {
  return {
    status: response.status,
    message: 'Something Went Wrong',
  };
}

// Example usage
(async () => {
  try {
    const response = await buildHttpResponse('/endpoint', HttpMethod.GET);
    console.log(response);
  } catch (error) {
    console.error(error);
  }
})();

export {
    buildHttpResponse,
    handleResponse,
    HttpMethod,
    // buildMultipartRequest,
    handleErrorResponse
    };
