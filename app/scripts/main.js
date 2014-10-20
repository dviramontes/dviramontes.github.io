//(function(global){

"use strict";

var key = 'XtnjbBbOkULcb7ePVhDNvEEjpCvx7vIm';
var endpoint = 'http://www.behance.net/v2/users/dreampilot';

var Gallery = {}; // ns

Gallery.projectList = Array; // collection

Gallery.Project = function (data) {
	this.name = data.name;
};

// Gallery View-Model
Gallery.viewModel = {};
Gallery.viewModel.init = function () {
	this.list = new Gallery.projectList();
	this.add = function (name) {
		this.list.push(new Gallery.Project({"name": name}));
	}.bind(this);
}

Gallery.viewModel.init();

//ctlr
Gallery.controller = function () {
	Gallery.viewModel.init();
}

// list view
Gallery.listView = function () {
	return m('div#listview',[
		m('ul', [
			Gallery.viewModel.list.map(function (project, index) {
				return m('li', [
					m('a[href=#' + project.name + ']' , project.name)
				])
			})
		])
	]);

}

//$.ajax(endpoint + '/projects?' + 'api_key=' + key, {
$.ajax('./scripts/projects.json', {
	crossDomain: false,
	//dataType: 'jsonp'
	dataType: 'json'
}).error(function (xhr, status, error) {
	return alert(error.message);
}).success(withData);

function withData(data) { // process jsonp callback
	console.info(data['http_code']);
	data.projects.map(function (e) {
		console.log(e.name)
		Gallery.viewModel.add(e.name);
	});

	//Gallery.viewModel.init();

	console.log(Gallery.viewModel.list.length)

	m.render(document.body.querySelector('#listview'), Gallery.listView());
	//m.module(document, Gallery);
}


//})(this);


