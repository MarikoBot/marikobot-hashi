// noinspection JSUnusedGlobalSymbols

import { HashiClient } from '../root/';
import { connect, ConnectOptions, Model, Schema, SchemaDefinition } from 'mongoose';
import { DataMap, DataMapDefinition, TypedDataMapStored } from './DataMap';
import { Base } from './Base';
import { FileManager } from '../root/FileManager';

/**
 * The type that includes all the data maps of the database.
 */
export type DataMapsObj = { [dmName: string]: DataMap<any> };

/**
 * The class who manages the database of the project.
 */
export class DatabaseManager extends Base {
  /**
   * The database name. Not useful to change it (only for MongoDB). Default: main.
   */
  #dbName: string = 'main';

  /**
   * The connection URI.
   */
  #connectionURI: string;

  /**
   * The options for the connection.
   */
  #connectOptions: ConnectOptions;

  /**
   * The list of dataMaps.
   */
  #dataMaps: DataMapsObj = {};

  /**
   * Get the database name.
   * @returns The database name.
   */
  get dbName(): string {
    return this.#dbName;
  }

  /**
   * Get the connection URI.
   * @returns The connection URI.
   */
  get connectionURI(): string {
    return this.#connectionURI;
  }

  /**
   * Get the connect options.
   * @returns The connect options.
   */
  get connectOptions(): ConnectOptions {
    return this.#connectOptions;
  }

  /**
   * Get the data maps.
   * @returns The data maps.
   */
  get dataMaps(): DataMapsObj {
    return this.#dataMaps;
  }

  /**
   * The constructor of the class.
   * @param client The client instance.
   */
  constructor(client: HashiClient) {
    super(client);
  }

  /**
   * Set the database name.
   * @param dbName The database name to set.
   * @returns The class instance.
   */
  public setDbName(dbName: string): DatabaseManager {
    if (typeof dbName === 'string') this.#dbName = dbName;
    return this;
  }

  /**
   * Set the connection URI.
   * @param connectionURI The connection URI to set.
   * @returns The class instance.
   */
  public setConnectionURI(connectionURI: string): DatabaseManager {
    if (typeof connectionURI === 'string') this.#connectionURI = connectionURI;
    return this;
  }

  /**
   * Set the connect options.
   * @param connectOptions The connect options to set.
   * @returns The class instance.
   */
  public setConnectOptions(connectOptions: ConnectOptions): DatabaseManager {
    if (typeof connectOptions === 'object') this.#connectOptions = connectOptions;
    return this;
  }

  /**
   * Build and save a data map.
   * @param name The name of the collection.
   */
  public createDataMap(name: string): DataMap<TypedDataMapStored> {
    const dataMap: DataMap<TypedDataMapStored> = new DataMap<TypedDataMapStored>(this.client, name);
    this.dataMaps[name] = dataMap;
    return dataMap;
  }

  /**
   * Synchronize the datamaps created by the coder into their own repository.
   * Synchronize this project files too.
   * @returns The class instance.
   */
  public loadDataMaps(): DatabaseManager {
    const definitions: [string, DataMapDefinition<any>][] = this.client.fileManager.read<DataMapDefinition<any>>(
      `${FileManager.ABSPATH}${this.client.dataMapsDir}`,
      `${FileManager.RMPATH}${this.client.dataMapsDir}`,
      {
        absPathStrSelf: `./lib/${this.client.dataMapsDir}`,
        rmPathStrSelf: `../${this.client.dataMapsDir}`,
      },
    );
    const models: [string, Model<any>][] = this.client.fileManager.read<Model<any>>(
      `${FileManager.ABSPATH}${this.client.dataMapsDir}/../models`,
      `${FileManager.RMPATH}${this.client.dataMapsDir}/../models`,
      {
        absPathStrSelf: `./lib/${this.client.dataMapsDir}/../models`,
        rmPathStrSelf: `../${this.client.dataMapsDir}/../models`,
      },
    );

    let definition: DataMapDefinition<any>;
    let model: Model<any>;
    let dataMap: DataMap<any, any>;

    let i: number = -1;
    while (++i < definitions.length) {
      definition = definitions[i][1][definitions[i][0]];
      model = models[i][1][models[i][0]];

      dataMap = this.createDataMap(definition.name);
      dataMap.setDefinition({ ...definition, model });
    }
    return this;
  }

  /**
   * Connect the database to the mongodb cluster.
   * @param connectionURI The connection URI.
   * @param connectOptions The connection options.
   */
  public async connect(
    connectionURI: string = this.connectionURI,
    connectOptions: ConnectOptions = { dbName: this.dbName },
  ): Promise<void> {
    if (connectionURI) this.#connectionURI = connectionURI;
    if (connectOptions) this.#connectOptions = connectOptions;

    await connect(this.connectionURI, this.connectOptions);
  }

  /**
   * Get a data map with the possibility to create it if it doesn't exist.
   * @param dataMapName The data map name.
   * @param force If the data map should be created if it doesn't exist.
   * @returns The [created] data map
   */
  public ensure(dataMapName: string, force: boolean = false): DataMap<TypedDataMapStored> {
    if (dataMapName in this.dataMaps) return this.dataMaps[dataMapName];

    if (force) return this.createDataMap(dataMapName);
    return null;
  }
}
