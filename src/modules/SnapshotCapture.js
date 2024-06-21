import ViewShot from 'react-native-view-shot';
import RNFS from 'react-native-fs';
import axios from 'axios';
import {formatTimestampSnapshot} from '../utils/helper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {captureScreen} from 'react-native-view-shot';
import { api_key, data } from './Init';
import { ZIPY_BASE_URL, ZIPY_PUBLIC_URL } from '../utils/constants';


let lastCaptureTime = 0;

const captureAndSendSnapshot = async () => {
  const now = Date.now();
  
  if (now - lastCaptureTime < 2000) {
    return null;
  }
  
  lastCaptureTime = now;
  
  try {
    // Capture the screen
    const uri = await captureScreen({
      format: 'jpg',
      quality: 0.3,
    });

    // Get the timestamp and session id
    const timestamp = await formatTimestampSnapshot();
    const sessionid = await AsyncStorage.getItem('session_id');
    const sessionFolderPath = `${RNFS.DocumentDirectoryPath}/zipy-sessions/${sessionid}`;

    // Create the session folder if it doesn't exist
    if (!(await RNFS.exists(sessionFolderPath))) {
      await RNFS.mkdir(sessionFolderPath);
    }

    // Define file name and path
    const fileName = `${timestamp}.jpg`;
    const filePath = `${sessionFolderPath}/${fileName}`;
// console.log(filePath);
    // Move the captured image to the desired path
    await RNFS.moveFile(uri, filePath);

    return { uri: filePath, fileName };

  } catch (error) {
    // console.error('Error capturing snapshot', error);
    return null;
  }
};


const sendSnapshot = async (filePath, fileName, sessionid) => {
  const formData = new FormData();
  formData.append('images', {
    uri: `file://${filePath}`,
    name: fileName,
    type: 'image/jpg',
  });
  formData.append('sessionid', sessionid); // If needed by server

  // console.log(filePath);
  // Uncomment the following lines to send the snapshot to the server
  try {
    const response = await axios.post(`${ZIPY_PUBLIC_URL}mobile-service/upload/${api_key}/${sessionid}/${data?.data?.c_id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    // console.log(response.status);
    if (response.status === 200) {
      // Delete the file
      await RNFS.unlink(filePath);
      // console.log('File deleted successfully');
    }
    console.log('Snapshot sent successfully', response.data);
  } catch (error) {
    console.error('Error sending snapshot', error);
  }
};

const watchDirectory = async () => {
  const sessionid = await AsyncStorage.getItem('session_id');
  const sessionFolderPath = `${RNFS.DocumentDirectoryPath}/zipy-sessions/${sessionid}`;

  if (!(await RNFS.exists(sessionFolderPath))) {
    await RNFS.mkdir(sessionFolderPath);
  }

  setInterval(async () => {
    try {
      const files = await RNFS.readDir(sessionFolderPath);
      for (const file of files) {
        if (file.isFile()) {
          await sendSnapshot(file.path, file.name, sessionid);
        }
      }
    } catch (error) {
      // console.error('Error watching directory', error);
    }
  }, 1000); // Check every 5 seconds
};


export { captureAndSendSnapshot, watchDirectory };
