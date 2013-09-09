Activity Board
==============

Description
-----------

The current code is only the web front end to visualize development activity 
metrics from the OpenStack community.

It is intended to add in the following days the machinery to retrieve all
of the dataset so this can be easily reproduced.


Configuration
-------------

Given that this is the front end as it is found in 
http://activity.openstack.org/dash, the only thing you need to do 
is to point your favorite server to the activity_board/browser directory.


Dependencies
------------

The whole machinery consists of several steps.
* Metrics Grimoire: in charge of the retrieval process, providing MySQL databases
* VizGrimoireR: in charge of parsing databases and providing polished JSON files
* VizGrimoireJS: in charge of visualizing the JSON files. 
* In order to get the latest versio n of the data use the command below and place
it under the directory "browser/data/"
** wget http://activity.openstack.org/dash/browser/data/db/json.7z
** 7zr x json.7z



