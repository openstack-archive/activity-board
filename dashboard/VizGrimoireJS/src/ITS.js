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

function ITS() {

    var basic_metrics = {
        'opened' : {
            'divid' : 'its-opened',
            'column' : "opened",
            'name' : "Opened",
            'desc' : "Number of opened tickets",
            'envision' : {
                y_labels : true,
                show_markers : true
            }
        },
        'openers' : {
            'divid' : 'its-openers',
            'column' : "openers",
            'name' : "Openers",
            'desc' : "Unique identities opening tickets",
            'action' : "opened",
            'envision' : {
                gtype : 'whiskers'
            }
        },
        'closed' : {
            'divid' : 'its-closed',
            'column' : "closed",
            'name' : "Closed",
            'desc' : "Number of closed tickets"
        },
        'closers' : {
            'divid' : 'its-closers',
            'column' : "closers",
            'name' : "Closers",
            'desc' : "Number of identities closing tickets",
            'action' : "closed",
            'envision' : {
                gtype : 'whiskers'
            }
        },
        'changed' : {
            'divid' : 'its-changed',
            'column' : "changed",
            'name' : "Changed",
            'desc' : "Number of changes to the state of tickets"
        },
        'changers' : {
            'divid' : 'its-changers',
            'column' : "changers",
            'name' : "Changers",
            'desc' : "Number of identities changing the state of tickets",
            'action' : "changed",
            'envision' : {
                gtype : 'whiskers'
            }
        }
    };       
    
    this.getMetrics = function() {return basic_metrics;};
    
    this.getMainMetric = function() {
        return "opened";
    };
    
    this.setReposData = function(repos_name, self) {
        if (self === undefined) self = this;
        if (!(repos_name instanceof Array)) repos_name=[repos_name];
        var repos = [];
        // convert http://issues.liferay.com/browse/AUI, change "/" by "_"
        for (var i=0; i<repos_name.length; i++) {
        	repos.push(repos_name[i].replace(/\//g,"_"));
        }
        self.repos = repos;
    };
    
    this.displaySubReportSummary = function(report, divid, item, ds) {
        var label = item;
        if (item.lastIndexOf("http") === 0)
            label = item.substr(item.lastIndexOf("_") + 1);
        var html = "<h1>" + label + "</h1>";
        var id_label = {
            opened : "Opened",
            openers : "Openers",
            first_date : "Start",
            last_date : "End",
            closers : "Closers",
            closed : "Closed",
            changers : "Changers",
    		changed: "Changed",
    		tickets: "Tickets",
    		trackers: "Trackers"
    		    
        };
        var global_data = null;
        if (report === "companies")
            global_data = ds.getCompaniesGlobalData();
        else if (report === "countries")
            global_data = ds.getCountriesGlobalData();
        else if (report === "repositories")
            global_data = ds.getReposGlobalData();
        else return;
        
        $.each(global_data[item],function(id,value) {
        	if (id_label[id]) 
        		html += id_label[id] + ": " + value + "<br>";
        	else
        		html += id + ": " + value + "<br>";
        });
        $("#"+divid).append(html);
    };
    
    this.displayData = function(divid) {
        var div_id = "#" + divid;
        var str = this.global_data.url;
        if (!str || str.length === 0) {
            $(div_id + ' .its-info').hide();
            return;
        }
        $(div_id + ' #its_type').text(this.global_data.type);
        var url = '';
        if (this.global_data.repositories === 1) {
            url = this.global_data.url;
        } else {
            url = Report.getProjectData().its_url;
        }
        if (this.global_data.type === "allura")
            url = url.replace("rest/","");
        else if (this.global_data.type === "github") {
            url = url.replace("api.","");
            url = url.replace("repos/","");
        }
        $(div_id + ' #its_url').attr("href", url);
        $(div_id + ' #its_name').text("Tickets " + this.global_data.type);

        var company = this.getCompanyQuery();
        var data = this.getGlobalData();
        if (company) {
            data = this.getCompaniesGlobalData()[company];
        }

        $(div_id + ' #itsFirst').text(data.first_date);
        $(div_id + ' #itsLast').text(data.last_date);
        $(div_id + ' #itsTickets').text(data.tickets);
        $(div_id + ' #itsOpeners').text(data.openers);
        $(div_id + ' #itsRepositories').text(data.repositories);
        if (data.repositories === 1)
            $(div_id + ' #itsRepositories').hide();
    };

    this.getTitle = function() {return "Tickets";};

    this.displayBubbles = function(divid, radius) {
        Viz.displayBubbles(divid, "opened", "openers", radius);
    };
    
}
var aux = new ITS();
ITS.prototype = new DataSource("its", aux.getMetrics());