import {  helperVariable } from "./Init";
import {
  CONTEXTUALINFO,
} from "../utils/constants";
import Geolocation from "react-native-geolocation-service";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";
import NetInfo from "@react-native-community/netinfo";
import DeviceInfo from "react-native-device-info";
import { Platform } from "react-native";

const ContextualInfo = async () => {
  const requestLocationPermission = async () => {
    try {
      let permission;
      if (Platform.OS === "android") {
        permission = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
      } else if (Platform.OS === "ios") {
        permission = PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
      }

      const result = await request(permission);
      if (result === RESULTS.GRANTED) {
        getCurrentLocation();
      } else {
        // console.log("Location permission denied");
      }
    } catch (error) {
      // console.log("Failed to request location permission: ", error);
    }
  };
  const checkLocationPermission = async () => {
    try {
      let permission;
      if (Platform.OS === "android") {
        permission = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
      } else if (Platform.OS === "ios") {
        permission = PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
      }

      const result = await check(permission);
      if (result === RESULTS.GRANTED) {
        getCurrentLocation();
      } else if (result === RESULTS.DENIED) {
        requestLocationPermission();
      } else {
        // console.log("Location permission not granted");
      }
    } catch (error) {
      // console.log("Failed to check location permission: ", error);
    }
  };
  let latitude;
  let longitude;

  const getCurrentLocation = () => {
    try {
      Geolocation.getCurrentPosition(
        (position) => {
          latitude = position.coords.latitude;
          longitude = position.coords.longitude;
        },
        (error) => {
          // console.log("Failed to get current location: ", error);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } catch (error) {
      // console.log("Geolocation error: ", error);
    }
  };
  try {
    await checkLocationPermission();
    setTimeout(async () => {
      const batteryLevel =
        Math.floor((await DeviceInfo.getBatteryLevel()) * 100) + "%";
      const isCharging = await DeviceInfo.isBatteryCharging();
      const orientation = DeviceInfo.isLandscapeSync()
        ? "landscape"
        : "portrait";
      const free_storage =
        Math.floor(DeviceInfo.getFreeDiskStorageSync() / 1024 / 1024 / 1024) +
        "GB";
      const memoryBytes = await DeviceInfo.getTotalMemory();
      const memorymb = Math.floor(memoryBytes / 1024 / 1024) + "MB";
      const umemoryBytes = DeviceInfo.getUsedMemorySync();
      const usedMemoryMB = Math.floor(umemoryBytes / 1024 / 1024) + "MB";
      const diskCapacity =
        Math.floor(
          (await DeviceInfo.getTotalDiskCapacity()) / 1024 / 1024 / 1024
        ) + "GB";
      const currentDate = new Date();
      const date = currentDate.getDate();
      const month = currentDate.getMonth() + 1; // Note: Month is zero-based
      const year = currentDate.getFullYear();
      const hours = currentDate.getHours();
      const minutes = currentDate.getMinutes();
      const seconds = currentDate.getSeconds();
      const connection = {};
      let is_connected;

      NetInfo.fetch().then((state) => {
        connection["type"] = state.type;
        connection["is_internet_reachable"] = state.isInternetReachable;
        connection["is_wifi_enabled"] = state.isWifiEnabled;
        connection["details"] = state.details;
        is_connected = state.isConnected;
      });

      const events_data = {
        eventType: CONTEXTUALINFO,
        total_memory: memorymb,
        used_memory: usedMemoryMB,
        total_storage: diskCapacity,
        free_storage: free_storage,
        connectivity_status: is_connected,
        battery_status: batteryLevel,
        charging_status: `${isCharging}`,
        device_orientation: orientation,
        date: `${date}:${month}:${year}`,
        time: `${hours}:${minutes}:${seconds}`,
        location: `${ latitude} ${longitude}`,
      };

     
      helperVariable.zipyEvents.push(events_data);
      helperVariable.lastActivitytime = Math.floor(Date.now() / 1000);

    }, 2000);
  } catch (error) {
    // console.log("Error in ContextualInfo: ", error);
  }
};

export default ContextualInfo;
