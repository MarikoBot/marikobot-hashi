import { HashiClient } from '../root/HashiClient';
/**
 * Represents the base class for each class of the package.
 */
export declare class Base {
    #private;
    /**
     * Get the client instance.
     * @returns The client instance.
     */
    get client(): HashiClient;
    /**
     * Initialize the base class, and, if needed, the client instance.
     * @param client The client instance.
     */
    constructor(client: HashiClient);
    /**
     * Set the client instance.
     */
    setClient(client: HashiClient): Base;
}