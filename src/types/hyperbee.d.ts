declare module 'hyperbee' {
    import HyperCore from "hypercore";

    export default class HyperBee {
        constructor(core: HyperCore, opts?: HyperBeeConstructorParameters);

        readonly core: HyperCore;
        readonly id: number;
        readonly version: number;
        readonly key: Buffer;
        readonly discoveryKey: Buffer;
        readonly writeable: boolean;
        readonly readable: boolean;

        readonly(): Promise<void>;

        close(): Promise<void>;

        put(key: any, value: any, options?: PutOptions): Promise<void>;

        get(key: any, options?: GetOptions): Promise<{ seq: number, key: Buffer, value: Buffer }>;

        del(key: any, options?: DelOptions): Promise<void>;

        getBySeq(seq: number, options?: GetOptions): Promise<{ key: Buffer, value: Buffer }>;
    }

    interface HyperBeeConstructorParameters extends EncodingOptions {
    }

    interface PutOptions {
        cas: (prev, next) => boolean;
    }

    interface GetOptions extends EncodingOptions {
        wait: boolean;
        update: boolean;
    }

    interface DelOptions {
        cas: (prev) => boolean;
    }
}