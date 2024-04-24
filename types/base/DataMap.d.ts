import { BaseClient, DATAMAP_INTENTS, TypedDataMapStored } from './';
import { DataMapEntry, Client, SuperModel } from '../root';
/**
 * The main class. Represents a data map technology.
 */
export declare class DataMap<DataStructure extends TypedDataMapStored> extends BaseClient {
    /**
     * The name of the data map.
     */
    name: string;
    /**
     * The primary key(s). Separate it with a '+' sign.
     */
    primaryKey: string;
    /**
     * The default data for the data map.
     */
    definition: SuperModel;
    /**
     * Intents for the database. Be careful! Those intents MUST BE set before the launch of the process.
     */
    intents: DATAMAP_INTENTS[];
    /**
     * The constructor of a data map.
     * @param client The client instance.
     * @param name The name of the collection.
     */
    constructor(client: Client, name: string);
    /**
     * Get some data from the data map.
     * @param key The key to look for.
     * @returns The data if found.
     */
    getRaw(key?: string): Promise<TypedDataMapStored>;
    /**
     * Automatically refreshes the data map if the data is core flagged.
     * @returns Nothing.
     */
    refreshCore(): Promise<void>;
    /**
     * Update some data from the database.
     * @param key The key to look.
     * @param data The full data.
     * @param path The path if the data is SQLite.
     * @returns Nothing.
     */
    update(key: string, data: TypedDataMapStored, path?: string): Promise<void>;
    /**
     * Refresh the data in the database if the structure is detected to be different.
     * @param key The key to look who applies changes on.
     * @returns The player data.
     */
    protected get(key?: string): Promise<TypedDataMapStored | DataMapEntry<DataStructure>>;
}
