var Gallery = Gallery || {};

var key = 'XtnjbBbOkULcb7ePVhDNvEEjpCvx7vIm';
var endpoint = 'http://www.behance.net/v2';
var user = '/users/dreampilot/'

Gallery.Project = function (data) {
    this.name = m.prop(data.name);
    this.thumbnail = m.prop(data.thumbnail);
    this.fields = m.prop(data.fields);
    this.id = m.prop(data.id);
};

Gallery.projectList = Array; // projects collection

function getBe(url, callback) {
    $.ajax(url, {
        //crossDomain: true,
        crossDomain: false,
        dataType: 'json'
        //dataType: 'jsonp'
    }).error(function (xhr, status, error) {
        return alert(error.message);
    }).success(callback);
}

// Gallery View-Model
Gallery.vm = {};
Gallery.vm.init = function () {
    this.list = new Gallery.projectList();
    this.add = function (obj) {
        this.list
            .push(new Gallery.Project({
                "name": obj.name,
                "thumbnail": obj.covers['202'],
                "fields": obj.fields,
                "id": obj.id
            }));
    }.bind(this);
}

//ctlr
Gallery.controller = function () {
    Gallery.vm.init();
}

//use default mode
m.route.mode = "hash";

Gallery.view = function () {
    return m('div#thumbnails', [
        m('div', [
            Gallery.vm.list.map(function (project) {
                return m('div', {class: 'col-xs-6 col-md-3 col-sm-6'}, [
                    m('a', {
                        class: 'thumbnail',
                        href: '#/project/' + project.id(),
                        //config: m.route
                    }, [
                        m('img', {'src': project.thumbnail()}),
                        m('div', {class: 'my-caption'}, [
                            m('p', [
                                m('span', project.name()),
                                m('br'),
                                m('span', [
                                    project.fields().map(function (p) {
                                        return m('em', function () {
                                            return p ? '/' + p + '/' : ' '
                                        }())
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

//manually initialize ctlr
Gallery.controller();

// get Behance data for thumbnail Gallery display
getBe('./scripts/projects.json', function(data){
    //console.log(data)
    data.projects.map(function (e) {
        Gallery.vm.add(e);
    });
    m.render(document.querySelector('#main'), Gallery.view());
});

var Project = Project || {};
Project.module = function (data) {
    //this.name = m.prop(data.name);
    //this.thumbnail = m.prop(data.thumbnail);
    //this.fields = m.prop(data.fields);
    //this.id = m.prop(data.id);
};

Project.moduleList = Array; // project modules collection, what behance calls each sub-section of the project

// Porject View-Model
Project.vm = {};
Project.vm.init = function () {
    this.modules = new Project.moduleList();
    this.add = function (obj) {
        this.modules
            .push(new Project.module({
                "name": obj.name,
                "thumbnail": obj.covers['202'],
                "fields": obj.fields,
                "id": obj.id
            }));
    }.bind(this);
}

//ctlr
Project.controller = function(){
    Project.vm.init();
    this.id = m.route.param("id");

};

Project.view = function(params){
    //console.log(id)
    var moduleData  = [];
    getProject(params.id, function(data){
        //console.log(data);
        data.project.modules.forEach(function(m){
            moduleData.push(m);
        });
        console.log(moduleData)
    })

    return m("h1", "test " + params.id)
}

m.route(document.querySelector('#main'), "/", {
    "/" : Gallery,
    "/project/:id": Project
});

function getProject(id, callback){
    $.ajax('./scripts/project.json', {
        //crossDomain: true,
        crossDomain: false,
        dataType: 'json'
        //dataType: 'jsonp'
    }).error(function (xhr, status, error) {
        return alert(error.message);
    }).success(callback);
}


