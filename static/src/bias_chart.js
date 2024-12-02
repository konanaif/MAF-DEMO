/**
 * Bias_chart 구성을 위한 클래스
 */
class Bias_chart {
    xAxis = ['Statistical Parity Difference', 'Disparate Impact', 'Equal Opportunity Difference', 'Average Odds Difference', 'Theil Index'];
    series = []; target=null; title=null; subtitle=null;

    /**
     * @param target {string} - Chart를 표시할
     */
    constructor(target) {
        this.target = target;
    }

    /**
     * x축을 재정의하는 메소드.
     */
    setAxis(axis) { var x_axis = axis; this.xAxis = x_axis; }

    /**
     * Series에 데이터를 추가하는 메소드. 재정의 필요.
     */
    push(data) { this.series.push(data); }

    /**
     * Series를 비우는 메소드
     */
    clear() { this.series = []; }

    /**
     * 차트를 그리는 메소드. 재정의 필요.
     */
    show() {}
}


/**
 * Bar Chart를 그리기 위한 클래스
 * usage)
 * const bar = new BarChart('bar_container');
 * bar.push(data.value1, {color: "#FF0000bb", name: "original"});
 * bar.show();
 */
class BarChart extends Bias_chart {
    /**
     * @param target {string} - 차트를 표시할 id 선택자
     */
    constructor(target) {
        super(target)
    }

    /**
     * @param data {Array<number>}
     * @param options { {color: string, name: string} } - optional, 그래프의 색상과 이름을 설정
     */
    push(data, options) {
        let _options = (!!options) ? options : {};
        let _color = (!!_options.color) ? _options.color : null;
        let _name = (!!_options.name || _options.name === "") ? _options.name : null;

        if(data.length > this.xAxis.length) {
            console.warn('Bar Bias_chart: The length of the data is longer than the length of the xAxis. Some data is not displayed.');
        }

        this.series.push({ name: _name, data: data.slice(0, this.xAxis.length), color: _color});
    }

    /**
     * 차트를 그리는 메소드
     */
    show() {
        Highcharts.chart(this.target, {
            chart: { type: 'column' },
            title: { text: this.title },
            xAxis: { categories: this.xAxis },
            credits: { enabled: false },
            series: this.series
        });
    }
}

function BarChartWithModal(chart, target, data, descriptions, xAxis, chartType = '2d') {
    const handleChartClick = function (category) {
        const description = descriptions[category];
        document.getElementById('chartmodalTitle').innerHTML = category;
        document.getElementById('chartmodalContent').innerHTML = description;
        document.getElementById('chartmodal').style.display = 'block';
        document.getElementById('closenewModal').onclick = function () {
            document.getElementById('chartmodal').style.display = 'none';
        };
    };

        chart.show = function () {
            const chartOptions = {
                chart: {
                    type: 'column',
                    renderTo: this.target
                },
                title: { text: null },
                subtitle: { text: chartType === '3d' ? this.subtitle : null },
                xAxis: { categories: this.xAxis },
                credits: { enabled: false },
                plotOptions: {
                    series: {
                        cursor: 'pointer',
                        point: {
                            events: {
                                click: function (e) {
                                    handleChartClick(e.point.category);
                                }
                            }
                        }
                    }
                },
                series: this.series
            };

            if (chartType === '3d') {
                chartOptions.chart.options3d = { enabled: true, alpha: 15, beta: 20, depth: 200, viewDistance: 100 };

                if (!chartOptions.plotOptions.column) {
                    chartOptions.plotOptions.column = {};
                }

                chartOptions.plotOptions.column.depth = 100;
                chartOptions.plotOptions.column.groupZPadding = 0;
                chartOptions.plotOptions.column.grouping = false;
                chartOptions.plotOptions.column.pointWidth = 80;
            }

            if (this.chart) {
                this.chart.destroy();
            }

            this.chart = Highcharts.chart(this.target, chartOptions);
        };

    if (Array.isArray(data)) {
        // 배열 형식의 데이터 처리
        chart.push(data, { name: "Original" });
    } else if (typeof data === 'object' && data.original && data.mitigated) {
        // 객체 형식의 데이터 처리
        chart.push(data.original, { color: "#FF0000bb", name: "Original" });
        chart.push(data.mitigated, { name: "Mitigated" });
    } else if (typeof data === 'object' && data.privileged && data.unprivileged) {
        chart.push(data.privileged, { color: "#FF0000bb", name: "Privileged" });
        chart.push(data.unprivileged, { name: "Unprivileged" });
    } else {
        console.error("Unsupported data format");
    }

    return chart;
}


function clsBarChartWithModal(mychart, target, data, descriptions, xAxis, chartType = '2d') {
  mychart.show = function () {
    const yAxisOptions = {
      chart: { type: 'column' },
      title: { text: this.title },
      xAxis: { categories: this.xAxis },
      credits: { enabled: false },
      plotOptions: {
        series: {
          cursor: 'pointer',
          point: {
            events: {
              click: function () {
                let category = this.category;
                let description = descriptions[category];

                document.getElementById('chartmodalTitle').innerHTML = category;
                document.getElementById('chartmodalContent').innerHTML = description;
                document.getElementById('chartmodal').style.display = 'block';
                document.getElementById('closenewModal').onclick = function() {
                document.getElementById('chartmodal').style.display = 'none';
                }
              }
            }
          }
        }
      },
      series: this.series
    };
    if (chartType === '3d') {
        yAxisOptions.chart.options3d = { enabled: true, alpha: 15, beta: 20, depth: 200, viewDistance: 100 };

        if (!yAxisOptions.plotOptions.column) {
            yAxisOptions.plotOptions.column = {};
        }

        yAxisOptions.plotOptions.column.depth = 100;
        yAxisOptions.plotOptions.column.groupZPadding = 0;
        yAxisOptions.plotOptions.column.grouping = false;
        yAxisOptions.plotOptions.column.pointWidth = 80;
    }

    if (xAxis[0] === 'Disparate impact') {
      yAxisOptions.yAxis = {
        min: 0,
        max: 1.25,
        tickInterval: 0.25,
        plotLines: [
          { value: 1.0, color: 'gray', width: 1, zIndex: 4, label: { text: 'fair', align: 'right', style: { color: '#04B404' } } },
          { value: 0.9, color: 'gray', width: 0, zIndex: 4, label: { text: 'bias', align: 'right', style: { color: 'red' } }
          }
        ]
      };
    } else if(xAxis[0] === 'Selection rate'){
        yAxisOptions.yAxis = {
        min: 0,
        max: 1.25,
        tickInterval: 0.25,
        plotLines: [
          { value: 0.5, color: 'gray', width: 1, zIndex: 4, label: { text: 'fair', align: 'right', style: { color: '#04B404' } } }
        ]
      };
    }
    else if (xAxis[0] === 'Theil index') {
        yAxisOptions.yAxis = {
        min: 0.0,
        max: 1.0,
        tickInterval: 0.25,
        plotLines: [
          { value: 0.0, color: 'gray', width: 1, zIndex: 4, label: { text: 'fair', align: 'right', style: { color: '#04B404' } } }
        ]
      };
    }
    else {
      yAxisOptions.yAxis = {
        min: -1.0,
        max: 1.0,
        tickInterval: 0.5,
        plotLines: [
          { value: 0.0, color: 'gray', width: 1, zIndex: 4, label: { text: 'fair', align: 'right', style: { color: '#04B404' } } },
          { value: -0.2, color: 'gray', width: 0, zIndex: 4, label: { text: 'bias', align: 'right', style: { color: 'red' } }
          }
        ]
      };
    }
    Highcharts.chart(this.target, yAxisOptions);
  };

    if (Array.isArray(data)) {
        // 배열 형식의 데이터 처리
        mychart.push(data, { name: "Original" });
    } else if (typeof data === 'object' && data.original && data.mitigated) {
        // 객체 형식의 데이터 처리
        mychart.push(data.original, { color: "#FF0000bb", name: "Original" });
        mychart.push(data.mitigated, { name: "Mitigated" });
    } else {
        console.error("Unsupported data format");
    }
    return mychart;
}


/**
 * 3D Bar Chart를 그리기 위한 클래스
 * usage)
 * const bar3d = new BarChart3D('bar3d_container');
 * bar3d.push(data.value1, {color: "#FF0000bb", name: "original"});
 * bar3d.show();
 */
class BarChart3D extends Bias_chart {
    /**
     * @param target {string} - 차트를 표시할 ID 선택자
     */
    constructor(target) {
        super(target);
    }

    /**
     * @param data {Array<number>}
     * @param options { {color: string, name: string} } - optional, 그래프의 색상과 이름을 설정
     */
    push(data, options) {
        let _options = (!!options) ? options : {};
        let _color = (!!_options.color) ? _options.color : null;
        let _name = (!!_options.name || _options.name === "") ? _options.name : null;

        if(data.length > this.xAxis.length) {
            console.warn('3D Bar Bias_chart: The length of the data is longer than the length of the xAxis. Some data is not displayed.');
        }

        this.series.push({stack:this.series.length, name: _name, data: data.slice(0, this.xAxis.length), color: _color});
    }

    /**
     * 차트를 그리는 메소드
     */
    show() {
        Highcharts.chart({
            chart: {
                renderTo: this.target,
                type: "column",
                options3d: { enabled: true, alpha: 15, beta: 20, depth: 200, viewDistance: 100 },
            },
            title: { text: this.title, },
            subtitle: { text: this.subtitle, },
            plotOptions: {
                column: { depth: 100, groupZPadding: 0, grouping: false, pointWidth: 80 },
                series: { pointPadding: 0, groupPadding: 0 }
            },
            xAxis: { categories: this.xAxis, offset: 20 },
            yAxis: {
                title: { enabled: false },
                tickInterval: 0.25
            },
            zAxis: {
                min: 0, max: 3,
                categories: ["", this.series[0].name, this.series[1].name, ""],
                labels: { rotation: 20, y: 30 }
            },
            series: this.series,
        });
    }
}


/**
 * Spider Web Chart를 그리기 위한 클래스
 * usage)
 * const spider = new SpiderWebChart('spider_container');
 * spider.push(data.value1, {color: "#FF0000bb", name: "original"});
 * spider.show();
 */
class SpiderWebChart extends Bias_chart {
    /**
     * @param target {string} - 차트를 표시할 ID 선택자
     */
    constructor(target) {
        super(target)
    }

    /**
     * @param data {Array<number>}
     * @param options { {color: string, name: string} } - optional, 그래프의 색상과 이름을 설정
     */
    push(data, options) {
        let _options = (!!options) ? options : {};
        let _color = (!!_options.color) ? _options.color : null;
        let _name = (!!_options.name || _options.name === "") ? _options.name : null;

        if(data.length > this.xAxis.length) {
            console.warn(`Spider Web Chart: The length of the data is longer than the length of the xAxis. Some data is not displayed.`);
        }

        this.series.push({ name: _name, data: data.slice(0, this.xAxis.length), pointPlacement: "on", color: _color });
    }

    /**
     * 차트를 그리는 메소드
     */
    show() {
        Highcharts.chart(this.target, {
            chart: { polar: true, type: 'line' },
            accessibility: { description: null },
            title: { text: null },
            pane: { size: '90%' },

            xAxis: { categories: this.xAxis, tickmarkPlacement: 'on', lineWidth: 0 },
            yAxis: { gridLineInterpolation: 'polygon', lineWidth: 0 },

            tooltip: { shared: true, pointFormat: '<span style="color:{series.color}">{series.name}: <b>${point.y:,.0f}</b><br/>' },

            legend: { align: 'right', verticalAlign: 'middle', layout: 'vertical' },

            series: this.series,

            responsive: {
                rules: [{
                    condition: { maxWidth: 500 },
                    chartOptions: {
                        legend: { align: 'center', verticalAlign: 'bottom', layout: 'horizontal' },
                        pane: { size: '70%' }
                    }
                }]
            }
        });
    }
}



/**
 * PolarChart를 그리기 위한 클래스
 * usage)
 * const polar = new PolarChart('polar_1', 'Sex');
 * polar.setChart([80, 67.6470, 36.8421, 47.3684], {color: "rgba(255,0,0,0)", name: ""});
 * polar.show();
 */
class PolarChart extends Bias_chart {
    constructor(target, title) {
        super(target)
        this.title = `Protected Attribute : ${title}`;
        this.xAxis = ["Statistical Parity Difference", "Disparate impact", "Equal opportunity difference", "Average odds difference"];
    }

    /**
     * @param data {Array<number>}
     * @param options { {color: string, name: string} } - optional, 그래프의 색상과 이름을 설정
     */
    setChart(data, options) {
        let _options = (!!options) ? options : {};
        let _color = (!!_options.color) ? _options.color : null;
        let _name = (!!_options.name || _options.name === "") ? _options.name : null;

        if(data.length > this.xAxis.length) {
            console.warn("Polar Bias_chart: The length of the data is longer than the length of the xAxis. Some data is not displayed.");
        }

        this.clear()
        this.series.push({
            type: "area",
            name: _name, color: _color,
            fillOpacity: 0.5,
            data: data.slice(0, this.xAxis.length),
            pointPlacement: "on"
        });
    }

    /**
     * 차트를 그리는 메소드
     */
    show() {
        Highcharts.chart(this.target, {
            chart: { polar: true },
            title: { text: this.title, x: -30 },
            pane: { size: '90%' },
            xAxis: { categories: this.xAxis, tickmarkPlacement: "on", lineWidth: 0 },
            yAxis: { gridLineInterpolation: "circle", lineWidth: 0, min: 0 },
            tooltip: { shared: true, pointFormat: "{point.y:,.0f}%" },
            legend: { align: "right", verticalAlign: "middle" },
            plotOptions: {
                series: { gapSize: 5 },
            },
            responsive: {
                rules: [{
                    condition: { maxWidth: 500 },
                    chartOptions: {
                        legend: { enabled: false }
                    },
                }],
            },
            series: this.series
        });
    }
}

/**
 * Scatter Chart를 생성하는 클래스
 * usage)
 * const scatter = new ScatterChart('scatter_1', 'Sex');
 * scatter.push("female", "rgba(129, 199, 233, 0.2)", tsen_1);
 * scatter.push("other", "rgba(255, 187, 0, 0.2)", tsen_2);
 * scatter.show();
 */
class ScatterChart extends Bias_chart {
    constructor(target, title) {
        super(target);
        this.title = `T-SNE algorithm(${title})`;
    }

    /**
     * Series에 데이터를 추가하는 메소드
     * @param data {Array<[number, number]>}
     * @param options { {color: string, name: string} } - optional, 그래프의 색상과 이름을 설정
     */
    push(data, options) {
        let _options = (!!options) ? options : {};
        let _color = (!!_options.color) ? _options.color : null;
        let _name = (!!_options.name || _options.name === "") ? _options.name : null;

        this.series.push({ name: _name, color: _color, data: data });
    }

    /**
     * Chart를 그리는 메소드
     */
    show() {
        Highcharts.chart({
            chart: { renderTo: this.target, type: "scatter", zoomType: "xy" },
            accessibility: { description: "" },
            title: { text: this.title },
            subtitle: { text: "" },
            legend: {
                layout: "vertical", align: "left", verticalAlign: "top",
                x: 100, y: 70, floating: true,
                backgroundColor: Highcharts.defaultOptions.chart.backgroundColor,
                borderWidth: 1
            },
            plotOptions: {
                scatter: {
                    marker: {
                        radius: 5,
                        states: {
                            hover: { enabled: true, lineColor: "rgb(100,100,100)" },
                        },
                    },
                    states: {
                        hover: {
                            marker: { enabled: false },
                        },
                    },
                    tooltip: { headerFormat: "<b>{series.name}</b><br>", pointFormat: "{point.x} , {point.y}" },
                },
            },
            series: this.series
        });
    }
}
