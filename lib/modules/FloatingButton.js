var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.default=void 0;var _asyncToGenerator2=_interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));var _reactNativeElements=require("react-native-elements");var _react=_interopRequireDefault(require("react"));var _Init=require("./Init");var _constants=require("../utils/constants");var _ApiCall=_interopRequireDefault(require("../utils/ApiCall"));var _jsxRuntime=require("react/jsx-runtime");var _this=this,_jsxFileName="/Users/sandesh/Desktop/zipy-mobilesdk-reactnative/src/modules/FloatingButton.js";var FloatingButton=function FloatingButton(){var reportBugClicked=function(){var _ref=(0,_asyncToGenerator2.default)(function*(){try{if(_constants.LOGDATA.length>0){var req_body={message:{key:_Init.api_key,sdk_ver:_constants.SDK_VERSION,src:_constants.SRC,src_tech_stack:_constants.TECH_STACK,s_id:_constants.S_ID,event_type:_constants.ANR,events:[_constants.LOGDATA]}};yield(0,_ApiCall.default)(_constants.LOGDATA,req_body);}else{}}catch(error){}});return function reportBugClicked(){return _ref.apply(this,arguments);};}();return(0,_jsxRuntime.jsx)(_jsxRuntime.Fragment,{children:_constants.SCREENRECORDING?(0,_jsxRuntime.jsx)(_reactNativeElements.FAB,{title:"Report Bug",titleStyle:{backgroundColor:"red"},placement:"right",upperCase:true,color:"red",onPress:reportBugClicked}):null});};var _default=exports.default=FloatingButton;