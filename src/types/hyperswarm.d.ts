declare module 'hyperswarm' {
    import {KeyPair, PeerDetails} from "hypercore";
    import DHT, {DHTNodeAddress} from "dht-rpc";
    import {NoiseSecretStream} from "hyperdht";
    export default class HyperSwarm {
        readonly connecting: number;
        readonly connections: number;
        readonly peers: Record<Buffer, PeerDetails>;
        readonly dht: DHT;

        constructor(options?: HyperSwarmConstructorParameters);

        join(topic: Buffer, options?: JoinOptions): PeerDiscovery;

        on(event: 'connection', listener: (socket: NoiseSecretStream, peerInfo: PeerInfo) => void): HyperSwarm;

        on(event: 'update', listener: () => void): HyperSwarm;

        leave(topic: Buffer): Promise<void>;

        joinPeer(noisePublicKey: Buffer);

        leavePeer(noisePublicKey: Buffer);

        status(topic: Buffer): PeerDiscovery;

        listen(): Promise<void>;

        flush(): Promise<void>;
    }

    export interface HyperSwarmConstructorParameters {
        keyPair: KeyPair
        seed: Buffer
        maxPeers: number
        firewall: (remotePublicKey) => boolean
        dht: DHT
    }

    interface ClientServerOptions {
        server: boolean
        client: boolean
    }

    interface JoinOptions extends ClientServerOptions {
    }

    interface PeerInfo extends EventEmitter {
        readonly publicKey: Buffer
        readonly relayAddresses: DHTNodeAddress[]
        readonly reconnecting: boolean
        readonly proven: boolean
        readonly connectedTime: number
        readonly banned: boolean
        readonly tried: boolean
        readonly explicit: boolean
        readonly waiting: boolean
        readonly forceRelaying: boolean
        readonly queued: boolean
        readonly client: boolean
        readonly topics: Buffer[]
        readonly attempts: number
        readonly priority: PeerPriority
        readonly prioritized: boolean

        ban(banStatus?: boolean = false): void;
    }

    enum PeerPriority {
        VERY_LOW_PRIORITY,
        LOW_PRIORITY,
        NORMAL_PRIORITY,
        HIGH_PRIORITY,
        VERY_HIGH_PRIORITY,
    }

    interface PeerDiscovery {
        readonly swarm: HyperSwarm
        readonly topic: Buffer
        readonly isClient: boolean
        readonly isServer: boolean
        readonly destroyed: boolean
        readonly destroying: unknown | null
        readonly suspended: boolean

        flushed(): Promise<void>;

        refresh(options: ClientServerOptions): Promise<void>;

        destroy(): Promise<void>;
    }
}