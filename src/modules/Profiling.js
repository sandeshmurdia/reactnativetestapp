import {formatTimestamp} from '../utils/helper';
import {PROFILING_INFO} from '../utils/constants';
import {data, helperVariable} from './Init';
import DeviceInfo from 'react-native-device-info';

const logDeviceInfo = async () => {
  try {
    const batteryLevel = Math.floor((await DeviceInfo.getBatteryLevel()) * 100) + "%";
    const totalStorage = Math.floor(await DeviceInfo.getTotalDiskCapacity() / 1024 / 1024 / 1024) + "GB";
    const freeStorage = Math.floor(DeviceInfo.getFreeDiskStorageSync() / 1024 / 1024 / 1024) + "GB";
    const usedStorage = (parseInt(totalStorage) - parseInt(freeStorage)) + "GB";
    const totalMemoryBytes = await DeviceInfo.getTotalMemory();
    const totalMemoryMB = Math.floor(totalMemoryBytes / 1024 / 1024) + "MB";
    const usedMemoryBytes = DeviceInfo.getUsedMemorySync();
    const usedMemoryMB = Math.floor(usedMemoryBytes / 1024 / 1024) + "MB";
    
    const eventAt = await formatTimestamp(Date.now());
    const logData = {
      eventType: PROFILING_INFO,
      createdAt: Date.now(),
      eventAt: `${eventAt}`,
      eventInfo: { 
        batteryLevel: batteryLevel,
        totalMemory: totalMemoryMB,
        usedMemory: usedMemoryMB,
        totalStorage: totalStorage,
        usedStorage: usedStorage
      }
    };

    helperVariable.zipyEvents.push(logData);

  } catch (error) {
    console.error('Error logging device info:', error);
  }
};

const startProfiler = () => {
  // Log device info immediately
  logDeviceInfo();

  // Log device info every 15 seconds
  setInterval(logDeviceInfo, data?.data?.profiler_timersec * 1000 || 15000);
};

export default startProfiler;
