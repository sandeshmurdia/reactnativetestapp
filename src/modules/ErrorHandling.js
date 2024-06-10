import { setJSExceptionHandler } from "react-native-exception-handler";
import { formatTimestamp } from "../utils/helper";
import { UNHANDLED_EXCEPTION } from "../utils/constants";
import { helperVariable } from "./Init";


const ErrorHandling = () => {
  const errorHandler = async (error, isFatal) => {
    if (isFatal) {
    
    } else {
      try {
        let eventAt = await formatTimestamp(Date.now());
        const reqData = {
          eventType: UNHANDLED_EXCEPTION,
          createdAt: Date.now(),
          eventAt: `${eventAt}`,
          message: error?.name,
          exceptionObj: {
            message : error?.message,
            stack : error?.stack
          },
        }

        helperVariable.zipyEvents.push(reqData);

        helperVariable.lastActivitytime = Math.floor(Date.now() / 1000);

  
      } catch (error) {
        
      }

    }
  };

  try {
    setJSExceptionHandler(errorHandler, true);

  } catch (error) {
    
  }
}
export default ErrorHandling;