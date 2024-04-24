import { connect, ConnectOptions, Model, SchemaDefinition } from 'mongoose';
import { BaseClient, DataMap, DataMapsObject, TypedDataMapStored } from './';
import {
  InstanceInjector,
  InstanceValidator,
  InstanceValidatorReturner,
  SuperModelInjectorTarget,
  Validators,
} from '../decorators';
import { Client, SuperModel } from '../root';

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
  @((<InstanceValidatorReturner>Validators.ObjectValidator.KeyDataMapPair)(DataMap))
  public dataMaps: DataMapsObject = {};

  /**
   * The list of dataMaps constructor waiting for being initialized.
   */
  @((<InstanceValidatorReturner>Validators.ArrayValidator.OnlyConstructorOf)(SuperModel))
  public sleepingSuperModels: SuperModel[] = [];

  /**
   * @param client The client instance.
   */
  constructor(client: Client) {
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

  // noinspection JSUnusedGlobalSymbols
  /**
   * The decorator to inject metadata into the constructor of an extension of SuperModel.
   * @param name The name of the super-SuperModel.
   * @returns The decorator.
   */
  public inject(name: string): InstanceInjector {
    const instance: DatabaseManager = this;
    return function (target: SuperModelInjectorTarget): void {
      instance.client.logger.info(`Bound model: ${name}`);
      target.prototype.name = name;
      instance.dataMaps[name] = new DataMap<TypedDataMapStored>(instance.client, name);
      instance.createDataMap(name);
      instance.dataMaps[name].definition = new target(name);
    };
  }

  /**
   * Get a table and its model.
   * @param name The name of the table.
   * @returns The model of the table.
   */
  public get(name: string): Model<SchemaDefinition & Document & any> {
    const table: DataMap<any> = this.dataMaps[name];
    if (!table) return null;

    return table.definition.model;
  }
}
