import axios from "axios";
import { helperVariable } from "./Init";
import {
  NETWORKLOG,
} from "../utils/constants";
import { formatTimestamp } from "../utils/helper";



const AxiosInterceptor = (configData) => {
  const axiosInstance = axios.create(configData);
  axiosInstance.interceptors.request.use((config) => {
    return config;
  });

  const logNetworkRequests = (response) => {
    let type = "other";
    if (response?.config?.url?.endsWith(".css")) {
      type = "css";
    } else if (response?.config?.url?.endsWith(".js")) {
      type = "js";
    } else if (
      response?.config?.url?.endsWith(".woff") ||
      response?.config?.url?.endsWith(".woff2") ||
      response?.config?.url?.endsWith(".ttf")
    ) {
      type = "fonts";
    } else if (
      response?.config?.url?.endsWith(".png") ||
      response?.config?.url?.endsWith(".jpg") ||
      response?.config?.url?.endsWith(".jpeg") ||
      response?.config?.url?.endsWith(".gif")
    ) {
      type = "images";
    } else if (
      response?.headers["content-type"]?.startsWith("application/json")
    ) {
      type = "xhr";
    }
    return type;
  };

  axiosInstance.interceptors.response.use(
    async (response) => {
      try {
        const responseSize = response?.request?._response;

        eventAt = await formatTimestamp(Date.now());

        const originalObject = response?.headers;
        const objectWithNewlines = {};
        for (const key in originalObject) {
          if (originalObject.hasOwnProperty(key)) {
            objectWithNewlines[key] = originalObject[key] + "\n";
          }
        }
        const responseheaderfinal = Object.entries(objectWithNewlines)
          .map(([key, value]) => `${key}: ${value}`)
          .join('\n');

          const originalObjectrq = response?.request?._headers;
          const objectWithNewlinesrq = {};
          for (const key in originalObjectrq) {
            if (originalObjectrq.hasOwnProperty(key)) {
              objectWithNewlinesrq[key] = originalObjectrq[key] + "\n";
            }
          }
          const reqheaderfinal = Object.entries(objectWithNewlinesrq)
            .map(([key, value]) => `${key}: ${value}`)
            .join('\n');
        let reqData = {
          eventType: NETWORKLOG,
          responseCode: response?.status,
          requestMethod: response?.request?._method,
          requestUrl: response?.request?._url,
          requestType: logNetworkRequests(response),
          responseSize: `${responseSize.length} B` || `${response?.request?.responseHeaders["content-length"]} B`,
          responseTime: `${Object.values(
            response.request?._performanceLogger?._timespans
          )[0]?.totalTime}`,
          responseHeader: responseheaderfinal,
          requestHeader: reqheaderfinal,
          eventAt: `${eventAt}`,
          createdAt: Date.now(),
          response: `${JSON.stringify(response?.data) || ""}`,
          request: `${response?.config?.data || ""}`
   
        };

   
        helperVariable.zipyEvents.push(reqData);
        helperVariable.lastActivitytime = Math.floor(Date.now() / 1000);


        return response;
      } catch (error) {
        console.error("Error in AxiosInterceptor response:", error);
        throw error;
      }
    },
    async (error) => {
        eventAt = await formatTimestamp(Date.now());
        const responseSize = error?.response?.request?._response;
        const originalObject = error?.response?.headers;
        const objectWithNewlines = {};
        for (const key in originalObject) {
          if (originalObject.hasOwnProperty(key)) {
            objectWithNewlines[key] = originalObject[key] + "\n";
          }
        }
        const responseheaderfinal = Object.entries(objectWithNewlines)
          .map(([key, value]) => `${key}: ${value}`)
          .join('\n');

          const originalObjectrq = error?.response?.request?._headers;
          const objectWithNewlinesrq = {};
          for (const key in originalObjectrq) {
            if (originalObjectrq.hasOwnProperty(key)) {
              objectWithNewlinesrq[key] = originalObjectrq[key] + "\n";
            }
          }
          const reqheaderfinal = Object.entries(objectWithNewlinesrq)
            .map(([key, value]) => `${key}: ${value}`)
            .join('\n');
        let reqData = {
          eventType: NETWORKLOG,
          responseCode: error?.response?.status,
          requestMethod: error?.response?.request?._method,
          requestUrl:  error?.response?.request?._url,
          requestType: logNetworkRequests(error?.response),
          responseSize: `${responseSize.length} B` || `${error?.response?.request?.responseHeaders["content-length"]} B`,
          responseTime: `${Object.values(
            error?.response.request?._performanceLogger?._timespans
          )[0]?.totalTime}`,
          responseHeader: responseheaderfinal,
          requestHeader: reqheaderfinal,
          eventAt: `${eventAt}`,
          createdAt: Date.now(),
          response: `${JSON.stringify(error?.response?.data) || ""}`,
          request: `${error?.response?.config?.data || ""}`
        };
       


        helperVariable.zipyEvents.push(reqData);
        helperVariable.lastActivitytime = Math.floor(Date.now() / 1000);


      // throw error;
    }
  );
  return axiosInstance;
};
export default AxiosInterceptor;