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
import { HashiClient } from '../root/HashiClient';
import { ConnectOptions } from 'mongoose';
import { DataMap, TypedDataMapStored } from './DataMap';
import { Base } from './Base';
/**
 * The type that includes all the data maps of the database.
 */
export type DataMapsObj = {
    [dmName: string]: DataMap<any>;
};
/**
 * The class who manages the database of the project.
 */
export declare class DatabaseManager extends Base {
    #private;
    /**
     * Get the database name.
     * @returns The database name.
     */
    get dbName(): string;
    /**
     * Get the connection URI.
     * @returns The connection URI.
     */
    get connectionURI(): string;
    /**
     * Get the connect options.
     * @returns The connect options.
     */
    get connectOptions(): ConnectOptions;
    /**
     * Get the data maps.
     * @returns The data maps.
     */
    get dataMaps(): DataMapsObj;
    /**
     * The constructor of the class.
     * @param client The client instance.
     */
    constructor(client: HashiClient);
    /**
     * Set the database name.
     * @param dbName The database name to set.
     * @returns The class instance.
     */
    setDbName(dbName: string): DatabaseManager;
    /**
     * Set the connection URI.
     * @param connectionURI The connection URI to set.
     * @returns The class instance.
     */
    setConnectionURI(connectionURI: string): DatabaseManager;
    /**
     * Set the connect options.
     * @param connectOptions The connect options to set.
     * @returns The class instance.
     */
    setConnectOptions(connectOptions: ConnectOptions): DatabaseManager;
    /**
     * Build and save a data map.
     * @param name The name of the collection.
     */
    createDataMap(name: string): DataMap<TypedDataMapStored>;
    /**
     * Connect the database to the mongodb cluster.
     * @param connectionURI The connection URI.
     * @param connectOptions The connection options.
     */
    connect(connectionURI?: string, connectOptions?: ConnectOptions): Promise<void>;
    /**
     * Get a data map with the possibility to create it if it doesn't exist.
     * @param dataMapName The data map name.
     * @param force If the data map should be created if it doesn't exist.
     * @returns The [created] data map
     */
    ensure(dataMapName: string, force?: boolean): DataMap<TypedDataMapStored>;
}