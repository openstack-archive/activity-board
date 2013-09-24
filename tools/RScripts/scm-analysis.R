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
## http://vizgrimoire.bitergia.org/
##
## Analyze and extract metrics data gathered by CVSAnalY tool
## http://metricsgrimoire.github.com/CVSAnalY
##
## Authors:
##   Jesus M. Gonzalez-Barahona <jgb@bitergia.com>
##   Alvaro del Castillo <acs@bitergia.com>
##   Daniel Izquierdo Cortazar <dizquierdo@bitergia.com>
##
##
## Usage:
##  R --vanilla --args -d dbname < scm-analysis.R
## or
##  R CMD BATCH scm-analysis.R
##

library("vizgrimoire")
library("ISOweek")
library("zoo")
options(stringsAsFactors = FALSE) # avoid merge factors for toJSON 

conf <- ConfFromOptParse()
SetDBChannel (database = conf$database, user = conf$dbuser, password = conf$dbpassword)

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

# destination directory
destdir <- conf$destination

# multireport
reports=strsplit(conf$reports,",",fixed=TRUE)[[1]]

#########
#EVOLUTIONARY DATA
#########

# 1- Retrieving and 2- merging data
evol_data = GetSCMEvolutionaryData(period, conf$startdate, conf$enddate, conf$identities_db)

if ('companies' %in% reports) { 
    companies <- EvolCompanies(period, conf$startdate, conf$enddate)
    evol_data = merge(evol_data, companies, all = TRUE)
}
if ('countries' %in% reports) {
    countries <- EvolCountries(period, conf$startdate, conf$enddate)
    evol_data = merge(evol_data, countries, all = TRUE)
}

#Calculating tendencies
s = 4 #short mean
l = 20 #long mean
tendency_commits = DiffRoll(evol_data$commits,4,20)
tendency_authors = DiffRoll(evol_data$authors, 4, 20)
evol_data$tendency_commits = list('tendency_commits' = 0)
evol_data$central = list('central'=0)
evol_data$tendency_authors = list('tendency_authors' = 0)

evol_data$tendency_commits = as.numeric(evol_data$tendency_commits[1])
evol_data$tendency_authors = as.numeric(evol_data$tendency_authors[1])
evol_data$central = as.numeric(evol_data$central[1])

evol_data$tendency_commits[l:length(evol_data$tendency_commits)] = tendency_commits$metric
evol_data$tendency_authors[l:length(evol_data$tendency_authors)] = tendency_authors$metric

evol_data <- completePeriodIds(evol_data, conf$granularity, conf)
evol_data <- evol_data[order(evol_data$id), ]
evol_data[is.na(evol_data)] <- 0

# 3- Creating a JSON file 
createJSON (evol_data, paste(destdir,"/scm-evolutionary.json", sep=''))

#########
#STATIC DATA
#########

# 1- Retrieving information
static_data = GetSCMStaticData(period, conf$startdate, conf$enddate, conf$identities_db)
static_url <- StaticURL()
latest_activity7 = last_activity(7)
latest_activity14 = last_activity(14)
latest_activity30 = last_activity(30)
latest_activity60 = last_activity(60)
latest_activity90 = last_activity(90)
latest_activity365 = last_activity(365)
latest_activity730 = last_activity(730) 

community_structure = GetCodeCommunityStructure(period, conf$startdate, conf$enddate, conf$identities_db)

#Data for specific analysis
if ('companies' %in% reports){
	static_data_companies = evol_info_data_companies (conf$startdate, conf$enddate)
        static_data = merge(static_data, static_data_companies)
}
if ('countries' %in% reports){ 
	static_data_countries = evol_info_data_countries (conf$startdate, conf$enddate)
        static_data = merge(static_data, static_data_countries)
}
# 2- Merging information
static_data = merge(static_data, static_url)
static_data = merge(static_data, latest_activity7)
static_data = merge(static_data, latest_activity14)
static_data = merge(static_data, latest_activity30)
static_data = merge(static_data, latest_activity60)
static_data = merge(static_data, latest_activity90)
static_data = merge(static_data, latest_activity365)
static_data = merge(static_data, latest_activity730)
static_data = merge(static_data, community_structure)



# 3- Creating file with static data
createJSON (static_data, paste(destdir,"/scm-static.json", sep=''))


# Top authors

top_authors_data <- top_authors(conf$startdate, conf$enddate)
top_authors_data <- list()
top_authors_data[['authors.']] <- top_people(0, conf$startdate, conf$enddate, "author" , "-Bot" )
top_authors_data[['authors.last year']]<- top_people(365, conf$startdate, conf$enddate, "author", "-Bot")
top_authors_data[['authors.last month']]<- top_people(31, conf$startdate, conf$enddate, "author", "-Bot")
createJSON (top_authors_data, paste(destdir,"/scm-top.json", sep=''))


if ('companies' %in% reports) {

    companies  <- companies_name_wo_affs(c("-Bot", "-Individual", "-Unknown"), conf$startdate, conf$enddate)
    companies <- companies$name
    createJSON(companies, paste(destdir,"/scm-companies.json", sep=''))
	
    for (company in companies){
        company_name = paste("'", company, "'", sep='')
        company_aux = paste("", company, "", sep='')
        print (company_name)
	
        ######
        #Evolutionary data per company
        ######	
        # 1- Retrieving and merging info  
        evol_data = GetSCMEvolutionaryData(period, conf$startdate, conf$enddate, conf$identities_db, list("company", company_name))
        		
        evol_data <- completePeriodIds(evol_data, conf$granularity, conf)
        evol_data <- evol_data[order(evol_data$id), ]
        evol_data[is.na(evol_data)] <- 0
		
        # 2- Creation of JSON file
        createJSON(evol_data, paste(destdir,"/",company_aux,"-scm-evolutionary.json", sep=''))
				
        ########
        #Static data per company
        ########
        static_data <- GetSCMStaticData(period, conf$startdate, conf$enddate, conf$identities_db, list("company", company_name))

        createJSON(static_data, paste(destdir,"/",company_aux,"-scm-static.json", sep=''))
	
        top_authors <- company_top_authors(company_name, conf$startdate, conf$enddate)
        createJSON(top_authors, paste(destdir,"/",company_aux,"-scm-top-authors.json", sep=''))
    }
}

if ('repositories' %in% reports) {
    repos  <- repos_name(conf$startdate, conf$enddate)
    repos <- repos$name
    createJSON(repos, paste(destdir,"/scm-repos.json", sep=''))
	
    for (repo in repos) {
        repo_name = paste("'", repo, "'", sep='')
        repo_aux = paste("", repo, "", sep='')
        print (repo_name)
        
        ###########
        #EVOLUTIONARY DATA
        ###########
        #1- Retrieving data
  
        evol_data = GetSCMEvolutionaryData(period, conf$startdate, conf$enddate, conf$identities_db, list("repository", repo_name))
        evol_data <- completePeriodIds(evol_data, conf$granularity, conf)
        evol_data <- evol_data[order(evol_data$id), ]
        evol_data[is.na(evol_data)] <- 0
        
        #3- Creating JSON
        createJSON(evol_data, paste(destdir, "/",repo_aux,"-scm-evolutionary.json", sep=''))
		
        ##########
        #STATIC DATA
        ##########
        # 1- Retrieving information
        static_data = GetSCMStaticData(period, conf$startdate, conf$enddate, conf$identities_db, list("repository", repo_name))

        #3- Creating JSON
        #static_info <- evol_info_data_repo(repo_name, period, conf$startdate, conf$enddate)
        createJSON(static_data, paste(destdir, "/",repo_aux,"-scm-static.json", sep=''))		
    }		
}

