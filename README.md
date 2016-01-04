# biojs-vis-summary-horizontal-bar-graph

[![NPM version](http://img.shields.io/npm/v/biojs-vis-summary-horizontal-bar-graph.svg)](https://www.npmjs.org/package/biojs-vis-summary-horizontal-bar-graph) 

> BioJS component to provide a scatter-plot graphing tool hosted in Stemformatics

## Getting Started
Install the module with: `npm install biojs-vis-summary-horizontal-bar-graph`

for more details of the options, see the working example [here](http://biojs.io/d/biojs-vis-summary-horizontal-bar-graph)  and the example code [here](https://github.com/rowlandm/biojs-vis-summary-horizontal-bar-graph/blob/master/examples/normal_oct4_human.js)


```javascript
var app = require('biojs-vis-summary-horizontal-bar-graph');

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
```

## Documentation

#### Running the instance for developing

Note: If you are running Ubuntu LTS 12.04 or 14.04 you will be behind in npm. To fix this, do the following:
```
sudo apt-get purge nodejs npm

curl -sL https://deb.nodesource.com/setup | sudo bash -

sudo apt-get install -y nodejs

sudo npm install -g watchify biojs-sniper

```

Once you have downloaded the code, you will need to ensure that you create a build directory in the root directory.

You can simply run the following command in the directory to see a website appear on [localhost:9090](http://localhost:9090)

```
npm run w
```

## Contributing

All contributions are welcome.

## Support

If you have any problem or suggestion please open an issue [here](https://github.com/rowlandm/biojs-vis-summary-horizontal-bar-graph/issues).

## License 
This software is licensed under the Apache 2 license, quoted below.

Copyright (c) 2016, rowlandm

Licensed under the Apache License, Version 2.0 (the "License"); you may not
use this file except in compliance with the License. You may obtain a copy of
the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
License for the specific language governing permissions and limitations under
the License.
