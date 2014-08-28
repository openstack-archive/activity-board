#!/bin/bash

# common pages
python apply_template.py --template body.template --content common/overview.tmpl > ../browser/index.html
python apply_template.py --template body.template --content common/people.tmpl > ../browser/people.html
python apply_template.py --template body.template --content common/company.tmpl > ../browser/company.html
python apply_template.py --template body.template --content common/country.tmpl > ../browser/country.html
python apply_template.py --template body.template --content common/repository.tmpl > ../browser/repository.html
python apply_template.py --template body.template --content common/data_sources.tmpl > ../browser/data_sources.html
python apply_template.py --template body.template --content common/project_map.tmpl > ../browser/project_map.html
python apply_template.py --template body.template --content common/project.tmpl > ../browser/project.html
python apply_template.py --template body.template --content common/demographics.tmpl > ../browser/demographics.html
python apply_template.py --template body.template.releases --content common/releases.tmpl > ../browser/release.html

cp common/footer.tmpl ../browser/footer.html
cp common/navbar.tmpl ../browser/navbar.html


# its
python apply_template.py --template body.template --content its/overview.tmpl > ../browser/its.html 
#python apply_template.py --template body.template --content its/companies.tmpl > ../browser/its-companies.html
python build_panel.py --template body.template --content common/list-of-filters.tmpl --conf conf/main.conf --panel its-companies > ../browser/its-companies.html
python apply_template.py --template body.template --content its/contributors.tmpl > ../browser/its-contributors.html 
#python apply_template.py --template body.template --content its/countries.tmpl > ../browser/its-countries.html
python build_panel.py --template body.template --content common/list-of-filters.tmpl --conf conf/main.conf --panel its-countries > ../browser/its-countries.html
#python apply_template.py --template body.template --content its/domains.tmpl > ../browser/its-domains.html
python build_panel.py --template body.template --content common/list-of-filters.tmpl --conf conf/main.conf --panel its-domains > ../browser/its-domains.html
python apply_template.py --template body.template --content its/projects.tmpl > ../browser/its-projects.html 
#python apply_template.py --template body.template --content its/repos.tmpl > ../browser/its-repos.html
python build_panel.py --template body.template --content common/list-of-filters.tmpl --conf conf/main.conf --panel its-repos > ../browser/its-repos.html
python apply_template.py --template body.template --content its/states.tmpl > ../browser/its-states.html
python apply_template.py --template body.template --content its/states-jira.tmpl > ../browser/its-states-jira.html

# irc
python apply_template.py --template body.template --content irc/overview.tmpl > ../browser/irc.html
#python apply_template.py --template body.template --content irc/repos.tmpl > ../browser/irc-repos.html
python build_panel.py --template body.template --content common/list-of-filters.tmpl --conf conf/main.conf --panel irc-repos > ../browser/irc-repos.html
python apply_template.py --template body.template --content irc/contributors.tmpl > ../browser/irc-contributors.html

# mls
python apply_template.py --template body.template --content mls/overview.tmpl > ../browser/mls.html
#python apply_template.py --template body.template --content mls/companies.tmpl > ../browser/mls-companies.html
python build_panel.py --template body.template --content common/list-of-filters.tmpl --conf conf/main.conf --panel mls-companies > ../browser/mls-companies.html
python apply_template.py --template body.template --content mls/contributors.tmpl > ../browser/mls-contributors.html
#python apply_template.py --template body.template --content mls/countries.tmpl > ../browser/mls-countries.html
python build_panel.py --template body.template --content common/list-of-filters.tmpl --conf conf/main.conf --panel mls-countries > ../browser/mls-countries.html
#python apply_template.py --template body.template --content mls/domains.tmpl > ../browser/mls-domains.html
python build_panel.py --template body.template --content common/list-of-filters.tmpl --conf conf/main.conf --panel mls-domains > ../browser/mls-domains.html
python apply_template.py --template body.template --content mls/projects.tmpl > ../browser/mls-projects.html
#python apply_template.py --template body.template --content mls/repos.tmpl > ../browser/mls-repos.html
python build_panel.py --template body.template --content common/list-of-filters.tmpl --conf conf/main.conf --panel mls-repos > ../browser/mls-repos.html

# qaforums
python apply_template.py --template body.template --content qaforums/overview.tmpl > ../browser/qaforums.html
python apply_template.py --template body.template --content qaforums/contributors.tmpl > ../browser/qaforums-contributors.html
#python apply_template.py --template body.template --content qaforums/tags.tmpl > ../browser/qaforums-tags.html
python build_panel.py --template body.template --content common/list-of-filters.tmpl --conf conf/main.conf --panel qaforums-tags > ../browser/qaforums-tags.html

# scm
python apply_template.py --template body.template --content scm/overview.tmpl > ../browser/scm.html
#python apply_template.py --template body.template --content scm/companies.tmpl > ../browser/scm-companies.html
python build_panel.py --template body.template --content common/list-of-filters.tmpl --conf conf/main.conf --panel scm-companies > ../browser/scm-companies.html
python apply_template.py --template body.template --content scm/companies-summary.tmpl > ../browser/scm-companies-summary.html
python apply_template.py --template body.template --content scm/contributors.tmpl > ../browser/scm-contributors.html
#python apply_template.py --template body.template --content scm/countries.tmpl > ../browser/scm-countries.html
python build_panel.py --template body.template --content common/list-of-filters.tmpl --conf conf/main.conf --panel scm-countries > ../browser/scm-countries.html
#python apply_template.py --template body.template --content scm/domains.tmpl > ../browser/scm-domains.html
python build_panel.py --template body.template --content common/list-of-filters.tmpl --conf conf/main.conf --panel scm-domains > ../browser/scm-domains.html
python apply_template.py --template body.template --content scm/projects.tmpl > ../browser/scm-projects.html
#python apply_template.py --template body.template --content scm/repos.tmpl > ../browser/scm-repos.html
python build_panel.py --template body.template --content common/list-of-filters.tmpl --conf conf/main.conf --panel scm-repos > ../browser/scm-repos.html

# scr
#python apply_template.py --template body.template --content scr/companies.tmpl > ../browser/scr-companies.html
python build_panel.py --template body.template --content common/list-of-filters.tmpl --conf conf/main.conf --panel scr-companies > ../browser/scr-companies.html
python apply_template.py --template body.template --content scr/companies-summary.tmpl > ../browser/scr-companies-summary.html
#python apply_template.py --template body.template --content scr/countries.tmpl > ../browser/scr-countries.html
python build_panel.py --template body.template --content common/list-of-filters.tmpl --conf conf/main.conf --panel scr-countries > ../browser/scr-countries.html
python apply_template.py --template body.template --content scr/overview.tmpl > ../browser/scr.html
python apply_template.py --template body.template --content scr/projects.tmpl > ../browser/scr-projects.html
#python apply_template.py --template body.template --content scr/repos.tmpl > ../browser/scr-repos.html
python build_panel.py --template body.template --content common/list-of-filters.tmpl --conf conf/main.conf --panel scr-repos > ../browser/scr-repos.html

# wiki
python apply_template.py --template body.template --content wiki/overview.tmpl > ../browser/wiki.html
python apply_template.py --template body.template --content wiki/contributors.tmpl > ../browser/wiki-contributors.html






