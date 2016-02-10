var colors = require('colors'),
    path = require('path'),
    sprintf = require('sprintfjs'),
    Engine = require(path.join(__dirname, "engine/engine"));


function main() {
    var engine = new Engine();
    var test = '~(a -> (c ^ b))';
    var parsed = engine.parse(test);
    console.log("EXPR:", test.yellow);
    console.log("AST:", JSON.stringify(parsed, null, 2).yellow);
    console.log("PERMS:", JSON.stringify(engine.cartesian(parsed.scope)).yellow);
    console.log("EVAL:", JSON.stringify(engine.eval(parsed)).yellow);
}
main();