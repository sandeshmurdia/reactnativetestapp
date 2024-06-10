import { FAB } from "react-native-elements";
import React from "react";
import { api_key } from "./Init";
import {
  LOGDATA,
  SDK_VERSION,
  S_ID,
  TECH_STACK,
  ANR,
  SRC,
  SCREENRECORDING,
} from "../utils/constants";
import ApiCall from "../utils/ApiCall";

const FloatingButton = () => {
  const reportBugClicked = async () => {
    try {
      if (LOGDATA.length > 0) {
        const req_body = {
          message: {
            key: api_key,
            sdk_ver: SDK_VERSION,
            src: SRC,
            src_tech_stack: TECH_STACK,
            s_id: S_ID,
            event_type: ANR,
            events: [LOGDATA],
          },
        };
        await ApiCall(LOGDATA, req_body);
      } else {
        // console.log("log data is empty");
      }
    } catch (error) {
      // console.error("Error in reportBugClicked: ", error);
    }
  };

  return (
    <>
      {SCREENRECORDING ? (
        <FAB
          title="Report Bug"
          titleStyle={{ backgroundColor: "red" }}
          placement="right"
          upperCase
          color="red"
          onPress={reportBugClicked}
        />
      ) : null}
    </>
  );
};

export default FloatingButton;
