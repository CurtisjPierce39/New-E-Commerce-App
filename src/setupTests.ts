import '@testing-library/jest-dom'; 
import { TextEncoder, TextDecoder } from 'util'; 

if (typeof global.TextEncoder === 'undefined') {//checks if TextEncoder is defined
    global.TextEncoder = TextEncoder as typeof global.TextEncoder; //if not, it sets it to TextEncoder
    global.TextDecoder = TextDecoder as typeof global.TextDecoder; //if not, it sets it to TextDecoder
}

// Extend Jest matchers
declare global {
    export interface Matchers<R> { //declares a new interface for Matchers
        toBeInTheDocument(): R; //declares a new method for Matchers
        toHaveTextContent(text: string): R; //verifies if the element has the given text content
    }
}

declare global {
    interface Expect { //declares a new interface for Expect
        toHaveBeenCalledWith<TArgs extends unknown[]>(...args: TArgs): void; 
        //allows the method to accept any number of arguments of any type
        //verifies if the mock has been called with the given arguments
    }

    interface MockInstance<TArgs extends unknown[]> { //declares a new interface for MockInstance
        toHaveBeenCalledWith(...args: TArgs): void; //verifies if the mock has been called with the given arguments
    }
}