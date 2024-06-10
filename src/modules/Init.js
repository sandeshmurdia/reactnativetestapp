import {createFileIfNotExists, deleteDataFromFile} from '../utils/FileUtils';
import {ZIPY_BASE_URL} from '../utils/constants';
import {generateSessionId} from '../utils/helper';
import ContextualInfo from './ContextualInfo';
import DeviceInfo from './DeviceInformation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Interceptor from './Interceptor';
import ErrorHandling from './ErrorHandling';
import CurrentAppState from './AppState';
import {streamData} from '../utils/ApiCall';

let data = null;
let api_key = '';
let helperVariable = {
  zipyEvents: [],
  timerDelay: false,
  sessionstartTime: 0,
  lastActivitytime: 0,
  sessionExpired: false,
  sessionLengthinMin: 3,
  streamDataTime: 5,
};
let timer;
let sdkinit;

export const Init = async key => {
  api_key = key;
  try {
    sdkinit = false;
    const response = await fetch(ZIPY_BASE_URL + 'verify/' + key);
    const json = await response.json();
    console.log(json, 'Got enabled');
    data = json;

    const sessionId = generateSessionId();
    await AsyncStorage.setItem('session_id', `${sessionId}`);
    await AsyncStorage.setItem('session_starttime', `${Date.now()}`);

    if (data?.data?.logs_capture) {
      await DeviceInfo();
      await ContextualInfo();
    }
  } catch (error) {
    console.error('[INIT] Error:', error);
  }

  ErrorHandling();
  Interceptor();
  sdkinit = true;

  // CurrentAppState();

  addSdkTimer();

  console.log('zipy init working');
};

export function startTimer() {
  helperVariable.timerDelay = false;
  timer = setInterval(() => {
    helperVariable.timerDelay = true;
  }, helperVariable.streamDataTime * 1000);
}

export function resetTimer() {
  if (timer) {
    clearInterval(timer);
  }
  startTimer();
}

export function addSdkTimer() {
  startTimer();
  setInterval(async () => {
    if (helperVariable.sessionExpired) {
      helperVariable.sessionstartTime = Date.now();
    }
console.log(helperVariable.zipyEvents.length)
    if (helperVariable.sessionExpired && helperVariable.zipyEvents.length > 0) {
      helperVariable.sessionExpired = false;
      await zipyReinit();
    }

    if (
      Math.floor(Date.now() / 1000) >=
      helperVariable.lastActivitytime + helperVariable.sessionLengthinMin * 60
    ) {
      helperVariable.sessionExpired = true;
    }

    streamData();
  }, 2000);
}

export async function zipyReinit() {
  try {
    helperVariable.zipyEvents = [];
    sdkinit = false;
    const sessionId = generateSessionId();
    await AsyncStorage.setItem('session_id', `${sessionId}`);
    await AsyncStorage.setItem('session_starttime', `${Date.now()}`);
    await DeviceInfo();
    await ContextualInfo();
    // CurrentAppState();
    addSdkTimer();
    sdkinit = true;
  } catch (e) {
    console.error(`Sdk reinit error ${e}`);
  }
}

export {data, api_key, helperVariable, sdkinit};
