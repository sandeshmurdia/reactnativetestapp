// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  */

// import React from 'react';
// import type {PropsWithChildren} from 'react';
// import {
//   Button,
//   SafeAreaView,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   useColorScheme,
//   View,
// } from 'react-native';

// import {
//   Colors,
//   DebugInstructions,
//   Header,
//   LearnMoreLinks,
//   ReloadInstructions,
// } from 'react-native/Libraries/NewAppScreen';

// import {
//   withAuthenticator,
//   useAuthenticator,
// } from '@aws-amplify/ui-react-native';

// import axios from 'axios';
// import zipy from './src';
// import {get} from '@aws-amplify/api';

// const App = () => {
//   const [apiResponse, setApiResponse] = React.useState('');

//   const handleButton1Click = () => {
//     // Add your logic for button 1 here
//     zipy.logMessage({
//       message: 'Your custom message',
//       exceptionObj: {s: 'Your custom message'},
//     });
//     // zipy.logMessage({message : 'Your custom message', exceptionObj: {'s': 'Your custom message'}});
//   };

//   const handleButton2Click = () => {
//     // Add your logic for button 2 herẽ
//     zipy.logException({
//       message: 'Your custom message',
//       exceptionObj: {asasas: 'Your custom message'},
//     });
//   };

//   const handleButton4Click = async () => {
//     try {
//       let d = e;
//       console.log(d);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   const handleButton3Click = async () => {
//     const url = 'https://jsonplaceholder.typicode.com/posts';

//     // Define the custom headers
//     const headers = {
//       'X-Custom-Header': 'Custom-Header-Value',
//       Authorization: 'Bearer YourAccessToken',
//       'Content-Type': 'application/json', // Specify the content type as JSON
//       // Add any other headers you need
//     };

//     // Define your payload data
//     const payloadData = {
//       key1: 'value1',
//       key2: 'value2',
//       // Add any other data you want to send
//     };

//     // Create the options object with headers and body
//     const options = {
//       method: 'POST',
//       headers: headers,
//       body: JSON.stringify(payloadData), // Stringify the payload data
//     };

//     try {
//       const response = await fetch(url, options);
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
//       const jsonResponse = await response.json();
//       console.log('Response:', jsonResponse);
//     } catch (error) {
//       console.error('An error occurred:', error);
//     }
//   };

//   const handleButton5Click = () => {
//     // Try to access an undefined variable (reference error)

//     const url = 'https://jsonplaceholder.typicode.com/todos';

//     // Define the custom headers
//     const headers = {
//       'X-Custom-Header': 'Custom-Header-Value',
//       Authorization: 'Bearer YourAccessToken',
//       'Content-Type': 'application/json', // Specify the content type as JSON
//       // Add any other headers you need
//     };

//     // Define your payload data
//     const payloadData = {
//       key1: 'value1',
//       key2: 'value2',
//       // Add any other data you want to send
//     };

//     // Create the options object with headers and body
//     const options = {
//       method: 'GET',
//       headers: headers,
//     };

//     fetch(url, options)
//       .then(response => response.json())
//       .then(json => console.log('Response:', json))
//       .catch(error => console.error('An error occurred:', error));
//   };

//   // const handleButton4Click = () => {
//   //   // Add your logic for button 2 here
//   // };

//   return (
//     <View style={styles.container}>
//       <View style={styles.buttonContainer}>
//         <Button
//           title="Zipy logs"
//           onPress={handleButton1Click}
//           color="#841584" // Change the color if needed
//           accessibilityLabel="Zipy logs"
//         />
//       </View>
//       <View style={styles.buttonContainer}>
//         <Button
//           title="Zipy Exception"
//           onPress={handleButton2Click}
//           color="#F39C12" // Change the color if needed
//           accessibilityLabel="Zipy Exception"
//         />
//       </View>
//       <View style={styles.buttonContainer}>
//         <Button
//           title="Axios network call"
//           onPress={handleButton3Click}
//           color="#3498DB" // Change the color if needed
//           accessibilityLabel="Axios network call"
//         />
//       </View>
//       <View style={styles.buttonContainer}>
//         <Button
//           title="Exception"
//           onPress={handleButton4Click}
//           color="#RD9DCD" // Change the color if needed
//           accessibilityLabel="Exception"
//         />
//       </View>
//       <View style={styles.buttonContainer}>
//         <Button
//           title="Fetch get network call"
//           onPress={handleButton5Click}
//           color="#DF9DFD" // Change the color if needed
//           accessibilityLabel="Fetch get network call"
//         />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   buttonContainer: {
//     marginBottom: 20,
//   },
// });

// export default App;

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button, Text, View , StyleSheet, TextInput} from 'react-native';
import HomeScreen from './Homescreen';
import zipy, { ScreenNavigation } from './src';
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://4e9a8813df40f1594edd8111ac96e536@o4507406330888192.ingest.us.sentry.io/4507406535229440',

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // enableSpotlight: __DEV__,
});


type RootStackParamList = {
  Home: undefined;
  Profile: { name: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const MyApp = () => {
  setTimeout(async ()=>{
    // const a=  await zipy.getCurrentSessionUrl();
    console.log(a)
  },2000)


  return (
       <NavigationContainer onStateChange={ScreenNavigation}>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Welcome' }}
        />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
     </NavigationContainer>

  );

  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const ProfileScreen: React.FC<{navigation: any; route: any}> = ({
  navigation,
  route,
}) => {
  const [text, setText] = React.useState('');

  const handleTap = () => {
    console.log('Home screen tapped!');
  };

  const handleSubmit = () => {
    console.log('Submit button pressed!');
    // This function currently doesn't do anything
  };
  return (
    <>
    <View>
    <Text>Welcome to the Home Screen!</Text>
      <Button zipy-label="CardContainer" title="Tap me on Home" />
  </View>
    <Text sentry-label="CardContain22er" style={{color: 'black'}}>This is {route.params.name}'s profile</Text>
    <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, margin: 10, paddingLeft: 5 }}
        placeholder="Type here"
        value={text}
        onChangeText={setText}
      />
      {/* <Button title="Submit" onPress={handleSubmit} /> */}
    </>
  );
};



export default (MyApp);
