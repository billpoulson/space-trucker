
export type ClientChatMessageSenderFragment = {
  user: string
  connectionId: string,
}
export type ClientChatMessageData = {
  isSender: boolean
  channel: string
  user: string
  connectionId: string,
  message: string
  timestamp: number
}
export class ClientChatMessage {
  static type = 'client-chat-message';
  constructor(public data: ClientChatMessageData) {
  }
}
export class SetUsernameMessage {
  static type = 'set-user-name';
  constructor(public data: string) {
  }
}


export type ChannelsAnnounceMessageData = {
  channels: string[]
}
export class ChannelsAnnounceMessage {
  static type = '';
  constructor(public data: ChannelsAnnounceMessageData) {
  }
}


export type SetUsernameErrorData = {
  message: string
}
export class SetUsernameError {
  static type = 'set-user-name/error';
  constructor(public data: SetUsernameErrorData) {
  }
}



export type SetUsernameSuccessData = {
  message: string
}
export class SetUsernameSuccess {
  static type = 'set-user-name/success';
  constructor(public data: SetUsernameSuccessData) {
  }
}



export class WebRTCConnectionOffer {
  static type = 'webrtc/offer'
  constructor(
    public data: RTCSessionDescriptionInit
  ) {
  }
}
export class WebRTC_ICE_Request {
  static type = 'webrtc/ice';
  constructor(
    public data: RTCIceCandidate
  ) {
  }
}
export class WebRTCConnectionAnswer {
  static type = 'webrtc/answer';
  constructor(
    public data: RTCSessionDescriptionInit
  ) {
  }
}

export class P2PServiceMessageWrapper {
  static type = 'webrtc:container';
  constructor(
    public data: WebRTCConnectionOffer | WebRTC_ICE_Request | WebRTCConnectionAnswer
  ) {
  }
}

