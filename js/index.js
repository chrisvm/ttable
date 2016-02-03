var colors = require('colors'),
    path = require('path'),
    parser = require(path.join(__dirname, "parsing/parser"));




function main() {
    if (parser == null) {
        console.log("error opening parser");
        return;
    }
    console.log(parser.parse('~(a->(b^c))'));
}
main();