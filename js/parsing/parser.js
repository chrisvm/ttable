var path = require('path'),
    fs = require('fs'),
    jison = require('jison'),
    Scope = require('./scope');

function getParser(name) {
    var real_name = path.join(__dirname, name);
    var bnf = fs.readFileSync(real_name, 'utf8');
    if (bnf) {
        var parser = new jison.Parser(bnf);
        parser.yy = {};
        parser.yy.scope = new Scope();
        return parser;
    }
    return null;
}

module.exports = getParser;
