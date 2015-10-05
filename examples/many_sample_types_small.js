// if you don't specify a html file, the sniper will generate a div with id "rootDiv"
var app = require("biojs-vis-scatter-plot");
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
            "Probe: " + d.Probe + "<br/>" +
            "Sample: " + d.Sample_ID +"<br/>"+
            "Log2 Expression: " + Expression_Value + " [" + lwr + ";" + upr +"]<br/>"
           // "MSC predicted "+msc_call+"/"+total+" iterations<br/>"
        return temp; 
    });

//The url's to the data displayed
data_url= '../data/ds_id_5003_scatter_gata3.tsv';
//data_url = '../data/ds_id_2000_scatter_stat1.tsv';
//data_url = '../data/ds_id_2000_scatter_pdgfd.tsv';

/* Extracting the data from the csv files for use in the graph
 * Also sets relevent options based on the data passed in (for example
 * calculating the min and max values of the graph */
d3.tsv(data_url,function (error,data){
    max = 0; 
    min = 0;
    number_of_increments = 0;
    count = 0; 
    //make an array to store the number of probes for the legend
    probes_types = new Array();
    probes = new Array();
    probe_count = 0;
    //Saving the sample types and corrosponding id to use when 
    //itterating over for the hovering over the ample types and altering the scatter
    //points for that sample type
    sample_types = new Array();
    sample_type_array = new Array();
    sample_type_count = 0;
    j = 0;
    //need to put in the number of colours that are being used (so that it
    //can reiitterate over them again if necesary
    number_of_colours = 39;
    colour_count = 0;
    data.forEach(function(d){
        // ths + on the front converts it into a number just in case
        d.Expression_Value = +d.Expression_Value;
        d.Standard_Deviation = +d.Standard_Deviation;
        d.Probe = d.Probe;
        //calculates the max value of the graph otherwise sets it to 0
        //calculates the min value and uses this if max < 0 otherwise sets to 0
        //increment valye = max - min.
        if(d.Expression_Value + d.Standard_Deviation > max){
            max = d.Expression_Value + d.Standard_Deviation;
        }
        if(d.Expression_Value - d.Standard_Deviation < min){
            min = d.Expression_Value - d.Standard_Deviation;
        }
        if($.inArray(d.Probe, probes_types) == -1){
            probes_types.push(d.Probe);
            probe_count++;
        }
        if($.inArray(d.Sample_Type, sample_type_array) == -1) {
            //Gives each sample type a unique id so that they can be grouped 
            //And highlighted together
            sample_type_array.push(d.Sample_Type);
            sample_types[d.Sample_Type] = sample_type_count;
            j++;
            sample_type_count ++;
        }
        count++;

    });
    //USed to set up the probes and their corrosponding 
    //colours
    for(i = 0; i < probe_count; i++){
        probes[i] = [];
        probes[i][0] = probes_types[i];
      //  colour_count++;
        if(colour_count == number_of_colours){
            colour_count = 0;
        }
        probes[i][1] = colours[colour_count];
        colour_count++;
    }
    //for an increment per number = max - min
    number_of_increments = max - min;
    //turn number of increments into a whole number
    number_of_increments |= 0;
    probes = probes;
    sample_types = sample_types;
    probe_count = probe_count;
    title = "Scatter Plot";
    subtitle1 = "Subtitle"
    subtitle2 = "Subtitle"
    target = rootDiv;

    // can always use just a straight value, but it's nicer when you calculate
    // based off the number of samples that you have
    width = data.length*1;
    horizontal_grid_lines = width;
    if (width < 1000){
        width = 1000;
    }

    //The main options for the graph
    var options = {
        initial_padding: 10,
        background_colour: "white",
        background_stroke_colour:  "black",
        background_stroke_width:  "6px",
        circle_radius: {small: 2, large: 3.5},  // for the scatter points
        hover_circle_radius: 10,
        colour: colours,
        data: data,
        domain_colours : ["#FFFFFF","#7f3f98"],
        error_bar_width:5,
        error_dividor:100,//100 means error bars will not show when error < 1% value 
        graph_size: "small", //can be small or large, small accomadates for 4 graphs to a page
        height: {small: 400, large: 1500},
        //horizontal lines takes a name, colour and the yvalue. If no colour is given one is chosen at random
        horizontal_lines: [["Detection Threshold", "green", 5], ["Median", , 8.93]],
        horizontal_line_value_column: 'value',
        //to have horizontal grid lines = width (to span accross the grid), otherwise = 0
        horizontal_grid_lines: width,
        legend_class: "legend",
        increment: number_of_increments,
        legend_range: [0,100],
        line_stroke_width: "2px",
        margin_legend: width - 190,
        margin:{top: 180, left:200, bottom: 530, right: 300},
        margin_small:{top: 40, left: 40, bottom: 40, right: 80},
        //default number of colours is 39 (before it reitterates over it again)
        number_of_colours: 39,
        //2 is the chosen padding. On either side there will be padding = to the interval between the points
        //1 gives 1/2 the interval on either side etc.
        padding: 2,
        probe_count: probe_count,
        probes: probes,
        //sample type order indicates whether or not the samplese need to be represented in a specific order
        //if no order is given then the order from the data set is taken
        sample_type_order:"none",// "DermalFibroblast, hONS", // "BM MSC,BM erythropoietic cells CD235A+,BM granulopoietic cells CD11B+,BM hematopoietic cells CD45+,Developing cortex neural progenitor cells,Ventral midbrain neural progenitor cells,Olfactory lamina propria derived stem cells",
        sample_types: sample_types,
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
        width: {small: 500, large: width}, // suggest 50 per sample
        x_axis_text_angle:-45, 
        x_axis_title: "Samples",
        x_column: 'Sample_ID',
        x_middle_title: 500,
        y_axis_title: "Log2 Expression",
        y_column: 'Expression_Value'
    }

    var instance = new app(options);

    // Get the d3js SVG element
    var tmp = document.getElementById(rootDiv.id);
    var svg = tmp.getElementsByTagName("svg")[0];
    // Extract the data as SVG text string
    var svg_xml = (new XMLSerializer).serializeToString(svg);

}); 
