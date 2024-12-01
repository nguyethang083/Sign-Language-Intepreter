"use strict";
// This code is a simplified and typed version adapted from the 'node-record-lpcm16' project by Gilles De Mey.
// Original source code: https://github.com/gillesdemey/node-record-lpcm16
Object.defineProperty(exports, "__esModule", { value: true });
exports.SoxRecording = void 0;
var assert_1 = require("assert");
var child_process_1 = require("child_process");
var stream_1 = require("stream");
var debug = !!process.env.DEBUG && process.env.DEBUG.indexOf("record") !== -1
    ? console.debug
    : function () { };
var SoxRecording = /** @class */ (function () {
    function SoxRecording(options) {
        if (options === void 0) { options = {}; }
        var defaults = {
            sampleRate: 16000,
            channels: 1,
            compress: false,
            threshold: 0.5,
            silence: "1.0",
            recorder: "sox",
            endOnSilence: false,
            audioType: "wav",
        };
        this.options = Object.assign(defaults, options);
        debug("Started recording");
        debug(this.options);
        return this.start();
    }
    SoxRecording.prototype.start = function () {
        var cmd = "sox";
        var args = [
            "--default-device",
            "--no-show-progress", // show no progress
            "--rate",
            this.options.sampleRate.toString(), // sample rate
            "--channels",
            this.options.channels.toString(), // channels
            "--encoding",
            "signed-integer", // sample encoding
            "--bits",
            "16", // precision (bits)
            "--type",
            this.options.audioType, // audio type
            "-", // pipe
        ];
        debug(" ".concat(cmd, " ").concat(args.join(" ")));
        var cp = (0, child_process_1.spawn)(cmd, args, {
            stdio: "pipe",
        });
        var rec = cp.stdout;
        var err = cp.stderr;
        this.process = cp; // expose child process
        this.soxStream = cp.stdout; // expose output stream
        cp.on("close", function (code) {
            if (code === 0)
                return;
            rec === null || rec === void 0 ? void 0 : rec.emit("error", "".concat(cmd, " has exited with error code ").concat(code, ".\n\nEnable debugging with the environment variable debug=record."));
        });
        err === null || err === void 0 ? void 0 : err.on("data", function (chunk) {
            debug("STDERR: ".concat(chunk));
        });
        rec === null || rec === void 0 ? void 0 : rec.on("data", function (chunk) {
            debug("Recording ".concat(chunk.length, " bytes"));
        });
        rec === null || rec === void 0 ? void 0 : rec.on("end", function () {
            debug("Recording ended");
        });
        return this;
    };
    SoxRecording.prototype.stop = function () {
        (0, assert_1.ok)(this.process, "Recording not yet started");
        this.process.kill();
    };
    SoxRecording.prototype.pause = function () {
        var _a;
        (0, assert_1.ok)(this.process, "Recording not yet started");
        this.process.kill("SIGSTOP");
        (_a = this.soxStream) === null || _a === void 0 ? void 0 : _a.pause();
        debug("Paused recording");
    };
    SoxRecording.prototype.resume = function () {
        var _a;
        (0, assert_1.ok)(this.process, "Recording not yet started");
        this.process.kill("SIGCONT");
        (_a = this.soxStream) === null || _a === void 0 ? void 0 : _a.resume();
        debug("Resumed recording");
    };
    SoxRecording.prototype.isPaused = function () {
        var _a;
        (0, assert_1.ok)(this.process, "Recording not yet started");
        return (_a = this.soxStream) === null || _a === void 0 ? void 0 : _a.isPaused();
    };
    SoxRecording.prototype.stream = function () {
        (0, assert_1.ok)(this === null || this === void 0 ? void 0 : this.soxStream, "Recording not yet started");
        return stream_1.Readable.toWeb(this === null || this === void 0 ? void 0 : this.soxStream);
    };
    return SoxRecording;
}());
exports.SoxRecording = SoxRecording;
