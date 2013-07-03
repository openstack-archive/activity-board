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

// TODO: Use attributes for getters and setters

function DataSource(name, basic_metrics) {
    
    this.top_data_file = this.data_dir + '/'+this.name+'-top.json';
    this.getTopDataFile = function() {
        return this.top_data_file;
    };
    
    this.getMetrics = function() {return this.basic_metrics;};
    this.setMetrics = function(metrics) {this.basic_metrics = metrics;};
    
    this.setMetricsDefinition = function(metrics) {
        if (metrics === undefined) return;
        this.setMetrics(metrics);
    };
    
    this.data_file = this.data_dir + '/'+this.name+'-evolutionary.json';
    this.getDataFile = function() {
        return this.data_file;
    };
    this.setDataFile = function(file) {
        this.data_file = file;
    };
    
    this.data = null;
    this.getData = function() {
        return this.data;
    };
    
    function nameSpaceMetrics(plain_metrics, ds) {
        // If array, no data available
        if (plain_metrics instanceof Array) 
            return plain_metrics;
        var metrics = {};
        $.each(plain_metrics, function (name, value) {
            var basic_name = name;
            // commits_7, commits_30 ....
            var aux = name.split("_");
            if (isNaN(aux[aux.length-1]) === false)
                basic_name = aux.slice(0,aux.length-1).join("_"); 
            var ns_basic_name = ds.getName()+"_"+basic_name;
            var ns_name = ds.getName()+"_"+name;
            if (ds.getMetrics()[ns_basic_name] === undefined)
                metrics[name] = value;
            else metrics[ns_name] = value;
        });
        return metrics;
    }
    
    this.setData = function(load_data, self) {
        if (self === undefined) self = this;
        self.data = nameSpaceMetrics(load_data, self);
    };
    
    
    this.demographics_file = this.data_dir + '/'+this.name+'-demographics.json';
    this.getDemographicsFile = function() {
        return this.demographics_file;
    };
    
    this.demographics_data = null;
    this.getDemographicsData = function() {
        return this.demographics_data;
    };
    this.setDemographicsData = function(data, self) {
        if (self === undefined) self = this;
        self.demographics_data = data;
    };
    
    this.data_dir = 'data/json';
    this.getDataDir = function() {
        return this.data_dir;
    };
    this.setDataDir = function(dataDir) {
        this.data_dir = dataDir;
        this.data_file = dataDir + '/'+this.name+'-evolutionary.json';
        this.demographics_file = dataDir + '/'+this.name+'-demographics.json';
        this.global_data_file = dataDir + '/'+this.name+'-static.json';
        this.top_data_file = dataDir + '/'+this.name+'-top.json';
        this.companies_data_file = dataDir+'/'+ this.name +'-companies.json';
        this.repos_data_file = dataDir+'/'+ this.name +'-repos.json';
        this.countries_data_file = dataDir+'/'+ this.name +'-countries.json';
        this.time_to_fix_data_file = dataDir+'/'+ this.name +'-quantiles-month-time_to_fix_hour.json';
    };
    

    this.global_data_file = this.data_dir + '/'+this.name+'-static.json';
    this.getGlobalDataFile = function() {
        return this.global_data_file;
    };
    
    this.global_data = null;
    this.getGlobalData = function() {
        return this.global_data;
    };
    this.setGlobalData = function(data, self) {
        if (self === undefined) self = this;
        self.global_data = nameSpaceMetrics(data, self);
    };
    
    this.global_top_data = null;
    this.getGlobalTopData = function() {
        return this.global_top_data;
    };
    this.setGlobalTopData = function(data, self) {
        if (self === undefined) self = this;
        self.global_top_data = data;
    };
    this.addGlobalTopData = function(data, self, metric, period) {
        if (period === undefined) period = "all";
        if (self === undefined) self = this;
        if (self.global_top_data === null)
            self.global_top_data = {};
        if (self.global_top_data[metric] === undefined)
            self.global_top_data[metric] = {};
        self.global_top_data[metric][period] = data;
    };

    this.name = name;    
    this.getName = function() {
        return this.name;
    };

    this.people_data_file = this.data_dir + '/'+this.name+'-people.json';
    this.getPeopleDataFile = function() {
        return this.people_data_file;
    };
    this.people = null;
    this.getPeopleData = function() {
        return this.people;
    };
    this.setPeopleData = function(people, self) {
        if (self === undefined) self = this;
        self.people = people;
    };
    
    this.time_to_fix_data_file = this.data_dir + '/'+this.name 
            + '-quantiles-month-time_to_fix_hour.json';
    this.getTimeToFixDataFile = function() {
        return this.time_to_fix_data_file;
    };
    this.time_to_fix_data = null;
    this.getTimeToFixData = function() {
        return this.time_to_fix_data;
    };
    this.setTimeToFixData = function(data, self) {
        if (self === undefined) self = this;
        self.time_to_fix_data = data;
    };
    
    this.time_to_attention_data_file = this.data_dir + '/'+this.name 
            + '-quantiles-month-time_to_attention_hour.json';
    this.getTimeToAttentionDataFile = function() {
        return this.time_to_attention_data_file;
    };
    this.time_to_attention_data = null;
    this.getTimeToAttentionData = function() {
        return this.time_to_attention_data;
    };
    this.setTimeToAttentionData = function(data, self) {
        if (self === undefined) self = this;
        self.time_to_attention_data = data;
    };
        
    this.project = null;
    this.getProject = function() {
        return this.project;
    };
    this.setProject = function(project) {
        this.project = project;
    };
    
    // Companies data
    this.companies_data_file = this.data_dir+'/'+ this.name +'-companies.json';
    this.getCompaniesDataFile = function() {
        return this.companies_data_file;
    };

    this.companies = null;
    this.getCompaniesData = function() {
        return this.companies;
    };
    this.setCompaniesData = function(companies, self) {
        if (companies === null) companies = [];
        if (!(companies instanceof Array)) companies=[companies];
        if (self === undefined) self = this;
        self.companies = companies;
    };

    this.companies_metrics_data = {};
    this.addCompanyMetricsData = function(company, data, self) {
        if (self === undefined) self = this;
        self.companies_metrics_data[company] = nameSpaceMetrics(data, self);
    };
    this.getCompaniesMetricsData = function() {
        return this.companies_metrics_data;
    };

    this.companies_global_data = {};
    this.addCompanyGlobalData = function(company, data, self) {
        if (self === undefined) self = this;
        self.companies_global_data[company] = nameSpaceMetrics(data, self);
    };
    this.getCompaniesGlobalData = function() {
        return this.companies_global_data;
    };

    this.companies_top_data = {};
    this.addCompanyTopData = function(company, data, self, period) {
        if (period === undefined) period = "all";
        if (self === undefined) self = this;
        if (self.companies_top_data[company] === undefined)
            self.companies_top_data[company] = {};
        self.companies_top_data[company][period] = data;
    };
    this.getCompaniesTopData = function() {
        return this.companies_top_data;
    };
    this.setCompaniesTopData = function(data, self) {
        if (self === undefined) self = this;
        self.companies_top_data = data;
    };

    // Repos data
    this.repos_data_file = 
        this.data_dir+'/'+ this.name +'-repos.json';
    this.getReposDataFile = function() {
        return this.repos_data_file;
    };

    this.repos = null;
    this.getReposData = function() {
        return this.repos;
    };
    this.setReposData = function(repos, self) {
        if (self === undefined) self = this;
        if (!(repos instanceof Array)) repos=[repos];
        self.repos = repos;
    };

    this.repos_metrics_data = {};
    this.addRepoMetricsData = function(repo, data, self) {
        if (self === undefined) self = this;
        self.repos_metrics_data[repo] = nameSpaceMetrics(data, self);
    };
    this.getReposMetricsData = function() {
        return this.repos_metrics_data;
    };

    this.repos_global_data = {};
    this.addRepoGlobalData = function(repo, data, self) {
        if (self === undefined) self = this;
        self.repos_global_data[repo] =  nameSpaceMetrics(data, self);
    };
    this.getReposGlobalData = function() {
        return this.repos_global_data;
    };
    
    // Countries data
    this.countries_data_file = 
        this.data_dir+'/'+ this.name +'-countries.json';
    this.getCountriesDataFile = function() {
        return this.countries_data_file;
    };

    this.countries = null;
    this.getCountriesData = function() {
        return this.countries;
    };
    this.setCountriesData = function(countries, self) {
        if (self === undefined) self = this;
        self.countries = countries;
    };

    this.countries_metrics_data = {};
    this.addCountryMetricsData = function(country, data, self) {
        if (self === undefined) self = this;
        self.countries_metrics_data[country] = nameSpaceMetrics(data, self);
    };
    this.getCountriesMetricsData = function() {
        return this.countries_metrics_data;
    };

    this.countries_global_data = {};
    this.addCountryGlobalData = function(country, data, self) {
        if (self === undefined) self = this;
        self.countries_global_data[country] = nameSpaceMetrics(data, self);
    };
    this.getCountriesGlobalData = function() {
        return this.countries_global_data;
    };


    // TODO: Move this logic to Report
    this.getCompanyQuery = function () {
        var company = null;
        var querystr = window.location.search.substr(1);
        if (querystr  &&
                querystr.split("&")[0].split("=")[0] === "company")
            company = querystr.split("&")[0].split("=")[1];
        return company;
    };

    // TODO: data and projects should be in the same dictionary
    this.displayBasicHTML = function(div_target, config, title) {
        var full_data = [];
        var projects = [];
        var ds_name = this.getName();

        $.each(Report.getDataSources(), function (index, ds) {
           if (ds.getName() === ds_name) {
               if (ds.getData() instanceof Array) return;
               full_data.push(ds.getData());
               projects.push(ds.getProject());
           } 
        });
        Viz.displayBasicHTML(full_data, div_target, this.getTitle(), 
                this.basic_metrics, this.name+'_hide', config, projects);
    };

    this.displayBasicMetricCompanies = function(metric_id,
            div_target, config, limit, order_by) {
        if (order_by === undefined) order_by = metric_id;
        var companies_data = this.getCompaniesMetricsData();
        if (limit) {
            var sorted_companies = DataProcess.sortCompanies(this, order_by);
            if (limit > sorted_companies.length) 
                limit = sorted_companies.length; 
            var companies_data_limit = {};
            for (var i=0; i<limit; i++) {
                var company = sorted_companies[i];
                companies_data_limit[company] = companies_data[company];
            }
            companies_data = companies_data_limit;
        }
        Viz.displayBasicMetricCompaniesHTML(metric_id, companies_data,
                div_target, config, limit);
    };
    
    this.displayBasicMetricMyCompanies = function(companies, metric_id,
            div_target, config, start, end) {
        var companies_data = {};
        var self = this;
        $.each(companies, function(i,name) {
            companies_data[name] = self.getCompaniesMetricsData()[name];
        });
        Viz.displayBasicMetricCompaniesHTML(metric_id, companies_data,
                div_target, config, start, end);
    };

    
    // TODO: mix with displayBasicMetricCompanies
    this.displayBasicMetricRepos = function(metric_id,
            div_target, config, limit, order_by) {
        if (order_by === undefined) order_by = metric_id;
        var repos_data = this.getReposMetricsData();
        if (limit) {
            var sorted_repos = DataProcess.sortRepos(this, order_by);
            if (limit > sorted_repos.length) 
                limit = sorted_repos.length; 
            var repos_data_limit = {};
            for (var i=0; i<limit; i++) {
                var repo = sorted_repos[i];
                repos_data_limit[repo] = repos_data[repo];
            }
            repos_data = repos_data_limit;
        }
        Viz.displayBasicMetricRepos(metric_id, repos_data,
                div_target, config, limit);
    };
    
    this.displayBasicMetricMyRepos = function(repos, metric_id,
            div_target, config, start, end) {
        var repos_data = {};
        var self = this;
        $.each(repos, function(i,name) {
            var metrics = self.getReposMetricsData()[name];
            if (!metrics) {
                name = Report.getReposMap()[name];
                metrics = self.getReposMetricsData()[name];
            }
            repos_data[name] = metrics;
        });
        Viz.displayBasicMetricRepos(metric_id, repos_data,
                div_target, config, start, end);
    };

    this.displayBasicMetricCompaniesStatic = function (metric_id,
            div_target, config, limit, order_by, show_others) {
        
        this.displayBasicMetricSubReportStatic ("companies",metric_id,
                div_target, config, limit, order_by, show_others);
    };
    
    this.displayBasicMetricReposStatic = function (metric_id,
            div_target, config, limit, order_by, show_others) {
        
        this.displayBasicMetricSubReportStatic ("repos", metric_id,
                div_target, config, limit, order_by, show_others);
    };
    
    this.displayBasicMetricCountriesStatic = function (metric_id,
          div_target, config, limit, order_by, show_others) {
    
        this.displayBasicMetricSubReportStatic ("countries", metric_id,
            div_target, config, limit, order_by, show_others);
    };
    
    
    this.displayBasicMetricSubReportStatic = function (report, metric_id,
            div_target, config, limit, order_by, show_others) {
        if (order_by === undefined) order_by = metric_id;
        var data = null;
        if (report=="companies")
            data = this.getCompaniesGlobalData();
        else if (report=="repos")
            data = this.getReposGlobalData();
        else if (report=="countries")
          data = this.getCountriesGlobalData();
        else return;
        if (limit) {
            var sorted = null;
            var item = null;
            if (report=="companies")
                sorted = DataProcess.sortCompanies(this, order_by);
            else if (report=="repos")
                sorted = DataProcess.sortRepos(this, order_by);
            else if (report=="countries")
              sorted = DataProcess.sortCountries(this, order_by);            
            if (limit > sorted.length) limit = sorted.length; 
            var data_limit = {};
            for (var i=0; i<limit; i++) {
                item = sorted[i];
                data_limit[item] = data[item];
            }

            // Add a final companies_data for the sum of other values
            if (show_others) {
                var others = 0;
                for (var j=limit; j<sorted.length; j++) {
                    item = sorted[j];
                    others += data[item][metric_id];
                }
                data_limit.others = {};
                data_limit.others[metric_id] = others;
            }
            data = data_limit;
        }
        
        Viz.displayBasicMetricSubReportStatic(metric_id, data,
            div_target, config, limit);
    };    

    this.displayBasicMetricsCompany = function (
            company, metrics, div_id, config) {
        Viz.displayBasicMetricsCompany(company, metrics,
                this.getCompaniesMetricsData()[company], div_id, config);
    };
    
    this.displayBasicMetricsRepo = function (repo, metrics, div_id, config) {
        Viz.displayBasicMetricsRepo(repo, metrics,
                this.getReposMetricsData()[repo], div_id, config);
    };
    
    this.displayBasicMetricsPeople = function (upeople_id, upeople_identifier, metrics, div_id, config) {
        var json_file = "people-"+upeople_id+"-"+this.getName()+"-evolutionary.json";
        var self = this;
        $.when($.getJSON(this.getDataDir()+"/"+json_file)).done(function(history) {
            history = nameSpaceMetrics(history, self);
            Viz.displayBasicMetricsPeople(upeople_identifier, metrics, history, div_id, config);
        }).fail(function() {
            $("#people").empty();
            $("#people").html('No data available for people');
        });
    };
    
    this.displayBasicMetricsCountry = function (country, metrics, div_id, config) {
        Viz.displayBasicMetricsCountry(country, metrics,
                this.getCountriesMetricsData()[country], div_id, config);
    };

    this.displayBasicMetrics = function(metric_ids, div_target, config, convert) {
        var data = this.getData();
        if (convert) {
            if (convert === "aggregate")
                data = DataProcess.aggregate(data, metric_ids);
            if (convert === "substract") {
                data = DataProcess.substract(data, metric_ids[0], metric_ids[1]);
                metric_ids = ['substract'];
            }
            if (convert === "substract-aggregate") {
                data = DataProcess.substract(data, metric_ids[0], metric_ids[1]);
                metric_ids = ['substract'];
                data = DataProcess.aggregate(data, metric_ids);
            }

        }
        Viz.displayBasicMetricsHTML(metric_ids, data, div_target, config);
    };

    this.displayBasicMetricHTML = function(metric_id, div_target, config) {
        var projects = [];
        var full_data = [];
        var ds_name = this.getName();
        $.each(Report.getDataSources(), function (index, ds) {
           if (ds.getName() === ds_name) {
               if (ds.getData() instanceof Array) return;
               full_data.push(ds.getData());
               projects.push(ds.getProject());
           } 
        });

        Viz.displayBasicMetricHTML(this.basic_metrics[metric_id], full_data,
                div_target, config, projects);
    };
    
    this.displayBasic = function() {
        this.basicEvo(this.getData());
    };    

    this.displayCompaniesNav = function (div_nav, sort_metric) {
        var nav = "<span id='nav'></span>";
        var sorted_companies = DataProcess.sortCompanies(this, sort_metric);
        $.each(sorted_companies, function(id, company) {
            nav += "<a href='#"+company+"-nav'>"+company + "</a> ";
        });
        $("#"+div_nav).append(nav);
    };
    
    this.displayCompaniesLinks = function (div_links, limit, sort_metric) {
        var sorted_companies = DataProcess.sortCompanies(this, sort_metric);
        var links = "";
        var i = 0;
        $.each(sorted_companies, function(id, company) {
            links += '<a href="company.html?company='+company+'">'+company+'</a> | ';
            if (i++>limit) return false;
        });
        $("#"+div_links).append(links);
    };
    
    this.displayCountriesNav = function (div_nav, sort_metric) {
        var nav = "<span id='nav'></span>";
        var sorted_countries = DataProcess.sortCountries(this, sort_metric);
        $.each(sorted_countries, function(id, country) {
            nav += "<a href='#"+country+"-nav'>"+country + "</a> ";
        });
        $("#"+div_nav).append(nav);
    };
    
    this.displayReposNav = function (div_nav, sort_metric, scm_and_its) {
        var nav = "<span id='nav'></span>";
        var sorted_repos = DataProcess.sortRepos(this, sort_metric);
        var self = this;
        $.each(sorted_repos, function(id, repo) {
            if (scm_and_its && (!(Report.getReposMap()[repo]))) return;
            nav += "<a href='#" + repo + "-nav'>";
            var label = repo;
            if (repo.lastIndexOf("http") === 0) {
                var aux = repo.split("_");
                label = aux.pop();
                if (label === '') label = aux.pop();
                if (self.getName() === "its") {
                    label = label.replace('buglist.cgi?product=','');
                }
                // label = repo.substr(repo.lastIndexOf("_") + 1);
            }
            else if (repo.lastIndexOf("<") === 0)
                label = MLS.displayMLSListName(repo);
            nav += label;
            nav += "</a> ";
        });
        $("#" + div_nav).append(nav);
    };


    this.displayCompaniesList = function (metrics,div_id, 
            config_metric, sort_metric) {
        this.displaySubReportList("companies",metrics,div_id, 
                config_metric, sort_metric);
    };
    
    this.displayReposList = function (metrics,div_id, 
            config_metric, sort_metric, scm_and_its) {
        this.displaySubReportList("repos",metrics,div_id, 
                config_metric, sort_metric, scm_and_its);
    };
    
    this.displayCountriesList = function (metrics,div_id, 
            config_metric, sort_metric) {
        this.displaySubReportList("countries",metrics,div_id, 
                config_metric, sort_metric);
    };
    
    this.displaySubReportList = function (report, metrics,div_id, 
            config_metric, sort_metric, scm_and_its) {
        var list = "";
        var ds = this;
        var data = null, sorted = null;
        if (report === "companies") {
            data = this.getCompaniesMetricsData();
            sorted = DataProcess.sortCompanies(this, sort_metric);
        }
        else if (report === "repos") {
            data = this.getReposMetricsData();
            sorted = DataProcess.sortRepos(this, sort_metric);
        }
        else if (report === "countries") {
            data = this.getCountriesMetricsData();
            sorted = DataProcess.sortCountries(this, sort_metric);
        } 
        else return;

        // Preserve order when float right
        metrics.reverse();

        $.each(sorted, function(id, item) {
            if (scm_and_its && (!(Report.getReposMap()[item]))) return;
            list += "<div class='subreport-list' id='"+item+"-nav' style='height:175px'>";
            list += "<div>";
            if (report === "companies") 
                list += "<a href='company.html?company="+item+"'>";
            else if (report === "repos") {
                list += "<a href='";
                // Show together SCM and ITS
                if ((ds.getName() === "scm" || ds.getName() === "its")
                        && (Report.getReposMap().length === undefined));
                else
                    list += ds.getName() + "-";
                list += "repository.html";
                list += "?repository=" + encodeURIComponent(item);
                list += "&data_dir=" + Report.getDataDir();
                list += "'>";
            }
            else if (report === "countries") {
                list += "<a href='"+ds.getName();
                list += "-country.html?country="+item;
                list += "&data_dir=" + Report.getDataDir();
                list += "'>";
            }
            list += "<strong>";
            var label = item;
            if (item.lastIndexOf("http") === 0) {
                var aux = item.split("_");
                label = aux.pop();
                if (label === '') label = aux.pop();
                if (ds.getName() === "its") {
                    label = label.replace('buglist.cgi?product=','');
                }
                // label = item.substr(item.lastIndexOf("_") + 1);
            }
            else if (item.lastIndexOf("<") === 0)
                label = MLS.displayMLSListName(item);
            list += label;
            list += "</strong> +info</a>";
            list += "<br><a href='#nav'>^</a>";
            list += "</div>";
            list += "<div style='height:150px'>"; 
            $.each(metrics, function(id, metric) {
                list += "<div id='"+item+"-"+metric+"'";
                list +=" class='subreport-list-item'></div>";
            });
            list += "</div>";
            list += "</div>";
        });
        $("#"+div_id).append(list);
        // Draw the graphs
        $.each(sorted, function(id, item) {
            if (scm_and_its && (!(Report.getReposMap()[item]))) return;
            $.each(metrics, function(id, metric) {
                var item_data = data[item];
                if (item_data[metric] === undefined && report === "repos") {
                    // Hack to support showing ITS+SCM metrics in repos
                    var map_repo = Report.getReposMap()[item];                    
                    if (map_repo) {
                        new_data = ds.getITS().getReposMetricsData()[map_repo];
                        item_data = new_data;
                    }
                    else return;
                }
                var div_id = item+"-"+metric;
                var items = {};
                items[item] = item_data;
                var title = ds.getMetrics()[metric].name;
                Viz.displayMetricSubReportLines(div_id, metric, items, title);
            });
        });
    };

    this.displayGlobalSummary = function(divid) {
        this.displaySummary(null, divid, null, this);
    };
    
    this.displayCompanySummary = function(divid, company, ds) {
        this.displaySummary("companies",divid, company, ds);
    };
    
    this.displayRepoSummary = function(divid, repo, ds) {
        this.displaySummary("repositories",divid, repo, ds);
    };
    
    this.displayCountrySummary = function(divid, repo, ds) {
        this.displaySummary("countries",divid, repo, ds);
    };
    
    // On demand file loading for people
    this.displayPeopleSummary = function(divid, upeople_id, 
            upeople_identifier, ds) {
        var json_file = "people-"+upeople_id+"-"+ds.getName()+"-static.json";
        $.getJSON(this.getDataDir()+"/"+json_file, null, function(history) {
            html = "<h4>"+upeople_identifier+"</h4>";
            html += "Start: "+history.first_date+" End: "+ history.last_date;
            if (ds.getName() == "scm") html += " Commits:" + history.commits;
            else if (ds.getName() == "its") html += " Closed:" + history.closed;
            else if (ds.getName() == "mls") html += " Sent:" + history.sent;
            $("#"+divid).append(html);
        });
    };

    this.displayCompaniesSummary = function(divid, ds) {
        var html = "";
        var data = ds.getGlobalData();

        html += "Total companies: " + data.companies +"<br>";
        if (data.companies_2006)
            html += "Companies in 2006: " + data.companies_2006+"<br>";
        if (data.companies_2009)
            html += "Companies in 2009: " + data.companies_2009+"<br>";
        if (data.companies_2012)
            html += "Companies in 2012: " + data.companies_2012+"<br>";

        $("#"+divid).append(html);
    };
    
    this.displaySummary = function(report, divid, item, ds) {};
    
    this.displayReposSummary = function(divid, ds) {
        var html = "";
        var data = ds.getGlobalData();
        html += "Total repositories: " + data[ds.getName()+"_repositories"] +"<br>";
        $("#"+divid).append(html);
    };
    
    this.displayCountriesSummary = function(divid, ds) {
      var html = "";
      var data = ds.getGlobalData();
      html += "Total countries: " + data.countries +"<br>";
      $("#"+divid).append(html);
    };

    this.displayDemographics = function(divid, file, period) {
        Viz.displayDemographics(divid, this, file, period);
    };

    this.displayTimeToAttention = function(div_id, column, labels, title) {
        labels = true;
        title = "Time to Attention " + column;
        Viz.displayTimeToAttention(div_id, this.getTimeToAttentionData(), column, labels, title);
    };
    
    this.displayTimeToFix = function(div_id, column, labels, title) {
        labels = true;
        title = "Time to Fix " + column;
        Viz.displayTimeToFix(div_id, this.getTimeToFixData(), column, labels, title);
    };
    
    this.displayTop = function(div, all, show_metric, graph) {
        if (all === undefined) all = true;
        Viz.displayTop(div, this, all, show_metric, graph);
    };
    
    this.displayTopBasic = function(div, action, doer, graph) {
        Viz.displayTopBasic(div, this, action, doer, graph);
    };

    this.displayTopCompany = function(company, div, metric, period, titles) {
        Viz.displayTopCompany(company, div, this, metric, period, titles);
    };

    this.displayTopGlobal = function(div, metric, period, titles) {
        Viz.displayTopGlobal(div, this, metric, period, titles);
    };

    this.basicEvo = function(history) {
        for (var id in this.basic_metrics) {
            var metric = this.basic_metrics[id];
            if ($.inArray(metric.column, Report.getConfig()[this.getName()+"_hide"]) > -1)
                continue;
            if ($('#' + metric.divid).length)
                Viz.displayBasicLines(metric.divid, history, metric.column,
                        true, metric.name);
        }
    };
    
    this.envisionEvo = function(div_id, history, relative, legend_show) {
        config = Report.getConfig();
        var options = Viz.getEnvisionOptions(div_id, history, this.getName(),
                Report.getConfig()[this.getName()+"_hide"]);
        options.legend_show = legend_show;
        
        if (relative)
            DataProcess.addRelativeValues(options.data, this.getMainMetric());
        
        new envision.templates.Envision_Report(options, [ this ]);
    };
    
    this.displayEvo = function(divid, relative, legend_show) {
        var projects_full_data = Report.getProjectsDataSources();
        
        this.envisionEvo(divid, projects_full_data, relative, legend_show);
    };    
}
