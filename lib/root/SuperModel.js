"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuperModel = void 0;
const mongoose_1 = require("mongoose");
const decorators_1 = require("../decorators");
const _1 = require("./");
/**
 * The class that combines a model and a schema.
 */
class SuperModel {
    /**
     * The list of the columns of the collection.
     */
    columns = {};
    /**
     * The model class content.
     */
    model;
    /**
     * The schema class content.
     */
    schema;
    /**
     * The model name (the name of the collection).
     */
    name = 'default';
    /**
     * The structure of the model.
     */
    structure;
    /**
     * The default values of the model.
     */
    defaultValues;
    /**
     * The default columns loading fonction of the model.
     * @returns Nothing.
     */
    onLoaded() {
        return void 0;
    }
    /**
     * @param name The name of the model.
     */
    constructor(name) {
        this.name = name;
        const loaded = this.onLoaded();
        if (loaded)
            this.columns = loaded;
        this.structure = SuperModel.diveObject(this.columns, 'data');
        this.defaultValues = SuperModel.diveObject(this.columns, 'defaultValue');
        this.schema = new mongoose_1.Schema(this.structure, this.defaultValues);
        this.model = (0, mongoose_1.model)(this.name, this.schema);
    }
    /**
     * Generates a new object based on the property you chose to take into the current instance-value.
     * @param obj The object to dive in.
     * @param propertyName The name of the property to take into the value. If it is empty, the function won't touch the source.
     * @returns An object (the finale one or a child).
     */
    static diveObject(obj, propertyName) {
        obj = Object.assign({}, obj);
        if ('data' in obj && ('type' in obj || 'defaultValue' in obj))
            return propertyName ? obj[propertyName] : obj;
        if (typeof obj === 'object' && typeof obj !== 'string') {
            const result = {};
            for (const key in obj)
                result[key] = SuperModel.diveObject(obj[key], propertyName ?? undefined);
            return result;
        }
        return obj;
    }
}
exports.SuperModel = SuperModel;
__decorate([
    (decorators_1.Validators.ObjectValidator.KeySuperModelColumnPair(_1.SuperModelColumn)),
    __metadata("design:type", Object)
], SuperModel.prototype, "columns", void 0);
__decorate([
    (decorators_1.Validators.ObjectValidator.KindOfInstance(mongoose_1.Model, _1.Placeholder)),
    __metadata("design:type", mongoose_1.Model)
], SuperModel.prototype, "model", void 0);
__decorate([
    (decorators_1.Validators.ObjectValidator.KindOfInstance(mongoose_1.Schema, _1.Placeholder)),
    __metadata("design:type", mongoose_1.Schema)
], SuperModel.prototype, "schema", void 0);
__decorate([
    decorators_1.Validators.StringValidator.ValidId,
    __metadata("design:type", String)
], SuperModel.prototype, "name", void 0);
__decorate([
    decorators_1.Validators.ObjectValidator.Matches,
    __metadata("design:type", Object)
], SuperModel.prototype, "structure", void 0);
__decorate([
    decorators_1.Validators.ObjectValidator.Matches,
    __metadata("design:type", Object)
], SuperModel.prototype, "defaultValues", void 0);
__decorate([
    decorators_1.Validators.FunctionValidator.Matches,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], SuperModel.prototype, "onLoaded", null);
