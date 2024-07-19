declare global {
    type Encoding = 'binary' | 'json' | 'utf-8'

    export interface EncodingOptions {
        valueEncoding: Encoding;
        keyEncoding: Encoding;
    }
    
}