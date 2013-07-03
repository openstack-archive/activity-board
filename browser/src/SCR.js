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

function SCR() {
    
    var self = this;
    
    this.basic_metrics = {
        'scr_opened' : {
            'divid' : "scr_opened",
            'column' : "opened",
            'name' : "opened",
            'desc' : ""
        },
        'scr_closed' : {
            'divid' : "scr_closed",
            'column' : "closed",
            'name' : "closed",
            'desc' : ""
        },
        'scr_merged' : {
            'divid' : "scr_merged",
            'column' : "merged",
            'name' : "merged",
            'desc' : ""
        },
        'scr_new' : {
            'divid' : "scr_new",
            'column' : "new",
            'name' : "new",
            'desc' : ""
        },
        'scr_abandoned' : {
            'divid' : "scr_abandoned",
            'column' : "abandoned",
            'name' : "abandoned",
            'desc' : ""
        },
        'scr_verified' : {
            'divid' : "scr_verified",
            'column' : "verified",
            'name' : "verified",
            'desc' : ""
        },
        'scr_approved' : {
            'divid' : "scr_approved",
            'column' : "approved",
            'name' : "approved",
            'desc' : ""
        },
        'scr_codereview' : {
            'divid' : "scr_codereview",
            'column' : "codereview",
            'name' : "codereview",
            'desc' : ""
        },
        'scr_WaitingForReviewer' : {
            'divid' : "scr_WaitingForReviewer",
            'column' : "WaitingForReviewer",
            'name' : "WaitingForReviewer",
            'desc' : ""
        },        
        'scr_WaitingForSubmitter' : {
            'divid' : "scr_WaitingForSubmitter",
            'column' : "WaitingForSubmitter",
            'name' : "WaitingForSubmitter",
            'desc' : ""
        },
        'scr_submitted' : {
            'divid' : "scr_submitted",
            'column' : "submitted",
            'name' : "submitted",
            'desc' : ""
        },
        'scr_sent' : {
            'divid' : "scr_sent",
            'column' : "sent",
            'name' : "sent",
            'desc' : ""
        },
        'scr_companies' : {
            'divid' : 'scr_companies',
            'column' : "companies",
            'name' : "Companies",
            'desc' : "Number of active companies"
        },
        'scr_countries' : {
            'divid' : 'scr_countries',
            'column' : "countries",
            'name' : "Countries",
            'desc' : "Number of active countries"
        },
        'scr_repositories' : {
            'divid' : 'scr_repositories',
            'column' : "repositories",
            'name' : "Respositories",
            'desc' : "Number of active respositories"
        },
        'scr_people' : {
            'divid' : 'scr_people',
            'column' : "people",
            'name' : "People",
            'desc' : "Number of active people"
        }
    };
        
    this.getMainMetric = function() {
        return "scr_merged";
    };
    
    this.displaySummary = function(report, divid, item, ds) {
        if (!item) item = "";
        var label = item;
        if (item.lastIndexOf("http") === 0) {
            var aux = item.split("_");
            label = aux.pop();
            if (label === '') label = aux.pop();
        }
        var html = "<h4>" + label + "</h4>";
        var global_data = null;
        if (report === "companies")
            global_data = ds.getCompaniesGlobalData()[item];
        if (report === "countries")
            global_data = ds.getCountriesGlobalData()[item];
        else if (report === "repositories")
            global_data = ds.getReposGlobalData()[item];
        else global_data = ds.getGlobalData();        
        if (!global_data) return;

        var id_label = {
                first_date : "Start",
                last_date : "End"
        };

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
            $(div_id + ' .scr_info').hide();
            return;
        }
        
        var url = '';
        if (this.global_data.repositories === 1) {
            url = this.global_data.url;
        } else {
            url = Report.getProjectData().mls_url;
        }

        if (this.global_data.type)
            $(div_id + ' #scr_type').text(this.global_data.type);
        if (this.global_data.url && this.global_data.url !== "." && this.global_data.type !== undefined)  {
            $(div_id + ' #scr_url').attr("href", url);
            $(div_id + ' #scr_name').text("SCR " + this.global_data.type);
        } else {
            $(div_id + ' #scr_url').attr("href", Report.getProjectData().mls_url);
            $(div_id + ' #scr_name').text(Report.getProjectData().scr_name);            
            $(div_id + ' #scr_type').text(Report.getProjectData().scr_type);
        }

        var company = this.getCompanyQuery();
        var data = this.getGlobalData();
        if (company) {
            data = this.getCompaniesGlobalData()[company];
        }

        $(div_id + ' #scrFirst').text(data.first_date);
        $(div_id + ' #scrLast').text(data.last_date);
        $(div_id + ' #scrReviews').text(data.scr_opened);
    };

    this.displayBubbles = function(divid, radius) {
        // TODO: we don't have people metrics data
        if (false)    
            Viz.displayBubbles(divid, "scr_opened", "scr_openers", radius);
    };
        
    // http:__lists.webkit.org_pipermail_squirrelfish-dev_
    // <allura-dev.incubator.apache.org>
    SCR.displaySCRListName = function (listinfo) {
        var list_name_tokens = listinfo.split("_");
        var list_name = ''; 
        if (list_name_tokens.length > 1) {
            list_name = list_name_tokens[list_name_tokens.length - 1];
            if (list_name === "")
                list_name = list_name_tokens[list_name_tokens.length - 2];
        } else {
            list_name = listinfo.replace("<", "");
            list_name = list_name.replace(">", "");
            list_name_tokens = list_name.split(".");
            list_name = list_name_tokens[0];
        }
        return list_name;
    };

    this.getTitle = function() {return "Source Code Review";};    
}
SCR.prototype = new DataSource("scr");