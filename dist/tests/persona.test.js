"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = __importDefault(require("../index"));
var max = null;
beforeEach(function () {
    var dogVocab = {
        greet: "{{#choose}}woof|bark|sniff sniff|wag tail{{/choose}}",
        annoy: "{{#choose}}whine=80|howl=12|beg=8{{/choose}}",
        inspect: "snifffff",
        master: "{{#params.name}}{{#capitalize}}{{params.name}}{{/capitalize}}{{/params.name}}{{^params.name}}bringer of food{{/params.name}}",
        emoji: "{{#choose}}👅|🐶|🐾|💩|🐩|🐕‍{{/choose}}",
        "welcome-home": "{{#capitalize}}{{>greet}}{{/capitalize}}! Welcome home, {{>master}}! {{>emoji}}"
    };
    max = new index_1.default(dogVocab);
});
test('it can say a concept', function () {
    var value = max.say("inspect");
    expect(value).toEqual("snifffff");
});
test('it will choose from possible options equally when articulating', function () {
    var value = max.say("greet");
    expect(["woof", "bark", "sniff sniff", "wag tail"]).toContain(value);
});
test('it will choose from possible options using weights when articulating', function () {
    var value = max.say("annoy");
    expect(["whine", "howl", "beg"]).toContain(value);
});
test('it will use param when provided', function () {
    var value = max.say("master", { "name": "justin" });
    expect(value).toBe("Justin");
});
