<b>CUSP-GX-6006</b><br>
Data Visualization<br>
Final Project<br><br>
<b>Team Members:</b><br>
Sam Ovenshine<br>
Kent Pan<br>
Matt Sauter<br><br>
<b>Objectives:</b><br>
The primary objective of this visualization is to enable people (civilians, government officials, police officers) understand the distribution of crime throughout New York City. The usage of the tool will be different for each population that uses it.

Civilians:<br>
The population of NYC continues to expand as more and more people move here for work, school, and countless other aspirations. While the housing market is far from overflowing with options, for those who are able to take their time and research locations prior to moving here, this could be a useful tool in helping select the best neighborhood for them. If you run a business out of your home with a lot of expensive equipment, it would be helpful for you to identify neighborhoods that historically have low rates of burglary. If you are planning on having a car in the city, it would be ideal to live in a place where it is less likely to be stolen. Additionally, if you are moving with children, you probably want to find a school that does not typically have high levels of crime in the immediate vicinity.

Government Officials:<br>
If you are working to construct new schools or other municiple buildings, it would be important to have an understanding of the distribution of crime so that you can best select an area that would be suitable for the infrastructure. If you are hoping to add housing in order to offset the increasing demand, but you know that the neighborhood you are planning to build in is not close to any transit lines (and thus residents will likely need to own vehicles) you can use this tool to identify specific lots that would be most suitable for the building. 

Police Officers:<br>
Fairly straightforward, officers can use this tool to showcase the (in)effectiveness of their policies, use the data to plan for future implementation of new practices, and obtain a general understanding of the distribution of crime.

Professionals:<br>
This tool can be used by real estate developers, teachers, drivers, and many other professionals who wish to take crime into consideration when planning for the future.

<br><br>
<b>Data Sources:</b><br>
-Crime records in New York for 2012-2016 from NYC Open Data (https://data.cityofnewyork.us/Public-Safety/NYPD-Complaint-Data-Historic/qgea-i56i)<br>
-Linked to CARTO for back end: https://nyu.carto.com/u/sgo2303/tables/mjdsauter.nyccrimedata/public/map?redirected=true
<br><br>
<b>Design Choices:</b><br>

Map:<br>
Points were the chosen mark for representing each individual crime. The position of each mark denoted the location of the crime, while the hue indicated the type of crime that occurred. Marks were overlayed atop a map revealing the underlying geography of the distribution, allowing users to infer the real-world location at which the crimes took place.
<br><br>
Charts:<br>
We used lines as the mark for our charts. For the column graph, representing the total counts of crime in each borough, the height of each bar was used to convey each borough's respective count. For the bar graph, which presented the counts of crime per precinct, the width of the bar was the chosen channel. 

<br><br>
<b>Outcome and Evaluation:</b><br>
The overall functionality of the visualization allows for many different views of the data, which we are excited about. 
<br><br>
Of course, there are several areas for improvement. Due to the limitations of the size of the file that could be uploaded to Carto, we had to shrink our data down to the major felonies in NYC and reduce the data from 10 years to 5. Additionally, had we more time and talent, we would have loved to allow users to specify which crimes they wished to visualize (as opposed to selecting one crime or all crimes) so that there would be an element of comparison within the tool. Also, it would be great if the temporal scale would allow for ranges as well -- instead of a drop-down menu, we would have loved to make a band that would allow users to select the start and end of the time period they were interested in. 
<br><br>
While we enable users to click on the precinct bar of their choice to show the crime distribution for that precinct in isolation, we were unable to combine that with the crime filters so that they could truly isolate the selection they were interested in. It is not completely futile, as after selecting the precinct in question, they could position the map so as to center and home in on the location, and then apply the filters. The functionality remains, albeit less elegantly than one would hope for. 
