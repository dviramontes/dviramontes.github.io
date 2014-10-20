var Gallery = Gallery || {}; // ns

//(function(global){

"use strict";

var key = 'XtnjbBbOkULcb7ePVhDNvEEjpCvx7vIm';
var endpoint = 'http://www.behance.net/v2';
var user = '/users/dreampilot/'



Gallery.projectList = Array; // collection

Gallery.Project = function (data) {
	this.name = m.prop(data.name);
	this.thumbnail = m.prop(data.thumbnail);
	this.fields = m.prop(data.fields);
};

// Gallery View-Model
Gallery.viewModel = {};
Gallery.viewModel.init = function () {
	this.list = new Gallery.projectList();
	this.add = function (obj) {
		this.list
			.push(new Gallery.Project({
				"name": obj.name,
				"thumbnail": obj.covers['202'],
				"fields" : obj.fields
			}));
	}.bind(this);
}

//ctlr
Gallery.controller = function () {
	Gallery.viewModel.init();
}

Gallery.controller();

// views
Gallery.listView = function () {
	return m('div#list-view',[
		m('p',[
			m('a[href="/"]',{config: m.route}, 'Gallery')
		]),
		m('ul', [
			Gallery.viewModel.list.map(function (project, index) {
				return m('li', [
					m('a[href=#' + project.name() + ']' , project.name())
				])
			})
		])
	]);
};



Gallery.thumbnailView = function () {
	return m('div#thumbnail-view',[
		m('div', [
			Gallery.viewModel.list.map(function (project, index) {
				return m('div', {class:'col-xs-6 col-md-3 col-sm-6'},[
					m('a',{class:'thumbnail',href:'#' + project.name()},[
						m('img', {'src' : project.thumbnail()}),
						m('div',{class:'my-caption'}, [
							m('p', [
								m('span',project.name()),
								m('br'),
								m('span',[
									project.fields().map(function(p){
										return m('em', p + ' / ')
									})
								])
							])
						])
					])
				])
			})
		])
	]);
};

function getBe(url, callback){
	$.ajax(url, {
		//crossDomain: true,
		crossDomain: false,
		dataType: 'json'
		//dataType: 'jsonp'
	}).error(function (xhr, status, error) {
		return alert(error.message);
	}).success(callback);
}

function buildGallery(data) { // process jsonp callback
	//console.info(data['http_code']);
	//console.debug(data.projects);
	data.projects.map(function (e) {
		//console.log(e)
		Gallery.viewModel.add(e);
	});

	//console.log(Gallery.viewModel.list.length)
	//console.log(Gallery.viewModel.list)

	m.render(
		document
			.querySelector('#list-view'), Gallery.listView()
	);

	m.render(
		document
			.querySelector('#thumbnail-view'), Gallery.thumbnailView()
	);
}

function buildProjectView(data){
	console.log(data)
}

// get Behance data
getBe('./scripts/projects.json', buildGallery);
//getBe(endpoint + '/' + user + 'projects?' + 'api_key=' + key, buildGallery);

// http://www.behance.net/v2/projects/20638661?api_key=XtnjbBbOkULcb7ePVhDNvEEjpCvx7vIm
getBe('./scripts/project.json', buildProjectView);
//getBe(endpoint + '/projects/' + 20615143 + '?api_key=' + key, buildProjectView);


//})(this);


