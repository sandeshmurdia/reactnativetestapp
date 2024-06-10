import React, { forwardRef, useImperativeHandle } from 'react';
import ViewShot from 'react-native-view-shot';
import axios from 'axios';

const SnapshotCapture = forwardRef((props, ref) => {
  const viewShotRef = React.useRef(null);

  useImperativeHandle(ref, () => ({
    captureAndSendSnapshot: async () => {
      try {
        const uri = await viewShotRef.current.capture();
        const fileName = `snapshot_${Date.now()}.jpg`;
        // console.log(uri,fileName)
        await sendSnapshot(uri, fileName);
        return { uri, fileName };
      } catch (error) {
        console.error('Error capturing snapshot', error);
        return null;
      }
    },
  }));

  const sendSnapshot = async (uri, fileName) => {
    const formData = new FormData();
    formData.append('file', {
      uri,
      name: fileName,
      type: 'image/jpeg',
    });

    try {
      const response = await axios.post('YOUR_SERVER_URL_HERE', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Snapshot sent successfully', response.data);
    } catch (error) {
      console.error('Error sending snapshot', error);
    }
  };

  return (
    <ViewShot ref={viewShotRef} options={{ format: 'jpg', quality: 0.5 }} style={props.style}>
      {props.children}
    </ViewShot>
  );
});

export default SnapshotCapture;
