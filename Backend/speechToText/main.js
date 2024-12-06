"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var assemblyai_1 = require("assemblyai");
var ws_1 = require("ws");
require("dotenv").config();
var run = function () { return __awaiter(void 0, void 0, void 0, function () {
    var client, SAMPLE_RATE, BUFFER_SIZE, transcriber, isAssemblyAIReady, wss, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!process.env.NEXT_PUBLIC_ASSEMBLYAI_API_KEY) {
                    throw new Error("Missing ASSEMBLY_AI_API environment variable");
                }
                client = new assemblyai_1.AssemblyAI({
                    apiKey: process.env.NEXT_PUBLIC_ASSEMBLYAI_API_KEY,
                });
                SAMPLE_RATE = 16000;
                BUFFER_SIZE = 4096;
                transcriber = client.realtime.transcriber({
                    sampleRate: SAMPLE_RATE,
                });
                isAssemblyAIReady = false;
                wss = new ws_1.WebSocketServer({
                    port: 8080,
                    perMessageDeflate: false,
                    maxPayload: 1024 * 1024,
                });
                // Thiết lập các listeners cho transcriber
                transcriber.on("open", function (_a) {
                    var sessionId = _a.sessionId;
                    console.log("AssemblyAI Session opened with ID: ".concat(sessionId));
                    isAssemblyAIReady = true;
                    console.log("isAssemblyAIReady set to:", isAssemblyAIReady);
                });
                transcriber.on("error", function (error) {
                    console.error("AssemblyAI Error:", error);
                    isAssemblyAIReady = false;
                });
                transcriber.on("transcript", function (data) {
                    wss.clients.forEach(function (client) {
                        if (client.readyState === WebSocket.OPEN) {
                            client.send(JSON.stringify({
                                text: data.text,
                                isFinal: false,
                            }));
                        }
                    });
                });
                transcriber.on("transcript.final", function (data) {
                    wss.clients.forEach(function (client) {
                        if (client.readyState === WebSocket.OPEN) {
                            client.send(JSON.stringify({
                                text: data.text,
                                isFinal: true,
                            }));
                        }
                    });
                });
                // Handle reconnection logic
                transcriber.on("close", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var error_2;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                console.log("AssemblyAI connection closed");
                                isAssemblyAIReady = false;
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, transcriber.connect()];
                            case 2:
                                _a.sent();
                                console.log("Reconnected to AssemblyAI");
                                isAssemblyAIReady = true;
                                return [3 /*break*/, 4];
                            case 3:
                                error_2 = _a.sent();
                                console.error("Failed to reconnect to AssemblyAI:", error_2);
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); });
                // Thiết lập WebSocket server
                wss.on("connection", function (ws) {
                    console.log("Client connected");
                    ws.on("message", function (message) { return __awaiter(void 0, void 0, void 0, function () {
                        var arrayBuffer, float16Array, error_3;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!isAssemblyAIReady) {
                                        console.log("Waiting for AssemblyAI connection...");
                                        return [2 /*return*/];
                                    }
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 3, , 4]);
                                    arrayBuffer = message instanceof Buffer
                                        ? message.buffer.slice(message.byteOffset, message.byteOffset + message.byteLength)
                                        : message;
                                    float16Array = new Int16Array(arrayBuffer);
                                    return [4 /*yield*/, transcriber.sendAudio(float16Array.buffer)];
                                case 2:
                                    _a.sent();
                                    return [3 /*break*/, 4];
                                case 3:
                                    error_3 = _a.sent();
                                    console.error("Error sending audio:", error_3);
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); });
                    ws.on("close", function () {
                        console.log("Client disconnected");
                    });
                });
                console.log("WebSocket server is running on ws://localhost:8080");
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, transcriber.connect()];
            case 2:
                _a.sent();
                console.log("Initially connected to AssemblyAI");
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.error("Initial connection to AssemblyAI failed:", error_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
run().catch(function (error) {
    console.error("Error running the application:", error);
});
