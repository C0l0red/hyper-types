declare module 'hypercore' {
    import {Readable, Writable} from 'streamx';
    import {NoiseSecretStream} from "hyperdht";

    export default class HyperCore extends EventEmitter {
        constructor(storage, key?: Buffer | HyperCoreConstructorParameters, opts?: HyperCoreConstructorParameters);

        readonly id: string;
        readonly key: Buffer;
        readonly discoveryKey: Buffer;
        readonly opened: boolean;
        readonly closed: boolean;
        readonly snapshotted: boolean;
        readonly sparse: boolean;
        readonly writable: boolean;
        readonly length: number;
        readonly fork: number;
        readonly sessions: number[];
        readonly activeRequests: number[];
        readonly peers: Peer[]; // FIXME verify if it is type number[] or Peer[]
        readonly keyPair: KeyPair;
        readonly readable: boolean;
        readonly encryptionKey: Buffer | null;
        readonly contiguousLength: number;
        readonly byteLength: number;
        readonly padding: number;
        readonly stats: NetworkStats;

        on(event: 'append', listener: () => void): HyperCore

        on(event: 'truncate', listener: (ancestors, forkId) => void): HyperCore

        on(event: 'ready', listener: () => void): HyperCore

        on(event: 'close', listener: () => void): HyperCore

        on(event: 'peer-add', listener: (peer: Peer) => void): HyperCore

        on(event: 'peer-remove', listener: (peer: Peer) => void): HyperCore

//
//        on(event: 'error', listener: (error: Error) => void): HyperCore
//
//        on(event: 'upload', listener: (index: number, data: E) => void): HyperCore

        once(event: 'peer-add', listener: (peer: Peer) => void): HyperCore

        once(event: 'peer-remove', listener: (peer: Peer) => void): HyperCore

        once(event: 'ready', listener: () => void): HyperCore

//        once(event: 'error', listener: (error: Error) => void): HyperCore
//
//        once(event: 'upload', listener: (index: number, data: E) => void): HyperCore

        once(event: 'append', listener: () => void): HyperCore

        once(event: 'close', listener: () => void): HyperCore

//        registerExtension<M = Buffer>(name: string, handlers: ExtensionHandlers<M>): Extension<M>

        append(data: any): Promise<{ length: number, byteLength: number }>

        get(index: number, options?: GetOptions): Promise<Buffer>

        has(start: number, end?: number): Promise<boolean>

        update(minLength?: UpdateOptions): Promise<boolean>

        seek(byteOffset: number, options?: SeekOptions): Promise<SeekResult>

        createReadStream(options?: ReadStreamOptions): ReadStream;

        createByteStream(options?: ByteStreamOptions): ByteStream;

        createWriteStream(options?: WriteStreamOptions): WriteStream;

        clear(start: number, end?: number, options?: ClearOptions): Promise<{ blocks: number } | null>

        truncate(newLength?: number, forkId?: number): Promise<void>;

        purge(): Promise<void>;

        treeHash(length?: number): Promise<Buffer>;

        download(range?: DownloadRangeOptions): Download;

        info(): Promise<PeerDetails>;

        close(): Promise<void>

        ready(): Promise<void>

        replicate(isInititaorOrStream: boolean | NoiseSecretStream, options?): Bridge;

        findingPeers(): () => void;

        session(options?: SessionOptions): HyperCore;

        snapshot(options?: SessionOptions): HyperCore;
    }

    export interface HyperCoreConstructorParameters {
        createIfMissing?: boolean
        overwrite?: boolean
        sparse?: boolean
        valueEncoding?: Encoding
        encodeBatch?: (batch) => {}
        keyPair?: KeyPair
        encryptionKey?: string
        onwait?: () => {}
        timeout?: number
        writeable?: boolean
    }

    export interface KeyPair {
        publicKey: Buffer
        secretKey: Buffer
    }

    interface Peer {
        remotePublicKey: Buffer
    }

    interface NetworkStat {
        uploadedBytes: number
        uploadedBlocks: number
        downloadedBytes: number
        downloadedBlocks: number
    }

    interface NetworkStats {
        totals: NetworkStat
        peers: NetworkStat[]
    }

    interface UpdateOptions {
        wait?: boolean
    }

    interface GetOptions {
        wait?: boolean
        onwait?: () => {}
        timeout?: number
        valueEncoding?: Encoding
        decrypt?: boolean
    }

    interface SeekOptions {
        wait?: boolean
        timeout?: number
    }

    interface SeekResult {
        index: number
        relativeOffset: number
    }

    interface SessionOptions {
        wait?: boolean
        onwait?: () => {}
        sparse?: boolean
        class: new (...args: any[]) => any
    }

    interface ReadStream extends Readable {
        core: HyperCore
        start: number
        end: number
        snapshot: boolean
        live: boolean
    }

    interface ReadStreamOptions {
        start?: number
        end?: number
        live?: boolean
        snapshot?: boolean
    }

    interface ByteStreamOptions {
        byteOffset: number
        byteLength: number
        prefetch: number
    }

    interface WriteStreamOptions {
        maxBlockSize?: number
    }

    interface WriteStream extends Writable {
        core: HyperCore
    }

    interface ByteStream extends Readable {
        _core: HyperCore
        _index: number
        _range: any
        _byteOffset: number
        _byteLength: number
        _prefetch: number
        _applyOffset: boolean
    }

    interface ClearOptions {
        diff: boolean;
    }

    interface DownloadRangeOptions {
        start?: number
        end?: number
        linear?: boolean
        blocks?: number[]
    }

    interface Download {
        done(): Promise<unknown>

        destroy(): Promise<void>
    }

    // TODO look for a better name
    interface PeerDetails {
        key: Buffer
        discoveryKey: Buffer
        length: number
        contiguousLength: number
        byteLength: number
        fork: number
        padding: number
        storage: PeerDetailsStorage
    }

    interface PeerDetailsStorage {
        oplog: number
        tree: number
        blocks: number
        bitfield: number
    }

    interface Bridge {

    }
}
