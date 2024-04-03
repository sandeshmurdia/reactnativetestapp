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
// import zipy from 'zipy-react-native';
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

// export default withAuthenticator(App);

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button, Text, View } from 'react-native';
import HomeScreen from './Homescreen';
import { ScreenNavigation } from './zipy-mobilesdk-reactnative/src/index';


type RootStackParamList = {
  Home: undefined;
  Profile: { name: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const MyStack = () => {
  return (
    <>  
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Welcome' }}
        />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
     </NavigationContainer>
    </>
  );
};

const ProfileScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  return <Text style={{color: 'black'}}>This is {route.params.name}'s profile</Text>;
};

export default MyStack;