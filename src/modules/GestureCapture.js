import React, { useRef, useCallback, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
// import SnapshotCapture from './SnapshotCapture';
// import { AppState } from 'react-native';
import { DOUBLE_TAP, LONG_TAP, SINGLE_TAP } from '../utils/constants.js';
import { formatTimestamp } from '../utils/helper.js';
import {  data, helperVariable } from './Init.js';
import {captureAndSendSnapshot} from './SnapshotCapture.js';

const ZIPY_LABEL = 'zipy-label';
const DOUBLE_TAP_DELAY = 200; 
const LONG_PRESS_DELAY = 400;

const touchEventStyles = StyleSheet.create({
  wrapperView: {
    flex: 1,
  },
});


const GestureCapture = ({
  maxComponentTreeSize = 20,
  children,
  labelName,
}) => {
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

  const tracingIntegrationRef = useRef(null);
  const [tapTimeout, setTapTimeout] = useState(null);
  const [longPressTimeout, setLongPressTimeout] = useState(null);
  const [tapCount, setTapCount] = useState(0);

  
  
  const logTouchEvent = useCallback(async (componentTreeNames, activeLabel, displayTag, tapType, coordinates, tappedOn) => {
  if(data?.data?.gesture_capture){
    try {
      const eventAt = await formatTimestamp(Date.now());
      const formattedComponentTreeNames = (componentTreeNames.toString()).replaceAll(',' , ' -> ');

      const logData = {
        eventType: tapType,
        createdAt: Date.now(),
        eventAt: `${eventAt}`,
        element: `${`Element: ${displayTag}` }`,
        tree: `${formattedComponentTreeNames}`,
        viewName: `${tappedOn} ${displayTag} ${formattedComponentTreeNames}`,
        viewText: `${JSON.stringify(coordinates)}`,
        coordinates: coordinates,
        tappedOn: tappedOn
      }
      helperVariable.zipyEvents.push(logData);
      helperVariable.lastActivitytime = Math.floor(Date.now() / 1000);
      await captureAndSendSnapshot();
    } catch (error) {}
  }
  }, []);

 

  const handleSingleTap = (componentTreeNames, activeLabel, displayTag, coordinates, tappedOn) => {
    if(!longPressTimeout){
      logTouchEvent(componentTreeNames, activeLabel, displayTag, SINGLE_TAP, coordinates, tappedOn);
    }
  };

  const handleDoubleTap = (componentTreeNames, activeLabel, displayTag, coordinates, tappedOn) => {
    logTouchEvent(componentTreeNames, activeLabel, displayTag, DOUBLE_TAP, coordinates, tappedOn);
  };

  const handleLongPress = (componentTreeNames, activeLabel, displayTag, coordinates, tappedOn) => {
    logTouchEvent(componentTreeNames, activeLabel, displayTag, LONG_TAP, coordinates, tappedOn);
  };

  const onTouchStart = useCallback(async (e) => {
    if (!e._targetInst) {
      return;
    }

    let currentInst = e._targetInst;

    let tappedOn;

    if (typeof currentInst.memoizedProps.children === 'string') {
      tappedOn = currentInst.memoizedProps.children;
    } 
    else if (Array.isArray(currentInst.memoizedProps.children)) {
        let childrenArray = currentInst.memoizedProps.children;

        if (childrenArray.every(child => typeof child === 'string')) {
          tappedOn = childrenArray.join('');
        } 
        else if (typeof childrenArray[0]?.props?.children === 'string' ){
          tappedOn = childrenArray[0]?.props?.children || '';
        }
    } 
    else {
      tappedOn = '';
    }

    let activeLabel;
    let activeDisplayName;
    const componentTreeNames = [];
    while (
      currentInst &&
      maxComponentTreeSize &&
      componentTreeNames.length < maxComponentTreeSize
    ) {
      const props = currentInst.memoizedProps;
      const zLabel = props?.[ZIPY_LABEL];
      let labelValue;
      if (typeof labelName === 'string') {
        labelValue = props?.[labelName];
      }

      if (zLabel) {
        if (!activeLabel) {
          activeLabel = zLabel;
        }
        componentTreeNames.push(zLabel);
      } else if (typeof labelValue === 'string') {
        if (!activeLabel) {
          activeLabel = labelValue;
        }
        componentTreeNames.push(labelValue);
      } else if (currentInst.elementType) {
        const { elementType } = currentInst;

        if (elementType.displayName) {
          if (!activeDisplayName) {
            activeDisplayName = elementType.displayName;
          }
          componentTreeNames.push(elementType.displayName);
        }
      }

      currentInst = currentInst.return;
    }


    const finalLabel = activeLabel || '';
    const displayTag = activeDisplayName;
    const coordinates = {
      x: (e.nativeEvent.pageX / screenWidth) * 100,
      y: (e.nativeEvent.pageY / screenHeight) * 100
    };
    const longPressTimeout = setTimeout(() => {
      if (longPressTimeout) {
        clearTimeout(tapTimeout);
        setLongPressTimeout(null);
      }
      handleLongPress(componentTreeNames, finalLabel, displayTag, coordinates, tappedOn);
      setTapTimeout(null);
      setLongPressTimeout(0);
    }, LONG_PRESS_DELAY);
    setLongPressTimeout(longPressTimeout);

    if (tapTimeout) {
      clearTimeout(tapTimeout);
      setTapTimeout(null);
      setTapCount(0);
      handleDoubleTap(componentTreeNames, finalLabel, displayTag, coordinates, tappedOn);
    } else {
      setTapCount(1);
      const timeout = setTimeout(() => {
        handleSingleTap(componentTreeNames, finalLabel, displayTag, coordinates, tappedOn);
        setTapTimeout(null);
        setTapCount(0);
      }, DOUBLE_TAP_DELAY);
      setTapTimeout(timeout);
    }

    if (tracingIntegrationRef.current) {
      tracingIntegrationRef.current.startUserInteractionTransaction({
        elementId: activeLabel,
      });
    }
  }, [maxComponentTreeSize, logTouchEvent, labelName, tapTimeout, tapCount]);

  const onTouchEnd = useCallback(() => {
    if (longPressTimeout) {
      clearTimeout(longPressTimeout);
      setLongPressTimeout(null);
    }
  }, [longPressTimeout]);

  return (
      <View
        style={touchEventStyles.wrapperView}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {children}
      </View>
  );
};

export default GestureCapture;
