function Scope() {
    this.ids = [];
}
Scope.prototype.constructor = Scope;

Scope.prototype.addId = function (newId) {
    // look for id in already added
    var index = this.ids.indexOf(newId);

    // if not found, add
    if (index == -1) {
        this.ids.push(newId);
    }

    // sort
    this.ids.sort();
};

Scope.prototype.size = function () {
    return this.ids.length;
};

Scope.prototype.indexOf = function (id) {
    return this.ids.indexOf(id);
};

module.exports = Scope;