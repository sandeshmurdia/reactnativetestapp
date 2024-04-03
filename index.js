/**
 * @format
 */

import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';

import { Amplify } from 'aws-amplify';
import amplifyconfig from './src/amplifyconfiguration.json';
import zipy from './zipy-mobilesdk-reactnative/src/index';
import MyStack from './App';
import GestureCapture from './zipy-mobilesdk-reactnative/src/modules/GestureCapture';

zipy.init('38489a9e');
Amplify.configure(amplifyconfig);

const App = () => {
    return (
        <>
        <MyStack/>
        </>
    );
}

AppRegistry.registerComponent(appName, () => App);
