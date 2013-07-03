describe( "VizGrimoireJS library", function () {    
    beforeEach(function() {
        waitsFor(function() {
            return Report.check_data_loaded();
        }, "It took too long to load data", 100);
      });
    
    describe( "Report", function () {
        it("data files should be loaded", function () {
            waitsFor(function() {
                return Report.check_data_loaded();
            }, "It took too long to load data", 100);
            runs(function() {
                expect(Report.check_data_loaded()).toBeTruthy();
            });
        });
        
        var blocks = ["navigation","refcard","header","footer"];
        it(blocks.join() + " should be loaded from file", function () {
            runs(function() {
                $.each(blocks, function(index, value) {buildNode(value);});
                $.each(blocks, function(index, value) {
                    Report.getBasicDivs()[value].convert();});
            });
            waitsFor(function() {
                var loaded = document.getElementsByClassName('info-pill');
                return (loaded.length > 1);
            }, "It took too long to convert " + blocks.join(), 500);
            runs(function() {
                $.each(blocks, function(index, value) {
                    expect(document.getElementById(value).childNodes.length)
                    .toBeGreaterThan(0);});
            });
        });
        
        describe( "html report should be converted", function () {        
            it("html envision should be displayed", function () {
                runs(function() {
                    $.each(Report.getDataSources(), function(index, DS) {
                        buildNode(DS.getName()+"-envision");
                    });
                    Report.convertEnvision();
                    var envisionCreated = document.getElementsByClassName
                        ('envision-visualization');
                    expect(envisionCreated.length).toEqual
                        (Report.getDataSources().length);
                });        
            });
            it("html flotr2 should be displayed", function () {
                runs(function() {
                    $.each(Report.getDataSources(), function(index, DS) {
                        $.each(DS.getMetrics(), function(i, metric) {
                            buildNode(metric.divid+"-flotr2");
                        });
                    });
                    Report.convertFlotr2();
                    $.each(Report.getDataSources(), function(index, DS) {
                        $.each(DS.getMetrics(), function(i, metric) {
                            expect(document.getElementById("flotr2_"+i)
                                    .childNodes.length).toBeGreaterThan(0);
                        });
                    });
                        
                });        
            });
            it("html top should be displayed", function () {               
                runs(function() {
                    $.each(Report.getDataSources(), function(index, DS) {
                        buildNode(DS.getName()+"-top");
                        buildNode(DS.getName()+"-top-pie");
                        buildNode(DS.getName()+"-top-bars");
                    });
                    Report.convertTop();
                });
                // TODO: JSON files for top should be loaded. 
                //       Change this load to global data loading
                waitsFor(function() {
                    return (document.getElementById("its-top-bars")
                    .childNodes.length > 0);
                }, "It took too long to load data", 100);
                runs(function() {
                    $.each(Report.getDataSources(), function(index, DS) {
                        if (DS.getName() === "mls") return;
                        expect(document.getElementById(DS.getName()+"-top")
                                .childNodes.length).toBeGreaterThan(0);
                        expect(document.getElementById(DS.getName()+"-top-pie")
                                .childNodes.length).toBeGreaterThan(0);
                        expect(document.getElementById(DS.getName()+"-top-bars")
                                .childNodes.length).toBeGreaterThan(0);
                    });
                });        
            });
            it("html bubbles should be displayed", function () {
                runs(function() {
                    $.each(Report.getDataSources(), function(index, DS) {
                        buildNode(DS.getName()+"-time-bubbles","bubbles");
                    });
                    var ncanvas = document.getElementsByClassName
                        ('flotr-canvas').length;
                    Report.convertBubbles();
                    var new_ncanvas = document.getElementsByClassName
                        ('flotr-canvas').length;
                    expect(new_ncanvas-ncanvas).toEqual
                        (Report.getDataSources().length);
                });        
            });
            it("html demographics should be displayed", function () {
                runs(function() {
                    $.each(Report.getDataSources(), function(index, DS) {
                        // TODO: ITS and MLS demographics not supported yet
                        if (DS.getName() === "scm")
                            buildNode(DS.getName()+"-demographics",
                                        "demographics");
                    });
                    var ncanvas = document.getElementsByClassName
                        ('flotr-canvas').length;
                    Report.convertDemographics();
                    var new_ncanvas = document.getElementsByClassName
                        ('flotr-canvas').length;
                    expect(new_ncanvas-ncanvas).toEqual(1);
                });        
            });
            it("html selectors should be displayed", function () {
                runs(function() {
                    $.each(Report.getDataSources(), function(index, DS) {
                        // TODO: SCM and ITS selectors not supported yet
                        if (DS.getName() === "mls")
                            buildNode(DS.getName()+"-selector");
                            buildNode(DS.getName()+"-flotr2-lists", "mls-dyn-list");
                            buildNode(DS.getName()+"-envision-lists");
                    });
                    Report.convertSelectors();
                });
                // TODO: Move JSON loading to global loading
                waitsFor(function() {
                        return (document.getElementById("form_mls_selector") != null);
                    }, "It took too long to load data", 100);               
                runs(function() {
                    $.each(Report.getDataSources(), function(index, DS) {
                        if (DS.getName() === "mls")
                            expect(document.getElementById
                                ("form_"+DS.getName()+"_selector")
                                .childNodes.length).toBeGreaterThan(0);
                    });
                });
            });
            it("html radar should be displayed", function () {
                runs(function() {
                    buildNode("radar-activity","radar");
                    buildNode("radar-community","radar");
                    var ncanvas = document.getElementsByClassName
                        ('flotr-canvas').length;
                    Report.convertBasicDivs();
                    var new_ncanvas = document.getElementsByClassName
                        ('flotr-canvas').length;
                    expect(new_ncanvas-ncanvas).toEqual(2);
                });        
            });
            it("html gridster should be displayed", function () {
                runs(function() {
                    buildNode("gridster","gridster");
                    Report.getBasicDivs()["gridster"].convert(); 
                    var grids = document.getElementsByClassName
                        ('gs_w').length;
                    expect(grids).toEqual(18);
                });        
            });
            it("html treemap should be displayed", function () {               
                runs(function() {
                    buildNode("treemap","treemap",
                            {'data-file':'data/json/treemap.json'});
                    Report.getBasicDivs()["treemap"].convert();
                });
                waitsFor(function() {
                    return (document.getElementsByClassName("treemap-node").length>0);
                }, "It took too long to load treemap data", 100);
                runs(function() {
                    var nodes = document.getElementsByClassName
                        ('treemap-node').length;
                    expect(nodes).toEqual(252);
                });        
            });

        });        
    });
    describe("VizGrimoireJS loaded", function() {
        it("should be present in the global namespace", function () {
            expect(Report).toBeDefined();
            expect(Viz).toBeDefined();
            var data_sources = Report.getDataSources();
            $.each(data_sources, function(index, DS) {
                expect(DS).toBeDefined();
            });
        });
    });
    
    function buildNode (id, div_class, attr_map) {
        if (document.getElementById(id)) return;
        var node = document.createElement('div');
        document.body.appendChild(node);
        if (div_class)
            node.className = div_class;
        node.id = id;
        if (attr_map)
            $('#'+id).attr(attr_map);
        return node;
      }

      function destroyNode (node) {
        document.body.removeChild(node);
      }
});
