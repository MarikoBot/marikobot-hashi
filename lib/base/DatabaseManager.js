"use strict";
/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   DatabaseManager.ts                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ehosta <ehosta@student.42lyon.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/27 20:04:50 by ehosta            #+#    #+#             */
/*   Updated: 2024/07/28 15:18:30 by ehosta           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */
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
exports.DatabaseManager = void 0;
const mongoose_1 = require("mongoose");
const _1 = require("./");
const decorators_1 = require("../decorators");
const root_1 = require("../root");
/**
 * The class who manages the database of the project.
 */
class DatabaseManager extends _1.BaseClient {
    /**
     * The database name. Not useful to change it (only for MongoDB). Default: main.
     */
    dbName;
    /**
     * The connection URI.
     */
    connectionURI;
    /**
     * The options for the connection.
     */
    connectOptions;
    /**
     * The list of dataMaps.
     */
    dataMaps = {};
    /**
     * The list of dataMaps constructor waiting for being initialized.
     */
    sleepingSuperModels = [];
    /**
     * Build and save a data map.
     * @param name The name of the collection.
     */
    createDataMap(name) {
        const dataMap = new _1.DataMap(this.client, name);
        this.dataMaps[name] = dataMap;
        return dataMap;
    }
    /**
     * Connect the database to the mongodb cluster.
     * @param connectionURI The connection URI.
     * @param connectOptions The connection options.
     */
    async connect(connectionURI = this.connectionURI, connectOptions = { dbName: this.dbName }) {
        if (connectionURI)
            this.connectionURI = connectionURI;
        if (connectOptions)
            this.connectOptions = connectOptions;
        await (0, mongoose_1.connect)(this.connectionURI, this.connectOptions);
    }
    // noinspection JSUnusedGlobalSymbols
    /**
     * The decorator to inject metadata into the constructor of an extension of SuperModel.
     * @param name The name of the super-SuperModel.
     * @param columns The columns object.
     * @returns The decorator.
     */
    inject(name, columns) {
        new _1.Logger().log('info', `Bound model: ${name}`);
        this.dataMaps[name] = new _1.DataMap(this.client, name);
        this.createDataMap(name);
        const superModel = new root_1.SuperModel(name, columns);
        this.dataMaps[name].definition = superModel;
        return superModel;
    }
    /**
     * Get a table and its model.
     * @param name The name of the table.
     * @returns The model of the table.
     */
    get(name) {
        const table = this.dataMaps[name];
        if (!table)
            return null;
        return table.definition.model;
    }
}
exports.DatabaseManager = DatabaseManager;
__decorate([
    decorators_1.StringValidator.ValidId,
    __metadata("design:type", String)
], DatabaseManager.prototype, "dbName", void 0);
__decorate([
    decorators_1.StringValidator.NotEmpty,
    __metadata("design:type", String)
], DatabaseManager.prototype, "connectionURI", void 0);
__decorate([
    decorators_1.ObjectValidator.Matches,
    __metadata("design:type", Object)
], DatabaseManager.prototype, "connectOptions", void 0);
__decorate([
    decorators_1.ObjectDeepValidator.KeyDataMapPair(_1.DataMap),
    __metadata("design:type", Object)
], DatabaseManager.prototype, "dataMaps", void 0);
__decorate([
    decorators_1.ArrayDeepValidator.OnlyConstructorOf(root_1.SuperModel),
    __metadata("design:type", Array)
], DatabaseManager.prototype, "sleepingSuperModels", void 0);
