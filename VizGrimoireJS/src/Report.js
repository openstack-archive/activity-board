/* 
 * Copyright (C) 2012-2013 Bitergia
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA 02111-1307, USA.
 *
 * This file is a part of the VizGrimoireJS package
 *
 * Authors:
 *   Alvaro del Castillo San Felix <acs@bitergia.com>
 */

var Report = {};

(function() {

    // Shared config
    var project_data = null, markers = null, config = null, 
        gridster = {}, data_sources = [], html_dir="";
    var data_dir = "data/json";
    var default_data_dir = "data/json";
    var default_html_dir = "";
    var projects_dirs = [default_data_dir];
    var projects_data = {};
    var projects_datasources = {};
    var repos_map = {};
    var project_file = data_dir + "/project-info.json",
        config_file = data_dir + "/viz_cfg.json",
        markers_file = data_dir + "/markers.json",
        repos_map_file = data_dir + "/repos-map.json";

    // TODO: Why is it public? Markup API!
    // Public API
    Report.convertBasicDivs = convertBasicDivs;
    Report.convertEnvision = convertEnvision;
    Report.convertFlotr2 = convertFlotr2;
    Report.convertTop = convertTop;
    Report.convertBubbles = convertBubbles;
    Report.convertDemographics = convertDemographics;
    Report.convertSelectors = convertSelectors;
    Report.createDataSources = createDataSources;
    Report.getAllMetrics = getAllMetrics;
    Report.getMarkers = getMarkers;
    Report.getConfig = getConfig;
    Report.getMetricDS = getMetricDS;
    Report.getGridster = getGridster;
    Report.setGridster = setGridster;
    Report.getProjectData = getProjectData;
    Report.getProjectsData = getProjectsData;
    Report.getBasicDivs = function() {
        return basic_divs;
    }; 
    Report.displayReportData = displayReportData;
    Report.convertGlobal = convertGlobal;
    Report.convertStudies = convertStudies;
    Report.getDataSources = function() {
        // return data_sources.slice(0,3);
        return data_sources;
    };
    Report.registerDataSource = function(backend) {
        data_sources.push(backend);
    };
    
    Report.setHtmlDir = function (dir) {
        html_dir = dir;
    };

    Report.getDataDir = function() {
      return data_dir;
    };

    Report.setDataDir = function(dataDir) {
        data_dir = dataDir;
        project_file = dataDir + "/project-info.json", 
        config_file = dataDir + "/viz_cfg.json", 
        markers_file = dataDir + "/markers.json";
        repos_mapping_file = data_dir + "/repos-mapping.json";
    };
   
    function getMarkers() {
        return markers;
    }
    
    Report.setMarkers = function (data) {
        markers = data;
    };    
    Report.getMarkersFile = function () {
        return markers_file;
    };
    
    Report.getReposMap = function() {
        return repos_map;
    };    
    Report.setReposMap = function (data) {
        repos_map = data;
    };    
    Report.getReposMapFile = function () {
        return repos_map_file;
    };
    Report.getValidRepo = function (repo, ds) {
        var valid_repo = null;
        var repos = ds.getReposGlobalData();
        if (repos[repo]) return repo;
        // Search for a mapping repository
        $.each(Report.getReposMap(), function (repo_name, repo_map) {
            if (repo_name === repo) {
                var test_repo = repo_map;
                if (repos[test_repo]!== undefined) {
                    valid_repo = test_repo;
                    return false;
                }
            } else if (repo_map === repo) {
                var test_repo = repo_name;
                if (repos[test_repo]!== undefined) {
                    valid_repo = test_repo;
                    return false;
                }
            }
        });
        return valid_repo;
    };

    function getConfig() {
        return config;
    }
    
    Report.setConfig = function(cfg) {
        config = cfg;
    };
    
    Report.getConfigFile = function() {
        return config_file;
    };

    function getGridster() {
        return gridster;
    }

    function setGridster(grid) {
        gridster = grid;
    }

    function getProjectData() {
        return project_data;
    }
    
    Report.setProjectData = function(data) {
        project_data = data;
    };
    
    Report.getProjectFile = function () {
        return project_file;
    };

    function getProjectsData() {
        return projects_data;
    }
    
    Report.getProjectsDirs = function () {
        return projects_dirs;
    };
    
    Report.setProjectsDirs = function (dirs) {
        projects_dirs = dirs;
    };

    
    Report.getProjectsList = function () {
        var projects_list = [];
        for (key in getProjectsData()) {
            projects_list.push(key);
        }
        return projects_list;
    };
    
    Report.getProjectsDataSources = function () {
      return projects_datasources;
    };
    
    function getMetricDS(metric_id) {
        var ds = [];
        $.each(Report.getDataSources(), function(i, DS) {
            if (DS.getMetrics()[metric_id]) {
                ds.push(DS);
            }
        });
        return ds;
    }


    function getAllMetrics() {
        var all = {};
        $.each(Report.getDataSources(), function(index, DS) {
            all = $.extend({}, all, DS.getMetrics());
        });
        return all;
    }

    function displayReportData() {
        data = project_data;
        document.title = data.project_name + ' Report by Bitergia';
        if (data.title) document.title = data.title;
        $(".report_date").text(data.date);
        $(".report_name").text(data.project_name);
        str = data.blog_url;
        if (str && str.length > 0) {
            $('#blogEntry').html(
                    "<br><a href='" + str
                            + "'>Blog post with some more details</a>");
            $('.blog_url').attr("href", data.blog_url);
        } else {
            $('#more_info').hide();
        }
        str = data.producer;
        if (str && str.length > 0) {
            $('#producer').html(str);
        } else {
            $('#producer').html("<a href='http://bitergia.com'>Bitergia</a>");
        }
        $(".project_name").text(data.project_name);
        $("#project_url").attr("href", data.project_url);
    }

    function checkDynamicConfig() {
        var data_sources = [];
        
        function getDataDirs(dirs_config) {
            var full_params = dirs_config.split ("&");
            var dirs_param = $.grep(full_params,function(item, index) {
                return (item.indexOf("data_dir=") === 0);
            });
            for (var i=0; i< dirs_param.length; i++) {                
                var data_dir = dirs_param[i].split("=")[1];
                data_sources.push(data_dir);
                if (i === 0) Report.setDataDir(data_dir);
            }             
        }
        
        var querystr = window.location.search.substr(1);
        // Config in GET URL
        if (querystr && querystr.indexOf("data_dir")>=0) {
            getDataDirs(querystr);
            if (data_sources.length>0)
                Report.setProjectsDirs(data_sources);
        }
    }
    
    function createDataSources() {
        checkDynamicConfig();
        
        var projects_dirs = Report.getProjectsDirs(); 

        $.each(projects_dirs, function (i, project) {
            // TODO: Only DS with data should exist
            var its = new ITS();
            Report.registerDataSource(its);
            var mls = new MLS();        
            Report.registerDataSource(mls);        
            var scm = new SCM();
            Report.registerDataSource(scm);
        
            its.setDataDir(project);
            mls.setDataDir(project);
            scm.setDataDir(project);
            scm.setITS(its);
        });
        
        return true;
    }
        
    var basic_divs = {
        "navigation": {
            convert: function() {
                $.get(html_dir+"navigation.html", function(navigation) {
                    $("#navigation").html(navigation);
                    var querystr = window.location.search.substr(1);
                    if (querystr && querystr.indexOf("data_dir")!==-1) {
                        var $links = $("#navigation a");
                        $.each($links, function(index, value){
                            value.href += "?"+window.location.search.substr(1);
                        });
                    }
                });                
            }
        },
        "header": {
            convert: function() {
                $.get(html_dir+"header.html", function(header) {
                    $("#header").html(header);
                    displayReportData();
                    var div_companies_links = "companies_links";
                    if ($("#"+div_companies_links).length > 0) {
                        var limit = $("#"+div_companies_links).data('limit');
                        var order_by = $("#"+div_companies_links).data('order-by');
                        var DS = null;
                        // scm support only
                        $.each(data_sources, function(i, ds) {
                            if (ds.getName() === "scm") {DS = ds; return false;}
                        });
                        DS.displayCompaniesLinks(div_companies_links, limit, order_by);
                    }
                    var querystr = window.location.search.substr(1);
                    if (querystr && querystr.indexOf("data_dir")!==-1) {
                        var $links = $("#header a");
                        $.each($links, function(index, value){
                            value.href += "?"+window.location.search.substr(1);
                        });
                    }
                });
            }
        },
        "footer": {
            convert: function() {
                $.get(html_dir+"footer.html", function(footer) {
                    $("#footer").html(footer);
                });
            }
        },
        "activity":  {
            convert: function() {
                var html = "<h1>Last Week</h1>";
                $.each(Report.getDataSources(), function(index, DS) {
                    var data = DS.getGlobalData();
                    for (key in data) {
                        // 7, 30, 90, 365
                        var suffix = "_7"; 
                        if (key.indexOf(suffix, key.length - suffix.length) !== -1) {
                            var metric = key.substring(0, key.length - suffix.length);
                            html += metric + ":" + data[key] + "<br>";
                        }
                    };
                });
                $("#activity").html(html);
            }
        },
        "activitymonth":  {
            convert: function() {
                var html = "<h1>Last Month</h1>";
                $.each(Report.getDataSources(), function(index, DS) {
                    var data = DS.getGlobalData();
                    for (key in data) {
                        // 7, 30, 90, 365
                        var suffix = "_30";
                        if (key.indexOf(suffix, key.length - suffix.length) !== -1) {
                            var metric = key.substring(0, key.length - suffix.length);
                            html += metric + ":" + data[key] + "<br>";
                        }
                    };
                });
                $("#activitymonth").html(html);
            }
        },
        "activityquarter":  {
            convert: function() {
                var html = "<h1>Last Quarter</h1>";
                $.each(Report.getDataSources(), function(index, DS) {
                    var data = DS.getGlobalData();
                    for (key in data) {
                        // 7, 30, 90, 365
                        var suffix = "_90";
                        if (key.indexOf(suffix, key.length - suffix.length) !== -1) {
                            var metric = key.substring(0, key.length - suffix.length);
                            html += metric + ":" + data[key] + "<br>";
                        }
                    };
                });
                $("#activityquarter").html(html);
            }
        },
        // Reference card with info from all data sources
        "refcard": {
            convert: function() {
                $.when($.get(html_dir+"refcard.html"), 
                        $.get(html_dir+"project-card.html"))
                .done (function(res1, res2) {
                    refcard = res1[0];
                    projcard = res2[0];

                    $("#refcard").html(refcard);
                    displayReportData();
                    $.each(getProjectsData(), function(prj_name, prj_data) {
                        var new_div = "card-"+prj_name.replace(".","").replace(" ","");
                        $("#refcard #projects_info").append(projcard);
                        $("#refcard #projects_info #new_card")
                            .attr("id", new_div);
                        $.each(data_sources, function(i, DS) {
                            if (DS.getProject() !== prj_name) {
                                $("#" + new_div + ' .'+DS.getName()+'-info').hide();
                                return;
                            }
                            DS.displayData(new_div);
                        });
                        $("#"+new_div+" #project_name").text(prj_name);
                        if (projects_dirs.length>1)
                            $("#"+new_div+" .project_info")
                                .append(' <a href="VizGrimoireJS/browser/index.html?data_dir=../../'+prj_data.dir+'">Report</a>');
                        
                        $("#"+new_div+" #project_url")
                            .attr("href", prj_data.url);

                    });
                });
            }
        },
        "radar-activity": {
            convert: function() {
                Viz.displayRadarActivity('radar-activity');
            }
        },
        "radar-community": {
            convert: function() {
                Viz.displayRadarCommunity('radar-community');
            }
        },
        "gridster": {
            convert: function() {
                var gridster = $("#gridster").gridster({
                    widget_margins : [ 10, 10 ],
                    widget_base_dimensions : [ 140, 140 ]
                }).data('gridster');
    
                Report.setGridster(gridster);
                gridster.add_widget("<div id='metric_selector'></div>", 1, 3);
                Viz.displayGridMetricSelector('metric_selector');
                Viz.displayGridMetricAll(true);
            }
        },
        "treemap": {
            convert: function() {
                var file = $('#treemap').data('file');
                Viz.displayTreeMap('treemap', file);
            }
        }
    };

    function convertCompanies(config) {        
        // General config for metrics viz
        var config_metric = {};
                
        config_metric.show_desc = false;
        config_metric.show_title = false;
        config_metric.show_labels = true;

        if (config) {
            $.each(config, function(key, value) {
                config_metric[key] = value;
            });
        }

        
        var company = null;
        var querystr = window.location.search.substr(1);
        if (querystr  &&
                querystr.split("&")[0].split("=")[0] === "company")
            company = querystr.split("&")[0].split("=")[1];
        company = decodeURIComponent(company);

        $.each(Report.getDataSources(), function(index, DS) {            
            var divid = DS.getName()+"-companies-summary";
            if ($("#"+divid).length > 0) {
                DS.displayCompaniesSummary(divid, this);
            }
            
            var divid = DS.getName()+"-refcard-company";
            if ($("#"+divid).length > 0) {
                DS.displayCompanySummary(divid, company, this);
            }

            var div_companies = DS.getName()+"-flotr2-companies";
            var divs = $("."+div_companies);
            if (divs.length > 0) {
                $.each(divs, function(id, div) {
                    var metric = $(this).data('metric');
                    var limit = $(this).data('limit');
                    var order_by = $(this).data('order-by');
                    var stacked = false;
                    if ($(this).data('stacked')) stacked = true;
                    config_metric.lines = {stacked : stacked};
                    div.id = metric+"-flotr2-companies";
                    DS.displayBasicMetricCompanies(metric,div.id,
                            config_metric, limit, order_by);
                });
            }
            var div_companies = DS.getName()+"-flotr2-companies-static";
            var divs = $("."+div_companies);
            if (divs.length > 0) {
                $.each(divs, function(id, div) {
                    var metric = $(this).data('metric');
                    var order_by = $(this).data('order-by');
                    var limit = $(this).data('limit');
                    var show_others = $(this).data('show-others');
                    config_metric.graph = $(this).data('graph');
                    div.id = metric+"-flotr2-companies-static";
                    DS.displayBasicMetricCompaniesStatic(metric,div.id,
                            config_metric, limit, order_by, show_others);
                });
            }
            var div_company = DS.getName()+"-flotr2-metrics-company";
            var divs = $("."+div_company);
            if (divs.length > 0 && company) {
                $.each(divs, function(id, div) {
                    config_metric.show_legend = false;
                    var metrics = $(this).data('metrics');
                    if ($(this).data('legend')) config_metric.show_legend = true;
                    div.id = metrics.replace(/,/g,"-")+"-flotr2-metrics-company";
                    DS.displayBasicMetricsCompany(company, metrics.split(","),
                            div.id, config_metric);
                });
            }

            var div_nav = DS.getName()+"-flotr2-companies-nav";
            if ($("#"+div_nav).length > 0) {
                var metric = $("#"+div_nav).data('sort-metric');
                DS.displayCompaniesNav(div_nav, metric);
            }
            var divs_comp_list = DS.getName()+"-flotr2-companies-list";
            var divs = $("."+divs_comp_list);
            if (divs.length > 0) {
                $.each(divs, function(id, div) {
                    var metrics = $(this).data('metrics');
                    var sort_metric = $(this).data('sort-metric');
                    div.id = metrics.replace(/,/g,"-")+"-flotr2-companies-list";
                    DS.displayCompaniesList(metrics.split(","),div.id,
                            config_metric, sort_metric);
                });
            }

            var div_companies = DS.getName()+"-flotr2-top-company";
            var divs = $("."+div_companies);
            if (divs.length > 0) {
                $.each(divs, function(id, div) {
                    var metric = $(this).data('metric');
                    var period = $(this).data('period');
                    var titles = $(this).data('titles');
                    div.id = metric+"-"+period+"-flotr2-top-company";
                    div.className = "";
                    DS.displayTopCompany(company,div.id,metric,period,titles);
                });
            }            
        });
    }
    
    function convertCountries() {
        var config_metric = {};                
        config_metric.show_desc = false;
        config_metric.show_title = false;
        config_metric.show_labels = true;
        
        var country = null;
        var querystr = window.location.search.substr(1);
        if (querystr  &&
                querystr.split("&")[0].split("=")[0] === "country")
            country = decodeURIComponent(querystr.split("&")[0].split("=")[1]);

        $.each(Report.getDataSources(), function(index, DS) {
            var divid = DS.getName()+"-countries-summary";
            if ($("#"+divid).length > 0) {
                DS.displayCountriesSummary(divid, this);
            }
            
            var div_countries = DS.getName()+"-flotr2-countries-static";
            var divs = $("."+div_countries);
            if (divs.length > 0) {
                $.each(divs, function(id, div) {
                    var metric = $(this).data('metric');
                    var limit = $(this).data('limit');
                    var show_others = $(this).data('show-others');
                    var order_by = $(this).data('order-by');
                    config_metric.graph = $(this).data('graph');
                    div.id = metric+"-flotr2-countries-static";
                    DS.displayBasicMetricCountriesStatic(metric,div.id,
                            config_metric, limit, order_by, show_others);
                });
            }
            
            var div_nav = DS.getName()+"-flotr2-countries-nav";
            if ($("#"+div_nav).length > 0) {
                var order_by = $("#"+div_nav).data('order-by');
                DS.displayCountriesNav(div_nav, order_by);
            }
            
            var divs_countries_list = DS.getName()+"-flotr2-countries-list";
            var divs = $("."+divs_countries_list);
            if (divs.length > 0) {
                $.each(divs, function(id, div) {
                    var metrics = $(this).data('metrics');
                    var order_by = $(this).data('order-by');
                    div.id = metrics.replace(/,/g,"-")+"-flotr2-countries-list";
                    DS.displayCountriesList(metrics.split(","),div.id, 
                            config_metric, order_by);
                });
            }
            
            if (country !== null) {
                var divid = DS.getName()+"-refcard-country";
                if ($("#"+divid).length > 0) {
                    DS.displayCountrySummary(divid, country, this);
                }
                
                var div_country = DS.getName()+"-flotr2-metrics-country";
                var divs = $("."+div_country);
                if (divs.length) {
                    $.each(divs, function(id, div) {
                        var metrics = $(this).data('metrics');
                        config.show_legend = false;
                        if ($(this).data('legend')) config_metric.show_legend = true;
                        div.id = metrics.replace(/,/g,"-")+"-flotr2-metrics-country";
                        DS.displayBasicMetricsCountry(country, metrics.split(","),
                                div.id, config_metric);
                    });
                }                
            }            
        });        
    }
    
    function convertRepos() {
        var config_metric = {};                
        config_metric.show_desc = false;
        config_metric.show_title = false;
        config_metric.show_labels = true;
        
        var repo = null, repo_valid = null;
        var querystr = window.location.search.substr(1);
        if (querystr  &&
                querystr.split("&")[0].split("=")[0] === "repository") {
            repo = decodeURIComponent(querystr.split("&")[0].split("=")[1]);
        }
        
        $.each(Report.getDataSources(), function(index, DS) {            
            var divid = DS.getName()+"-repos-summary";
            if ($("#"+divid).length > 0) {
                DS.displayReposSummary(divid, this);
            }
            var div_repos = DS.getName()+"-flotr2-repos-static";
            var divs = $("."+div_repos);
            if (divs.length > 0) {
                $.each(divs, function(id, div) {
                    var metric = $(this).data('metric');
                    var limit = $(this).data('limit');
                    var show_others = $(this).data('show-others');
                    var order_by = $(this).data('order-by');
                    config_metric.graph = $(this).data('graph');
                    div.id = metric+"-flotr2-repos-static";
                    DS.displayBasicMetricReposStatic(metric,div.id,
                            config_metric, limit, order_by, show_others);
                });
            }
            
            var div_nav = DS.getName()+"-flotr2-repos-nav";
            if ($("#"+div_nav).length > 0) {
                var order_by = $("#"+div_nav).data('order-by');
                var scm_and_its = $("#"+div_nav).data('scm-and-its');
                DS.displayReposNav(div_nav, order_by, scm_and_its);
            }            
            
            var divs_repos_list = DS.getName()+"-flotr2-repos-list";
            var divs = $("."+divs_repos_list);
            if (divs.length > 0) {
                $.each(divs, function(id, div) {
                    var metrics = $(this).data('metrics');
                    var order_by = $(this).data('order-by');
                    var scm_and_its = $(this).data('scm-and-its');
                    div.id = metrics.replace(/,/g,"-")+"-flotr2-repos-list";
                    DS.displayReposList(metrics.split(","),div.id, 
                            config_metric, order_by, scm_and_its);
                });
            }
            
            if (repo !== null) repo_valid = Report.getValidRepo(repo, DS);
            if (repo_valid !== null) {                
                var divid = DS.getName()+"-refcard-repo";
                if ($("#"+divid).length > 0) {
                    DS.displayRepoSummary(divid, repo_valid, this);
                }
                
                var div_repo = DS.getName()+"-flotr2-metrics-repo";
                var divs = $("."+div_repo);
                if (divs.length) {
                    $.each(divs, function(id, div) {
                        var metrics = $(this).data('metrics');
                        config.show_legend = false;
                        if ($(this).data('legend')) config_metric.show_legend = true;
                        div.id = metrics.replace(/,/g,"-")+"-flotr2-metrics-repo";
                        DS.displayBasicMetricsRepo(repo_valid, metrics.split(","),
                                div.id, config_metric);
                    });
                }                
            }            
        });
    }

    
    function convertFlotr2(config) {        
        // General config for metrics viz
        var config_metric = {};
                
        config_metric.show_desc = false;
        config_metric.show_title = false;
        config_metric.show_labels = true;

        if (config) {
            $.each(config, function(key, value) {
                config_metric[key] = value;
            });
        }
        
        var already_shown = [];
        var metric_already_shown = [];
        $.each(Report.getDataSources(), function(index, DS) {
            if (DS.getData().length === 0) return;
            $.each(DS.getMetrics(), function(i, metric) {
                var div_flotr2 = metric.divid+"-flotr2";
                if ($("#"+div_flotr2).length > 0 &&
                        $.inArray(metric.column, metric_already_shown) === -1) {
                    DS.displayBasicMetricHTML(i,div_flotr2, config_metric);
                    metric_already_shown.push(metric.column);
                }
                // Getting data real time
                var div_flotr2_rt = metric.divid+"-flotr2-rt";
                var divs = $("."+div_flotr2_rt);
                if (divs.length > 0) {
                    $.each(divs, function(id, div) {
                        config_metric.realtime = true;
                        // config_metric.json_ds = "http://localhost:1337/?callback=?";
                        var db = "acs_cvsanaly_allura_1049";
                        db = $(this).data('db');
                        div.id = db + "_" + div.className;
                        config_metric.json_ds ="http://localhost:3000/scm/"+db+"/";
                        config_metric.json_ds += metric.column+"_evol/?callback=?";
                        DS.displayBasicMetricHTML(i,div.id, config_metric);
                    });
                }
            });
                        
            if ($("#"+DS.getName()+"-flotr2").length > 0) {
                if ($.inArray(DS.getName(), already_shown) === -1) {
                    DS.displayBasicHTML(DS.getName()+'-flotr2', config_metric);
                    already_shown.push(DS.getName());
                }
            }
            
            if (DS instanceof MLS) {
                if ($("#"+DS.getName()+"-flotr2"+"-lists").length > 0) {
                    if (Report.getProjectsList().length === 1)
                        DS.displayBasic
                            (DS.getName() + "-flotr2"+"-lists", config_metric);
                }
            }

            // Multiparam
            var div_param = DS.getName()+"-flotr2-metrics";
            var divs = $("."+div_param);
            if (divs.length > 0) {
                $.each(divs, function(id, div) {
                    var metrics = $(this).data('metrics');
                    config.show_legend = false;
                    if ($(this).data('legend'))
                        config_metric.show_legend = true;
                    div.id = metrics.replace(/,/g,"-")+"-flotr2-metrics";
                    DS.displayBasicMetrics(metrics.split(","),div.id,
                            config_metric);
                });
            }
            
           // Time to fix
            var div_ttfix = DS.getName()+"-time-to-fix";
            divs = $("."+div_ttfix); 
            if (divs.length > 0) {
                $.each(divs, function(id, div) {
                    var quantil = 'X'+$(this).data('quantil');
                    div.id = DS.getName()+"-time-to-fix-"+quantil;
                    DS.displayTimeToFix(div.id, quantil);
                });
            }
            // Time to attention
            var div_ttatt = DS.getName()+"-time-to-attention";
            divs = $("."+div_ttatt); 
            if (divs.length > 0) {
                $.each(divs, function(id, div) {
                    var quantil = 'X'+$(this).data('quantil');
                    div.id = DS.getName()+"-time-to-attention-"+quantil;
                    DS.displayTimeToAttention(div.id, quantil);
                });
            }
        });
    }

    function convertEnvision() {
        if ($("#all-envision").length > 0) {
            var relative = $('#all-envision').data('relative');
            Viz.displayEvoSummary('all-envision', relative);
        }
        var already_shown = [];
        $.each(Report.getDataSources(), function(index, DS) {
            if (DS.getData().length === 0) return;
            var div_envision = DS.getName() + "-envision";
            if ($("#" + div_envision).length > 0) {
                if ($.inArray(DS.getName(), already_shown) !== -1)
                    return;
                var relative = $('#'+div_envision).data('relative');
                if (DS instanceof MLS) {
                    DS.displayEvo(div_envision, relative);
                    // DS.displayEvoAggregated(div_envision);
                    if (Report.getProjectsList().length === 1)
                        if ($("#" + DS.getName() + "-envision"+"-lists").length > 0)
                            DS.displayEvoListsMain
                                (DS.getName() + "-envision"+"-lists");
                } else if ($.inArray(DS.getName(), already_shown) === -1) { 
                    DS.displayEvo(div_envision, relative); 
                }
                already_shown.push(DS.getName());
            }
        });
    }

    function convertIdentity() {
        $.each(Report.getDataSources(), function(index, DS) {
            var divid = DS.getName()+"-people";
            if ($("#"+divid).length > 0) {
                Identity.showList(divid, DS);
            }
        });
        if ($("#unique-people").length > 0)
            Identity.showListNested("unique-people");
    }
    
    function convertTop() {
        $.each(Report.getDataSources(), function(index, DS) {
            if (DS.getData().length === 0) return;

            var div_id_top = DS.getName()+"-top";
            var show_all = false;
            
            if ($("#"+div_id_top).length > 0) {
                if ($("#"+div_id_top).data('show_all')) show_all = true;
                var top_metric = $("#"+div_id_top).data('metric');
                DS.displayTop(div_id_top, show_all, top_metric);
            }           
            $.each(['pie','bars'], function (index, chart) {
                var div_id_top = DS.getName()+"-top-"+chart;
                if ($("#"+div_id_top).length > 0) {
                    if ($("#"+div_id_top).data('show_all')) show_all = true;
                    var show_metric = $("#"+div_id_top).data('metric');
                    DS.displayTop(div_id_top, show_all, show_metric, chart);
                }
                div_id_top = DS.getName()+"-top-basic-"+chart;
                if ($("#"+div_id_top).length > 0) {
                    var doer = $("#"+div_id_top).data('doer');
                    var action = $("#"+div_id_top).data('action');
                    DS.displayTopBasic(div_id_top, action, doer, chart);
                }
            });
            
            var div_tops = DS.getName()+"-global-top-metric";
            var divs = $("."+div_tops);
            if (divs.length > 0) {
                $.each(divs, function(id, div) {
                    var metric = $(this).data('metric');
                    var period = $(this).data('period');
                    var titles = $(this).data('titles');
                    div.id = metric.replace("_","-")+"-"+period+"-global-metric";
                    DS.displayTopGlobal(div.id, metric, period, titles);
                });
            }
        });
    }
    
    function convertBubbles() {
        $.each(Report.getDataSources(), function(index, DS) {
            if (DS.getData().length === 0) return;

            var div_time = DS.getName() + "-time-bubbles";
            if ($("#" + div_time).length > 0) {
                var radius = $("#" + div_time).data('radius');
                DS.displayBubbles(div_time, radius);
            }
        });        
    }
    
    function convertDemographics() {
        $.each(Report.getDataSources(), function(index, DS) {
            var div_demog = DS.getName() + "-demographics";
            if ($("#" + div_demog).length > 0)
                DS.displayDemographics(div_demog);
            // Specific demographics loaded from files
            var divs = $('[id^="' + DS.getName() + '-demographics"]');
            for ( var i = 0; i < divs.length; i++) {
                var file = $(divs[i]).data('file');
                // period in years
                var period = $(divs[i]).data('period');
                DS.displayDemographics(divs[i].id, file, period);
            }
        });
    }
    
    function convertSelectors() {       
        // Selectors
        $.each(Report.getDataSources(), function(index, DS) {
            var div_selector = DS.getName() + "-selector";
            var div_envision = DS.getName() + "-envision-lists";
            var div_flotr2 = DS.getName() + "-flotr2-lists";
            if ($("#" + div_selector).length > 0)
                // TODO: Only MLS supported 
                if (DS instanceof MLS) {
                    DS.displayEvoBasicListSelector(div_selector, div_envision,
                            div_flotr2);
                }
        });
    }
    
    function convertBasicDivs() {
        $.each (basic_divs, function(divid, value) {
            if ($("#"+divid).length > 0) value.convert(); 
        });
    }
    
    function configDataSources() {
        var prjs_dss = Report.getProjectsDataSources();
        $.each(Report.getDataSources(), function (index, ds) {
            if (ds.getData() instanceof Array) return;
            $.each(projects_data, function (name, project) {
                if (project.dir === ds.getDataDir()) {                    
                    if (prjs_dss[name] === undefined) prjs_dss[name] = [];
                    ds.setProject(name);
                    prjs_dss[name].push(ds);
                    return false;
                }
            });            
        });
        
    }
    
    Report.setReportConfig = function (data) {
        if (data) {
            if (data['global-html-dir'])
                Report.setHtmlDir(data['global-html-dir']);
            if (data['global-data-dir'])
                Report.setDataDir(data['global-data-dir']);
            if (data['projects-data-dirs'])
                Report.setProjectsDirs(data['projects-data-dirs']);
        }
    };
           

    function convertGlobal() {
        configDataSources();
        convertBasicDivs();
        convertBubbles();        
        convertEnvision();
        convertFlotr2(config);
        convertTop();
    }
    
    function convertStudies() {
        convertRepos();
        convertCompanies();
        convertCountries();
        convertDemographics();
        convertSelectors();
    }
    
    // TODO: Move to plugins
    function convertOthers() {
        // TODO: Create a new class for Identity?
        convertIdentity();
    }
})();

Loader.data_ready_global(function() {
    Report.convertGlobal();    
});
    
Loader.data_ready(function() {
    Report.convertStudies();
    $("body").css("cursor", "auto");
});

$(document).ready(function() {
    $.getJSON('config.json', function(data) {
        Report.setReportConfig(data);
    }).always(function (data) {
        Report.createDataSources();
        Loader.data_load();
        $("body").css("cursor", "progress");
    });
});
