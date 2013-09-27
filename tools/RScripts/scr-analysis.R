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
## Analyze and extract metrics data gathered by Bicho tool
## http://metricsgrimoire.github.com/Bicho
##
## Authors:
##   Daniel Izquierdo Cortazar <dizquierdo@bitergia.com>
##
##
## Usage:
##  R --vanilla --args -d dbname < scr-analysis.R
## or
##  R CMD BATCH scm-analysis.R
##

library("vizgrimoire")
library("ISOweek")
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
#type of analysis
reports=strsplit(conf$reports,",",fixed=TRUE)[[1]]

reviews_type <- list("submitted", "opened", "new", "inprogress", "closed", "merged", "abandoned")

evaluations_type <- list("verified", "approved", "codereview", "sent")
#########
#EVOLUTIONARY DATA
########

print ("ANALYSIS PER TYPE OF REVIEW")
reviews.evol = NA
#Reviews info
data = EvolReviewsSubmitted(period, conf$startdate, conf$enddate)
reviews.evol <- completePeriodIds(data, conf$granularity, conf)
data = EvolReviewsOpened(period, conf$startdate, conf$enddate)
reviews.evol = merge(reviews.evol, completePeriodIds(data, conf$granularity, conf), all=TRUE)
data = EvolReviewsNew(period, conf$startdate, conf$enddate)
reviews.evol = merge(reviews.evol, completePeriodIds(data, conf$granularity, conf), all=TRUE)
data = EvolReviewsInProgress(period, conf$startdate, conf$enddate)
reviews.evol = merge(reviews.evol, completePeriodIds(data, conf$granularity, conf), all=TRUE)
data = EvolReviewsClosed(period, conf$startdate, conf$enddate)
reviews.evol = merge(reviews.evol, completePeriodIds(data, conf$granularity, conf), all=TRUE)
data = EvolReviewsMerged(period, conf$startdate, conf$enddate)
reviews.evol = merge(reviews.evol, completePeriodIds(data, conf$granularity, conf), all=TRUE)
data = EvolReviewsAbandoned(period, conf$startdate, conf$enddate)
reviews.evol = merge(reviews.evol, completePeriodIds(data, conf$granularity, conf), all=TRUE)
#Patches info
data = EvolPatchesVerified(period, conf$startdate, conf$enddate)
reviews.evol = merge(reviews.evol, completePeriodIds(data, conf$granularity, conf), all=TRUE)
data = EvolPatchesApproved(period, conf$startdate, conf$enddate)
reviews.evol = merge(reviews.evol, completePeriodIds(data, conf$granularity, conf), all=TRUE)
data = EvolPatchesCodeReview(period, conf$startdate, conf$enddate)
reviews.evol = merge(reviews.evol, completePeriodIds(data, conf$granularity, conf), all=TRUE)
data = EvolPatchesSent(period, conf$startdate, conf$enddate)
reviews.evol = merge(reviews.evol, completePeriodIds(data, conf$granularity, conf), all=TRUE)
#Waiting for actions info
data = EvolWaiting4Reviewer(period, conf$startdate, conf$enddate)
reviews.evol = merge(reviews.evol, completePeriodIds(data, conf$granularity, conf), all=TRUE)
data = EvolWaiting4Submitter(period, conf$startdate, conf$enddate)
reviews.evol = merge(reviews.evol, completePeriodIds(data, conf$granularity, conf), all=TRUE)
#Reviewers info
data = EvolReviewers(period, conf$startdate, conf$enddate)
reviews.evol = merge(reviews.evol, completePeriodIds(data, conf$granularity, conf), all=TRUE)
createJSON(reviews.evol, paste(destdir,"/scr-evolutionary.json", sep=''))


#########
#STATIC DATA
#########

reviews.static = NA
#Reviews info
reviews.static = StaticReviewsSubmitted(period, conf$startdate, conf$enddate)
reviews.static = merge(reviews.static, StaticReviewsOpened(period, conf$startdate, conf$enddate))
reviews.static = merge(reviews.static, StaticReviewsNew(period, conf$startdate, conf$enddate))
reviews.static = merge(reviews.static, StaticReviewsInProgress(period, conf$startdate, conf$enddate))
reviews.static = merge(reviews.static, StaticReviewsClosed(period, conf$startdate, conf$enddate))
reviews.static = merge(reviews.static, StaticReviewsMerged(period, conf$startdate, conf$enddate))
reviews.static = merge(reviews.static, StaticReviewsAbandoned(period, conf$startdate, conf$enddate))
#Patches info
reviews.static = merge(reviews.static, StaticPatchesVerified(period, conf$startdate, conf$enddate))
reviews.static = merge(reviews.static, StaticPatchesApproved(period, conf$startdate, conf$enddate))
reviews.static = merge(reviews.static, StaticPatchesCodeReview(period, conf$startdate, conf$enddate))
reviews.static = merge(reviews.static, StaticPatchesSent(period, conf$startdate, conf$enddate))
#Waiting for actions info
reviews.static = merge(reviews.static, StaticWaiting4Reviewer(period, conf$startdate, conf$enddate))
reviews.static = merge(reviews.static, StaticWaiting4Submitter(period, conf$startdate, conf$enddate))
#Reviewers info
reviews.static = merge(reviews.static, StaticReviewers(period, conf$startdate, conf$enddate))
createJSON(reviews.static, paste(destdir,"/scr-static.json", sep=''))




########
#ANALYSIS PER REPOSITORY
########

print("ANALYSIS PER REPOSITORY")
if ('repositories' %in% reports) {
    repos  <- GetReposSRCName(conf$startdate, conf$enddate)
    repos <- repos$name
    #createJSON(repos, paste(destdir,"data/json/scr-repos.json", sep=''))

    for (repo in repos) {
        repo_name = paste("'", repo, "'", sep='')
        repo_aux = paste("", repo, "", sep='')
        print (repo_name)

        first = TRUE
        evol_data = data.frame()
        for (analysis in reviews_type)
        {
            data = EvolReviews(period, conf$startdate, conf$enddate, analysis, list("repository", repo_name))
            data <- completePeriodIds(data, conf$granularity, conf)
            data <- data[order(data$id),]
            data[is.na(data)] <- 0
            if (first) {
                evol_data = data
                first = FALSE
            }else{
               evol_data = merge(evol_data, data, all = TRUE)
            }
    

        }
        createJSON(evol_data, paste(destdir, "/",repo_aux,"-scr-reviews-evolutionary.json", sep=''))

        first = TRUE
        evol_data = data.frame()
        for (analysis in evaluations_type)
        {
            data = EvolEvaluations(period, conf$startdate, conf$enddate, analysis, list("repository", repo_name))
            data <- completePeriodIds(data, conf$granularity, conf)
            data <- data[order(data$id),]
            data[is.na(data)] <- 0
            if (first) {
                evol_data = data
                first = FALSE
            }else{
               evol_data = merge(evol_data, data, all = TRUE)
            }    
        }
        createJSON(evol_data, paste(destdir, "/",repo_aux,"-scr-patches-evolutionary.json", sep=''))

        data = Waiting4Review(period, conf$startdate, conf$enddate, conf$identities_db,  list("repository", repo_name))
        data1 <- completePeriodIds(data1, conf$granularity, conf)
        data1 <- data1[order(data1$id),]
        data1[is.na(data1)] <- 0
    
        data = Waiting4Submitter(period, conf$startdate, conf$enddate, conf$identities_db,  list("repository", repo_name))
        data <- completePeriodIds(data, conf$granularity, conf)
        data <- data[order(data$id),]
        data[is.na(data)] <- 0
        evol_data = merge(data, data1, all=TRUE)
        createJSON(evol_data, paste(destdir, "/",repo_aux,"-scr-waiting-evolutionary.json", sep=''))
    }
}
