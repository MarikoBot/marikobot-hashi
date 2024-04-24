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
import { SchemaDefinitionProperty, SchemaDefinitionWithBuiltInClass } from 'mongoose';
/**
 * The class that represents a column into a SuperModel instance.
 */
export declare class SuperModelColumn<T extends SchemaDefinitionProperty | SchemaDefinitionWithBuiltInClass<any> | 'MongooseId'> {
    /**
     * The data of the column. This property is used to store the mongoose schema definition without editing the
     * "possible" already existing properties.
     */
    readonly data: SchemaDefinitionProperty | SchemaDefinitionWithBuiltInClass<T>;
    /**
     * The default value for the column.
     */
    readonly defaultValue: any;
    /**
     * @param schemaColumnProperty The list of properties.
     * @param defaultValue The default value for the column (if empty, replaced with "None"). Different from the
     * mongoose default, this one is not written into the database, just as a filler when the data is returned.
     */
    constructor(schemaColumnProperty: SchemaDefinitionProperty | SchemaDefinitionWithBuiltInClass<T> | 'MongooseId', defaultValue?: any);
}
