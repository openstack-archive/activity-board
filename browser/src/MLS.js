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

function MLS() {
    
    var self = this;
    
    this.basic_metrics = {
        'mls_responses' : {
            'divid' : "mls_responses",
            'column' : "responses",
            'name' : "Responses",
            'desc' : "Number of messages that are responses"
        },
        'mls_sent' : {
            'divid' : "mls_sent",
            'column' : "sent",
            'name' : "Sent",
            'desc' : "Number of messages"
        },
        'mls_senders' : {
            'divid' : "mls_senders",
            'column' : "senders",
            'name' : "Senders",
            'desc' : "Number of unique message senders",
            'action' : "sent"
        },
        'mls_threads' : {
            'divid' : "mls_threads",
            'column' : "threads",
            'name' : "Threads",
            'desc' : "Number of messages threads"
        },
        'mls_companies' : {
            'divid' : 'mls_companies',
            'column' : "companies",
            'name' : "Companies",
            'desc' : "Number of active companies"
        },
        'mls_countries' : {
            'divid' : 'mls_countries',
            'column' : "countries",
            'name' : "Countries",
            'desc' : "Number of active countries"
        },
        'mls_repositories' : {
            'divid' : 'mls_repositories',
            'column' : "repositories",
            'name' : "Respositories",
            'desc' : "Number of active respositories"
        },
        'mls_people' : {
            'divid' : 'mls_people',
            'column' : "people",
            'name' : "People",
            'desc' : "Number of active people"
        }
    };
        
    this.data_lists_file = this.data_dir + '/mls-lists.json';
    this.getListsFile = function() {return this.data_lists_file;};
    this.data_lists = null;
    this.getListsData = function() {return this.data_lists;};
    this.setListsData = function(lists, self) {
        if (self === undefined) self = this;
        self.data_lists = lists;
    };

    this.setDataDir = function(dataDir) {
        this.data_dir = dataDir;
        this.data_lists_file = this.data_dir + '/mls-lists.json';
        MLS.prototype.setDataDir.call(this, dataDir);
    };

    this.getMainMetric = function() {
        return "mls_sent";
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
        var id_label = {
            first_date : "Start",
            last_date : "End"
        };
        var global_data = null;
        if (report === "companies")
            global_data = ds.getCompaniesGlobalData()[item];
        if (report === "countries")
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
            $(div_id + ' .mls_info').hide();
            return;
        }
        
        var url = '';
        if (this.global_data.repositories === 1) {
            url = this.global_data.url;
        } else {
            url = Report.getProjectData().mls_url;
        }

        if (this.global_data.type)
            $(div_id + ' #mls_type').text(this.global_data.type);
        if (this.global_data.url && this.global_data.url !== "." && this.global_data.type !== undefined)  {
            $(div_id + ' #mls_url').attr("href", url);
            $(div_id + ' #mls_name').text("MLS " + this.global_data.type);
        } else {
            $(div_id + ' #mls_url').attr("href", Report.getProjectData().mls_url);
            $(div_id + ' #mls_name').text(Report.getProjectData().mls_name);            
            $(div_id + ' #mls_type').text(Report.getProjectData().mls_type);
        }

        var company = this.getCompanyQuery();
        var data = this.getGlobalData();
        if (company) {
            data = this.getCompaniesGlobalData()[company];
        }

        $(div_id + ' #mlsFirst').text(data.first_date);
        $(div_id + ' #mlsLast').text(data.last_date);
        $(div_id + ' #mlsMessages').text(data.mls_sent);
        $(div_id + ' #mlsSenders').text(data.mls_senders);
        $(div_id + ' #mlsRepositories').text(data.mls_repositories);
        if (data.repositories === 1)
            $(div_id + ' #mlsRepositories').hide();
    };

    this.displayBubbles = function(divid, radius) {
        Viz.displayBubbles(divid, "mls_sent", "mls_senders", radius);
    };
        
    // http:__lists.webkit.org_pipermail_squirrelfish-dev_
    // <allura-dev.incubator.apache.org>
    MLS.displayMLSListName = function (listinfo) {
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

    function getUserLists() {
        var form = document.getElementById('form_mls_selector');
        var lists = [];
        for ( var i = 0; i < form.elements.length; i++) {
            if (form.elements[i].checked)
                lists.push(form.elements[i].value);
        }

        if (localStorage) {
            localStorage.setItem(getMLSId(), JSON.stringify(lists));
        }
        return lists;
    }

    this.displayBasicUserAll = function (id, all) {
        var form = document.getElementById('form_mls_selector');
        for ( var i = 0; i < form.elements.length; i++) {
            if (form.elements[i].type == "checkbox")
                form.elements[i].checked = all;
        }
        this.displayBasicUser(id);
    };

    this.displayBasicUser = function(div_id) {

        $("#" + div_id).empty();

        lists = getUserLists();

        for ( var i = 0; i < lists.length; i++) {
            var l = lists[i];
            file_messages = this.getDataDir()+"/mls-";
            file_messages += l;
            file_messages += "-evolutionary.json";
            displayBasicList(div_id, l, file_messages);
        }
    };

    this.displayBasic = function (div_id, config_metric) {
        var lists = this.getListsData();
        
        lists_hide = Report.getConfig().mls_hide_lists;
        lists = lists.mailing_list;        
        if (lists === undefined) return null;
        
        var user_pref = false;

        if (typeof lists === 'string')
            lists = [ lists ];

        if (localStorage) {
            if (localStorage.length && localStorage.getItem(getMLSId())) {
                lists = JSON.parse(localStorage.getItem(getMLSId()));
                user_pref = true;
            }
        }

        for ( var i = 0; i < lists.length; i++) {
            var l = lists[i];
            if (!user_pref)
                if ($.inArray(l, lists_hide) > -1)
                    continue;
            file_messages = this.getDataDir()+ "/mls-";
            file_messages += l;
            file_messages += "-evolutionary.json";
            displayBasicList(div_id, l, file_messages, config_metric);
        }

    };
    
    this.getTitle = function() {return "Mailing Lists";};
    
    // TODO: use cache to store mls_file and check it!
    function displayBasicList(div_id, l, mls_file, config_metric) {
        var config = Viz.checkBasicConfig(config_metric);
        for ( var id in basic_metrics) {
            var metric = basic_metrics[id];
            var title = '';
            if (config.show_title)
                title = metric.name;
            if ($.inArray(metric.column, Report.getConfig().mls_hide) > -1)
                continue;
            var new_div = "<div class='info-pill m0-box-div flotr2-"
                    + metric.column + "'>";
            new_div += "<h4>" + metric.name + " " + MLS.displayMLSListName(l)
                    + "</h4>";
            new_div += "<div id='" + metric.divid + "_" + l
                    + "' class='m0-box flotr2-" + metric.column + "'></div>";
            if (config.show_desc)
                new_div += "<p>" + metric.desc + "</p>";
            new_div += "</div>";
            $("#" + div_id).append(new_div);
            Viz.displayBasicLinesFile(metric.divid + '_' + l, mls_file,
                    metric.column, config.show_labels, title);
        }

    }

    function getReportId() {
        var project_data = Report.getProjectData();
        return project_data.date + "_" + project_data.project_name;
    }

    function getMLSId() {
        return getReportId() + "_mls_lists";
    }
    
    this.displayEvoListsMain = function (id) {
        if (localStorage) {
            if (localStorage.length && localStorage.getItem(getMLSId())) {
                lists = JSON.parse(localStorage.getItem(getMLSId()));
                return this.displayEvoLists(id, lists);
            }
        }

        history = this.getListsData();
        lists = history.mailing_list;
        
        if (lists === undefined) return;
        
        var config = Report.getConfig();
        lists_hide = config.mls_hide_lists;
        if (typeof lists === 'string') {
            lists = [ lists ];
        }

        var filtered_lists = [];
        for ( var i = 0; i < lists.length; i++) {
            if ($.inArray(lists[i], lists_hide) == -1)
                filtered_lists.push(lists[i]);
        }

        if (localStorage) {
            if (!localStorage.getItem(getMLSId())) {
                localStorage.setItem(getMLSId(), JSON
                        .stringify(filtered_lists));
            }
        }
        this.displayEvoLists(id, filtered_lists);
    };
    
    function cleanLocalStorage() {
        if (localStorage) {
            if (localStorage.length && localStorage.getItem(getMLSId())) {
                localStorage.removeItem(getMLSId());
            }
        }
    }
    
    this.getDefaultLists = function () {
        var default_lists = [];        
        var hide_lists = Report.getConfig().mls_hide_lists;
        $.each(this.getListsData().mailing_list, function(index,list) {
            if ($.inArray(list, hide_lists) === -1) default_lists.push(list);
        });
        return default_lists;
    };
    
    this.displaySelectorCheckDefault = function () {
        var default_lists = this.getDefaultLists();
        
        var form = document.getElementById('form_mls_selector');
        for ( var i = 0; i < form.elements.length; i++) {
            if (form.elements[i].type == "checkbox") {
                var id = form.elements[i].id;
                l = id.split("_check")[0];
                if ($.inArray(l, default_lists) > -1)
                    form.elements[i].checked = true;
                else form.elements[i].checked = false;
            }
        }
    };
    
    this.displayBasicDefault = function (div_id) {
        
        var obj = self;
        if (this instanceof MLS) obj = this;

        cleanLocalStorage();
        obj.displaySelectorCheckDefault();
        $("#" + div_id).empty();
        obj.displayBasic(div_id);
    };

    this.displayEvoDefault = function (div_id) {
        var obj = self;
        if (this instanceof MLS) obj = this;

        cleanLocalStorage();
        if (document.getElementById('form_mls_selector'))
            obj.displaySelectorCheckDefault();
        $("#" + div_id).empty();
        obj.displayEvoLists(div_id, obj.getDefaultLists());
    };

    this.displayEvoUserAll = function (id, all) {
        var form = document.getElementById('form_mls_selector');
        for ( var i = 0; i < form.elements.length; i++) {
            if (form.elements[i].type == "checkbox")
                form.elements[i].checked = all;
        }
        this.displayEvoUser(id);
    };

    this.displayEvoUser = function (id) {
        $("#" + id).empty();
        var obj = self;
        if (this instanceof MLS) obj = this;
        obj.displayEvoLists(id, getUserLists());
    };

    this.displayEvoListSelector = function (div_id_sel, div_id_mls) {
        this.displayEvoBasicListSelector(div_id_sel, div_id_mls, null);
    };

    this.displayBasicListSelector = function (div_id_sel, div_id_mls) {
        this.displayEvoBasicListSelector(div_id_sel, null, div_id_mls);
    };

    this.displayEvoBasicListSelector = function (div_id_sel, div_id_evo, div_id_basic){
        var res1 = this.getListsData();
        var lists = res1.mailing_list;
        var user_lists = [];

        if (lists === undefined) return;

        if (localStorage) {
            if (localStorage.length
                    && localStorage.getItem(getMLSId())) {
                user_lists = JSON.parse(localStorage
                        .getItem(getMLSId()));
            }
        }
        
        // TODO: Hack! Methods visible to HTML
        Report.displayBasicUser = this.displayBasicUser;
        Report.displayBasicUserAll = this.displayBasicUserAll;
        Report.displayBasicDefault = this.displayBasicDefault;
        Report.displayEvoDefault = this.displayEvoDefault;            
        Report.displayEvoUser = this.displayEvoUser;
        Report.displayEvoUserAll = this.displayEvoUserAll;

        var html = "Mailing list selector:";
        html += "<form id='form_mls_selector'>";

        if (typeof lists === 'string') {
            lists = [ lists ];
        }
        for ( var i = 0; i < lists.length; i++) {
            var l = lists[i];
            html += '<input type=checkbox name="check_list" value="'
                    + l + '" ';
            html += 'onClick="';
            if (div_id_evo)
                html += 'Report.displayEvoUser(\''
                        + div_id_evo + '\');';
            if (div_id_basic)
                html += 'Report.displayBasicUser(\''
                        + div_id_basic + '\')";';
            html += '" ';
            html += 'id="' + l + '_check" ';
            if ($.inArray(l, user_lists) > -1)
                html += 'checked ';
            html += '>';
            html += MLS.displayMLSListName(l);
            html += '<br>';
        }
        html += '<input type=button value="All" ';
        html += 'onClick="';
        if (div_id_evo)
            html += 'Report.displayEvoUserAll(\'' + div_id_evo
                    + '\',true);';
        if (div_id_basic)
            html += 'Report.displayBasicUserAll(\''
                    + div_id_basic + '\',true);';
        html += '">';
        html += '<input type=button value="None" ';
        html += 'onClick="';
        if (div_id_evo)
            html += 'Report.displayEvoUserAll(\'' + div_id_evo
                    + '\',false);';
        if (div_id_basic)
            html += 'Report.displayBasicUserAll(\''
                    + div_id_basic + '\',false);';
        html += '">';
        html += '<input type=button value="Default" ';
        html += 'onClick="';
        if (div_id_evo)
            html += 'Report.displayEvoDefault(\''+div_id_evo+'\');';
        if (div_id_basic)
            html += 'Report.displayBasicDefault(\''+div_id_basic+'\')';
        html += '">';
        html += "</form>";
        $("#" + div_id_sel).html(html);
        if (Report.getProjectsList().length>1) {
            $("#" + div_id_sel).append("Not supported in multiproject");
            $('#' + div_id_sel + ' :input').attr('disabled', true);
        }
    };

    // history values should be always arrays
    function filterHistory(history) {
        if (typeof (history.id) === "number") {
            $.each(history, function(key, value) {
                value = [ value ];
            });
        }
        return history;
    }

    this.displayEvoLists = function (id, lists) {
        for ( var i = 0; i < lists.length; i++) {
            var l = lists[i];

            file_messages = this.getDataDir()+"/mls-";
            file_messages += l;
            file_messages += "-evolutionary.json";
            this.displayEvoList(MLS.displayMLSListName(l), id, file_messages);
        }
    };

    this.displayEvoList = function(list_label, id, mls_file) {
        var self = this;
        $.getJSON(mls_file, function(history) {
            // TODO: Support multiproject          
            self.envisionEvoList(list_label, id, history);
        });
    };

    this.envisionEvoList = function (list_label, div_id, history) {
        var config = Report.getConfig();
        var options = Viz.getEnvisionOptionsMin(div_id, history,  
                config.mls_hide);
        options.data.list_label = MLS.displayMLSListName(list_label);
        new envision.templates.Envision_Report(options, [ this ]);
    };
}
MLS.prototype = new DataSource("mls");
