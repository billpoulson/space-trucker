
export class ChatUserData {
    constructor(
        public name: string,
        public ws: any,
        public send: (message: any) => void,
        public channelSubscriptions: Array<string>,
    ) {
    }

    isSubscribedToMessage({ channel }: { channel: string }) {
        return this.channelSubscriptions.includes(channel)
    }
};

export class ConnectionAuthorizationData {
    constructor(
        public connectionId: number
    ) {
    }
};


