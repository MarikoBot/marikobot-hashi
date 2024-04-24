import { DataMap, TypedDataMapStored } from '../base/';
import { InstanceValidatorReturner, Validators } from '../decorators';

/**
 * The base class that represents a data map class object.
 * Every object into the data map will be passed in this class to improve manipulation.
 */
export class DataMapEntry<DataStructure extends TypedDataMapStored> {
  /**
   * The data map.
   */
  @((<InstanceValidatorReturner>Validators.ObjectValidator.IsInstanceOf)(DataMap))
  public readonly dataMap: DataMap<DataStructure>;

  /**
   * The data.
   */
  public readonly data: DataStructure;

  /**
   * The constructor of a data map entry.
   * @param dataMap The data map.
   * @param data The data.
   */
  constructor(dataMap: DataMap<DataStructure>, data: DataStructure) {
    this.dataMap = dataMap;
    this.data = data;
  }
}
