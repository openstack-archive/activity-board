/* 
 * Copyright (C) 2013 Bitergia
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

var DataProcess = {};

(function() {
    DataProcess.info = function() {};
    
    DataProcess.sortCompanies = function(ds, metric_id) {
        return sortGlobal(ds, metric_id, "companies");
    };
    
    DataProcess.sortCountries = function(ds, metric_id) {
        return sortGlobal(ds, metric_id, "countries");
    };
    
    DataProcess.sortRepos = function(ds, metric_id) {
        return sortGlobal(ds, metric_id, "repos");
    };
    
    sortGlobal = function (ds, metric_id, kind) {
        if (metric_id === undefined) metric_id = "commits";
        var metric = [];
        var sorted = [];
        var global = null;
        if (kind === "companies") {
            global = ds.getCompaniesGlobalData();
            if (ds.getCompaniesData().length === 0) return sorted;
            if (global[ds.getCompaniesData()[0]][metric_id] === undefined)
                metric_id = "commits";
        } 
        else if (kind === "repos") {
            global = ds.getReposGlobalData();
            if (ds.getReposData().length === 0) return sorted;
            if (global[ds.getReposData()[0]][metric_id] === undefined)
                metric_id = "commits";
        }
        else if (kind === "countries") {
            global = ds.getCountriesGlobalData();
            if (ds.getCountriesData().length === 0) return sorted;
            if (global[ds.getCountriesData()[0]][metric_id] === undefined)
                metric_id = "commits";
        }
        $.each(global, function(item, data) {
           metric.push([item, data[metric_id]]);
        });
        metric.sort(function(a, b) {return b[1] - a[1];});
        $.each(metric, function(id, value) {
            sorted.push(value[0]);
        });
        return sorted;
    };
    
    DataProcess.mergeConfig = function (config1, config2) {
        var new_config = {};
        $.each(config1, function(entry, value) {
            new_config[entry] = value;
        });
        $.each(config2, function(entry, value) {
            new_config[entry] = value;
        });
        return new_config;
    };
    
    DataProcess.hideEmail = function(email) {
        var clean = email;
        if (email.indexOf("@") > -1) {
            clean = email.split('@')[0];
        }
        return clean;
    };
    
    DataProcess.filterDates = function(start_id, end_id, history) {        
        var history_dates = {};
        $.each(history, function(name, data) {
            history_dates[name] = [];                
            $.each(data, function(i, value) {
                // var id = history.id[i];
                // TODO: week should be id
                // var id = history.week[i];
                var id = history.unixtime[i];
                if (id > start_id && id <= end_id)
                    history_dates[name].push(value);
            });
        });
        return history_dates;
    };
    
    DataProcess.filterYear = function(year, history) {
        // var day_msecs = 1000*60*60*24;
        year = parseInt(year, null);
        //var min_id = 12*year, max_id = 12*(year+1);
        // var min_id = (new Date(year.toString()).getTime())/(day_msecs);
        // var max_id = (new Date((year+1).toString()).getTime())/(day_msecs);
        var min_id = new Date(year.toString()).getTime();
        var max_id = new Date((year+1).toString()).getTime();

        var history_year = filterDates(min_id, max_id, history);
        return history_year;
    };
    
    DataProcess.fillDates = function (dates_orig, more_dates) {
        
        if (dates_orig[0].length === 0) return more_dates;

        // [ids, values]
        var new_dates = [[],[]];
        
        // Insert older dates
        var i = 0;
        if (dates_orig[0][0]> more_dates[0][0]) {
            for (i=0; i< more_dates[0].length; i++) {
                new_dates[0][i] = more_dates[0][i];
                new_dates[1][i] = more_dates[1][i];
            }
        }

        // Push already existing dates
        for (i=0; i< dates_orig[0].length; i++) {
            pos = new_dates[0].indexOf(dates_orig[0][i]);
            if (pos === -1) {
                new_dates[0].push(dates_orig[0][i]);
                new_dates[1].push(dates_orig[1][i]);
            }
        }
        
        // Push newer dates
        if (dates_orig[0][dates_orig[0].length-1] < 
                more_dates[0][more_dates[0].length-1]) {
            for (i=0; i< more_dates[0].length; i++) {
                pos = new_dates[0].indexOf(more_dates[0][i]);
                if (pos === -1) {
                    new_dates[0].push(more_dates[0][i]);
                    new_dates[1].push(more_dates[1][i]);
                }
            }
        }
        
        return new_dates;

    };
    
    DataProcess.fillHistory = function (hist_complete_id, hist_partial) {
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
    DataProcess.fillHistoryLines = function(hist_complete_id, hist_partial) {        
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
        
        new_history = DataProcess.fillHistory(hist_complete_id, old_history);
        
        for (i = 0; i < hist_complete_id.length; i++) {
            lines_history.push([new_history[0][i],new_history[1][i]]);
        }
        return lines_history;
    };
    
    DataProcess.addRelativeValues = function (metrics_data, metric) {        
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
                data: [pdata.data[0],val_relative]
            });
        });        
    };
    
    DataProcess.aggregate = function(data, metrics) {
        var new_data = {};
        if (!(metrics instanceof Array)) metrics = [metrics];
        $.each(data, function(metric, mdata){
            if ($.inArray(metric, metrics)> -1) {
                var metric_agg = [];
                metric_agg[0] = data[metric][0];
                for (var i=1; i<data[metric].length; i++) {
                    metric_agg[i] = metric_agg[i-1] + data[metric][i];
                }
                new_data[metric] = metric_agg;
            } else {
                new_data[metric] = data[metric];
            }
        }); 
        return new_data;
    };

    DataProcess.substract = function(data, metric1, metric2) {
        var new_data = {};
        var substract = [];
        for (var i=0; i<data[metric1].length; i++) {
            substract[i] = data[metric1][i]-data[metric2][i];
        }
        $.each(data, function(metric, mdata) {
            new_data[metric] = data[metric];
        });
        new_data.substract = substract;
        return new_data;
    };
})();