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
import { ConnectOptions, Model, SchemaDefinition } from 'mongoose';
import { BaseClient, DataMap, DataMapsObject, TypedDataMapStored } from './';
import { InstanceInjector } from '../decorators';
import { Client, SuperModel } from '../root';
/**
 * The class who manages the database of the project.
 */
export declare class DatabaseManager extends BaseClient {
    /**
     * The database name. Not useful to change it (only for MongoDB). Default: main.
     */
    dbName: string;
    /**
     * The connection URI.
     */
    connectionURI: string;
    /**
     * The options for the connection.
     */
    connectOptions: ConnectOptions;
    /**
     * The list of dataMaps.
     */
    dataMaps: DataMapsObject;
    /**
     * The list of dataMaps constructor waiting for being initialized.
     */
    sleepingSuperModels: SuperModel[];
    /**
     * @param client The client instance.
     */
    constructor(client: Client);
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
     * The decorator to inject metadata into the constructor of an extension of SuperModel.
     * @param name The name of the super-SuperModel.
     * @returns The decorator.
     */
    inject(name: string): InstanceInjector;
    /**
     * Get a table and its model.
     * @param name The name of the table.
     * @returns The model of the table.
     */
    get(name: string): Model<SchemaDefinition & Document & any>;
}
