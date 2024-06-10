import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { MESSAGE, SDK_VERSION, SRC, TECH_STACK } from './constants';
import { api_key } from '../modules/Init';

export const generateSessionId = () => {

    let uuid = uuidv4();
    var time = Math.floor(Date.now())
    uuid += "_" + time;
    return uuid;
};

export const formatTimestamp =async (timestamp) => {
    let startTime = await AsyncStorage.getItem('session_starttime');
    let timeat = (timestamp -startTime)/1000;
   
    const hours = Math.floor(timeat / 3600);
    const minutes = Math.floor((timeat % 3600) / 60);
    const seconds = Math.floor(timeat % 60);

    const formattedTimeDifference = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
   return `${formattedTimeDifference}`;
};

export const createRequestObjdevice =async (event) => {
    const sessionid = (await AsyncStorage.getItem("session_id"));
    const req_body = {
        message: {
          events: event,
          'eu_info_id': 'N/A',
          'eue_id': '0',
          'euz_id': '0',
          'ip': '',
          'rel_ver': 'N/A',
          'timezone': 'IST',
          key: api_key,
          sdk_ver: SDK_VERSION,
          src: SRC,
          src_tech_stack: TECH_STACK,
          s_id: `${sessionid}`,
          event_type: MESSAGE,
        },
      };
      return req_body;

};
  
  
