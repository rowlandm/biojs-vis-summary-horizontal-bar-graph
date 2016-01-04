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
d3.json(data_url,function (error,data){

    /*
    data.forEach(function(d){
        // ths + on the front converts it into a number just in case
        
    });
    */

    data = [{'name':'embryo','number':4},
            {'number':33,'name':'cell'},
            {'number':2300,'name':'tissueB'},
            {'number':133,'name':'nothingA'},
            {'number':238,'name':'tissueK'},
            {'number':13,'name':'nothing'},
            {'number':23,'name':'tissueF'},
            {'number':145,'name':'nothingB'},
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

    title = "Sample Breakdown by Tissue";
    target = rootDiv;
    height = 250;
    width = 300;
    margin = {top: 50, left:10, bottom: 10, right: 10};


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
        horizontal_space_for_labels: 100, // this is for giving space on the left side of the bar graphs and for the numbers on the right
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

    options.target = '#new';
    options.title = 'Samples Breakdown by X';
    $('body').append('<div id="new"></div>');
    var instance2 = new app(options);

    options.target = '#new2';
    options.title = 'Samples Breakdown by y';
    $('body').append('<div id="new2"></div>');
    var instance3 = new app(options);

    options.target = '#new3';
    options.title = 'Samples Breakdown by Yy';
    $('body').append('<div id="new3"></div>');
    var instance4 = new app(options);


}); 

