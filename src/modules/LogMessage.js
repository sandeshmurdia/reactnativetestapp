import { data, helperVariable } from "./Init";
import {
  ZIPY_LOG,
} from "../utils/constants";
import { formatTimestamp } from "../utils/helper";

export const logMessage = async (
 { message,
   maxLength = -1,
   exceptionObj = {}
}
  ) => {
// console.log('zipy log');
  if (data?.data?.logs_capture) {
    try {
     if(maxLength >= 0){
      message = message.substring(0,maxLength);
     }
     
     eventAt = await formatTimestamp(Date.now());
      const logData = {
        eventType: ZIPY_LOG,
          createdAt: Date.now(),
          message: message,
          exceptionObj: exceptionObj,
          eventAt: `${eventAt}`
      };

      helperVariable.zipyEvents.push(logData);

      helperVariable.lastActivitytime = Math.floor(Date.now() / 1000);

    } catch (error) {
      console.error(error);
    }
  } else {
    console.info("logs_capture is not enabled");
  }
};
