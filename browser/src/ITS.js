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

    this.basic_metrics = {
        'its_opened' : {
            'divid' : 'its_opened',
            'column' : "opened",
            'name' : "Opened",
            'desc' : "Number of opened tickets",
            'envision' : {
                y_labels : true,
                show_markers : true
            }
        },
        'its_openers' : {
            'divid' : 'its_openers',
            'column' : "openers",
            'name' : "Openers",
            'desc' : "Unique identities opening tickets",
            'action' : "opened",
            'envision' : {
                gtype : 'whiskers'
            }
        },
        'its_closed' : {
            'divid' : 'its_closed',
            'column' : "closed",
            'name' : "Closed",
            'desc' : "Number of closed tickets"
        },
        'its_closers' : {
            'divid' : 'its_closers',
            'column' : "closers",
            'name' : "Closers",
            'desc' : "Number of identities closing tickets",
            'action' : "closed",
            'envision' : {
                gtype : 'whiskers'
            }
        },
        'its_changed' : {
            'divid' : 'its_changed',
            'column' : "changed",
            'name' : "Changed",
            'desc' : "Number of changes to the state of tickets"
        },
        'its_changers' : {
            'divid' : 'its_changers',
            'column' : "changers",
            'name' : "Changers",
            'desc' : "Number of identities changing the state of tickets",
            'action' : "changed",
            'envision' : {
                gtype : 'whiskers'
            }
        },
        'its_companies' : {
            'divid' : 'its_companies',
            'column' : "companies",
            'name' : "Companies",
            'desc' : "Number of active companies"
        },
        'its_countries' : {
            'divid' : 'its_countries',
            'column' : "countries",
            'name' : "Countries",
            'desc' : "Number of active countries"
        },
        'its_repositories' : {
            'divid' : 'its_repositories',
            'column' : "repositories",
            'name' : "Respositories",
            'desc' : "Number of active respositories"
        },
        'its_people' : {
            'divid' : 'its_people',
            'column' : "people",
            'name' : "People",
            'desc' : "Number of active people"
        }  
    };       
    
    this.getMainMetric = function() {
        return "its_opened";
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
    
    this.displaySummary = function(report, divid, item, ds) {
        if (!item) item = "";
        var label = item;
        if (item.lastIndexOf("http") === 0) {
            label = item.substr(item.lastIndexOf("_") + 1);
            label = label.replace('buglist.cgi?product=','');
        }
        var html = "<h4>" + label + "</h4>";
        var id_label = {
            first_date : "Start",
            last_date : "End",
            tickets : "Tickets",
            trackers : "Trackers"
        };
        var global_data = null;
        if (report === "companies")
            global_data = ds.getCompaniesGlobalData()[item];
        else if (report === "countries")
            global_data = ds.getCountriesGlobalData()[item];
        else if (report === "repositories")
            global_data = ds.getReposGlobalData()[item];
        else global_data = ds.getGlobalData();
        
        if (!global_data) return;

        var self = this;
        $.each(global_data,function(id,value) {
            if (self.getMetrics()[id])
                html += self.getMetrics()[id].name + ": " + value + "<br>";
            else if (id_label[id]) 
                html += id_label[id] + ": " + value + "<br>";
            else
                if (report) html += id + ": " + value + "<br>";
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
        if (url === undefined) url = '';
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
        $(div_id + ' #itsTickets').text(data.its_opened);
        $(div_id + ' #itsOpeners').text(data.its_openers);
        $(div_id + ' #itsRepositories').text(data.its_repositories);
        if (data.repositories === 1)
            $(div_id + ' #itsRepositories').hide();
    };

    this.getTitle = function() {return "Tickets";};

    this.displayBubbles = function(divid, radius) {
        Viz.displayBubbles(divid, "its_opened", "its_openers", radius);
    };
    
}
ITS.prototype = new DataSource("its");