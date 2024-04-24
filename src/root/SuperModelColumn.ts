import { SchemaDefinitionProperty, SchemaDefinitionWithBuiltInClass, Types } from 'mongoose';
import { InstanceValidator, Validators } from '../decorators';

/**
 * The class that represents a column into a SuperModel instance.
 */
export class SuperModelColumn<
  T extends SchemaDefinitionProperty | SchemaDefinitionWithBuiltInClass<any> | 'MongooseId',
> {
  /**
   * The data of the column. This property is used to store the mongoose schema definition without editing the
   * "possible" already existing properties.
   */
  @(<InstanceValidator>Validators.ObjectValidator.Matches)
  public readonly data: SchemaDefinitionProperty | SchemaDefinitionWithBuiltInClass<T>;

  /**
   * The default value for the column.
   */
  public readonly defaultValue: any = 'None';

  /**
   * @param schemaColumnProperty The list of properties.
   * @param defaultValue The default value for the column (if empty, replaced with "None"). Different from the
   * mongoose default, this one is not written into the database, just as a filler when the data is returned.
   */
  constructor(
    schemaColumnProperty: SchemaDefinitionProperty | SchemaDefinitionWithBuiltInClass<T> | 'MongooseId',
    defaultValue: any = 'None',
  ) {
    if (schemaColumnProperty === 'MongooseId')
      this.data = {
        type: Types.ObjectId,
        default: () => new Types.ObjectId(),
        unique: true,
      };
    else this.data = schemaColumnProperty;

    this.defaultValue = defaultValue;
  }
}
