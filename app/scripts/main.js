(function (global) {

    var Gallery = Gallery || {}; // ns

    var key = 'XtnjbBbOkULcb7ePVhDNvEEjpCvx7vIm';
    var endpoint = 'http://www.behance.net/v2';
    var user = '/users/dreampilot/';

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
    };

    Project.controller = function () {
        Project.vm.init();
        this.id = m.route.param("id");
        getProject(this.id, function (data) {
            //Project.name(data.project.name);
            data.project.modules.map(function (m) {
                if (m.type === 'image') Project.vm.addImageModule(m);
                if (m.type === 'text')  Project.vm.addTextModule(m);
                if (m.type === 'embed') Project.vm.addVideoModule(m);
            });
            m.render(document.querySelector('#main'), Project.view());
        });
    };

    Project.view = function (params) {
        return m("div", {class:"col-lg-6 col-sm-12 col-xs-12 module"},[
            Project.vm.txtModules.map(function (e) {
                return m('div', m.trust(e.html()));
            }),
            Project.vm.imgModules.map(function (e) {
                return m('img', {
                    src: e.src(),
                    class : 'img-responsive',
                    width: e.width(),
                    height: e.height()
                })
            }),
            Project.vm.videoModules.map(function (e) {
                return m('div',m.trust(e.embed()));
            })
        ]);

    };

    //<div class="col-lg-6">
    //<div class="jumbotron">
    //<h1>Hi</h1>
    //<p class="lead">My name is David A. Viramontes and sometimes I use the mon·i·ker:
    //    <em>dreamPilot</em>. I use the web as my idea-<a href="http://www.matrixsynth.com/">syntheziser</a>
    //to <a href="https://www.behance.net/dreamPilot">draw</a>, <a href="http://cycling74.com">patch</a>
    //<a href="https://soundcloud.com/dreampilot"> noise</a> and write <a href="https://github.com/dviramontes">code</a>.
    //<a href="http://lambda-the-ultimate.org"> I love programming languages</a> and right now i'm a big fan of <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript">JavaScript</a>
    //and <a href="https://github.com/clojure/clojurescript">ClojureScript</a>. If you any of that sounds interesting to you, don't hesitate to <a href="mailto:dviramontes@gmail.com">to get in touch</a>.
    //</p>
    //</div>
    //</div>

    m.route(document.querySelector('#main'), "/", {
        "/": Gallery,
        "/project/:id": Project,
        "/about" : {
            controller: function(){
                m.render(document.querySelector('#main'), this.view());
            },
            view : function(){
                return m('div', {class:"col-lg-6"},[
                  m('div', {class:"jumbotron"},[
                      m('h1', "Hi")
                  ])
                ])
            }
        }
    });

})(this);
