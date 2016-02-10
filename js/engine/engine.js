var getParser = require('../parsing/parser'),
    path = require('path'),
    sprintf = require('sprintfjs'),
    Combinatronics = require('js-combinatorics'),
    _ = require('lodash');


function Engine() {
    // init parser
    this.jison_path = '../parsing/prop_parser.jison';
    var parser = getParser(this.jison_path);
    if (parser == null) {
        console.log(sprintf("Error opening parser: %s", this.jison_path).red);
        exit();
    }
    this.parser = parser;
}
Engine.prototype.constructor = Engine;


Engine.prototype.parse = function (expr) {
    return this.parser.parse(expr);
};


Engine.prototype.eval = function (expr) {
    var ast;
    if (typeof(expr) == 'string') {
        // parse expresion
        ast = this.parse(expr);
    } else if (typeof(expr) == 'object' && expr.ast != null && expr.scope != null) {
        ast = expr;
    } else return null;

    // get all permutations for the given ids
    var perms = this.cartesian(ast.scope);

    return _.map(perms, (perm) => {
        return this._reval(ast, perm);
    });
};

Engine.prototype._reval = function (ast, perm) {
    if (ast.ast.type == 'NegationOperation') {
        return !this._reval({ast: ast.ast.val, scope: ast.scope}, perm);
    }

    if (ast.ast.type == 'Closure') {
        return this._reval({ast: ast.ast.val, scope: ast.scope}, perm);
    }

    if (ast.ast.type == 'ThenOperation') {
        // use logical equiv p -> q === ~p v q
        var p = this._reval({ast: ast.ast.left, scope: ast.scope}, perm),
            q = this._reval({ast: ast.ast.right, scope: ast.scope}, perm);
        //console.log(sprintf("ThenOperation: p:%s -> q:%s === %s", p, q, !p || q));
        return (!p || q);
    }

    if (ast.ast.type == 'AndOperation') {
        var p = this._reval({ast: ast.ast.left, scope: ast.scope}, perm),
            q = this._reval({ast: ast.ast.right, scope: ast.scope}, perm);
        //console.log(sprintf("AndOperation: p:%i q:%i === %i", p, q, p && q));
        return (p && q);
    }

    if (ast.ast.type == 'OrOperation') {
        var p = this._reval({ast: ast.ast.left, scope: ast.scope}, perm),
            q = this._reval({ast: ast.ast.right, scope: ast.scope}, perm);
        return (p || q);
    }

    if (ast.ast.type == 'Variable') {
        var index = ast.scope.indexOf(ast.ast.val);
        if (index == -1) {
            console.log(sprintf("Error: lookup failed for id %s", ast.ast.val).red);
            return null;
        }
        return perm[index];
    }

    console.log(sprintf("Error: ast node %s not implemented, exiting", ast.ast.type));
    exit();
};

Engine.prototype.cartesian = function (scope) {
    // baseN of all the combination
    var toReverse = Combinatronics.baseN([true, false], scope.size()).toArray();

    // reverse all
    return _.map(toReverse, function (i) {
        return _.reverse(i);
    });
};
module.exports = Engine;