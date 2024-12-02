const bias_data = {
    value1: [-0.25, 0.66, -0.19, -0.19, 0.18],
    value2: [0.27, 1.51, 0.14, 0.24, 0.18]
}

// Bar Bias_chart
const bar = new BarChart('bar_container');
bar.push(bias_data.value1, {color: "#FF0000bb", name: "original"});
bar.push(bias_data.value2, {name: "mitigated"});
bar.show();


// 3D Bar Bias_chart
const bar3d = new BarChart3D('bar3d_container');
bar3d.push(bias_data.value1, {color: "#FF0000bb", name: "original"});
bar3d.push(bias_data.value2, {name: "mitigated"});
bar3d.show();


// Spider Web Bias_chart
const spider = new SpiderWebChart('spider_container');
spider.push(bias_data.value1, {color: "#FF0000bb", name: "original"});
spider.push(bias_data.value2, {name: "mitigated"});
spider.show();


// Polar Bias_chart
const polar1 = new PolarChart('polar_1', 'Sex');
polar1.setChart([80, 67.6470, 36.8421, 47.3684], {color: "rgba(255,0,0,0)", name: ""});
polar1.show();

const polar2 = new PolarChart('polar_2', 'Race');
polar2.setChart([55.5555, 60.4831, 92.8571, 62.5], {color: "rgba(18,154,144,0)", name: ""});
polar2.show();


// Scatter Bias_chart
const tsen_1 = tsen_xy_data.slice(0, 3606);
const tsen_2 = tsen_xy_data.slice(3606, tsen_xy_data.length);

const scatter_1 = new ScatterChart('scatter_1', 'Sex');
scatter_1.push(tsen_1, {color: "rgba(129, 199, 233, 0.2)", name: "Female"});
scatter_1.push(tsen_2, {color: "rgba(255, 187, 0, 0.2)", name: "other"});
scatter_1.show();

const scatter_2 = new ScatterChart('scatter_2', 'Race');
scatter_2.push(tsen_1, {color: "rgba(128, 65, 217, 0.2)", name: "Caucasian"});
scatter_2.push(tsen_2, {color: "rgba(0, 255, 0, 0.2)", name: "other"});
scatter_2.show();



// ffnn Chart
const ffnn = new FfnnChart();
ffnn.target = "#nodeChart";
ffnn.nodes = [4, 3, 3];
// ffnn.input = 4;
// ffnn.hidden = 6;
// ffnn.output = 3;
ffnn.course = [3, 2, 1, 2];
ffnn.hiddenLayer = 2;
ffnn.show();


// cnn chart Data
const dl_data = [
    {
        weight: 0,
        data: [
            {ms: -300, value: 0},
            {ms: -200, value: 20},
            {ms: -100, value: 30},
            {ms: 0, value: 25},
            {ms: 100, value: 35},
            {ms: 200, value: 45},
            {ms: 300, value: 60},
            {ms: 400, value: 50},
        ]
    },
    {
        weight: 1,
        data: [
            {ms: -300, value: 13},
            {ms: -200, value: 16},
            {ms: -100, value: 24},
            {ms: 0, value: 56},
            {ms: 100, value: 42},
            {ms: 200, value: 22},
            {ms: 300, value: 12},
            {ms: 400, value: 40},
        ]
    },
    {
        weight: 2,
        data: [
            {ms: -300, value: 0},
            {ms: -200, value: 12},
            {ms: -100, value: 20},
            {ms: 0, value: 31},
            {ms: 100, value: 35},
            {ms: 200, value: 42},
            {ms: 300, value: 47},
            {ms: 400, value: 44},
        ]
    },
    {
        weight: 3,
        data: [
            {ms: -300, value: 5},
            {ms: -200, value: 66},
            {ms: -100, value: 53},
            {ms: 0, value: 41},
            {ms: 100, value: 38},
            {ms: 200, value: 35},
            {ms: 300, value: 22},
            {ms: 400, value: 21},
        ]
    },
    {
        weight: 4,
        data: [
            {ms: -300, value: 0},
            {ms: -200, value: 1},
            {ms: -100, value: 2},
            {ms: 0, value: 10},
            {ms: 100, value: 86},
            {ms: 200, value: 4},
            {ms: 300, value: 2},
            {ms: 400, value: 1},
        ]
    },
    {
        weight: 5,
        data: [
            {ms: -300, value: 4},
            {ms: -200, value: 32},
            {ms: -150, value: 55},
            {ms: 0, value: 77},
            {ms: 100, value: 62},
            {ms: 200, value: 34},
            {ms: 300, value: 62},
            {ms: 400, value: 19},
        ]
    },
    {
        weight: 6,
        data: [
            {ms: -300, value: 14},
            {ms: -200, value: 22},
            {ms: -150, value: 65},
            {ms: 0, value: 78},
            {ms: 100, value: 89},
            {ms: 200, value: 92},
            {ms: 300, value: 99},
            {ms: 400, value: 24},
        ]
    }
];

// cnn Chart
const cnn = new CnnChart(dl_data);
cnn.setTarget = '#histogram';
cnn.setWidth = 600;
cnn.setHeight = 400;
cnn.setPadding = 30;
cnn.setInnerHeight = 300;
cnn.setAreaColor = ["#FFA270", "#C64017"];
cnn.setMargin = [40, 40];
cnn.show();
