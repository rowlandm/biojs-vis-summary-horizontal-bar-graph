/*
 * biojs-vis-summary-horizontal-bar-graph
 * https://github.com/rowlandm/biojs-vis-summary-horizontal-bar-graph
 *
 * Copyright (c) 2014 rowlandm
 * Licensed under the Apache 2 license.

    based off this example:
    http://bl.ocks.org/erikvullings/51cc5332439939f1f292
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
        page_options.margin = options.margin;
        page_options.width = options.width;
        page_options.margin_top = options.margin.top;
        page_options.margin_bottom = options.margin.bottom;
        page_options.width_whole = page_options.width - options.margin.left - options.margin.right; // -150 makes it fit the graph nicely
        page_options.height = options.height- options.margin.top - options.margin.bottom;
        page_options.horizontal_grid_lines = options.horizontal_grid_lines;
        page_options.full_width = options.width + options.margin.left + options.margin.right;
        page_options.full_height = options.height;

        graph.page_options = page_options;
        return graph;

    } ///end setup margins
     
    // Setup the y axis 
    this.setup_y_axis = function(graph){
        svg = graph.svg;
        max = graph.max_val;
        options = graph.options;
        // ########################################## Setup Y axis labels ###################################3
        /*
            For the y axis, the scale is linear, so we create a variable called y that we can use later
            to scale and do other things. in some people call it yScale
            https://github.com/mbostock/d3/wiki/Quantitative-Scales
            The range is the range of the graph from the height to 0. This is true for all y axes
        */
        var scaleY = d3.scale.linear()
            .range([page_options.height + options.gap_between_groups, 0]);

        // setup the yaxis. this is later called when appending as a group .append("g")
        // Note that it uses the y to work out what it should output
        //trying to have the grid lines as an option 
        var yAxis = d3.svg.axis()
            .scale(scaleY)
            .tickFormat('')
            .tickSize(0)
            .orient("left");

           
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
        data = options.data;
        extra_y = 24;
        width = page_options.width;
        horizontal_space_for_labels = options.horizontal_space_for_labels;
        inner_margin= options.inner_margin;

        // http://stackoverflow.com/a/24744689 
        // need to pass in the data and then the actual value you want to find
        max_d_number =d3.max(data,function(d){return d.number;});

        var scaleX = d3.scale.linear()
            // with simple array .domain([0, d3.max(data)])
            .domain([0, max_d_number])
            .range([0, width - 2* horizontal_space_for_labels - inner_margin]);


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
        data = options.data;
        horizontal_space_for_labels = options.horizontal_space_for_labels;
        // Specify the chart area and dimensions
        inner_margin = options.inner_margin; // this is the gap between the bars and the box around it
        bar_height = (page_options.height - 2*inner_margin)/(data.length);
        gap_between_groups = options.gap_between_groups;

        // Create bars
        var bar = svg.selectAll("g")
            .data(data)
            .enter().append("g")
            // i is for index, d is for the data object
            .attr("transform", function(d, i) {
                test = d;
                return "translate(" + horizontal_space_for_labels + "," + ((i * bar_height) + inner_margin) + ")";
            });


        color = d3.scale.category20();
                  
        // Create rectangles of the correct width
        bar.append("rect")
            .attr("fill", function(d,i){ return color(i);})
            .attr("class", "bar")
            .attr("width",  function(d){ 
                                return scaleX(d.number); 
                            }
            )
            .attr("height", bar_height - gap_between_groups);


        // Create text for the label
        bar.append("text")
            .text(function(d){return d.name;})
            .attr("y", gap_between_groups*2)   
            .attr("transform", function(d, i) {
                test = d;
                return "translate(-"+(horizontal_space_for_labels - inner_margin) +"," + (0.5*bar_height + gap_between_groups) + ")";
            });
 
        // Create text for the number 
        bar.append("text")
            .text(function(d){return d.number;})
            .attr("y", gap_between_groups*2)   
            .attr("transform", function(d, i) {
                test = d;
                return "translate("+(scaleX(d.number) + inner_margin) +"," + (0.5*bar_height + gap_between_groups) + ")";
            });
 


        graph.svg = svg;
        return graph;
}    // end of this.setup_scatter

    this.setup_legend = function(graph) {
        //graph.svg = svg;
        return graph;
    }   // end of setup_legend


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
            .attr('class','summary_horizontal_bar_graph')
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
        height_margin = options.height_margin_for_title;

        svg.append("text")
            .attr("x", page_options.width/2)//options.x_middle_title)             
            .attr("y", -height_margin)
            .attr("text-anchor", "middle")  
            .text(options.title).attr("class",options.title_class)
            .style("font-family", "Arial")
            .style("font-size", size_options.title_text)
            .style("fill", "black")
            .attr("class",options.title_class);
        
        
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

    /*  Setting up the graph including y and x axes */ 
    this.setup_graph = function(graph){
        // setup all the graph elements
        graph = this.setup_margins(graph);
        graph = this.setup_svg(graph);    
        graph = this.setup_x_axis(graph);
        graph = this.setup_y_axis(graph);
        graph = this.setup_bar(graph);
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

        svg = graph.svg;

    } 

    // constructor to run right at the start
    this.init(init_options);
}
