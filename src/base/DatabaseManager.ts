// noinspection JSUnusedGlobalSymbols

import { connect, Model, ConnectOptions } from 'mongoose';
import { BaseClient, DataMap, TypedDataMapStored } from './';
import { Validators } from '../decorators';
import { FileManager, HashiClient, SuperModel } from '../root/';
import { InstanceValidator } from '../decorators/shared';

/**
 * The class who manages the database of the project.
 */
export class DatabaseManager extends BaseClient {
  /**
   * The database name. Not useful to change it (only for MongoDB). Default: main.
   */
  @(<InstanceValidator>Validators.StringValidator.ValidId)
  public dbName: string = 'main';

  /**
   * The connection URI.
   */
  @(<InstanceValidator>Validators.StringValidator.NotEmpty)
  public connectionURI: string;

  /**
   * The options for the connection.
   */
  @(<InstanceValidator>Validators.ObjectValidator.Matches)
  public connectOptions: ConnectOptions;

  /**
   * The list of dataMaps.
   */
  @((<(dataMap: typeof DataMap) => InstanceValidator>Validators.ObjectValidator.KeyDataMapPair)(DataMap))
  public dataMaps: DataMapsObject = {};

  /**
   * The constructor of the class.
   * @param client The client instance.
   */
  constructor(client: HashiClient) {
    super(client);
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
    const superModels: [string, typeof SuperModel][] = this.client.fileManager.read<typeof SuperModel>(
      `${FileManager.ABSPATH}${this.client.dataMapsDir}`,
      `${FileManager.RMPATH}${this.client.dataMapsDir}`,
      {
        absPathStrSelf: `./lib/${this.client.dataMapsDir}`,
        rmPathStrSelf: `../${this.client.dataMapsDir}`,
      },
    );

    let superModel: SuperModel;
    let dataMap: DataMap<any, any>;

    let i: number = -1;
    while (++i < superModels.length) {
      superModel = superModels[i][1][superModels[i][0]];

      dataMap = this.createDataMap(superModel.name);
      dataMap.superModel = superModel;
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
    if (connectionURI) this.connectionURI = connectionURI;
    if (connectOptions) this.connectOptions = connectOptions;

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

/**
 * The type that includes all the data maps of the database.
 */
export type DataMapsObject = { [dmName: string]: DataMap<any> };
