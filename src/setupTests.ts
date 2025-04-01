import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

if (typeof global.TextEncoder === 'undefined') {
    global.TextEncoder = TextEncoder as typeof global.TextEncoder;
    global.TextDecoder = TextDecoder as typeof global.TextDecoder;
}

// Extend Jest matchers
declare global {
    export interface Matchers<R> {
        toBeInTheDocument(): R;
        toHaveTextContent(text: string): R;
    }
}

declare global {
    interface Expect {
        toHaveBeenCalledWith<TArgs extends unknown[]>(...args: TArgs): void;
    }

    interface MockInstance<TArgs extends unknown[]> {
        toHaveBeenCalledWith(...args: TArgs): void;
    }
}