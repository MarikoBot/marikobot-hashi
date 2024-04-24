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
exports.BaseClient = void 0;
const decorators_1 = require("../decorators/");
const root_1 = require("../root");
/**
 * Represents the base class for each class of the package base.
 */
class BaseClient {
    client;
    /**
     * Initialize the base class, and, if needed, the client instance.
     * @param client The client instance.
     */
    constructor(client) {
        this.client = client;
    }
}
exports.BaseClient = BaseClient;
__decorate([
    (decorators_1.Validators.ObjectValidator.IsInstanceOf(root_1.Client)),
    __metadata("design:type", root_1.Client)
], BaseClient.prototype, "client", void 0);
