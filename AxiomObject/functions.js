function breadcrumbs() {
    var crumbs = [];

    var p = this;
    while ((p = p._parent) != null && (!(p instanceof Root))) {
	crumbs.push(p);
    }

    return crumbs.reverse();
}