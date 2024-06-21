import {formatTimestamp} from '../utils/helper';
import {SCREENTRANSITION} from '../utils/constants';
import {data, helperVariable} from './Init';
// import SnapshotCapture from "./SnapshotCapture";
import {captureAndSendSnapshot} from './SnapshotCapture';

const ScreenNavigation = async state => {
  if(data?.data?.screen_navigation){
  const currentRoute = state.routes[state.index];
  const eventInfo = {
    name: currentRoute.name,
    params: currentRoute.params,
    path: currentRoute.path,
  };
  // console.log(, EventInfo: ${JSON.stringify(eventInfo)})
  try {
    eventAt = await formatTimestamp(Date.now());
    const logData = {
      eventType: SCREENTRANSITION,
      createdAt: Date.now(),
      screenName: `${currentRoute.name || ''}`,
      eventAt: `${eventAt}`,
    };
    helperVariable.zipyEvents.push(logData);
    helperVariable.lastActivitytime = Math.floor(Date.now() / 1000);
    setTimeout(async ()=> {
      await captureAndSendSnapshot(true);
    },1000)
  } catch (error) {
  }
}
};

export default ScreenNavigation;
