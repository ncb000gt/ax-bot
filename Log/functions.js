function log_line(line) {
    var val = '';
    if (!(this.stream)) {
	val = '' + line;
    } else {
	val = this.stream + '\n' + line;
    }
    this.stream = val;
}