## Copyright (C) 2012, 2013 Bitergia
##
## This program is free software; you can redistribute it and/or modify
## it under the terms of the GNU General Public License as published by
## the Free Software Foundation; either version 3 of the License, or
## (at your option) any later version.
##
## This program is distributed in the hope that it will be useful,
## but WITHOUT ANY WARRANTY; without even the implied warranty of
## MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
## GNU General Public License for more details.
##
## You should have received a copy of the GNU General Public License
## along with this program; if not, write to the Free Software
## Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA 02111-1307, USA.
##
## This file is a part of the vizGrimoire.R package
##
## Authors:
##   Jesus M. Gonzalez-Barahona <jgb@bitergia.com>
##   Alvaro del Castillo <acs@bitergia.com>
##
##
## Usage:
##  R --vanilla --args -d dbname < its-analysis.R
## or
##  R CMD BATCH scm-analysis.R
##

library("vizgrimoire")
library("ISOweek")
## Analyze args, and produce config params from them
## conf <- ConfFromParameters(dbschema = "dic_cvsanaly_linux_git",
##                            user = "root", password = NULL,
##                            host = "127.0.0.1", port = 3308)
## SetDBChannel (database = conf$database,
##               user = conf$user, password = conf$password,
##               host = conf$host, port = conf$port)
# conf <- ConfFromParameters(dbschema = "kdevelop_bicho", user = "jgb", password = "XXX")

conf <- ConfFromOptParse('its')
SetDBChannel (database = conf$database, user = conf$dbuser, password = conf$dbpassword)

# period of time
if (conf$granularity == 'years') { 
    period = 'year'
    nperiod = 365
} else if (conf$granularity == 'months') { 
    period = 'month'
    nperiod = 31
} else if (conf$granularity == 'weeks') { 
    period = 'week'
    nperiod = 7
} else if (conf$granularity == 'days'){ 
    period = 'day'
    nperiod = 1
} else {stop(paste("Incorrect period:",conf$granularity))}


# backends
if (conf$backend == 'allura'){
    closed_condition <- "new_value='CLOSED'"
}
if (conf$backend == 'bugzilla'){
    closed_condition <- "(new_value='RESOLVED' OR new_value='CLOSED')"
}
if (conf$backend == 'github'){
    closed_condition <- "field='closed'"
}
if (conf$backend == 'jira'){
    closed_condition <- "new_value='CLOSED'"
}
if (conf$backend == 'launchpad'){
    #closed_condition <- "(new_value='Fix Released' or new_value='Invalid' or new_value='Expired' or new_value='Won''t Fix')"
    closed_condition <- "(new_value='Fix Committed')"
}

# dates
startdate <- conf$startdate
enddate <- conf$enddate

# database with unique identities
identities_db <- conf$identities_db

# multireport
reports=strsplit(conf$reports,",",fixed=TRUE)[[1]]

# destination directory
destdir <- conf$destination

options(stringsAsFactors = FALSE) # avoid merge factors for toJSON 

closed <- GetEvolClosed(closed_condition, period, startdate, enddate)
changed <- GetEvolChanged(period, startdate, enddate)
open <- GetEvolOpened(period, startdate, enddate)
repos <- GetEvolReposITS(period, startdate, enddate)
evol <- merge (open, closed, all = TRUE)
evol <- merge (evol, changed, all = TRUE)
evol <- merge (evol, repos, all = TRUE)

if ('companies' %in% reports) {
    info_data_companies = GetEvolCompaniesITS (period, startdate, enddate, identities_db)
    evol = merge(evol, info_data_companies, all = TRUE)
}
if ('repositories' %in% reports) {
    data = GetEvolReposITS(period, startdate, enddate)
    evol = merge(evol, data, all = TRUE)
}

evol <- completePeriodIds(evol, conf$granularity, conf)
evol[is.na(evol)] <- 0
evol <- evol[order(evol$id),]
createJSON (evol, paste(c(destdir,"/its-evolutionary.json"), collapse=''))


all_static_info <- GetStaticITS(closed_condition, startdate, enddate)

if ('companies' %in% reports) {
    info_com = GetStaticCompaniesITS (startdate, enddate, identities_db)
    all_static_info = merge(all_static_info, info_com, all = TRUE)
}

latest_activity7 = GetLastActivityITS(7, closed_condition)
latest_activity14 = GetLastActivityITS(14, closed_condition)
latest_activity30 = GetLastActivityITS(30, closed_condition)
latest_activity60 = GetLastActivityITS(60, closed_condition)
latest_activity90 = GetLastActivityITS(90, closed_condition)
latest_activity365 = GetLastActivityITS(365, closed_condition)
latest_activity730 = GetLastActivityITS(730, closed_condition)
all_static_info = merge(all_static_info, latest_activity7)
all_static_info = merge(all_static_info, latest_activity14)
all_static_info = merge(all_static_info, latest_activity30)
all_static_info = merge(all_static_info, latest_activity60)
all_static_info = merge(all_static_info, latest_activity90)
all_static_info = merge(all_static_info, latest_activity365)
all_static_info = merge(all_static_info, latest_activity730)
createJSON (all_static_info, paste(c(destdir,"/its-static.json"), collapse=''))

# Top closers
top_closers_data <- list()
top_closers_data[['closers.']]<-GetTopClosersByAssignee(0, conf$startdate, conf$enddate,identities_db, c("-Bot"))
top_closers_data[['closers.last year']]<-GetTopClosersByAssignee(365, conf$startdate, conf$enddate,identities_db, c("-Bot"))
top_closers_data[['closers.last month']]<-GetTopClosersByAssignee(31, conf$startdate, conf$enddate,identities_db, c("-Bot"))


createJSON (top_closers_data, paste(c(destdir,"/its-top.json"), collapse=''))

# People List for working in unique identites
# people_list <- its_people()
# createJSON (people_list, paste(c(destdir,"/its-people.json"), collapse=''))

# Repositories
if ('repositories' %in% reports) {	
    repos  <- GetReposNameITS()
    repos <- repos$name
    createJSON(repos, paste(c(destdir,"/its-repos.json"), collapse=''))
	
    for (repo in repos) {
        repo_name = paste(c("'", repo, "'"), collapse='')
        repo_aux = paste(c("", repo, ""), collapse='')
        repo_file = gsub("/","_",repo)
		
        closed <- GetRepoEvolClosed(repo_name, closed_condition, period, startdate, enddate)
        changed <- GetRepoEvolChanged(repo_name, period, startdate, enddate)
        opened <- GetRepoEvolOpened(repo_name, period, startdate, enddate)        
        evol = merge(closed, changed, all = TRUE)
        evol = merge(evol, opened, all = TRUE)        
        evol <- completePeriodIds(evol, conf$granularity, conf)
        evol[is.na(evol)] <- 0
        evol <- evol[order(evol$id),]
        createJSON(evol, paste(c(destdir,"/",repo_file,"-its-evolutionary.json"), collapse=''))
		
        static_info <- GetStaticRepoITS(repo_name, startdate, enddate)
        createJSON(static_info, paste(c(destdir,"/",repo_file,"-its-static.json"), collapse=''))
	}
}

# COMPANIES
if ('companies' %in% reports) {

    # companies <- its_companies_name_wo_affs(c("-Bot", "-Individual", "-Unknown"), startdate, enddate, identities_db)
    companies  <- GetCompaniesNameITS(startdate, enddate, identities_db, c("-Bot", "-Individual", "-Unknown"))
    companies <- companies$name
    createJSON(companies, paste(c(destdir,"/its-companies.json"), collapse=''))
    
    for (company in companies){
        company_name = paste(c("'", company, "'"), collapse='')
        company_aux = paste(c("", company, ""), collapse='')
        print (company_name)

        closed <- GetCompanyEvolClosed(company_name, closed_condition, period, startdate, enddate, identities_db)
        changed <- GetCompanyEvolChanged(company_name, period, startdate, enddate, identities_db)
        opened <- GetCompanyEvolOpened(company_name, period, startdate, enddate, identities_db)        
        evol = merge(closed, changed, all = TRUE)
        evol = merge(evol, opened, all = TRUE)
        evol <- completePeriodIds(evol, conf$granularity, conf)
        evol[is.na(evol)] <- 0
        evol <- evol[order(evol$id),]               
        createJSON(evol, paste(c(destdir,"/",company_aux,"-its-evolutionary.json"), collapse=''))

        static_info <- GetCompanyStaticITS(company_name, closed_condition, startdate, enddate, identities_db)
        createJSON(static_info, paste(c(destdir,"/",company_aux,"-its-static.json"), collapse=''))
		
        top_closers <- GetCompanyTopClosers(company_name, startdate, enddate, identities_db)
        createJSON(top_closers, paste(c(destdir,"/",company_aux,"-its-top-closers.json"), collapse=''))

    }
}

    
