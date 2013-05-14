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
    
    this.basic_metrics = basic_metrics;
    this.getMetrics = function() {
        return this.basic_metrics;
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
    this.setData = function(load_data, self) {
        if (self === undefined) self = this;
        self.data = load_data;
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
        self.global_data = data;
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
        self.companies_metrics_data[company] = data;
    };
    this.getCompaniesMetricsData = function() {
        return this.companies_metrics_data;
    };

    this.companies_global_data = {};
    this.addCompanyGlobalData = function(company, data, self) {
        if (self === undefined) self = this;
        self.companies_global_data[company] = data;
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
        self.repos_metrics_data[repo] = data;
    };
    this.getReposMetricsData = function() {
        return this.repos_metrics_data;
    };

    this.repos_global_data = {};
    this.addRepoGlobalData = function(repo, data, self) {
        if (self === undefined) self = this;
        self.repos_global_data[repo] = data;
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
        self.countries_metrics_data[country] = data;
    };
    this.getCountriesMetricsData = function() {
        return this.countries_metrics_data;
    };

    this.countries_global_data = {};
    this.addCountryGlobalData = function(country, data, self) {
        if (self === undefined) self = this;
        self.countries_global_data[country] = data;
    };
    this.getCountriesGlobalData = function() {
        return this.countries_global_data;
    };


    // TODO: Move this login to Report
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
            var sorted_companies = this.sortCompanies(order_by);
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
            var sorted_repos = this.sortRepos(order_by);
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
            if (report=="companies")
                sorted = this.sortCompanies(order_by);
            else if (report=="repos")
                sorted = this.sortRepos(order_by);
            else if (report=="countries")
              sorted = this.sortCountries(order_by);            
            if (limit > sorted.length) limit = sorted.length; 
            var data_limit = {};
            for (var i=0; i<limit; i++) {
                var item = sorted[i];
                data_limit[item] = data[item];
            }

            // Add a final companies_data for the sum of other values
            if (show_others) {
                var others = 0;
                for (var i=limit; i<sorted.length; i++) {
                    var item = sorted[i];
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
    
    this.displayBasicMetricsCountry = function (country, metrics, div_id, config) {
        Viz.displayBasicMetricsCountry(country, metrics,
                this.getCountriesMetricsData()[country], div_id, config);
    };

    this.displayBasicMetrics = function(metric_ids, div_target, config) {
        Viz.displayBasicMetricsHTML(metric_ids, this.getData(),
                div_target, config);
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
    
    this.sortCompanies = function(metric_id) {
    	return this.sortGlobal(metric_id, "companies");
    };
    
    this.sortRepos = function(metric_id) {
    	return this.sortGlobal(metric_id, "repos");
    };
    
    this.sortCountries = function(metric_id) {
      return this.sortGlobal(metric_id, "countries");
    };

    this.sortGlobal = function (metric_id, kind) {
        if (metric_id === undefined) metric_id = "commits";
        var metric = [];
        var sorted = [];
        var global = null;
        if (kind === "companies") {
            global = this.getCompaniesGlobalData();
            if (this.getCompaniesData().length === 0) return sorted;
            if (global[this.getCompaniesData()[0]][metric_id] === undefined)
                metric_id = "commits";
        } 
        else if (kind === "repos") {
            global = this.getReposGlobalData();
            if (this.getReposData().length === 0) return sorted;
            if (global[this.getReposData()[0]][metric_id] === undefined)
                metric_id = "commits";
        }
        else if (kind === "countries") {
            global = this.getCountriesGlobalData();
            if (this.getCountriesData().length === 0) return sorted;
            if (global[this.getCountriesData()[0]][metric_id] === undefined)
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

    this.displayCompaniesNav = function (div_nav, sort_metric) {
        var nav = "<span id='nav'></span>";
        var sorted_companies = this.sortCompanies(sort_metric);
        $.each(sorted_companies, function(id, company) {
            nav += "<a href='#"+company+"-nav'>"+company + "</a> ";
        });
        $("#"+div_nav).append(nav);
    };
    
    this.displayCompaniesLinks = function (div_links, limit, sort_metric) {
        var sorted_companies = this.sortCompanies(sort_metric);
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
        var sorted_countries = this.sortCountries(sort_metric);
        $.each(sorted_countries, function(id, country) {
            nav += "<a href='#"+country+"-nav'>"+country + "</a> ";
        });
        $("#"+div_nav).append(nav);
    };

    
    this.displayReposNav = function (div_nav, sort_metric, scm_and_its) {
        var nav = "<span id='nav'></span>";
        var sorted_repos = this.sortRepos(sort_metric);        
        $.each(sorted_repos, function(id, repo) {
            if (scm_and_its && (!(Report.getReposMap()[repo]))) return;
            nav += "<a href='#" + repo + "-nav'>";
            var label = repo;
            if (repo.lastIndexOf("http") === 0) {
                var aux = repo.split("_");
                label = aux.pop();
                if (label === '') label = aux.pop();
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
            sorted = this.sortCompanies(sort_metric);
        }
        else if (report === "repos") {
            data = this.getReposMetricsData();
            sorted = this.sortRepos(sort_metric);
        }
        else if (report === "countries") {
            data = this.getCountriesMetricsData();
            sorted = this.sortCountries(sort_metric);
        } 
        else return;

        // Preserve order when float right
        metrics.reverse();

        $.each(sorted, function(id, item) {
            if (scm_and_its && (!(Report.getReposMap()[item]))) return;
            list += "<div class='subreport-list' id='"+item+"-nav'>";
            list += "<div style='float:left;'>";
            if (report === "companies") 
                list += "<a href='company.html?company="+item+"'>";
            else if (report === "repos") {
        		list += "<a href='";
        		// Show together SCM and ITS
        		if ((ds.getName() === "scm" || ds.getName() === "its") &&
        		     (Report.getReposMap().length === undefined)) ;
        		else 
        		    list += ds.getName()+"-";
        		list += "repository.html";
        		list += "?repository="+item;
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
                // label = item.substr(item.lastIndexOf("_") + 1);
            }
            else if (item.lastIndexOf("<") === 0)
                label = MLS.displayMLSListName(item);
            list += label;
            list += "</strong> +info</a>";
            list += "<br><a href='#nav'>^</a>";
            list += "</div>";
            $.each(metrics, function(id, metric) {
                list += "<div id='"+item+"-"+metric+"'";
                list +=" class='subreport-list-item'></div>";
            });
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
                var title = metric;
                Viz.displayMetricSubReportLines(div_id, metric, items, title);
            });
        });
    };
    
    this.displayCompanySummary = function(divid, company, ds) {
        this.displaySubReportSummary("companies",divid, company, ds);
    };
    
    this.displayRepoSummary = function(divid, repo, ds) {
        this.displaySubReportSummary("repositories",divid, repo, ds);
    };
    
    this.displayCountrySummary = function(divid, repo, ds) {
        this.displaySubReportSummary("countries",divid, repo, ds);
    };

    this.displayCompaniesSummary = function(divid, ds) {
        var html = "";
        var data = ds.getGlobalData();

        html += "Total companies: " + data.companies +"<br>";
        html += "Companies in 2006: " + data.companies_2006+"<br>";
        html += "Companies in 2009: " + data.companies_2009+"<br>";
        html += "Companies in 2012: " + data.companies_2012+"<br>";

        $("#"+divid).append(html);
    };
    
    this.displaySubReportSummary = function(report, divid, item, ds) {};
    
    this.displayReposSummary = function(divid, ds) {
        var html = "";
        var data = ds.getGlobalData();
        html += "Total repositories: " + data.repositories +"<br>";
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
        var labels = true;
        var title = "Time to Attention " + column;
        Viz.displayTimeToAttention(div_id, this.getTimeToAttentionData(), column, labels, title);
    };
    
    this.displayTimeToFix = function(div_id, column, labels, title) {
        var labels = true;
        var title = "Time to Fix " + column;
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
    
    this.envisionEvo = function(div_id, history, relative) {
        config = Report.getConfig();
        var options = Viz.getEnvisionOptions(div_id, history, this.getName(),
                Report.getConfig()[this.getName()+"_hide"]);
        
        if (relative)
            Viz.addRelativeValues(options.data, this.getMainMetric());
        
        new envision.templates.Envision_Report(options, [ this ]);
    };
    
    this.displayEvo = function(divid, relative) {
        var projects_full_data = Report.getProjectsDataSources();
        
        this.envisionEvo(divid, projects_full_data, relative);
    };    
}
