declare module 'hyperdht' {
    import DHT, {DHTConstructorParameters, DHTNodeAddress, UDX} from 'dht-rpc';
    import {KeyPair} from "hypercore";
    import {Duplex} from 'streamx';

    export default class HyperDHT extends DHT {
        readonly _eventsCount: number;
        readonly _maxListeners?: number;
        readonly bootstrapNodes: DHTNodeAddress[];
        readonly table: RoutingTable;
        readonly nodes: TimeOrderedSet;
        readonly udx: UDX;
        readonly concurrency: number;
        readonly bootstrapped: boolean;
        readonly adaptive: boolean;
        readonly suspended: boolean;
        readonly online: boolean;
        readonly stats: HyperDHTStats;
        readonly defaultKeyPair: KeyPair;
        readonly tracer: NoTracingClass;
        readonly keepConnectionAlive: number;

        constructor(opts?: HyperDHTConstructorParameters);

        static keyPair(seed?): KeyPair;

        createServer(options?: CreateServerOptions, onConnection?: (socket) => void): HyperDHTServer;

        connect(remotePublicKey, opts?: ConnectOptions): HyperDHTSocket;

        lookup(topic: Buffer, options?): LookupStream;

        announce(topic: Buffer, keyPair: KeyPair, relayAddresses?: string[], options?): LookupStream;

        unannounce(topic: Buffer, keyPair: KeyPair, options?): Promise<void>;

        immutablePut(value: Buffer | string, options?): Promise<ImmutablePutResult>

        // TODO check if strings are allowed
        immutableGet(hash: Buffer, options?): Promise<ImmutableGetResult>;

        mutablePut(keyPair: KeyPair, value: Buffer | string, options?): Promise<MutablePutResult>;

        // TODO confirm what publicKey is
        mutableGet(publicKey: Buffer, hash: Buffer | string, options?: MutableGetOptions): Promise<MutableGetResult>;
    }

    interface HyperDHTConstructorParameters extends DHTConstructorParameters {
        keyPair?: KeyPair
    }

    interface HyperDHTServer {
        readonly dht: HyperDHT;
        readonly target: Buffer;
        readonly closed: boolean;
        readonly relayThrough: unknown | null;
        readonly relayKeepAlive: number;
        readonly pool: unknown | null;
        readonly suspended: boolean;
        readonly _shareLocalAddress: boolean;
        readonly _reusableSocket: boolean;
        readonly _neverPunch: boolean;
        readonly _keyPair: KeyPair;

        createHandshake(): unknown;

        createSecretStream(): unknown;

        firewall(): unknown;

        holepunch(): unknown;

        listen(keyPair: KeyPair): Promise<void>;

        refresh(): Promise<void>;

        address(): HyperDHTServerAddress;

        close(): Promise<void>;

        on(event: 'connection', listener: (socket: NoiseSecretStream) => void): HyperDHTServer;

        on(event: 'listening', listener: () => void): HyperDHTServer;

        on(event: 'close', listener: () => void): HyperDHTServer;

        on(event: 'error', listener: (error) => void): HyperDHTServer;
    }

    export interface NoiseSecretStream extends Duplex {
        readonly isInitiator: boolean
        readonly publicKey: Buffer
        readonly remotePublicKey: Buffer
        readonly handshakeHash: Buffer
        readonly connected: boolean
        readonly keepAlive: number
        readonly timeout: number
        readonly opened: Promise<unknown>
        readonly rawBytesWritten: number
        readonly rawBytesRead: number
        readonly relay: unknown | null
        readonly puncher: unknown | null
    }

    interface CreateServerOptions {
        firewall: (remotePublicKey, remoteHandshakePayload) => boolean
    }

    interface TimeOrderedSet {
        readonly oldest: HyperDHTNode;
        readonly latest: HyperDHTNode;
        readonly length: number;
    }

    interface HyperDHTNode {
        readonly id: Buffer;
        readonly port: number;
        readonly host: string;
        readonly to: unknown;
        readonly sampled: number;
        readonly added: number;
        readonly pinged: number;
        readonly seen: number;
        readonly downHints: number;
        readonly prev: HyperDHTNode | null;
        readonly next: HyperDHTNode | null;
    }

    interface HyperDHTStats {
        readonly punches: { consistency: number, random: number, open: number };
        readonly queries: { active: number, total: number }
    }

    export interface NoTracingClass {
        enabled: boolean;
        ctx: unknown | null;
        className: unknown | null;
        props: unknown | null;
        parentObject: unknown | null;
        objectId: unknown | null;
    }

    export interface HyperDHTServerAddress extends DHTNodeAddress {
        publicKey: Buffer
    }

    interface ConnectOptions {
        nodes: string[]
        keyPair: KeyPair
    }

    interface HyperDHTSocket {
        readonly remotePublicKey: Buffer
        readonly publicKey: Buffer

        on(event: 'open', listener: () => void): HyperDHTSocket
    }

    interface LookupStream {
        from: DHTNodeAddress & { id: string }
        to: DHTNodeAddress
        peer: { publicKey: Buffer, node: DHTNodeAddress[] }[]
    }

    interface ImmutablePutResult {
        hash: Buffer
        closestNodes: DHTNodeAddress[]
    }

    interface ImmutableGetResult {
        value: Buffer
        from: DHTNodeAddress
    }

    interface MutablePutResult {
        publicKey: Buffer
        closestNodes: DHTNodeAddress[]
        seq: number
        signature: any
    }

    interface MutableGetOptions {
        seq: number
        latest: boolean
    }

    interface MutableGetResult {
        value: Buffer
        from: DHTNodeAddress
        seq: number
        signature: any
    }
}