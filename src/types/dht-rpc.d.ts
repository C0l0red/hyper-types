declare module 'dht-rpc' {
    import * as dgram from "node:dgram";
    export default class DHT extends EventEmitter {
        constructor(opts?: DHTConstructorParameters);

        readonly id?: string;
        readonly ephemeral: boolean;
        readonly host: string;
        readonly port: number;
        readonly firewalled: boolean;
        readonly randomized: boolean;
        readonly socket: dgram.Socket;
        readonly destroyed: boolean;

        static bootstrapper(port: number, host: string, opts?: DHTConstructorParameters): DHT;

        address(): DHTNodeAddress;

        ready(): Promise<void>;

        on(event: 'bootstrap', listener: () => void): DHT;

        on(event: 'listening', listener: () => void): DHT;

        on(event: 'ready', listener: () => void): DHT;

        on(event: 'persistent', listener: () => void): DHT;

        on(event: 'wake-up', listener: () => void): DHT;

        on(event: 'network-change', listener: (interfaces) => void): DHT;

        on(event: 'nat-update', listener: (host: string, port: number) => void): DHT;

        on(event: 'close', listener: () => void): DHT;

        on(event: 'request', listener: (req: DHTReceivedRequest) => void): DHT;

        on(event: 'error', listener: (error) => void): DHT;

        refresh(): Promise<void>;

        request(message: DHTSentRequest, to: DHTNodeAddress, opts?: DHTRequestOptions): Promise<DHTResponse>;

        ping(to: DHTNodeAddress, opts?: DHTRequestOptions): Promise<DHTResponse>;

        query(message: DHTQueryMessage, opts?: DHTQueryOptions): Promise<DHTStream>;

        findNode(target: any, opts?): Promise<DHTStream>;

        destroy(): Promise<boolean>;

        toArray(): DHTNodeAddress[];

        addNode(address: DHTNodeAddress): void;

        suspend(): Promise<void>;

        resume(): Promise<void>;
    }

    export interface DHTConstructorParameters {
        bootstrap?: string[]
        nodes?: { node: string, port: number }[]
        port?: number
        host?: string
        udx?: UDX
        firewalled?: boolean
    }

    export enum DHTCommand {
        PING,
        PING_NAT,
        FIND_NODE,
        DOWN_HINT,
    }

    export interface DHTNodeAddress {
        host: string
        port: number
    }

    export class UDX {
    }

    export interface DHTSentRequest {
        target: any
        command: DHTCommand
        value: Buffer
        token: string
    }

    export interface DHTReceivedRequest extends DHTSentRequest {
        from: DHTNodeAddress

        reply(value): void;

        error(errorCode)
    }

    export interface DHTRequestOptions {
        retry?: boolean
        socket?: dgram.Socket
    }

    export interface DHTQueryMessage {
        target: Buffer
        command: DHTCommand
        value?: Buffer
    }

    export interface DHTQueryOptions {
        commit?: boolean
    }

    export interface DHTResponse {
        token: string
        from: DHTNodeAddress
    }

    export interface DHTStream {
        readonly closestNodes: any[]
        readonly closestReplies: any[]

        finished(): Promise<void>
    }
}