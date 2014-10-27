//(function (global) {
////////////////////
//////GALLERY NS///

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

    function getProject(id, callback) {
        //$.ajax('./scripts/project.json', {
        $.ajax(endpoint + '/projects/' + id + '?api_key=' + key, {
            crossDomain: true,
            //crossDomain: false,
            //dataType: 'json'
            dataType: 'jsonp'
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
    getBe('./scripts/projects.json', function (data) {
        data.projects.map(function (e) {
            Gallery.vm.add(e);
        });
        m.render(document.querySelector('#main'), Gallery.view());
    });

    ////////////////////
    //////PROJECT NS///

    var Project = Project || {};

    Project.name = function () {
        this.name = m.prop();
    }

    Project.imgModule = function (data) {
        this.src = m.prop(data.src);
        this.width = m.prop(data.width);
        this.height = m.prop(data.height);
    };

    Project.txtModule = function (data) {
        this.html = m.prop(data.text);
    };

    Project.videoModule = function (data) {
        this.embed = m.prop(data.embed);
    };

    Project.moduleList = Array; // project modules collection, what behance calls each sub-section of the project


    Project.vm = {};
    Project.vm.init = function () {
        this.imgModules = new Project.moduleList();
        this.txtModules = new Project.moduleList();
        this.videoModules = new Project.moduleList();

        this.addImageModule = function (obj) {
            this.imgModules
                .push(new Project.imgModule(obj));
        }.bind(this);

        this.addTextModule = function (obj) {
            this.txtModules
                .push(new Project.txtModule(obj));
        }.bind(this);

        this.addVideoModule = function (obj) {
            this.videoModules
                .push(new Project.videoModule(obj));
        }.bind(this);
    }

    Project.controller = function () {
        Project.vm.init();
        this.id = m.route.param("id");
        getProject(this.id, function (data) {
            //Project.name(data.project.name);
            data.project.modules.map(function (m) {
                console.log(m)
                if (m.type === 'image') Project.vm.addImageModule(m);
                if (m.type === 'text')  Project.vm.addTextModule(m);
                if (m.type === 'embed')  Project.vm.addVideoModule(m);
            });
            m.render(document.querySelector('#main'), Project.view());
        });
    };

    Project.view = function (params) {
        return m("div", {class:"col-lg-6 module"},[
            Project.vm.txtModules.map(function (e) {
                return m('div', m.trust(e.html()));
            }),
            Project.vm.imgModules.map(function (e) {
                return m('img', {
                    src: e.src(),
                    width: e.width(),
                    height: e.height()
                })
            }),
            Project.vm.videoModules.map(function (e) {
                return m('div', m.trust(e.embed()));
            }),
        ]);

    }

    m.route(document.querySelector('#main'), "/", {
        "/": Gallery,
        "/project/:id": Project
    });

//})(this);
