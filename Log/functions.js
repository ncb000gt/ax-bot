function log_line(line) {
    app.log('scope: ' + this);
    app.log('_parent: ' + this._parent);
    var val = '';
    if (!(this.stream)) {
	app.log('no content');
	val = '' + line;
	app.log('after val');
    } else {
	val = this.stream + '\n' + line;
    }
    app.log('val set');
    this.stream = val;
    app.log('stream set');
}