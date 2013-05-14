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

function SCM() {

    var basic_metrics = {
        'commits' : {
            'divid' : "scm-commits",
            'column' : "commits",
            'name' : "Commits",
            'desc' : "Evolution of the number of commits (aggregating branches)",
            'envision' : {
                y_labels : true,
                show_markers : true
            }
        },
        'committers' : {
            'divid' : "scm-committers",
            'column' : "committers",
            'name' : "Committers",
            'desc' : "Unique committers making changes to the source code",
            'action' : "commits",
            'envision' : {
                gtype : 'whiskers'
            }
        },
        'authors' : {
            'divid' : "scm-authors",
            'column' : "authors",
            'name' : "Authors",
            'desc' : "Unique authors making changes to the source code",
            'action' : "commits",
            'envision' : {
                gtype : 'whiskers'
            }
        },
        'authors_rev' : {
            'divid' : "scm-authors-rev",
            'column' : "authors_rev",
            'name' : "Authors",
            'desc' : "Unique authors making changes reviewed to the source code",
            'action' : "commits_rev",
            'envision' : {
                gtype : 'whiskers'
            }
        },
        'commits_rev' : {
            'divid' : "scm-commits-rev",
            'column' : "commits_rev",
            'name' : "Commits Reviewed",
            'desc' : "Evolution of the number of commits reviewed (aggregating branches)",
            'envision' : {
                y_labels : true,
                show_markers : true
            }
        },
        'reviewers' : {
            'divid' : "scm-reviewers",
            'column' : "reviewers",
            'name' : "Reviewers",
            'desc' : "Unique reviewers making reviews to the source code changes",
            'action' : "commits-rev",
            'envision' : {
                gtype : 'whiskers'
            }
        },
        'branches' : {
            'divid' : "scm-branches",
            'column' : "branches",
            'name' : "Branches",
            'desc' : "Evolution of the number of branches"
        },
        'files' : {
            'divid' : "scm-files",
            'column' : "files",
            'name' : "Files",
            'desc' : "Evolution of the number of unique files handled by the community"
        },
        'files' : {
            'divid' : "scm-files",
            'column' : "files",
            'name' : "Files",
            'desc' : "Evolution of the number of unique files handled by the community"
        },
        'added_lines' : {
            'divid' : "scm-added-lines",
            'column' : "added_lines",
            'name' : "Lines Added",
            'desc' : "Evolution of the source code lines added"
        },
        'removed_lines' : {
            'divid' : "scm-removed-lines-",
            'column' : "removed_lines",
            'name' : "Lines Removed",
            'desc' : "Evolution of the source code lines removed"
        },
        'repositories' : {
            'divid' : "scm-repositories",
            'column' : "repositories",
            'name' : "Repositories",
            'desc' : "Evolution of the number of repositories",
            'envision' : {
                gtype : 'whiskers'
            }
        }
    };
    
    this.getMetrics = function() {return basic_metrics;};
    
    this.getMainMetric = function() {
        return "commits";
    };
    
    this.setITS = function(its) {
        this.its = its;
    };
    
    this.getITS = function(its) {
        return this.its;
    };
    
    this.getTitle = function() {return "Change sets (commits to source code)";};
    
    this.displaySubReportSummary = function(report, divid, item, ds) {
        var label = item;
        if (item.lastIndexOf("http") === 0) {
            var aux = item.split("_");
            label = aux.pop();
            if (label === '') label = aux.pop();
        }

        var html = "<h1>"+label+"</h1>";
        var id_label = {    
            commits:'Commits',
            committers:'Committers',
            authors:'Authors',
            first_date:'Start',
            last_date:'End',
            files:'Files',
            actions:'Files actions',
            avg_commits_month:'Commits/month',
            avg_files_month:'Files/month',
            avg_authors_month:'Authors/month',
            avg_reviewers_month:'Reviewers/moth',
            avg_commits_week:'Commits/week',
            avg_files_week:'Files/week',
            avg_authors_week:'Authors/week',
            avg_reviewers_week:'Reviewers/week',
            avg_commits_author:'Commits/author',
            avg_files_author:'Files/author'
        };
        var global_data = null;
        if (report === "companies")
            global_data = ds.getCompaniesGlobalData();
        else if (report === "repositories")
            global_data = ds.getReposGlobalData();
        else if (report === "countries")
            global_data = ds.getCountriesGlobalData();
        else return;
        
        if (!global_data[item]) return;
        
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
            $(div_id + ' .scm-info').hide();
            return;
        }
        $(div_id + ' #scm_type').text(this.global_data.type);
        var url = '';
        if (this.global_data.repositories === 1) {
            url = this.global_data.url;
        } else {
            url = Report.getProjectData().scm_url;
        }
        if (this.global_data.type === "git")
            if (url) url = url.replace("git://","http://");
        $(div_id + ' #scm_url').attr("href", url);
        $(div_id + ' #scm_name').text(this.global_data.type);

        var company = this.getCompanyQuery();
        var data = this.getGlobalData();
        if (company) {
            data = this.getCompaniesGlobalData()[company];
        }
        $(div_id + ' #scmFirst').text(data.first_date);
        $(div_id + ' #scmLast').text(data.last_date);
        $(div_id + ' #scmCommits').text(data.commits);
        $(div_id + ' #scmAuthors').text(data.authors);
        if (data.reviewers)
            $(div_id + ' #scmReviewers').text(data.reviewers);
        $(div_id + ' #scmCommitters').text(data.committers);
        $(div_id + ' #scmRepositories').text(data.repositories);
        if (data.repositories === 1)
            $(div_id + ' #scmRepositories').hide();
    };

    this.displayBubbles = function(divid, radius) {
        Viz.displayBubbles(divid, "commits", "committers", radius);
    };
}
var aux = new SCM();
SCM.prototype = new DataSource("scm", aux.getMetrics());