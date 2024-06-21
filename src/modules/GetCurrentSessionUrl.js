import { api_key, data, sdkinit } from "./Init";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getCurrentSessionUrl = async (

  ) => {
    try {
      if (sdkinit == true) {
        const sessionid = (await AsyncStorage.getItem("session_id"));

         const currentUrl =
            `https://mobileapp.zipy.ai/${api_key}/${data?.data?.c_id}/mobile-replay-cont?s_id=${sessionid}`;
        return currentUrl;
      } else {
        return '';
      }
    } catch (e) {
      return 'Error occurred';
    }
};
