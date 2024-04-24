import { BaseClient, DATAMAP_INTENTS, TypedDataMapStored } from './';
import { InstanceValidator, InstanceValidatorReturner, Validators } from '../decorators';
import { DataMapEntry, Client, SuperModel } from '../root';

/**
 * The main class. Represents a data map technology.
 */
export class DataMap<DataStructure extends TypedDataMapStored> extends BaseClient {
  /**
   * The name of the data map.
   */
  @(<InstanceValidator>Validators.StringValidator.ValidId)
  public name: string = 'default';

  /**
   * The primary key(s). Separate it with a '+' sign.
   */
  @(<InstanceValidator>Validators.StringValidator.ValidPrimaryKeys)
  public primaryKey: string = 'discordId';

  /**
   * The default data for the data map.
   */
  @((<InstanceValidatorReturner>Validators.ObjectValidator.IsInstanceOf)(SuperModel))
  public definition: SuperModel;

  /**
   * Intents for the database. Be careful! Those intents MUST BE set before the launch of the process.
   */
  @Validators.ArrayValidator.OnlyEnumValues
  public intents: DATAMAP_INTENTS[] = [];

  /**
   * The constructor of a data map.
   * @param client The client instance.
   * @param name The name of the collection.
   */
  constructor(client: Client, name: string) {
    super(client);
    this.name = name;
  }

  /**
   * Get some data from the data map.
   * @param key The key to look for.
   * @returns The data if found.
   */
  public async getRaw(key: string = this.definition.defaultValues[this.primaryKey]): Promise<TypedDataMapStored> {
    const value: TypedDataMapStored = null;
    this.client.logger.debug(key, value);
    return value;
  }

  /**
   * Automatically refreshes the data map if the data is core flagged.
   * @returns Nothing.
   */
  public async refreshCore(): Promise<void> {
    if (!this.intents.includes(DATAMAP_INTENTS.CORE)) return;

    const currentData: TypedDataMapStored = await this.getRaw(this.definition.defaultValues[this.primaryKey]);
    this.client.logger.debug(currentData);
  }

  /**
   * Update some data from the database.
   * @param key The key to look.
   * @param data The full data.
   * @param path The path if the data is SQLite.
   * @returns Nothing.
   */
  public async update(
    key: string = this.definition.defaultValues[this.primaryKey],
    data: TypedDataMapStored,
    path?: string,
  ): Promise<void> {
    this.client.logger.debug(key, data, path);
  }

  /**
   * Refresh the data in the database if the structure is detected to be different.
   * @param key The key to look who applies changes on.
   * @returns The player data.
   */
  protected async get(
    key: string = this.definition.defaultValues[this.primaryKey],
  ): Promise<TypedDataMapStored | DataMapEntry<DataStructure>> {
    const data: TypedDataMapStored = await this.getRaw(key);
    if (!data) return data;

    const structure: this['definition']['defaultValues'] = this.definition.defaultValues;
    let finalStructure: { [key: string]: any };
    let refreshIsRequired: boolean = false;

    const compareObj = (source: object, target: object, finalObj: object): object => {
      for (const K of Object.keys(source)) {
        if (this.primaryKey.includes(K)) {
          finalObj[K] = target[K];
          continue;
        }
        if (typeof source[K] !== 'object') {
          finalObj[K] = typeof source[K] !== typeof target[K] ? source[K] : target[K];
        } else {
          if (K in target) finalObj[K] = compareObj(source[K], target[K], {});
          else {
            if (typeof finalObj[K] !== 'object') refreshIsRequired = true;
            finalObj = source[K];
          }
        }
      }
      return finalObj;
    };

    finalStructure = compareObj(<object>structure, <object>data, {});
    if (refreshIsRequired) await this.update(key, finalStructure);
    return <DataStructure>finalStructure;
  }
}
