import {
  BEARER_TOKEN,
  CONTENT_TYPE,
  MESSAGE,
  POST,
  SDK_VERSION,
  SRC,
  TECH_STACK,
  ZIPY_BASE_URL,
  ZIPY_PUBLIC_URL,
} from "./constants";
// // import { addDataToFile, createFileIfNotExists } from "./FileUtils";

import { api_key, helperVariable, resetTimer, retryCount, sdkinit } from "../modules/Init";
import { dataLength } from "./constants";
import { createRequestObjdevice } from "./helper";
import axios from "axios";

// const ApiCall = async (logData, req_body) => {
//   req_body = JSON.stringify(req_body);
//   // await createFileIfNotExists(FILEPATH);
//   // await addDataToFile(FILEPATH, req_body);

//   LOGDATA.push(logData);
//   let resp = "";
//   await fetch(ZIPY_BASE_URL + "post", {
//     method: POST,
//     headers: new Headers({
//       Authorization: BEARER_TOKEN,
//       "Content-Type": CONTENT_TYPE,
      
//     }),
//     body: req_body,
//   })
//     .then((response) => response.json())
//     .then((json) => {
//       resp = json;
//       // console.log(
//       //   resp,
//       //   "this is the response after successful data posted"
//       // );
//     })
//     .catch((error) => {
//       console.error(error);
//     });
//   if (resp.success) {
//     LOGDATA.pop();
//   }
// };

// export default ApiCall;

let dataTill = 0;
let isSending = false;
const maxRetryCount = 5;
let currentRetryCount = maxRetryCount;

let res;

export async function streamData() {
  try {
    if ((helperVariable.zipyEvents.length >= dataLength ||
        (helperVariable.timerDelay === true && helperVariable.zipyEvents.length > 0)) &&
        helperVariable.sessionExpired === false && sdkinit === true) {
      if (helperVariable.zipyEvents.length <= dataLength) {
        dataTill = helperVariable.zipyEvents.length;
      } else {
        dataTill = dataLength;
      }

      if (!isSending) {
        isSending = true;
        const reqObj = await createRequestObjdevice(
            helperVariable.zipyEvents.slice(0, dataTill)
        );
        res = await fetch(ZIPY_PUBLIC_URL + "post", {
          method: POST,
          headers: new Headers({
            Authorization: BEARER_TOKEN,
            "Content-Type": CONTENT_TYPE,
          }),
          body: JSON.stringify(reqObj)
        });
        console.log(res.status);
        if (res.status === 200) {
          resetTimer();
          isSending = false;
          if (dataTill <= helperVariable.zipyEvents.length) {
            helperVariable.zipyEvents.splice(0, dataTill);
          }
          currentRetryCount = maxRetryCount;
        } else {
        }
      }
    }
    return res;
  } catch (e) {
    if (currentRetryCount > 0) {
      resetTimer();
      isSending = false;
      currentRetryCount--;
      return streamData();
    }
    const requestOptions = {
      headers: {
        'Content-Type': CONTENT_TYPE,
        'Authorization': BEARER_TOKEN
      }
    };
    return {
      data: { error: 'An error occurred while sending data to the backend.' },
      requestOptions: requestOptions
    };
  }
}
