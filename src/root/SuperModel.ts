import { Document, model, Model, Schema, SchemaDefinition, SchemaDefinitionProperty } from 'mongoose';
import { InstanceValidator, InstanceValidatorReturner, Validators } from '../decorators';
import { Placeholder, StructureColumnOrChild, SuperModelColumn } from './';

/**
 * The class that combines a model and a schema.
 */
export class SuperModel {
  /**
   * The list of the columns of the collection.
   */
  @((<InstanceValidatorReturner>Validators.ObjectValidator.KeySuperModelColumnPair)(SuperModelColumn))
  public columns: StructureColumnOrChild = {};

  /**
   * The model class content.
   */
  @((<InstanceValidatorReturner>Validators.ObjectValidator.KindOfInstance)(Model, Placeholder))
  public readonly model: Model<SchemaDefinition & Document>;

  /**
   * The schema class content.
   */
  @((<InstanceValidatorReturner>Validators.ObjectValidator.KindOfInstance)(Schema, Placeholder))
  public readonly schema: Schema<SchemaDefinition>;

  /**
   * The model name (the name of the collection).
   */
  @(<InstanceValidator>Validators.StringValidator.ValidId)
  public readonly name: string = 'default';

  /**
   * The structure of the model.
   */
  @(<InstanceValidator>Validators.ObjectValidator.Matches)
  public structure: { [p: string]: SchemaDefinitionProperty };

  /**
   * The default values of the model.
   */
  @(<InstanceValidator>Validators.ObjectValidator.Matches)
  public defaultValues: { [p: string]: any };

  /**
   * The default columns loading fonction of the model.
   * @returns Nothing.
   */
  @Validators.FunctionValidator.Matches
  public onLoaded(): void | object {
    return void 0;
  }

  /**
   * @param name The name of the model.
   */
  constructor(name: string) {
    this.name = name;

    const loaded: void | object = this.onLoaded();
    if (loaded) this.columns = <StructureColumnOrChild>loaded;

    this.structure = SuperModel.diveObject(this.columns, 'data');
    this.defaultValues = SuperModel.diveObject(this.columns, 'defaultValue');

    this.schema = new Schema<typeof this.structure>(this.structure, this.defaultValues);
    this.model = model<SchemaDefinition & Document & typeof this.structure>(this.name, this.schema);
  }

  /**
   * Generates a new object based on the property you chose to take into the current instance-value.
   * @param obj The object to dive in.
   * @param propertyName The name of the property to take into the value. If it is empty, the function won't touch the source.
   * @returns An object (the finale one or a child).
   */
  private static diveObject(obj: object, propertyName?: string) {
    obj = Object.assign({}, obj);
    if ('data' in obj && ('type' in obj || 'defaultValue' in obj)) return propertyName ? obj[propertyName] : obj;

    if (typeof obj === 'object' && typeof obj !== 'string') {
      const result: object = {};

      for (const key in obj) result[key] = SuperModel.diveObject(obj[key], propertyName ?? undefined);

      return result;
    }

    return obj;
  }
}
