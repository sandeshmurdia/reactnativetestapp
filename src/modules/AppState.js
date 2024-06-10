import { formatTimestamp } from "../utils/helper";
import {
  SCREEN_HIDE,
  SCREEN_SHOW,
  SOFTKEY_BACK,
} from "../utils/constants";
import { helperVariable } from "./Init";
import { BackHandler } from "react-native";
import { AppState } from 'react-native';


const CurrentAppState = async () => {
        BackHandler.addEventListener('hardwareBackPress', handleBackButtonPress);
        AppState.addEventListener('change', (appstate)=> {AppStateChange(appstate)})
    
      
      const handleBackButtonPress = async () => {
        try {
          eventAt = await formatTimestamp(Date.now());
          const logData = {
              eventType: SOFTKEY_BACK,
              createdAt: Date.now(),
              eventAt: `${eventAt}`
          };
    
      
          helperVariable.zipyEvents.push(logData);
          helperVariable.lastActivitytime = Math.floor(Date.now() / 1000);

        } catch (error) {

        }

      }

      const AppStateChange = async (appstate) => {
        let stateChange;
        if(appstate === "active")
        {
          stateChange = SCREEN_SHOW

        }else if(appstate === "background"){
          stateChange = SCREEN_HIDE
        }

        try {
          eventAt = await formatTimestamp(Date.now());
          const logData = {
              eventType: stateChange,
              createdAt: Date.now(),
              eventAt: `${eventAt}`
          };
      
          helperVariable.zipyEvents.push(logData);
          helperVariable.lastActivitytime = Math.floor(Date.now() / 1000);

        } catch (error) {

        }

      }
      


};

export default CurrentAppState;