/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { Model, Schema, SchemaDefinition, Document } from 'mongoose';
import { HashiClient } from './HashiClient';
/**
 * The type that represents a document for the hashi data map.
 */
export interface DataMapDefinition<IStructure extends SchemaDefinition> {
    /**
     * The build schema.
     */
    schema: Schema<IStructure>;
    /**
     * The model if the data map is using mongo.
     */
    model?: Model<IStructure & Document>;
    /**
     * The default values.
     */
    defaultValues: PossibleDataMapStored;
}
/**
 * The possible value to store in.
 */
export type PossibleDataMapStored = number | string | boolean | PossibleDataMapStored[] | {
    [key: string]: PossibleDataMapStored;
} | undefined;
/**
 * The list of flags for the data map intents.
 */
export declare enum DATAMAP_INTENTS {
    /**
     * If the data map is used for store the most important data (as process data).
     */
    CORE = 0
}
/**
 * The main class. Represents a data map technology.
 */
export declare class DataMap<DataStructure extends PossibleDataMapStored> {
    #private;
    /**
     * Get the client.
     * @returns The client.
     */
    get client(): HashiClient;
    /**
     * Get the data map name.
     * @returns The name.
     */
    get name(): string;
    /**
     * Get the primary key.
     * @returns The primary key.
     */
    get primaryKey(): string;
    /**
     * Get the default data.
     * @returns The default data.
     */
    get definition(): DataMapDefinition<SchemaDefinition>;
    /**
     * Get the intents.
     * @returns The intents.
     */
    get intents(): DATAMAP_INTENTS[];
    /**
     * Get the data map.
     * @returns The data map.
     */
    get collection(): Model<DataMapDefinition<SchemaDefinition>>;
    /**
     * Get the data map as mongo model.
     * @returns The data map as mongo model.
     */
    get model(): DataMapDefinition<SchemaDefinition>['model'];
    /**
     * The constructor of a data map.
     * @param name The name of the collection.
     */
    constructor(name: string);
    /**
     * Set the client.
     * @param client The client to set.
     * @returns The class instance.
     */
    setClient(client: HashiClient): DataMap<DataStructure>;
    /**
     * Set the data map name.
     * @param name The data map name to set.
     * @returns The class instance.
     */
    setName(name: string): DataMap<DataStructure>;
    /**
     * Set the primary key.
     * @param primaryKey The primary key to set.
     * @returns The class instance.
     */
    setPrimaryKey(primaryKey: string): DataMap<DataStructure>;
    /**
     * Set the definition data.
     * @param definition The definition data to set.
     * @returns The data map.
     */
    setDefinition<IStructure extends SchemaDefinition>(definition: DataMapDefinition<IStructure>): DataMap<DataStructure>;
    /**
     * Add an intent.
     * @param intent The intent to add.
     * @returns The data map.
     */
    addIntent(intent: DATAMAP_INTENTS): DataMap<DataStructure>;
    /**
     * Get some data from the data map.
     * @param key The key to look for.
     * @returns The data if found.
     */
    getRaw(key?: string): Promise<PossibleDataMapStored>;
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
    update(key: string, data: PossibleDataMapStored, path?: string): Promise<void>;
    /**
     * Refresh the data in the database if the structure is detected to be different.
     * @param key The key to look who applies changes on.
     * @returns The player data.
     */
    protected get(key?: string): Promise<PossibleDataMapStored>;
}
