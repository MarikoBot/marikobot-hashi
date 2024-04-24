"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggerModes = exports.bitRecord = exports.COMMAND_END = void 0;
/**
 * The value that is returned when the command is finished.
 */
var COMMAND_END;
(function (COMMAND_END) {
    /**
     * When the command terminates goodly.
     */
    COMMAND_END[COMMAND_END["SUCCESS"] = 0] = "SUCCESS";
    /**
     * When the command did not terminate.
     */
    COMMAND_END[COMMAND_END["ERROR"] = 1] = "ERROR";
    /**
     * When the command terminates but with some problems that occurred in the process.
     */
    COMMAND_END[COMMAND_END["ISSUED"] = 2] = "ISSUED";
})(COMMAND_END || (exports.COMMAND_END = COMMAND_END = {}));
/**
 * The bits value for each command privileges key.
 */
exports.bitRecord = {
    forbiddenUsers: '0b10000000',
    uniqueUsers: '0b1000000',
    forbiddenGuilds: '0b100000',
    uniqueGuilds: '0b10000',
    forbiddenRoles: '0b1000',
    uniqueRoles: '0b100',
    forbiddenChannels: '0b10',
    uniqueChannels: '0b1',
};
/**
 * The list of mode-colors for logging assets.
 */
exports.loggerModes = ['error', 'success', 'warning', 'info', 'debug', 'test', 'clean'];
