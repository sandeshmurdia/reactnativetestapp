import { formatTimestamp } from "../utils/helper";
import {
  SCREENTRANSITION,
} from "../utils/constants";
import {  helperVariable } from "./Init";


const ScreenNavigation = async (state) => {

        const currentRoute = state.routes[state.index];
        
        const eventInfo = {
          name : currentRoute.name,
          params : currentRoute.params,
          path : currentRoute.path 
        }
        try {
          eventAt = await formatTimestamp(Date.now());
          const logData = {
              eventType: SCREENTRANSITION,
              createdAt: Date.now(),
              screenName: `${currentRoute.name || ''}, EventInfo: ${JSON.stringify(eventInfo)}`,
              eventAt: `${eventAt}`
          };
    
   
      
          helperVariable.zipyEvents.push(logData);
          helperVariable.lastActivitytime = Math.floor(Date.now() / 1000);

        } catch (error) {

        }

};

export default ScreenNavigation;