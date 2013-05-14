/* 
 * Copyright (C) 2012 Bitergia
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

var Viz = {};

(function() {

    var gridster_debug = false;
    var bitergiaColor = "#ffa500";

    Viz.displayTop = displayTop;
    Viz.displayTopBasic = displayTopBasic;
    Viz.displayTopCompany = displayTopCompany;
    Viz.displayTopGlobal = displayTopGlobal;
    Viz.displayBasicHTML = displayBasicHTML;
    Viz.displayBasicMetricHTML = displayBasicMetricHTML;
    Viz.displayBasicMetricCompaniesHTML = displayBasicMetricCompaniesHTML;
    Viz.displayBasicMetricSubReportStatic = displayBasicMetricSubReportStatic;
    Viz.displayBasicMetricsCompany = displayBasicMetricsCompany;
    Viz.displayBasicMetricsRepo = displayBasicMetricsRepo;
    Viz.displayBasicMetricRepos = displayBasicMetricRepos;
    Viz.displayBasicMetricsCountry = displayBasicMetricsCountry;
    Viz.displayBasicMetricsHTML = displayBasicMetricsHTML;
    Viz.displayBasicLinesFile = displayBasicLinesFile;
    Viz.displayBasicLines = displayBasicLines;
    Viz.displayBubbles = displayBubbles;
    Viz.displayDemographics = displayDemographics;
    Viz.displayEvoSummary = displayEvoSummary;
    Viz.displayTimeToFix = displayTimeToFix;
    Viz.displayTimeToAttention = displayTimeToAttention;
    Viz.filterYear = filterYear;
    Viz.filterDates = filterDates;
    Viz.displayMetricSubReportLines = displayMetricSubReportLines;
    Viz.displayRadarActivity = displayRadarActivity;
    Viz.displayRadarCommunity = displayRadarCommunity;
    Viz.displayTreeMap = displayTreeMap;
    Viz.drawMetric = drawMetric;
    Viz.getEnvisionOptions = getEnvisionOptions;
    Viz.checkBasicConfig = checkBasicConfig;
    Viz.mergeConfig = mergeConfig;
    Viz.displayGridMetric = displayGridMetric;
    Viz.displayGridMetricSelector = displayGridMetricSelector;
    Viz.displayGridMetricAll = displayGridMetricAll;
    // Working fixing gridster issue: redmine issue 991
    Viz.gridster_debug = gridster_debug;

    function mergeConfig(config1, config2) {
        var new_config = {};
        $.each(config1, function(entry, value) {
            new_config[entry] = value;
        });
        $.each(config2, function(entry, value) {
            new_config[entry] = value;
        });
        return new_config;
    }

    function findMetricDoer(history, metric_id) {
    	var doer = '';
    	$.each(Report.getAllMetrics(), function(name,metric) {
    		if (metric.action === metric_id) {
    			doer = metric.column;
    			return false;
    		}
    	});
    	return doer;
    }

    function hideEmail(email) {
        var clean = email;
        if (email.indexOf("@") > -1) {
            clean = email.split('@')[0];
        }
        return clean;
    }

    function drawMetric(metric_id, divid) {
        var config_metric = {};
        config_metric.show_desc = false;
        config_metric.show_title = false;
        config_metric.show_labels = true;
        var drawn = false;

        $.each(Report.getDataSources(), function(index, DS) {
            if (drawn) return false;
            var list_metrics = DS.getMetrics();
            $.each(list_metrics, function(metric, value) {
                if (value.column === metric_id) {
                    DS.displayBasicMetricHTML(value.column, divid,
                            config_metric);
                    drawn = true;
                    return false;
                }
            });
        });
    }

    function displayTopMetricTable(history, metric_id, doer) {
        var table = "<table><tbody>";
        table += "<tr><th></th><th>" + metric_id + "</th></tr>";
        if (history[metric_id] === undefined) return;
        if (!(history[metric_id] instanceof Array)) {
            history[metric_id] = [history[metric_id]];
            history[doer] = [history[doer]];
        }
        for ( var i = 0; i < history[metric_id].length; i++) {
            var metric_value = history[metric_id][i];
            var doer_value = history[doer][i];
            table += "<tr><td>" + hideEmail(doer_value) + "</td><td>"
                    + metric_value + "</td></tr>";
        }
        table += "</tbody></table>";

        return table;
    }

    function displayTopMetric
        (div_id, project, metric, metric_period, history, graph, titles) {

        if (!history) return;
        var metric_id = metric.action;
        var doer = metric.column;
        if (doer === undefined) doer = findMetricDoer(history, metric_id);
        var table = displayTopMetricTable(history, metric_id, doer);
        // var doer = findMetricDoer(history, metric_id);

        if (table === undefined) return;
        if (titles === false) {
            var div = $("#" + div_id);
            div.append(table);
            return;
        }

        var top_metric_id = metric.column;
        var div_graph = '';
        var new_div = '';
        new_div += "<div class='info-pill'>";
        new_div += "<h1>";
        // if (project) new_div += project +" ";
        new_div += "Top " + top_metric_id + " " + metric_period + " </h1>";
        if (graph) {
            div_graph = "top-" + graph + "-" + doer + "-";
            div_graph += metric_id + "-" + metric_period;
            new_div += "<div id='" + div_graph
                    + "' class='graph' style='float:right'></div>";
        }

        new_div += table;
        new_div += "</div>";

        var div = $("#" + div_id);
        div.append(new_div);
        if (graph)
            displayBasicChart(div_graph, history[doer], history[metric_id],
                    graph);
    }

    function displayBasicLinesFile(div_id, json_file, column, labels, title, projects) {
        $.getJSON(json_file, null, function(history) {
            displayBasicLines(div_id, history, column, labels, title, projects);
        });
    }

    // Lines from different Data Sources
    function displayBasicLines(div_id, history, column, labels, title, projects) {
        var lines_data = [];
        var data = [];
        var full_history_id = [], dates = [];
        container = document.getElementById(div_id);
        
        if (history instanceof Array) data = history;
        else data = [history];
                
        $.each(data, function(i, serie) {
            if (serie.id && serie.id.length > full_history_id.length) {
                full_history_id = serie.id;
                dates = serie.date;                
            }
        });

        for ( var j = 0; j < data.length; j++) {
            lines_data[j] = [];
            if (data[j][column] === undefined) continue;
            for ( var i = 0; i < data[j][column].length; i++) {
                lines_data[j][i] = [ data[j].id[i], parseInt(data[j][column][i], 10) ];
            }
            // TODO: projects should be included in data not in a different array
            if (projects)
                lines_data[j] = {label:projects[j], 
                    data:fillHistoryLines(full_history_id, lines_data[j])};
            else
                lines_data[j] = {data:fillHistoryLines(full_history_id, lines_data[j])};
        }

        // TODO: Hack to have lines_data visible in track/tickFormatter
        (function() {var x = lines_data;})();
        
        var config = {
            xaxis : {
                minorTickFreq : 4,
                tickFormatter : function(x) {
                    var index = null;
                    for ( var i = 0; i < full_history_id.length; i++) {
                        if (parseInt(x)===full_history_id[i]) {
                            index = i; break;}
                    }
                    return dates[index];
                }
            },
            yaxis : {
                minorTickFreq : 1000,
                tickFormatter : function(y) {
                    return parseInt(y, 10) + "";
                }
            },

            grid : {
                show : false
            },
            mouse : {
                track : true,
                trackY : false,
                trackFormatter : function(o) {
                    var label = dates[parseInt(o.index, 10)] + "<br>";

                    for (var i=0; i<lines_data.length; i++) {
                        if (lines_data.length > 1)
                            label += lines_data[i].label +":";
                        label += lines_data[i].data[o.index][1]+"<br>";
                    }
                    return label;
                }
            }
        };

        config.title = title;

        if (!labels || labels === 0) {
            config.xaxis.showLabels = false;
            config.yaxis.showLabels = false;
        }
        if (projects && projects.length === 1) config.legend = {show:false};
            
        graph = Flotr.draw(container, lines_data, config);
    }

    function displayMetricsLines(div_id, metrics, history, title, config) {
        var lines_data = [];

        $.each(metrics, function(id, metric) {
            if (!history[metric]) return;
            var mdata = [[],[]];
            $.each(history[metric], function (i, value) {
                mdata[i] = [history.id[i], history[metric][i]];
            });
            lines_data.push({label:metric, data:mdata});
        });
        displayDSLines(div_id, history, lines_data, title, config);
    };
    
    function filterDates(start_id, end_id, history) {        
        var history_dates = {};
        $.each(history, function(name, data) {
            history_dates[name] = [];                
            $.each(data, function(i, value) {
                // var id = history.id[i];
                // TODO: week should be id
                var id = history.week[i];
                if (id > start_id && id <= end_id)
                    history_dates[name].push(value);
            });
        });
        return history_dates;
    }
    
    function filterYear(year, history) {
        var day_msecs = 1000*60*60*24;
        year = parseInt(year);
        //var min_id = 12*year, max_id = 12*(year+1);
        var min_id = (new Date(year.toString()).getTime())/(day_msecs);
        var max_id = (new Date((year+1).toString()).getTime())/(day_msecs);                

        var history_year = filterDates(min_id, max_id, history);            
        return history_year;
    }
    
    function displayMetricSubReportLines(div_id, metric, items, title, 
            config, start, end) {
        var lines_data = [];
        var history = {};
        
        $.each(items, function(item, data) {
            if (data === undefined) return false;
            if (data[metric] === undefined) return false;
            
            if (start && end) data = filterDates(start, end, data);
            
            var cdata = [[], []];
            for (var i=0; i<data.id.length; i++ ) {
                cdata[i] = [data.id[i], data[metric][i]];
            }
            lines_data.push({label:item, data:cdata});
            history = data;
        });
        
        if (lines_data.length === 0) return;
        
        displayDSLines(div_id, history, lines_data, title, config);
    };
    
    // Lines from the same Data Source
    // TODO: Probably we should also fill history
    function displayDSLines(div_id, history, lines_data, title, config_metric) {
        var container = document.getElementById(div_id);

        var config = {
            title : title,
            legend: {
              show: false,
            },
            xaxis : {
                minorTickFreq : 4,
                tickFormatter : function(x) {
                    var index = null;
                    for ( var i = 0; i < history.id.length; i++) {
                        if (parseInt(x)===history.id[i]) {
                            index = i; break;}
                    }
                    return history.date[index];
                }
            },
            yaxis : {
                minorTickFreq : 1000,
                tickFormatter : function(y) {
                    return parseInt(y, 10) + "";
                }
            },

            grid : {
                show : false
            },
            mouse : {
                track : true,
                trackY : false,
                trackFormatter : function(o) {
                    var label = history.date[parseInt(o.index, 10)] + "<br>";

                    for (var i=0; i<lines_data.length; i++) {
                        if (lines_data.length > 1)
                            label += lines_data[i].label +":";
                        label += lines_data[i].data[o.index][1]+"<br>";
                    }
                    return label;
                }
            }
        };

        if (config_metric) {
            if (!config_metric.show_title) config.title = '';
            if (config_metric.show_legend) config.legend.show = true;
            if (config_metric.lines && config_metric.lines.stacked)
                config.lines =
                    {stacked:true, fill:true, fillOpacity: 1, fillBorder:true, lineWidth:0.01};
            if (! config_metric.show_labels) {
                config.xaxis.showLabels = false;
                config.yaxis.showLabels = false;
            }
        }
        graph = Flotr.draw(container, lines_data, config);
    }

    function displayBasicChart
        (divid, labels, data, graph, title, config_metric, rotate, fixColor) {

        var horizontal = false;
        if (rotate)
            horizontal = true;

        var container = document.getElementById(divid);
        var chart_data = [], i;

        if (!horizontal) {
            for (i = 0; i < labels.length; i++) {
                chart_data.push({
                    data : [ [ i, data[i] ] ],
                    label : hideEmail(labels[i])
                });
            }
        } else {
            for (i = 0; i < labels.length; i++) {
                chart_data.push({
                    data : [ [ data[i], i ] ],
                    label : hideEmail(labels[i])
                });
            }
        }

        var config = {
            title : title,
            grid : {
                verticalLines : false,
                horizontalLines : false,
                outlineWidth : 0
            },
            xaxis : {
                showLabels : false,
                min : 0
                
            },
            yaxis : {
                showLabels : false,
                min : 0
            },
            mouse : {
                track : true,
                trackFormatter : function(o) {
                    var i = 'x';
                    if (horizontal)
                        i = 'y';
                    return hideEmail(labels[parseInt(o[i], 10)]) + ": "
                            + data[parseInt(o[i], 10)];
                }
            },
            legend : {
                show : false,
                position : 'se',
                backgroundColor : '#D2E8FF'
            // container: container_legend
            }
        };

        if (config_metric) {
            if (!config_metric.show_title) config.title = '';
            if (config_metric.show_legend) config.legend.show = true;
        }

        if (graph === "bars") {
            config.bars = {
                show : true, 
                horizontal : horizontal
            };
            if (fixColor) {
                config.bars.color = fixColor;
                config.bars.fillColor = fixColor;
            }

            if (config_metric && config_metric.show_legend !== false)
                config.legend = {show:true, position: 'ne'};
            
            // TODO: Color management should be defined
            //var defaults_colors = [ '#ffa500', '#ffff00', '#00ff00', '#4DA74D',
            //                        '#9440ED' ];
            // config.colors = defaults_colors,
            config.grid.horizontalLines = true;
            config.yaxis = {
                showLabels : true, min:0
            };
//            config.xaxis = {
//                    showLabels : true, min:0
//            };
        }
        if (graph === "pie") {
            config.pie = {show : true};
            config.mouse.position = 'ne';
        }


        graph = Flotr.draw(container, chart_data, config);
    }

    function getDSMetric(metric_id) {
        var ds = null;
        $.each(Report.getDataSources(), function(index, DS) {
            $.each(DS.getMetrics(), function(i, metric) {
                if (i === metric_id)
                    ds = DS;
            });
        });
        return ds;
    }
    
    // The two metrics should be from the same data source
    function displayBubbles(divid, metric1, metric2, radius) {

        var container = document.getElementById(divid);

        var DS = getDSMetric(metric1);
        var DS1 = getDSMetric(metric2);

        var bdata = [];

        if (DS != DS1) {
            alert("Metrics for bubbles have different data sources");
            return;
        }
        var full_data = [];
        var projects = [];
        $.each(Report.getDataSources(), function (index, ds) {
           if (ds.getName() ===  DS.getName()) {
               full_data.push(ds.getData());
               projects.push(ds.getProject());
           }
        });
        
        // [ids, values] Complete timeline for all the data
        var dates = [[],[]];
        
        // Healthy initial value
        dates = [full_data[0].id, full_data[0].date];
        
        for (var i=0; i<full_data.length; i++) {
            // if empty data return
            if (full_data[i] instanceof Array) return;
            dates = Viz.fillDates(dates, [full_data[i].id, full_data[i].date]);
        }

        for ( var j = 0; j < full_data.length; j++) {
            var serie = [];
            var data = full_data[j];
            var data1 = Viz.fillHistory(dates[0], [data.id, data[metric1]]);
            var data2 = Viz.fillHistory(dates[0], [data.id, data[metric2]]);
            for ( var i = 0; i < dates[0].length; i++) {
                serie.push( [ dates[0][i], data1[1][i], data2[1][i] ]);
            }
            bdata.push({label:projects[j],data:serie});
        }

        var config = {
            bubbles : {
                show : true,
                baseRadius : 5
            },
            mouse : {
                track : true,
                trackFormatter : function(o) {
                    var value = full_data[0].date[o.index] + ": ";
                    value += o.series.label + " ";
                    value += o.series.data[o.index][1] + " " + metric1 + ",";
                    value += o.series.data[o.index][2] + " " + metric2;
                    return value;
                }
            },
            xaxis : {
                tickFormatter : function(o) {
                    return full_data[0].date[parseInt(o, 10) - full_data[0].id[0]];
                }
            }
        };

        if (DS.getName() === "its")
            $.extend(config.bubbles, {
                baseRadius : 1.0
            });
        
        if (radius) {
            $.extend(config.bubbles, {
                baseRadius : radius
            });            
        }
        Flotr.draw(container, bdata, config);
    }

    function displayDemographics(divid, ds, file, period) {
        if (!file) {
            var data = ds.getDemographicsData();
            displayDemographicsChart(divid, ds, data, period);
        } else {
            $.when($.getJSON(file)).done(function(history) {
                displayDemographicsChart(divid, ds, history, period);
            }).fail(function() {
                alert("Can't load JSON file: " + file);
            });
        }
    }

    function displayDemographicsChart(divid, ds, data, period_year) {
        if (!data) return;
        
        if (!period_year) period = 365/4;
        else period = 365*period_year;

        // var data = ds.getDemographicsData();
        var period_data = [];
        var labels = [], i;
        var config = {show_legend:false};

        for (i = 0; i < data.persons.age.length; i++) {
            var age = data.persons.age[i];
            var index = parseInt(age / period, 10);
            if (!period_data[index])
                period_data[index] = 0;
            period_data[index] += 1;
        }

        for (i = 0; i < period_data.length; i++) {
            labels[i] = "" + parseInt(i, 10);
        }

        if (data)
            displayBasicChart(divid, labels, period_data,
                    "bars", "", config, true, bitergiaColor);
    }

    function displayRadarChart(div_id, ticks, data) {
        var container = document.getElementById(div_id);
        var max = $("#" + div_id).data('max');
        var border=0.2;
        
        if (!(max)) max = 0;
        
        for (var j=0; j<data.length; j++) {
            for (var i=0; i<data[j].data.length; i++) {
                var value =  data[j].data[i][1];
                if (value>max) {
                    max = value;
                    max = parseInt(max * (1+border));
                }
            }
        }
        
        // TODO: Hack to have vars visible in track/tickFormatter
        (function() {var x = [data, ticks];})();

        graph = Flotr.draw(container, data, {
            radar : {
                show : true
            },
            mouse : {
                track : true,
                trackFormatter : function(o) {
                    var value = "";
                    for (var i=0; i<data.length; i++) {
                        value += data[i].label + " ";
                        value += data[i].data[o.index][1] + " ";
                        value += ticks[o.index][1] + "<br>";
                    }
                    return value;
                }
            },
            grid : {
                circular : true,
                minorHorizontalLines : true
            },
            yaxis : {
                min : 0,
                max : max,
                minorTickFreq : 1
            },
            xaxis : {
                ticks : ticks
            }
        });
    }

    function displayRadar(div_id, metrics) {
        var data = [], ticks = [];
        var radar_data = [];
        var projects = [];

        for ( var i = 0; i < metrics.length; i++) {
            var DS = Report.getMetricDS(metrics[i]);
            for (var j=0; j<DS.length; j++) {
                if (!data[j]) {
                    data[j] = [];
                    projects[j] = DS[j].getProject();
                }
                data[j].push([ i, parseInt(DS[j].getGlobalData()[metrics[i]], 10) ]);
            }
            ticks.push([ i, DS[0].getMetrics()[metrics[i]].name ]);
        }

        for (var j=0; j<data.length; j++) {            
            radar_data.push({
                label : projects[j],
                data : data[j]
            });
        }

        displayRadarChart(div_id, ticks, radar_data);
    }

    function displayRadarCommunity(div_id) {
        var metrics = [ 'committers', 'authors', 'openers', 'closers',
                'changers', 'senders' ];
        displayRadar(div_id, metrics);
    }

    function displayRadarActivity(div_id) {
        var metrics = [ 'commits', 'files', 'opened', 'closed', 'changed',
                'sent' ];
        displayRadar(div_id, metrics);
    }
    
    function displayTimeToAttention(div_id, ttf_data, column, labels, title) {
        displayTimeTo(div_id, ttf_data, column, labels, title);
    }
    
    function displayTimeToFix(div_id, ttf_data, column, labels, title) {
        displayTimeTo(div_id, ttf_data, column, labels, title);
    }

    function displayTimeTo(div_id, ttf_data, column, labels, title) {       
        var history = ttf_data.data; 
        if (!history[column]) return;
        var new_history = {};
        new_history.date = history.date;
        // We prefer the data in days, not hours
        $.each(history, function(name, data) {
            if (name != column) return;
            new_history[name] = [];
            for (var i=0; i<data.length; i++) {
                new_history[name].push(parseInt(data[i])/24);
            }            
        });
        //  We need and id column
        new_history.id=[];
        for (var i=0; i<history[column].length;i++) {
            new_history.id.push(i);
        }
        Viz.displayBasicLines(div_id, new_history, column, labels, title);
    }

    // Each metric can have several top: metric.period
    // For example: "committers.all":{"commits":[5310, ...],"name":["Brion
    // Vibber",..]}
    // TODO: Data load should be done in Loader
    function displayTop(div, ds, all, show_metric, graph, titles) {
        var top_file = ds.getTopDataFile();
        var basic_metrics = ds.getMetrics();
        var project = ds.getProject();
            
        if (all === undefined)
            all = true;
        $.getJSON(top_file, function(history) {
            $.each(history, function(key, value) {
                // ex: commits.all
                var data = key.split(".");
                var top_metric = data[0];
                if (show_metric && show_metric !== top_metric) return true;
                var top_period = data[1];
                for (var id in basic_metrics) {
                    var metric = basic_metrics[id];
                    if (metric.column == top_metric) {
                        displayTopMetric(div, project, metric, 
                                top_period, history[key], graph);
                        if (!all) return false;
                        break;
                    }
                }
            });
        });
    }
    
    // Each file have just the doer and the do
    // {"authors":["Mark McLoughlin" ... ,"commits":[265 ...
    function displayTopBasic(div, ds, metric_do, metric_doer, graph, titles) {
        var top_file = ds.getTopDataFile();
        $.getJSON(top_file, function(history) {
            var table = displayTopMetricTable(history, metric_do, metric_doer);
            if (table === undefined) return;
            $('#'+div).append(table);
        });
    }

    function displayTopCompany(company, div, ds, metric_id, period, titles) {
        var project = ds.getProject();
        var metric = ds.getMetrics()[metric_id];
        var graph = null;
        data = ds.getCompaniesTopData()[company][period];
        displayTopMetric(div, project, metric, period, data, graph, titles);
    }

    function displayTopGlobal(div, data_source, metric_id, period, titles) {
        var project = data_source.getProject();
        var metric = data_source.getMetrics()[metric_id];
        var graph = null;
        if (!data_source.getGlobalTopData()[metric_id]) return
        data = data_source.getGlobalTopData()[metric_id][period];
        displayTopMetric(div, project, metric, period, data, graph, titles);
    }
    
    // D3
    function displayTreeMap(divid, data_file) {
        $.getJSON(data_file, function(root) {
            var color = d3.scale.category20c();

            var div = d3.select("#"+divid);

            var width = $("#treemap").width(), 
                height = $("#treemap").height();

            var treemap = d3.layout.treemap()
                .size([ width, height ])
                .sticky(true)
                .value(function(d) {return d.size;}
            );

            var position = function() {
                this.style("left", function(d) {
                    return d.x + "px";
                }).style("top", function(d) {
                    return d.y + "px";
                }).style("width", function(d) {
                    return Math.max(0, d.dx - 1) + "px";
                }).style("height", function(d) {
                    return Math.max(0, d.dy - 1) + "px";
                });
            };

            var node = div.datum(root).selectAll(".node")
                    .data(treemap.nodes)
                .enter().append("div")
                    .attr("class", "treemap-node")
                    .call(position)
                    .style("background", function(d) {
                        return d.children ? color(d.name) : null;})
                    .text(function(d) {
                        return d.children ? null : d.name;
                    });

            d3.selectAll("input").on("change", function change() {
                var value = this.value === "count" 
                    ? function() {return 1;}
                    : function(d) {return d.size;};

                node
                        .data(treemap.value(value).nodes)
                    .transition()
                        .duration(1500)
                        .call(position);
           });
        });
    }

    Viz.fillDates = function (dates_orig, more_dates) {
        
        if (dates_orig[0].length === 0) return more_dates;

        // [ids, values]
        var new_dates = [[],[]];
        
        // Insert older dates
        if (dates_orig[0][0]> more_dates[0][0]) {
            for (var i=0; i< more_dates[0].length; i++) {
                new_dates[0][i] = more_dates[0][i];
                new_dates[1][i] = more_dates[1][i];
            }
        }

        // Push already existing dates
        for (var i=0; i< dates_orig[0].length; i++) {
            pos = new_dates[0].indexOf(dates_orig[0][i]);
            if (pos === -1) {
                new_dates[0].push(dates_orig[0][i]);
                new_dates[1].push(dates_orig[1][i]);
            }
        }
        
        // Push newer dates
        if (dates_orig[0][dates_orig[0].length-1] < 
                more_dates[0][more_dates[0].length-1]) {
            for (var i=0; i< more_dates[0].length; i++) {
                pos = new_dates[0].indexOf(more_dates[0][i]);
                if (pos === -1) {
                    new_dates[0].push(more_dates[0][i]);
                    new_dates[1].push(more_dates[1][i]);
                }
            }
        }
        
        return new_dates;

    };
    
    Viz.fillHistory = function (hist_complete_id, hist_partial) {
        // [ids, values]
        var new_history = [ [], [] ];
        for ( var i = 0; i < hist_complete_id.length; i++) {
            pos = hist_partial[0].indexOf(hist_complete_id[i]);
            new_history[0][i] = hist_complete_id[i];
            if (pos != -1) {
                new_history[1][i] = hist_partial[1][pos];
            } else {
                new_history[1][i] = 0;
            }
        }
        return new_history;
    };
    
    // Envision and Flotr2 formats are different.
    function fillHistoryLines(hist_complete_id, hist_partial) {        
        // [ids, values]
        var old_history = [ [], [] ];
        var new_history = [ [], [] ];
        var lines_history = [];
        
        for ( var i = 0; i < hist_partial.length; i++) {
            // ids
            old_history[0].push(hist_partial[i][0]);
            // values
            old_history[1].push(hist_partial[i][1]);
        }
        
        new_history = Viz.fillHistory(hist_complete_id, old_history);
        
        for ( var i = 0; i < hist_complete_id.length; i++) {
            lines_history.push([new_history[0][i],new_history[1][i]]);
        }
        return lines_history;
    }

    // TODO: Remove when mls lists are multiproject
    Viz.getEnvisionOptionsMin = function (div_id, history, hide) {
        var firstMonth = history.id[0],
                container = document.getElementById(div_id), options;
        var markers = Report.getMarkers();
        var basic_metrics = Report.getAllMetrics();

        options = {
            container : container,
            xTickFormatter : function(index) {
                var label = history.date[index - firstMonth];
                if (label === "0")
                    label = "";
                return label;
            },
            yTickFormatter : function(n) {
                return n + '';
            },
            // Initial selection
            selection : {
                data : {
                    x : {
                        min : history.id[0],
                        max : history.id[history.id.length - 1]
                    }
                }
            }
        };        
        
        options.data = {
            summary : [history.id,history.sent],
            markers : markers,
            dates : history.date,
            envision_hide : hide,
            main_metric : "sent"
        };

        for (var metric in history) {
            options.data[metric] = [{label:metric, data:[history.id,history[metric]]}];
        }
        
        options.trackFormatter = function(o) {
            var sdata = o.series.data, index = sdata[o.index][0] - firstMonth;            

            var value = history.date[index] + ":<br>";

            for (var metric in basic_metrics) {
                if (history[metric] === undefined) continue;
                value += history[metric][index] + " " + metric + " , ";
            }
            return value;
        };

        return options;
    };
    
    function getEnvisionOptions(div_id, projects_data, ds_name, hide) {

        var basic_metrics, main_metric="", summary_data = [[],[]];

        if (ds_name) {
            $.each(Report.getDataSources(), function(i, DS) {
                if (DS.getName() === ds_name) {
                    basic_metrics = DS.getMetrics();
                    return false;
                }
            });
        }
        else basic_metrics = Report.getAllMetrics();
        
        $.each(Report.getDataSources(), function(i, DS) {
            main_metric = DS.getMainMetric();
            if ((ds_name === null && DS.getName() === "scm") ||
                (ds_name && DS.getName() == ds_name)) {
                summary_data = [DS.getData().id, DS.getData()[main_metric]];
                return false;
            }
        });
        
        // [ids, values] Complete timeline for all the data
        var dates = [[],[]];
        
        $.each(projects_data, function(project, data) {
            $.each(data, function(index, DS) {
                if (ds_name && ds_name !== DS.getName()) return;
                dates = Viz.fillDates(dates, 
                        [DS.getData().id, DS.getData().date]);
            });
        });
        
        var firstMonth = dates[0][0],
                container = document.getElementById(div_id), options;
        var markers = Report.getMarkers();

        options = {
            container : container,
            xTickFormatter : function(index) {
                var label = dates[1][index - firstMonth];
                if (label === "0")
                    label = "";
                return label;
            },
            yTickFormatter : function(n) {
                return n + '';
            },
            // Initial selection
            selection : {
                data : {
                    x : {
                        min : dates[0][0],
                        max : dates[0][dates[0].length - 1]
                    }
                }
            }
        };        
        
        options.data = {
            summary : Viz.fillHistory(dates[0], summary_data),
            markers : markers,
            dates : dates[1],
            envision_hide : hide,
            main_metric : main_metric
        };

        for (var metric in basic_metrics) {
            $.each(projects_data, function(project, pdata) {
                $.each(pdata, function(index, ds) {
                    var data = ds.getData();
                    if (data[metric] === undefined) return;
                    if (options.data[metric] === undefined) 
                        options.data[metric] = [];
                    var full_data =
                        Viz.fillHistory(dates[0], [data.id, data[metric]]);
                    if (metric === main_metric) {
                        options.data[metric].push(
                                {label:project, data:full_data});
                        if (data[metric+"_relative"] === undefined) return;
                        if (options.data[metric+"_relative"] === undefined) 
                            options.data[metric+"_relative"] = [];
                        full_data = Viz.fillHistory(dates[0],
                                    [data.id, data[metric+"_relative"]]);
                        options.data[metric+"_relative"].push(
                                {label:project, data:full_data});
                    } else {
                        //options.data[metric].push({label:"", data:full_data});
                        options.data[metric].push({label:project, data:full_data});
                    }
                });
            });
        }
        
        options.trackFormatter = function(o) {
            var sdata = o.series.data, index = sdata[o.index][0] - firstMonth;            
            var project_metrics = {};
            var projects = Report.getProjectsList();
            for (var j=0;j<projects.length; j++) {
                project_metrics[projects[j]] = {};
            }

            var value = dates[1][index] + ":<br>";

            for (var metric in basic_metrics) {
                if (options.data[metric] === undefined) continue;
                if ($.inArray(metric,options.data.envision_hide) > -1) continue;                                                
                for (var j=0;j<projects.length; j++) {
                    if (options.data[metric][j] === undefined) continue;
                    var project_name = options.data[metric][j].label;
                    var pdata = options.data[metric][j].data;
                    value = pdata[1][index];
                    project_metrics[project_name][metric] = value;
                }                                    
            }
            
            value  = "<table><tr><td align='right'>"+dates[1][index];
            value += "</td></tr><tr><td></td>";
            for (var metric in basic_metrics) {
                if (options.data[metric] === undefined) continue;
                if ($.inArray(metric,options.data.envision_hide) > -1) 
                    continue;
                value += "<td>"+metric+"</td>";
            }
            value += "</tr>";
            $.each(project_metrics, function(project, metrics) {
                value += "<tr><td>"+project+"</td>";
                for (var metric in basic_metrics) {
                    if (options.data[metric] === undefined) continue;
                    if ($.inArray(metric,options.data.envision_hide) > -1) 
                        continue;
                    mvalue = project_metrics[project][metric];
                    if (mvalue === undefined) mvalue = "n/a";
                    value += "<td>" + mvalue + "</td>";
                }
                value += "</tr>";   
            });
            value += "</table>";

            return value;
        };

        return options;
    }

    function checkBasicConfig(config) {
        if (config === undefined)
            config = {};
        if (config.show_desc === undefined)
            config.show_desc = true;
        if (config.show_title === undefined)
            config.show_title = true;
        if (config.show_labels === undefined)
            config.show_labels = true;
        return config;
    }

    function displayBasicHTML(data, div_target, title, basic_metrics, hide,
            config, projs) {
        config = checkBasicConfig(config);
        var new_div = '<div class="info-pill">';
        new_div += '<h1>' + title + '</h1></div>';
        $("#" + div_target).append(new_div);
        for ( var id in basic_metrics) {
            var metric = basic_metrics[id];
            if (data[0][metric.column] === undefined) continue;
            if ($.inArray(metric.column, Report.getConfig()[hide]) > -1)
                continue;
            displayBasicMetricHTML(metric, data, div_target, config, projs);
        }
    }

    function displayBasicMetricsHTML(metrics, data, div_target, config) {
        config = checkBasicConfig(config);
        var title = metrics.join(",");
        if (!config.show_title) title = '';
        displayMetricsLines(div_target, metrics, data, title, config);
    }

    function displayBasicMetricsCompany (company, metrics, data, div_id, config) {
        config = checkBasicConfig(config);
        var title = company;
        displayMetricsLines(div_id, metrics, data, title, config);
    }
    
    function displayBasicMetricsRepo (repo, metrics, data, div_id, config) {
        config = checkBasicConfig(config);
        var title = repo;
        displayMetricsLines(div_id, metrics, data, title, config);
    }
    
    function displayBasicMetricRepos(metric, data, div_target, 
            config, start, end) {
        config = checkBasicConfig(config);
        config.show_legend = true;
        var title = metric;
        displayMetricSubReportLines(div_target, metric, data, title, 
                config, start, end);
    }
    
    function displayBasicMetricsCountry (country, metrics, data, div_id, 
            config) {
        config = checkBasicConfig(config);
        var title = country;
        displayMetricsLines(div_id, metrics, data, title, config);
    }

    function displayBasicMetricCompaniesHTML(metric, data, div_target, 
            config, start, end) {
        config = checkBasicConfig(config);
        config.show_legend = true;
        var title = metric;
        displayMetricSubReportLines(div_target, metric, data, title, 
                config, start, end);
    }

    function displayBasicMetricSubReportStatic(metric, data,
            div_id, config) {
        config = checkBasicConfig(config);
        var title = metric;
        var metric_data = [];
        var labels = [];

        var graph = 'bars';
        if (config.graph) graph = config.graph;

        $.each(data, function(item, data) {
            // TODO: find a generic way to filter labels
            var label = item;
            if (item.lastIndexOf("http") === 0) {
                var aux = item.split("_");
                label = aux.pop();
                if (label === '') label = aux.pop();
                // item = item.substr(item.lastIndexOf("_") + 1);
            }
            else if (item.lastIndexOf("<") === 0)
                label = MLS.displayMLSListName(item);
            labels.push(label);
            metric_data.push(data[metric]);
        });
        displayBasicChart(div_id, labels, metric_data, graph, title, config);
    }

    function displayBasicMetricHTML(metric, data, div_target, config, projs) {
        config = checkBasicConfig(config);
        var title = metric.name;
        if (!config.show_title)
            title = '';

        var new_div = '<div class="info-pill">';
        $("#" + div_target).append(new_div);
        new_div = '<div id="flotr2_' + metric.column
                + '" class="info-pill m0-box-div">';
        new_div += '<h1>' + metric.name + '</h1>';
        if (config.realtime) {            
            new_div += '<div class="basic-metric-html" id="' + metric.divid;
            new_div += "_" + div_target;
        }
        else
            new_div += '<div class="basic-metric-html" id="' + metric.divid;
        new_div += '"></div>';
        if (config.show_desc === true)
            new_div += '<p>' + metric.desc + '</p>';
        new_div += '</div>';
        $("#" + div_target).append(new_div);
        if (config.realtime)
            displayBasicLinesFile(metric.divid+"_"+div_target, config.json_ds, 
                    metric.column, config.show_labels, title, projs);
        else
            displayBasicLines(metric.divid, data, metric.column,
                    config.show_labels, title, projs);
    }

    function displayGridMetric(metric_id, config) {
        var gridster = Report.getGridster();
        var metric = Report.getAllMetrics()[metric_id];
        var size_x = 1, size_y = 1, col = 2, row = 1;
        var silent = true;

        if (config) {
            size_x = config.size_x, size_y = config.size_y, col = config.col,
                    row = config.row;
        }

        var divid = metric.divid + "_grid";
        if ($("#" + metric_id + "_check").is(':checked')) {
            if ($("#" + divid).length === 0) {
                gridster.add_widget("<div id='" + divid + "'></div>", size_x,
                        size_y, col, row);
                // gridster.add_widget( "<div id='"+divid+"'></div>", size_x,
                // size_y);
                drawMetric(metric_id, divid);
            }
        } else {
            if ($("#" + divid).length > 0) {
                if (Viz.gridster_debug)
                    silent = false;
                gridster.remove_widget($("#" + divid), silent);
            }
        }
    }

    function displayGridMetricAll(state) {
        var columns = 3;
        var form = document.getElementById('form_metric_selector');
        var config = {
            size_x : 1,
            size_y : 1,
            col : 2,
            row : 0
        };
        for ( var i = 0; i < form.elements.length; i++) {
            if (form.elements[i].type == "checkbox") {
                form.elements[i].checked = state;
                if (i % columns === 0) {
                    config.row++;
                    config.col = 2;
                }
                displayGridMetric(form.elements[i].value, config);
                config.col++;
            }
        }
    }

    function displayGridMetricDefault() {
    }

    function displayGridMetricSelector(div_id) {
        var metrics = {};
        $.each(Report.getDataSources(), function(i, DS) {
            if (DS.getData().length === 0) return;
            metrics = $.extend(metrics, DS.getMetrics());
        });

        var html = "Metrics Selector:";
        html += "<form id='form_metric_selector'>";

        $.each(metrics, function(metric_id, value) {
            html += '<input type=checkbox name="check_list" value="'
                    + metric_id + '" ';
            html += 'onClick="';
            html += 'Viz.displayGridMetric(\'' + metric_id + '\');';
            html += '" ';
            html += 'id="' + metric_id + '_check" ';
            // if ($.inArray(l, user_lists)>-1) html += 'checked ';
            html += '>';
            html += metric_id;
            html += '<br>';
        });
        html += '<input type=button value="All" ';
        html += 'onClick="Viz.displayGridMetricAll(' + true + ')">';
        html += '<input type=button value="None" ';
        html += 'onClick="Viz.displayGridMetricAll(' + false + ')">';
        // html += '<input type=button value="Default" ';
        // html += 'onClick="Viz.displayGridMetricDefault()">';
        html += "</form>";
        $("#" + div_id).html(html);
    }

    Viz.addRelativeValues = function (metrics_data, metric) {        
        if (metrics_data[metric] === undefined) return;
        metrics_data[metric+"_relative"] = [];
        var added_values = [];
        
        $.each(metrics_data[metric], function(index, pdata) {
            var metric_values = pdata.data[1];
            for (var i = 0; i<metric_values.length;i++) {
                if (added_values[i] === undefined)
                    added_values[i] = 0;
                added_values[i] += metric_values[i];
            }
        });
        
        $.each(metrics_data[metric], function(index, pdata) {
            var val_relative = [];
            for (var i = 0; i<pdata.data[0].length;i++) {
                if (added_values[i] === 0) val_relative[i] = 0;
                else {
                    var rel_val = pdata.data[1][i]/added_values[i]*100;
                    val_relative[i] = rel_val;
                }
            }
            metrics_data[metric+"_relative"].push({
                label: pdata.label,
                data: [pdata.data[0],val_relative],
            });
        });        
    };

    function displayEvoSummary(div_id, relative) {
        var projects_full_data = Report.getProjectsDataSources();
        var config = Report.getConfig();
        var options = Viz.getEnvisionOptions(div_id, projects_full_data, null,
                config.summary_hide);
        if (relative) {
            // TODO: Improve main metric selection. Report.getMainMetric()
            $.each(projects_full_data, function(project, data) {
                $.each(data, function(index, DS) {
                    main_metric = DS.getMainMetric();
                });
            });
            Viz.addRelativeValues(options.data, main_metric);
        }                
        new envision.templates.Envision_Report(options);
    }
})();
