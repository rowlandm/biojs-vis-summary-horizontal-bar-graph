/*
 * biojs-vis-summary-horizontal-bar-graph
 * https://github.com/rowlandm/biojs-vis-rohart-msc-test
 *
 * Copyright (c) 2014 rowlandm
 * Licensed under the Apache 2 license.
 */

/**
@class biojsvissummaryhorizontalbargraph
 */
/*
    Copyright 2015 Ariane Mora

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.


    This is a standalone unit to call when you want to create a summary horizontal bar graph.

*/
var biojsvissummaryhorizontalbargraph;


module.exports = biojsvissummaryhorizontalbargraph = function(init_options)
{

    /* this is just to define the options as defaults: added numberFormat*/
    this.default_options = function(){

        var options = {
            target: "#graph",
            unique_id: "Sample_ID",
            margin:{top: 80, right: 0, bottom: 30, left: 0},
            height: 600,
            width: 1060,
            x_axis_title: "Samples",
            y_axis_title: "Log2 Expression"
        }
        return options;
        
    } // end this.defaultOptions

    // This wraps the text based on a specific width
    // Derived from http://bl.ocks.org/mbostock/7555321
    this.d3_wrap = function (text, width) {
        text.each(function() {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            y = text.attr("y"),
            x = text.attr("x"), // set x to be x, not 0 as in the example
            dy = parseFloat(text.attr("dy")); // no dy
            // added this in as sometimes dy is not used
            if (isNaN(dy)){
                dy =0;
            } else {
                dy = dy;
            }
            tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
        
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                new_dy =++lineNumber * lineHeight + dy; // added this in as well
                tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", new_dy+ "em").text(word).attr('text-anchor','middle');
            }
        }
      });
    } // end d3_wrap

    // setup margins in a different function (sets up the page options (i.e. margins height etc)
    this.setup_margins = function(graph){
        options = graph.options;
        //height = options.height;
        if(options.graph_size == "small") {
            page_options.width = options.width.small;
            page_options.margin = options.margin_small;
            page_options.width_whole = page_options.width - options.margin_small.left - options.margin_small.right; // -150 makes it fit the graph nicely
            page_options.height = options.height.small - options.margin_small.top - options.margin_small.bottom;
            page_options.horizontal_grid_lines = 0;
            page_options.margin_top = options.margin_small.top;
            page_options.margin_bottom = options.margin_small.bottom;
            page_options.full_width = options.width.small + options.margin_small.left + options.margin_small.right;
            page_options.full_height = options.height.small;
        } else {
            page_options.large = options.width.large;
            page_options.margin = options.margin;
            page_options.width = options.width.large;
            page_options.margin_top = options.margin.top;
            page_options.margin_bottom = options.margin.bottom;
            page_options.width_whole = page_options.width - options.margin.left - options.margin.right; // -150 makes it fit the graph nicely
            page_options.height = options.height.large - options.margin.top - options.margin.bottom;
            page_options.horizontal_grid_lines = options.horizontal_grid_lines;
            page_options.full_width = options.width.large + options.margin.left + options.margin.right;
            page_options.full_height = options.height.large;
        }
        graph.page_options = page_options;
        return graph;

    } ///end setup margins
     
    // Setup the y axis 
    this.setup_y_axis = function(graph){
        svg = graph.svg;
        max = graph.max_val;
        // ########################################## Setup Y axis labels ###################################3
        /*
            For the y axis, the scale is linear, so we create a variable called y that we can use later
            to scale and do other things. in some people call it yScale
            https://github.com/mbostock/d3/wiki/Quantitative-Scales
            The range is the range of the graph from the height to 0. This is true for all y axes
        */
        var scaleY = d3.scale.linear()
            .range([page_options.height, 0]);

        // setup the yaxis. this is later called when appending as a group .append("g")
        // Note that it uses the y to work out what it should output
       //trying to have the grid lines as an option 
      var yAxis = d3.svg.axis() 
                    .scale(scaleY)
                    .orient("left")
                    //sets the number of points to increment by 1 whole number. To change see options.increment
                    .ticks(size_options.increment)
                    .innerTickSize(-page_options.horizontal_grid_lines)
                    .outerTickSize(0);  

        y_column = options.y_column;
        scaleY.domain([0,1]).nice();
        y_axis_legend_y = (graph.full_height - options.margin.top - options.margin.bottom)/2;
        
        /*Adding the title to the Y-axis: stored in options.y_axis_title: information from
        ** http://bl.ocks.org/dougdowson/8a43c7a7e5407e47afed*/         
        svg.append("text")
          .text(options.y_axis_title)
          .attr("text-anchor", "middle")
          .style("font-family", "Arial")
          .style("font-size",  size_options.text_size)
          .attr("transform", "rotate(-90)")
          .style("text-anchor", "middle")
          .attr("x", -y_axis_legend_y)
          .attr("y", -size_options.padding); //specifies how far away it is from the axis

        svg.append("g")
            .attr("class", "grid") //creates the horizontal lines accross the page
            .call(yAxis); //implementing the y axis as an axis
            

        graph.svg = svg;
        graph.scaleY = scaleY;
        graph.yAxis = yAxis;
        return graph;
    } // end this.setup_y_axis

    this.setup_x_axis = function (graph){
        // ########################################## Setup X axis labels ###################################3
        page_options = graph.page_options;
        svg = graph.svg;
        options = graph.options;
        extra_y = 24;
        width = page_options.width;
        var scaleX = d3.scale.linear()  
        .range([0,width]);

        scaleX.domain(d3.extent(options.data, function(d) { return d[options.x_column]; }));

        svg.append("text") // main x axis title
            .attr("class", "label")
            .attr("x", page_options.width/2)
            .attr("y", +page_options.height+extra_y)
            .style("text-anchor", "end")
            .text(options.x_axis_title);


        graph.svg = svg;
        graph.scaleX = scaleX;

        return graph ;
    } //end this.setup_x_axis

    // Brush is for all the options of selecting start and stop co-ordinates.
    // From example: http://bl.ocks.org/mbostock/4349545
    // This is when you start
    this.brushstart = function () {
        svg.classed("selecting", true);
    }

   
  
    /* Sets up the actual scatter points on the graph, assigns colours based on 
        probe types also has a tooltip (see simple.js for tooltip setup) 
        with relevent info aobut each point */
    this.setup_bar = function(graph){
        ds_id_array = graph.options.ds_id_array;
        size_options = graph.size_options;
        svg = graph.svg;
        options = graph.options;
        page_options = graph.page_options;
        scaleX = graph.scaleX;
        scaleY = graph.scaleY;
        y_column = options.y_column;
        x_column = options.x_column;

        graph.dots = dots;
        graph.svg = svg;
        return graph;
}    // end of this.setup_scatter

    this.setup_legend = function(graph) {

        size_options = graph.size_options;
        svg = graph.svg;
        options = graph.options;
        page_options = graph.page_options;
        scaleX = graph.scaleX;
        scaleY = graph.scaleY;
        y_column = options.y_column;
        x_column = options.x_column; 
        tooltip = options.tooltip;
        svg.call(tooltip);
        probes = new Array();
    
    //Creates a table to store the legend in
    var table = document.createElement("TABLE");
        table.border = "1";
        table.id = "table";

    //Get the count of columns for the table
    var columnCount = (options.probe_count/28)|0;
    //makes sure there is at least 1 column
    if(columnCount < 1){
        columnCount = 1;
    }

    /*Toggle and hide the legend on a button click:
    http://stackoverflow.com/questions/4528085/toggle-show-hide-div-with-button*/
    var legend_btn = document.createElement("input");
        legend_btn.type = "button";
        legend_btn.id = "legend_btn";
        legend_btn.className = "btn";
        legend_btn.style.fontSize = size_options.text_size;
        legend_btn.value = "Legend";
        legend_btn.innerHTML = "Legend";
        legend_btn.setAttribute('content', 'test content'); 
        legend_btn.onclick = function() {
    
    var div = document.getElementById('table');
        if (div.style.display !== 'none') {
            div.style.display = 'none';
        }
        else {
            div.style.display = 'block';
        }
    };
    
    //Create the legend as a table in a separate div so that it can be togeled on an off
    //and grow dynamically.
    probe_number = 0;
    colour_count = 0;
    for (var i = 0; i < options.probe_count + 2; i++) {
        row = table.insertRow(-1);
        if(i== 500){
            break;
        }
        colour_count++;
        for (var j = 0; j < (2*columnCount); j++) {
            var cell = row.insertCell(-1);
            if(j%2 == 0){
                if(probe_number + 1 <= options.probe_count){
                    colour_count++;
                    if(colour_count == 0){
                        colour_count = 0;
                    }
                    //to display the colour of each probe a button is created
                    //this can later be used to toggle the scatter_line
                    btn = document.createElement('input');
                    btn.type = "button";
                    btn.className = "btn";
                    btn.id = options.probes[probe_number][0];
                    btn.style.background = options.probes[probe_number][1];
                    // When the probe button is clicked we want to display the scatter line
                    btn.onclick = function() {
                        var probe = (this.id);
                        //Gets the elements by probe and assigns colour to the line (this is started off hidden)
                        var probe_group = document.getElementsByClassName("line-probe-" + probe.replace(/\ |(|)/g,''));
                        for (i = 0; i < probe_group.length; i++) {
                            if(probe_group[i].style.opacity != 0) {
                                d3.select(probe_group[i]).style("opacity", 0);
                            } else {
                                d3.select(probe_group[i]).style("opacity", 1);
                            }
                        }
                    }; //end on_click button
                    cell.appendChild(btn);
                } else { //have added all the probes
                    break;
                }
            } else {
                if(probe_number >= options.probe_count){
                    break;
                }
                //writes the probe name to the cell
                cell.innerHTML = options.probes[probe_number][0];
                cell.style.fontSize = size_options.text_size;
                probe_number++;
            }
        }
     }
    //creates the div to append to the svg element and put the table in
    var div = document.createElement("div");
            div.id = "div";
            div.style.position = "absolute";
            div.style.color = "white";
            div.style.left = page_options.width + page_options.margin.right;
            div.style.top = page_options.margin.top;
            div.appendChild(legend_btn); //add the legend button above
            div.appendChild(table);
    
        document.body.appendChild(div);

        graph.svg = svg;
        return graph;
    }    // end of this.setup_scatter and setting up the legend


    //Sets up the SVG element
    this.setup_svg = function (graph){
        options = graph.options;
        page_options = graph.page_options;

        full_width = page_options.full_width;
        full_height = page_options.full_height;

        graph.full_width = full_width;
        graph.full_height = full_height;
        background_stroke_width = options.background_stroke_width;
        background_stroke_colour = options.background_stroke_colour;

        // clear out html
        $(options.target)
            .html('')
            .css('width',full_width+'px')
            .css('height',full_height+'px');

        // setup the SVG. We do this inside the d3.tsv as we want to keep everything in the same place
        // and inside the d3.tsv we get the data ready to go (called options.data in here)
        var svg = d3.select(options.target).append("svg")
            .attr("width", full_width)
            .attr("height",full_height) 
        .append("g")
            // this is just to move the picture down to the right margin length
            .attr("transform", "translate(" + page_options.margin.left + "," + page_options.margin.top + ")");


        // this is to add a background color
        // from: http://stackoverflow.com/questions/20142951/how-to-set-the-background-color-of-a-d3-js-svg
        svg.append("rect")
            .attr("width", page_options.width)
            .attr("height", page_options.height)
            .attr("stroke-width", background_stroke_width)
            .attr("stroke", background_stroke_colour)
            .attr("fill", options.background_colour);

        // this is the Main Title
        // http://bl.ocks.org/mbostock/7555321
        if(options.graph_size == "small") {
            height_margin_multiplier = 2;
        } else {
            height_margin_multiplier = -1;
        }
        height_margin = 10;
        height_divisor = 1.5;
        svg.append("text")
            .attr("x", page_options.width/2)//options.x_middle_title)             
            .attr("y", 0 - (page_options.margin.top /height_divisor) + (height_margin/height_margin_multiplier)) 
            .attr("text-anchor", "middle")  
            .text(options.title).attr("class",options.title_class)
            .style("font-family", "Arial")
            .style("font-size", size_options.title_text)
            .style("fill", "black")
            .attr("class",options.title_class);
        
        //if the graph is small we don't want the subtitles
        if(options.graph_size !== "small") {
            // this is the Sub Title
            svg.append("text")
                .attr("x", page_options.width/2)//ptions.x_middle_title)             
                .attr("y", 0 - (page_options.margin.top / height_divisor)+2*height_margin)
                .attr("text-anchor", "middle")  
                .text(options.subtitle1).attr("class",options.title_class+" subtitle1")
                .style("font-family", "Arial")
                .style("font-size", size_options.text_size)
                .style("fill", "black")
                .attr("class",options.title_class);


            svg.append("text")
                .attr("x", page_options.width/2)//options.x_middle_title)             
                .attr("y", 0 - (page_options.margin.top / height_divisor)+height_margin*5)
                .attr("text-anchor", "middle")  
                .text(options.subtitle2).attr("class",options.title_class+" subtitle2")
                .style("font-family", "Arial")
                .style("font-size", size_options.text_size)
                .style("fill", "black")
                .attr("class",options.title_class);
    }
    //End subtitle setup
        max_width_of_text = 600;
        suggested_width_of_text = options.width*0.7;
        if (max_width_of_text < suggested_width_of_text){
            width_of_title = max_width_of_text;
        } else {
            width_of_title = suggested_width_of_text;
        }
        svg.selectAll("."+options.title_class)
            .call(this.d3_wrap,width_of_title); 


        graph.svg = svg;
        return graph;
    } // setup_svg

    /*  Setting up the watermark */
    this.setup_watermark = function(graph){
        svg = graph.svg;
        options = graph.options;
        extra_padding = 0;
        if(options.graph_size == "small") {
            extra_padding = 30;
        }
        svg.append("image")
            .attr("xlink:href",options.watermark)
            .attr("x", page_options.height/2 - 100)
            .attr("y", -page_options.width - 2 * size_options.padding - extra_padding)// just out of the graphs edge
            .attr("transform", "rotate(+90)")
            .attr("width", 200)
            .attr("height", 100);

        graph.svg = svg;
        return graph;
    } // setup_watermark

    /*  Setting up the graph including y and x axes */ 
    this.setup_graph = function(graph){
        // setup all the graph elements
        graph = this.setup_margins(graph);
        graph = this.setup_svg(graph);    
        graph = this.setup_x_axis(graph);
        graph = this.setup_y_axis(graph);
        graph = this.setup_watermark(graph);
        return graph;

    }  // end setup_graph  

    // run this right at the start of the initialisation of the class
    this.init = function(init_options){
        var options = this.default_options();
        options = init_options;
        page_options = {}; // was new Object() but jshint wanted me to change this
        size_options = {};
        var graph = {}; // this is a new object
        graph.options = options;

        graph = this.setup_graph(graph);

        var target = $(options.target);
        graph = this.setup_brush(graph);

        svg = graph.svg;

    } 

    // constructor to run right at the start
    this.init(init_options);
}
