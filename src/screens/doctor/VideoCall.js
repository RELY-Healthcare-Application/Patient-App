import React, {useState} from 'react';
import AgoraUIKit from 'agora-rn-uikit';
import {Text} from 'react-native';

const VideoCall = ({doctor}) => {
  const [videoCall, setVideoCall] = useState(true);
  console.log(doctor);
  const connectionData = {
      appId: '5e2ee6c6fc13459caa99cb8c234d42e0',
      channel: '1NS',
      uid:1,
      token: '0065e2ee6c6fc13459caa99cb8c234d42e0IADrivZFacX3VF8u52RhtY7NsI8HnKYCvRzkH6uGk9tAZ3A0cEYAAAAAIgCZoedShkEgZAQAAQAW/h5kAgAW/h5kAwAW/h5kBAAW/h5k',
  };
  const callbacks = {
    EndCall: () => setVideoCall(false),
};
return videoCall ? (
  <AgoraUIKit connectionData={connectionData} rtcCallbacks={callbacks} />
) : (
  <Text setVideoCall = {setVideoCall} onPress={() => setVideoCall(true)}>Start Call</Text>
);
}
export default VideoCall;