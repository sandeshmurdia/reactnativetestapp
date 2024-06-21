import {createFileIfNotExists, deleteDataFromFile} from '../utils/FileUtils';
import {ZIPY_BASE_URL, ZIPY_PUBLIC_URL} from '../utils/constants';
import {generateSessionId, cleanSessionFolder} from '../utils/helper';
import ContextualInfo from './ContextualInfo';
import DeviceInfo from './DeviceInformation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Interceptor from './Interceptor';
import ErrorHandling from './ErrorHandling';
import CurrentAppState from './AppState';
import {streamData} from '../utils/ApiCall';
import { captureAndSendSnapshot, watchDirectory } from './SnapshotCapture';
import startProfiler from './Profiling';

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
    const response = await fetch(ZIPY_PUBLIC_URL + 'mobile-service/verify/' + key);
    console.log(response.status);
    const json = await response.json();
    data = json;
    const sessionId = generateSessionId();
    await AsyncStorage.setItem('session_id', `${sessionId}`);
    await AsyncStorage.setItem('session_starttime', `${Date.now()}`);

    if(data?.data?.device_info){
    await DeviceInfo();
    }
    if(data?.data?.contextual_info){
      await ContextualInfo();
    }
  } catch (error) {
    console.error('[INIT] Error:', error);
  }

  if(data?.data?.error_exception){
  ErrorHandling();
  }
  if(data?.data?.network_call){
  Interceptor();
  }
  sdkinit = true;

  // CurrentAppState();
  helperVariable.sessionLengthinMin = data?.data?.sessionlength_min || 10;
  helperVariable.streamDataTime = data?.data?.stream_datasec || 5;
  addSdkTimer();

  if(data?.data?.screenshot_cap){
  captureAndSendSnapshot();
  watchDirectory();
  }

  if(data?.data?.profiler){
  startProfiler();
  }

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
  }, data?.data?.sdk_timersec * 1000 || 2000);
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
