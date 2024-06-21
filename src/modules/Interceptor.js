import { data, helperVariable } from "./Init";
import {
  CONTENT_TYPE,
  NETWORKLOG,
} from "../utils/constants";
import { formatTimestamp } from "../utils/helper";

export const Interceptor = () => {

  if ((data?.data?.network_capture)) {
    // console.log('Network capture is enabled');
    const originalFetch = fetch;

    fetch = function (url, options) {
      const requestMethod = options?.method?.toUpperCase() || 'GET';
      let start = new Date().getTime();

      return originalFetch
        .apply(this, arguments)
        .then(async function (response) {
          let end = new Date().getTime();
          if (response.url === 'https://mobileservice.zipy.ai/post') {
            return response;
          }
          // console.log(`Request time taken: ${end - start} ms`);

          // console.log('Request Response', reqResponse);

          const logNetworkRequests = (response) => {
            let type = 'other';
            if (response.url.endsWith('.css')) {
              type = 'css';
            } else if (response.url.endsWith('.js')) {
              type = 'js';
            } else if (
              response.url.endsWith('.woff') ||
              response.url.endsWith('.woff2') ||
              response.url.endsWith('.ttf')
            ) {
              type = 'fonts';
            } else if (
              response.url.endsWith('.png') ||
              response.url.endsWith('.jpg') ||
              response.url.endsWith('.jpeg') ||
              response.url.endsWith('.gif')
            ) {
              type = 'images';
            } else if (
              response?.headers?.map['content-type']?.startsWith(CONTENT_TYPE)
            ) {
              type = 'xhr';
            }
            return type;
          };
          let method = requestMethod?.toLowerCase() || '';
          let eventAt = await formatTimestamp(Date.now());
          const requestPayload = options?.body;
          let reqType = logNetworkRequests(response);
          let reqResponse = null
          try {
            reqResponse = await response?.json();

          } catch (error) {

          }

          // }
          const originalObject = response?.headers?.map || response?.headers;
          // Create a new object with newline characters added to each value
          const objectWithNewlines = {};
          for (const key in originalObject) {
            if (originalObject.hasOwnProperty(key)) {
              objectWithNewlines[key] = originalObject[key] + "\n";
            }
          }
          const responseheaderfinal = Object.entries(objectWithNewlines)
            .map(([key, value]) => `${key}: ${value}`)
            .join('\n');

          const requestheaderobject = options?.headers;
          const requestheaderWithNewlines = {};
          for (const key in requestheaderobject) {
            if (requestheaderobject.hasOwnProperty(key)) {
              requestheaderWithNewlines[key] = requestheaderobject[key] + "\n";
            }
          }

          const requestheaderfinal = Object.entries(requestheaderWithNewlines)
            .map(([key, value]) => `${key}: ${value}`)
            .join('\n');

          const logData = {
            eventType: NETWORKLOG,
            requestMethod: method || '',
            requestUrl: response?.url || '',
            requestType: reqType || '',
            requestHeader: requestheaderfinal || '',
            responseCode: response?.status || '',
            responseHeader: responseheaderfinal || '',
            responseTime: `${end - start}`,
            responseSize: `${response?.headers?.get('content-length') || response?._bodyBlob?._data?.size} B`,
            eventAt: `${eventAt}`,
            request: `${(requestPayload)}`,
            createdAt: Date.now(),
          };
          if (reqResponse !== null) {
            logData.response = `${JSON.stringify(reqResponse)}`;
          }

          helperVariable.zipyEvents.push(logData);
          helperVariable.lastActivitytime = Math.floor(Date.now() / 1000);

          return response.clone();
        })
        .catch(function (error) {
          console.error('[NETWORK INTERCEPTOR] fetch error:', error);
          throw error;
        });
    };
  } else {
    // console.log('Network capture is not enabled');
  }
};

export default Interceptor;