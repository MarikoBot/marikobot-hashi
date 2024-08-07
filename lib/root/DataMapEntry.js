"use strict";
/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   DataMapEntry.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ehosta <ehosta@student.42lyon.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/27 20:08:01 by ehosta            #+#    #+#             */
/*   Updated: 2024/07/28 16:12:48 by ehosta           ###   ########.fr       */
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
exports.DataMapEntry = void 0;
const base_1 = require("../base/");
const decorators_1 = require("../decorators");
/**
 * The base class that represents a data map class object.
 * Every object into the data map will be passed in this class to improve manipulation.
 */
class DataMapEntry {
    /**
     * The data map.
     */
    dataMap;
    /**
     * The data.
     */
    data;
    /**
     * The constructor of a data map entry.
     * @param dataMap The data map.
     * @param data The data.
     */
    constructor(dataMap, data) {
        this.dataMap = dataMap;
        this.data = data;
    }
}
exports.DataMapEntry = DataMapEntry;
__decorate([
    decorators_1.ObjectDeepValidator.IsInstanceOf(base_1.DataMap),
    __metadata("design:type", base_1.DataMap)
], DataMapEntry.prototype, "dataMap", void 0);
