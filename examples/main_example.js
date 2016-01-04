// if you don't specify a html file, the sniper will generate a div with id "rootDiv"
var app = require("biojs-vis-summary-horizontal-bar-graph");
function round_to_two_decimal_places(num){
    new_num = Math.round(num * 100) / 100;
    return new_num;
}

//The url's to the data displayed
data_url= '../data/json_format_clec4e_human_dev_s4m_very_small.txt';

/* Extracting the data from the csv files for use in the graph
 * Also sets relevent options based on the data passed in (for example
 * calculating the min and max values of the graph */
d3.tsv(data_url,function (error,data){

    data.forEach(function(d){
        // ths + on the front converts it into a number just in case
        d.number = +d.number;
    });


    // http://stackoverflow.com/a/19326174
    // use slice() to copy the array and not just make a reference
    var sort_by_number = data.slice(0);
    sort_by_number.sort(function(a,b) {
        return b.number - a.number;
    });
    data = sort_by_number;




    title = "Sample Breakdown by Tissue";
    target = rootDiv;
    height = 500;
    width = 800;
    margin = {top: 50, left:20, bottom: 10, right: 20};


    //The main options for the graph
    var options = {
        initial_padding: 10,
        background_colour: "white",
        background_stroke_colour:  "black",
        background_stroke_width:  "6px",
        data: data,
        gap_between_groups: 2,
        height: height,
        height_margin_for_title : 25,
        horizontal_space_for_labels: 100, // this is for giving space on the left side of the bar graphs
        inner_margin: 10, // margin between the bars and the outer box
        margin: margin,
        target: target,
        title: title,
        title_class: "title",
        watermark:"http://www1.stemformatics.org/img/logo.gif",
        width:  width, // suggest 50 per sample
        x_axis_title: "Samples Breakdown by Tissue"
    }


    var instance = new app(options);

    // Get the d3js SVG element
    var tmp = document.getElementById(rootDiv.id);
    var svg = tmp.getElementsByTagName("svg")[0];
    // Extract the data as SVG text string
    var svg_xml = (new XMLSerializer).serializeToString(svg);

}); 

