import Bugsnag from "@bugsnag/react-native";
Bugsnag.start();

/**
 * @format
 */

import {AppRegistry, NativeModules} from 'react-native';
import {name as appName} from './app.json';

import zipy from 'zipyai-react-native';
import MyApp from './App';
// import Instabug, { InvocationEvent } from 'instabug-reactnative';

zipy.init('e100d24c');
// import {endAppStartup, initialize} from '@embrace-io/react-native';
import React from 'react';
import { withGestureCapture } from "zipyai-react-native";
// import {multiply} from 'zipy-test';


// import BugsnagPerformance from '@bugsnag/react-native-performance'

// Instabug.init({
//   token: '8df952f58904eb2136a775921239df15',
//   invocationEvents: [InvocationEvent.shake, InvocationEvent.screenshot, InvocationEvent.floatingButton],
// });
// import { initialize as clarityInitialize } from 'react-native-clarity';
// import * as Sentry from "@sentry/react-native";

// Sentry.init({
//   dsn: "https://4e9a8813df40f1594edd8111ac96e536@o4507406330888192.ingest.us.sentry.io/4507406535229440",
//   // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
//   // We recommend adjusting this value in production.
//   tracesSampleRate: 1.0,
//   _experiments: {
//     // profilesSampleRate is relative to tracesSampleRate.
//     // Here, we'll capture profiles for 100% of transactions.
//     profilesSampleRate: 1.0,
//   },
// });

// import Smartlook from 'react-native-smartlook-analytics'

// Smartlook.instance.preferences.setProjectKey(
//   'c35d3361ac069354d84d161f78ca703c45895190'
// );
// Smartlook.instance.start();

// clarityInitialize("mn296b8b06");
const Appp = () => {
  // React.useEffect(() => {
  //   // Note: Initialize is a promise, so if you want to perform an action
  //   // and it must be tracked, it is recommended to use await/then
  //   // to wait for the method to finish
  //   initialize().then(hasStarted => {
  //     if (hasStarted) {
  //       endAppStartup();
  //     }
  //   });
  // }, []);
  // multiply(2,3);
// NativeModules.ZipyaiReactNative.crash();
// BugsnagPerformance.start({ apiKey: 'b9f500c4aaf6b41e06f94b511e4bfab0' })
    return (
      // <GestureCapture>
        <MyApp />
      // </GestureCapture>
    );
  };

AppRegistry.registerComponent(appName, () => withGestureCapture(Appp));
