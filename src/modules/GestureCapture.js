import React, { useRef, useCallback, useState } from 'react';
import { View, StyleSheet, BackHandler } from 'react-native';
import SnapshotCapture from './SnapshotCapture';
// import { AppState } from 'react-native';
import { DOUBLE_TAP, LONG_TAP, SINGLE_TAP } from '../utils/constants.js';
import { formatTimestamp } from '../utils/helper.js';
import {  helperVariable } from './Init.js';

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

  const snapshotRef = useRef(null);
  const tracingIntegrationRef = useRef(null);
  const [tapTimeout, setTapTimeout] = useState(null);
  const [longPressTimeout, setLongPressTimeout] = useState(null);
  const [tapCount, setTapCount] = useState(0);

  const logTouchEvent = useCallback(async (componentTreeNames, activeLabel, displayTag, tapType) => {


    try {
      eventAt = await formatTimestamp(Date.now());
      const logData = {
        eventType: tapType,
        createdAt: Date.now(),
        viewName: `${activeLabel ? `Label : ${activeLabel} ${displayTag}` : `Element: ${displayTag}` }`,
        viewText: `${componentTreeNames}`,
        eventAt: `${eventAt}`,
      }
    
      helperVariable.zipyEvents.push(logData);
      helperVariable.lastActivitytime = Math.floor(Date.now() / 1000);

    } catch (error) {}

  }, []);

  const handleSingleTap = (componentTreeNames, activeLabel, displayTag) => {
    if(!longPressTimeout){
    logTouchEvent(componentTreeNames, activeLabel, displayTag, SINGLE_TAP);
    }
  };

  const handleDoubleTap = (componentTreeNames, activeLabel, displayTag) => {
    logTouchEvent(componentTreeNames, activeLabel, displayTag, DOUBLE_TAP);
  };

  const handleLongPress = (componentTreeNames, activeLabel, displayTag) => {
    logTouchEvent(componentTreeNames, activeLabel, displayTag, LONG_TAP);
  };
  
  const onTouchStart = useCallback(async (e) => {
    if (!e._targetInst) {
      return;
    }
    // snapshotRef.current.captureAndSendSnapshot(); // Capture snapshot on long press

    let currentInst = e._targetInst;
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
    
    const longPressTimeout = setTimeout(() => {
      if (longPressTimeout) {
        clearTimeout(tapTimeout);
        setLongPressTimeout(null);
      }
      handleLongPress(componentTreeNames, finalLabel, displayTag);
      setTapTimeout(null);
      setLongPressTimeout(0);
    }, LONG_PRESS_DELAY);
    setLongPressTimeout(longPressTimeout);

    if (tapTimeout) {
      clearTimeout(tapTimeout);
      setTapTimeout(null);
      setTapCount(0);
      handleDoubleTap(componentTreeNames, finalLabel, displayTag);
    } else {
      setTapCount(1);
      const timeout = setTimeout(() => {
        handleSingleTap(componentTreeNames, finalLabel, displayTag);
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
    <SnapshotCapture ref={snapshotRef} style={touchEventStyles.wrapperView}>
      <View
        style={touchEventStyles.wrapperView}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {children}
      </View>
     </SnapshotCapture>
  );
};

export default GestureCapture;

