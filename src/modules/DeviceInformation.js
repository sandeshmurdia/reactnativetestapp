import {
  DEVICEINFO,
} from "../utils/constants";
import DeviceInfo from "react-native-device-info";
import { helperVariable } from "./Init";
import { Dimensions, useWindowDimensions } from 'react-native';

const DeviceInformation = async () => {
  try {
    const appVersion = DeviceInfo.getVersion(); // Get the app version
    const appBuildNumber = DeviceInfo.getBuildNumber(); // Get the app build number
    const systemVersion = DeviceInfo.getSystemVersion(); // Get the device operating system version
    const deviceId = DeviceInfo.getUniqueIdSync(); // Get the device unique ID
    const deviceModel = DeviceInfo.getModel(); // Get the device model
    const deviceName = DeviceInfo.getDeviceNameSync(); // Get the device name
    const systemName = DeviceInfo.getSystemName(); // Get the device operating system name
    const { width, height } = Dimensions.get('window');

    const events_data = {
      eventType: DEVICEINFO,
      zms_version: appVersion,
      app_build_number: appBuildNumber,
      system_version: systemVersion,
      device_id: deviceId,
      device_model: deviceModel,
      device_name: deviceName,
      system_name: systemName,
      screen_dimensions: `${Math.round(width)} X ${Math.round(height)}`
    };
    
    helperVariable.zipyEvents.push(events_data);
    helperVariable.lastActivitytime = Math.floor(Date.now() / 1000);

  } catch (error) {
    console.log("Error in DeviceInformation: ", error);
  }
};

export default DeviceInformation;