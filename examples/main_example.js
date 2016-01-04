// if you don't specify a html file, the sniper will generate a div with id "rootDiv"
var app = require("biojs-vis-summary-horizontal-bar-graph");
function round_to_two_decimal_places(num){
    new_num = Math.round(num * 100) / 100;
    return new_num;
}

//An array of colours which are used for the different probes
var colours = ["DarkOrchid", "Orange", "DodgerBlue", "Blue","BlueViolet","Brown", "Deeppink", "BurlyWood","CadetBlue",
"Chartreuse","Chocolate","Coral","CornflowerBlue","Crimson","Cyan", "Red", "DarkBlue",
"DarkGoldenRod","DarkGray", "Tomato", "Violet","DarkGreen","DarkKhaki","DarkMagenta","DarkOliveGreen",
"DarkOrange","DarkOrchid","DarkRed","DarkSalmon","DarkSlateBlue","DarkTurquoise",
"DarkViolet","DeepPink","DeepSkyBlue","DodgerBlue","FireBrick","ForestGreen","Fuchsia",
"Gold","GoldenRod","Green","GreenYellow","HotPink","IndianRed","Indigo"];


// tip which is displayed when hovering over a collumn. Displays the sample type 
//of the collumn
var tip = d3.tip()
    .attr('class', 'd3-tip')
    .html(function(d) {
        sample_type = d.sample_type;
        temp =
            "Sample Type: " +  sample_type + "<br/>"
        return temp;
    });

// this tooltip function is passed into the graph via the tooltip
var tooltip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([0, +110])
    .html(function(d) {
        probe = d.Probe;
        // 2 decimal places on the display only
        Expression_Value = round_to_two_decimal_places(d[y_column]);
        lwr = round_to_two_decimal_places(d.Expression_Value - d.Standard_Deviation);
        upr = round_to_two_decimal_places(d.Expression_Value + d.Standard_Deviation);
        temp = 
            "Sample: " + d.sample_id +"<br/>"+
            "Dataset: " + d.ds_id +"<br/>"+
            "YuGene Value: " + Expression_Value +"<br/>"
           // "MSC predicted "+msc_call+"/"+total+" iterations<br/>"
        return temp; 
    });

//The url's to the data displayed
data_url= '../data/json_format_clec4e_human_dev_s4m_very_small.txt';




/* Extracting the data from the csv files for use in the graph
 * Also sets relevent options based on the data passed in (for example
 * calculating the min and max values of the graph */
d3.json(data_url,function (error,data){

    /*
    data.forEach(function(d){
        // ths + on the front converts it into a number just in case
        
    });
    */

    data = [{'name':'embryo','number':4},
            {'number':33,'name':'cell'},
            {'number':233,'name':'tissue'},
            {'number':133,'name':'nothingA'},
            {'number':233,'name':'tissue'},
            {'number':13,'name':'nothing'},
            {'number':23,'name':'tissue'},
            {'number':1453,'name':'nothingB'},
            {'number':233,'name':'tissue'},
            {'number':13,'name':'nothingC'},
            {'number':33,'name':'brain'}
            ];
    // simple array
    //data = [4,5,6,7,7,56,6,6,7,77,0];
    // data.sort(function(a, b){return b-a});


    // http://stackoverflow.com/a/19326174
    // use slice() to copy the array and not just make a reference
    var sort_by_number = data.slice(0);
    sort_by_number.sort(function(a,b) {
        return b.number - a.number;
    });
    data = sort_by_number;

    title = "Overall Summary Horizontal Bar Graph for Clec4e ";
    subtitle1 = "Subtitle"
    subtitle2 = "Subtitle"
    target = rootDiv;
    height = 900;
    width = 600;
    ds_id_array =  [5008,3000,5003];
    ds_id_array =  [5008];
    ds_id_array =  [5001,4000,6062];

    //The main options for the graph
    var options = {
        initial_padding: 10,
        background_colour: "white",
        background_stroke_colour:  "black",
        background_stroke_width:  "6px",
        circle_radius: {small: 4, large: 3.5},  // for the scatter points
        hover_circle_radius: 10,
        colour: colours,
        ds_id_array: ds_id_array,
        data: data,
        domain_colours : ["#FFFFFF","#7f3f98"],
        error_bar_width:5,
        error_dividor:100,//100 means error bars will not show when error < 1% value 
        gap_between_groups: 2,
        height: height,
        //horizontal lines takes a name, colour and the yvalue. If no colour is given one is chosen at random
        horizontal_space_for_labels: 100, // this is for giving space on the left side of the bar graphs
        horizontal_lines: [["Detection Threshold", "green", 5], ["Median", , 8.93]],
        horizontal_line_value_column: 'value',
        //to have horizontal grid lines = width (to span accross the grid), otherwise = 0
        horizontal_grid_lines: width,
        inner_margin: 10, // margin between the bars and the outer box
        legend_class: "legend",
        legend_range: [0,100],
        line_stroke_width: "2px",
        margin_legend: width - 190,
        margin:{top: 180, left:200, bottom: 230, right: 300},
        margin_small:{top: 40, left: 40, bottom: 40, right: 80},
        //default number of colours is 39 (before it reitterates over it again)
        number_of_colours: 39,
        //2 is the chosen padding. On either side there will be padding = to the interval between the points
        //1 gives 1/2 the interval on either side etc.
        padding: 2,
        show_horizontal_line_labels: true,
        subtitle1: subtitle1,
        subtitle2: subtitle2,
        stroke_width:"3px",
        target: target,
        text_size: {small: "12px", large: "20px"},
        title_text_size: {small: "12px", large: "30px"},
        title: title,
        title_class: "title",
        tip: tip,//second tip to just display the sample type
        tooltip: tooltip, // using d3-tips
        //tooltip1: tooltip1, // using d3-tips unique_id: "chip_id",
        watermark:"http://www1.stemformatics.org/img/logo.gif",
        width:  width, // suggest 50 per sample
        x_axis_text_angle:-45, 
        x_axis_title: "Samples",
        x_column: 'x_position',
        x_middle_title: 500,
        y_axis_title: "YuGene Value",
        y_column: 'yugene_value'
    }

    var instance = new app(options);

    // Get the d3js SVG element
    var tmp = document.getElementById(rootDiv.id);
    var svg = tmp.getElementsByTagName("svg")[0];
    // Extract the data as SVG text string
    var svg_xml = (new XMLSerializer).serializeToString(svg);

}); 

