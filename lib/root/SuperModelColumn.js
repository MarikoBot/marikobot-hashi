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
exports.SuperModelColumn = void 0;
const mongoose_1 = require("mongoose");
const decorators_1 = require("../decorators");
/**
 * The class that represents a column into a SuperModel instance.
 */
class SuperModelColumn {
    /**
     * The data of the column. This property is used to store the mongoose schema definition without editing the
     * "possible" already existing properties.
     */
    data;
    /**
     * The default value for the column.
     */
    defaultValue = 'None';
    /**
     * @param schemaColumnProperty The list of properties.
     * @param defaultValue The default value for the column (if empty, replaced with "None"). Different from the
     * mongoose default, this one is not written into the database, just as a filler when the data is returned.
     */
    constructor(schemaColumnProperty, defaultValue = 'None') {
        if (schemaColumnProperty === 'MongooseId')
            this.data = {
                type: mongoose_1.Types.ObjectId,
                default: () => new mongoose_1.Types.ObjectId(),
                unique: true,
            };
        else
            this.data = schemaColumnProperty;
        this.defaultValue = defaultValue;
    }
}
exports.SuperModelColumn = SuperModelColumn;
__decorate([
    decorators_1.Validators.ObjectValidator.Matches,
    __metadata("design:type", Object)
], SuperModelColumn.prototype, "data", void 0);
