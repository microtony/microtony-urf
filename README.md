URF Play Styles - Riot Games API Challenge entry
==============

by Wong Man Hang (NA: microtony, Taiwan: 微Tony)

This project aims to understand how players changed their play style in the URF game mode and the effects. k-means clustering was used to obtain 5 item build centroids (Marksman, Mage, Fighter, Support and Tank). After that, items builds from matches are categorized into one of the 5 centroids. Results are finally aggregated and presented in the mini AngularJS application.

Note: Marksman is not restricted to ranged champions.

Live URL
----
http://urf.microtony.com

More details of the project can be found in the "About" tab.

Interesting Findings
----
1. In URF mode, Ashe was played as a Mage 19% of the time. The win rate is 42.62%.
2. Building more damage on Poppy gives higher win rate. (Marksman: 61.93%, Tank: 51.97%)
3. Despite a dramatic shift to Mage builds, for some champions the win rates of such builds did not increase. (Blitzcrank: 51.93% to 49.02%, Malphite: 51.12% to 50.61%)
4. Thresh has the lowest win rate (about 40%) for all builds.

Technologies used
----
* Microsoft Azure ML
* AngularJS
* Google Charts
* Node.JS for downloading data from Riot Games API
