import { DataMap, TypedDataMapStored } from '../base/';
/**
 * The base class that represents a data map class object.
 * Every object into the data map will be passed in this class to improve manipulation.
 */
export declare class DataMapEntry<DataStructure extends TypedDataMapStored> {
    /**
     * The data map.
     */
    readonly dataMap: DataMap<DataStructure>;
    /**
     * The data.
     */
    readonly data: DataStructure;
    /**
     * The constructor of a data map entry.
     * @param dataMap The data map.
     * @param data The data.
     */
    constructor(dataMap: DataMap<DataStructure>, data: DataStructure);
}
