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

(function() {

    var V = envision, global_data = {};

    function getDefaultsMarkers(option, markers, dates) {
        var mark = "";
        if (!markers || markers.length === 0) return mark;
        for ( var i = 0; i < markers.date.length; i++) {
            if (markers.date[i] == dates[option.index]) {
                mark = markers.marks[i];
            }
        }
        return mark;
    }

    function getEnvisionDefaultsGraph(name, gconfig) {
        var graph = {
            name : name,
            config : {
                colors : gconfig.colors,
                grid: {verticalLines:false, horizontalLines:false},
                mouse : {
                    // container: $("#all-envision-legend"),
                    track : true,
                    trackY : false,
                    position : 'ne'
                },
                yaxis : {
                    min : 0,
                    autoscale : true
                },
                legend : {
                    show: false,
                    backgroundColor : '#FFFFFF',
                    backgroundOpacity : 0
                }
            }
        };

        if (gconfig.gtype === "whiskers")
            graph.config.whiskers = {
                show : true,
                lineWidth : 2
            };
        else
            graph.config['lite-lines'] = {
                lineWidth : 2,
                show : true,
                fill : false,
                fillOpacity : 0.5
            };

        if (gconfig.y_labels)
            graph.config.yaxis = {
                showLabels : true,
                min : 0
            };

        if (gconfig.show_markers)
            graph.config.markers = {
                show : true,
                position : 'ct',
                labelFormatter : function(o) {
                    return getDefaultsMarkers(o, gconfig.markers, gconfig.dates);
                }
            };
        return graph;
    }

    function getDefaultsMetrics(DS, viz, metrics, default_config) {
        var all_metrics = Report.getAllMetrics();
        var label = null;
        $.each(metrics, function(metric, value) {
            config = default_config;
            if (value.envision)
                config = DataProcess.mergeConfig(default_config,
                        value.envision);
            if ($.inArray(metric, global_data.envision_hide) === -1) {
                viz[metric] = getEnvisionDefaultsGraph
                    ('report-' + DS.getName() + '-' + metric, config);
                label = metric;
                if (all_metrics[metric]) label = all_metrics[metric].name;
                viz[metric].config.subtitle = label;
                if (DS.getMainMetric() == metric) {
                    // Create graph also for relative data
                    viz[metric+"_relative"] = getEnvisionDefaultsGraph
                        ('report-' + DS.getName() + '-' + metric+"_relative", config);
                    viz[metric].config['lite-lines'] = {show:false};
                    viz[metric].config.lines = {
                            lineWidth : 1,
                            show : true,
                            stacked: true,
                            fill : true,
                            fillOpacity : 1
                    };
                }
            } 
        });
    }

    function getDefaults(ds) {
        //var defaults_colors = [ '#ffa500', '#ffff00', '#00ff00', '#4DA74D',
        //        '#9440ED' ];
        var defaults_colors = [ '#ffa500', '#00A8F0', '#C0D800', '#ffff00', '#00ff00', '#4DA74D',
                '#9440ED' ];

        var default_config = {
            colors : defaults_colors,
            dates : global_data.dates,
            g_type : '',
            markers : global_data.markers,
            y_labels : false
        };
        
        var data_sources = Report.getDataSources();

        var viz = {};
        var metrics = {};
        if (!ds) {
            $.each(data_sources, function(i, DS) {
                metrics = DS.getMetrics();
                getDefaultsMetrics(DS, viz, metrics, default_config);
            });
        } else {
            $.each(data_sources, function(i, DS) {
                if ($.inArray(DS.getName(), ds) > -1) {
                    metrics = DS.getMetrics();
                    getDefaultsMetrics(DS, viz, metrics, default_config);
                }
            });
        }

        config = default_config;
        viz.summary = getEnvisionDefaultsGraph('report-summary', config);
        viz.summary.config.xaxis = {
            noTickets : 10,
            showLabels : true
        };
        viz.summary.config.handles = {
            show : true
        };
        viz.summary.config.selection = {
            mode : 'x'
        };
        viz.summary.config.mouse = {};

        viz.connection = {
            name : 'report-connection',
            adapterConstructor : V.components.QuadraticDrawing
        };
        return viz;
    }
    
    function getOrderedDataSources(ds_list, main_metric) {
        var ordered = [];
        var main_DS = null;
        $.each(ds_list, function(i, DS) {
           if (DS.getMetrics()[main_metric]) {
               main_DS = DS;
               return false;
           }
        });
        ordered.push(main_DS);
        $.each(ds_list, function(i, DS) {
            if (DS===main_DS) return;
            ordered.push(DS);
         });
        return ordered;
    }

    function Envision_Report(options, data_sources) {

        var main_metric = options.data.main_metric;
        global_data = options.data;

        if (!data_sources) data_sources = Report.getDataSources();
        
        data_sources = getOrderedDataSources(data_sources, main_metric);
        
        var ds = [];
        for ( var i = 0; i < data_sources.length; i++) {
            if (data_sources[i].getData().length === 0) continue;
            ds.push(data_sources[i].getName());
        }

        var data = options.data, defaults = getDefaults(ds), 
            vis = new V.Visualization(
                {
                    name : 'report-' + ds.join(",")
                }), selection = new V.Interaction(), hit = new V.Interaction();

        var metrics = {};

        $.each(data_sources, function(i, DS) {
            if (DS.getData().length === 0) return;
            metrics = $.extend(metrics, DS.getMetrics());
        });

        $.each(metrics, function(metric, value) {
            if ($.inArray(metric, data.envision_hide) !== -1) return;
            if (data[metric] === undefined) return;
            defaults[metric].data = data[metric];
            // The legend is different if the metric is not in all projects
            if (defaults[metric].data.length < 
                    Report.getProjectsList().length)
                defaults[metric].config.legend.show = true;
            if (data[metric+"_relative"])
                defaults[metric].data = data[metric+"_relative"];
        });

        defaults.summary.data = data.summary;

        // SHOW MOUSE LEGEND AND LEGEND        
        defaults[main_metric].config.legend.show = true;
        if (options.legend_show === false)
            defaults[main_metric].config.legend.show = false;
        defaults[main_metric].config.mouse.trackFormatter = options.trackFormatter;
        if (options.xTickFormatter) {
            defaults.summary.config.xaxis.tickFormatter = options.xTickFormatter;
        }
        defaults[main_metric].config.yaxis.tickFormatter = options.yTickFormatter ||
                function(n) {
                    return '$' + n;
                };

        // ENVISION COMPONENTS
        var components = {};
        $.each(metrics, function(metric, value) {
            if (data[metric] === undefined) return;
            if ($.inArray(metric, data.envision_hide) === -1) {
                components[metric] = new V.Component(defaults[metric]);
            }
        });
        connection = new V.Component(defaults.connection);
        summary = new V.Component(defaults.summary);

        // VISUALIZATION
        $.each(components, function(component, value) {
            vis.add(value);
        });
        vis
        .add(connection).add(summary)
        .render(options.container);

        // ZOOMING
        $.each(components, function(component, value) {
            selection.follower(value);
        });
        selection.follower(connection).leader(summary).add(V.actions.selection,
                options.selectionCallback ? {
                    callback : options.selectionCallback
                } : null);

        // HIT
        var hit_group = [];
        $.each(components, function(component, value) {
            hit_group.push(value);
        });
        hit.group(hit_group).add(V.actions.hit);

        // INITIAL SELECTION
        if (options.selection) {
            summary.trigger('select', options.selection);
        }
    }

    V.templates.Envision_Report = Envision_Report;

})();
