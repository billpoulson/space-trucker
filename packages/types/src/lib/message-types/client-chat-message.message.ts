
export type ClientChatMessageData = {
  channel: string
  user: string
  message: string
  timestamp: number
}
export class ClientChatMessage {
  static type = 'chat-message';
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

