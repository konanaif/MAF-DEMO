/*
    @usage
    const data = [
        {
            weight: 0,
            data: [
                {ms: -300, value: 14},
                {ms: -200, value: 22},
                {ms: -150, value: 65},
                {ms: 0, value: 78},
                {ms: 100, value: 69},
                {ms: 200, value: 52},
                {ms: 300, value: 29},
                {ms: 400, value: 14},
            ]
        }
    ]

    const chart = new CnnChart(data);
    chart.setTarget = '#histogram';
    chart.show();
*/
/**
 * CNN의 Histogram을 나타내기 위한 클래스, d3 라이브러리 필요
 */
class CnnChart {
    #config = {
        target: 'body', // 차트를 표시할 타겟
        width: 600, height: 400, // 차트의 크기
        innerHeight: 300, // 그래프의 최대 크기
        padding: 30, // 차트의 패딩값
        margin: { // 차트의 마진값
            top: 40, right: 0, bottom: 40, left: 0
        },
        color: { // 그래프의 컬러 스케일
            start: "#FFA270", end: "#C64017"
        }
    };

    #data;

    /**
     * @param data {Array<Object>} - 데이터 배열
     */
    constructor(data) {
        this.#data = data;
    }

    /**
     * 차트를 구성 후 표시
     * @description - cnn.show();
     */
    show() {
        // Make X Axis
        const [xAxis, yAxis, fy] = this.#makeAxis(this.#data)

        // Binding SVG Tag
        const svg = d3.select("#histogram")
            .style('width', this.#config.width)
            .style('height', this.#config.height);

        // Add Axis
        svg.append('g').call(xAxis);
        svg.append('g').call(yAxis);

        // get X, Y Position
        const sh = this.#config.height - this.#config.innerHeight;
        let intvArr = getInnerXPos(this.#data);

        // draw Summay Chart
        this.#loopSummaryChart(this.#data, intvArr)

        /**
         * Area 그래프를 Y축에 맞게 출력하기 위한 메소드
         * @param data {Array<Object>}
         */
        function getInnerXPos(data) {
            let prev=0; let now=0; let intv=0; let intvArr = [];
            for(let i=0; i<data.length; i++) {
                if(prev !== 0) {
                    now = fy(data[i].weight);
                    intv = intv + (prev - now);
                }

                prev = fy(data[i].weight);
                intvArr.push(sh - intv);
            }

            return intvArr;
        }
    }

    /**
     * @private
     * 차트의 X축과 Y축을 표시하기 위한 메소드
     * @param data {Array<Object>}
     */
    #makeAxis(data) {
        // init X Axis, range : 0 to max
        const x = d3.scaleLinear()
            .domain(getSptrX(data)).nice()
            .range([this.#config.padding, this.#config.width - this.#config.padding]);

        // Make X Axis
        const xAxis = g => g.attr("transform", `translate(0, ${this.#config.height - this.#config.margin.bottom})`)
            .attr("class", "cnn-xAxis")
            .call(d3.axisBottom(x).ticks(this.#config.width / 90).tickSizeOuter(0))
            .call(g => g.select('.domain').remove())
            .call(g => g.selectAll('line').remove());

        // this.#min = getSptrX(data)[0];

        // init Y Axis : Not Nice
        const y = d3.scaleLinear()
            .domain(getSptrY(data))/*.nice()*/
            .range([this.#config.height - this.#config.margin.bottom, this.#config.margin.top*4]);

        // Make Y Axis
        const yAxis = g => g.attr("transform", `translate(${this.#config.padding}, 0)`)
            .attr("class", "cnn-yAxis")
            .call(d3.axisLeft(y))
            .call(g => g.selectAll('text').remove())
            .call(g => g.select('.domain').remove())
            .call(g => g.selectAll('line').remove());

        return [xAxis, yAxis, y];

        /**
         * 차트의 X축을 설정하는 함수
         */
        function getSptrX(_data) {
            let max; let min;

            for(const e of _data) {
                let mx = d3.max(e.data, d => d.ms);
                max = (max >= mx) ? max : mx;

                let mn = d3.min(e.data, d => d.ms);
                min = (min <= mn) ? min : mn;
            }

            return [min, max];
        }

        /**
         * 차트의 Y축을 설정하는 함수, 인덱스 간의 간격을 2배로 측정
         */
        function getSptrY(_data) {
            let max = d3.max(_data, d => d.weight);
            let min = d3.min(_data, d => d.weight);

            return [min, max*2];
        }
    }

    /**
     * @private
     * 입력된 데이터 만큼 Area Summary 차트가 생성되도록 처리하는 함수
     * @param data {Array<Object>}
     * @param heightArray {Array<float>}
     */
    #loopSummaryChart(data, heightArray) {
        let dataRv = data.reverse();
        let spectrum = getSptr(data);
        let linearColor = d3.scaleLinear()
            .domain([0, data.length])
            .range([this.#config.color.start, this.#config.color.end])

        // 역순으로 출력, 가장 마지막 데이터가 가장 먼저 표시된다
        for(let i=0; i<data.length; i++) {
            this.#makeSummary(dataRv[i].data, heightArray[heightArray.length - (1+i)], spectrum.x, spectrum.y, linearColor(data.length - (1+i)))
        }

        /**
         * 그래프의 축을 설정하는 메소드
         */
        function getSptr(data) {
            let maxX; let minX; let maxY; let minY;
            for(const e of data) {
                let mxX = d3.max(e.data, d => d.ms);
                maxX = (maxX >= mxX) ? maxX : mxX;

                let mnX = d3.min(e.data, d => d.ms);
                minX = (minX <= mnX) ? minX : mnX;

                let mxY = d3.max(e.data, d => d.value);
                maxY = (maxY >= mxY) ? maxY : mxY;

                let mnY = d3.min(e.data, d => d.value);
                minY = (minY <= mnY) ? minY : mnY;
            }

            return {x: [minX, maxX], y: [minY, maxY]};
        }
    }

    /**
     * @private
     * Area 그래프를 그리는 메소드
     * @param data {Array<Object>}
     * @param intv {float}
     * @param sptrX {[number, number]}
     * @param sptrY {[number, number]}
     * @param color {string}
     */
    #makeSummary(data, intv, sptrX, sptrY, color) {
        // init X
        const fx = d3.scaleLinear()
            .domain(sptrX)/*.nice()*/
            .range([this.#config.padding, this.#config.width - this.#config.padding]);

        // init Y Axis
        const fy = d3.scaleLinear()
            .domain(sptrY).nice()
            .range([this.#config.innerHeight - this.#config.margin.bottom, this.#config.margin.top]);

        // Binding SVG Tag
        const svg = d3.select(this.#config.target).append('svg')
            .attr("class", "cnn-summary")
            .style('width', this.#config.width)
            .style('height', this.#config.innerHeight);

        // Make Group
        const group = svg.append("g").attr("class", "cnn-group").attr("transform", `translate(0, ${intv})`);

        this.#innerMakeArea(group, data, fx, fy, color);
        this.#innerMakeLine(group, data, fx, fy);
        this.#innerMakeDot(group, data, fx, fy, color);
    }

    /**
     * @private
     * Area 차트의 선을 그리는 메소드
     * @param group {Object}
     * @param data {Array<Object>}
     * @param fx {function}
     * @param fy {function}
     */
    #innerMakeLine(group, data, fx, fy) {
        // Make Line Chart
        const line = d3.line()
            .defined(d => !isNaN(d.value))
            .x(d => fx(d.ms))
            .y(d => fy(d.value));

        // Add Line Graph
        group.append('path')
            .datum(data)
            .attr("class", "cnn-line")
            .attr("fill", "none")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke", "#ccc")
            .attr("stroke-width", 1)
            .attr("d", line)
    }

    /**
     * @private
     * Area 차트의 Area를 그리는 메소드
     * @param group {Object}
     * @param data {Array<Object>}
     * @param fx {function}
     * @param fy {function}
     * @param color {string}
     */
    #innerMakeArea(group, data, fx, fy, color) {
        // Make Area Chart
        const area = d3.area()
            .x(d => fx(d.ms))
            .y0(fy(0))
            .y1(d => fy(d.value));

        // Add Area Graph
        group.append('path')
            .datum(data)
            .attr("class", "cnn-area")
            .attr("fill", color)
            .attr("d", area);
        // .on("mouseover", (a, b, c) => { console.log(d3.max(a, d => d.value)) })
        // .on("mouseout", _ => {  });
    }

    /**
     * @private
     * 최고점에 원과 텍스트를 표시하는 메소드
     * @param group {Object}
     * @param data {Array<Object>}
     * @param fx {function}
     * @param fy {function}
     * @param color {string}
     */
    #innerMakeDot(group, data, fx, fy, color) {
        // Add Dot
        const dot = (_ => {
            let max = d3.max(data, d => d.value);
            return data.find(e => e.value === max);
        })();

        group.append('circle')
            .attr("class", "cnn-dot")
            .attr("cx", fx(dot.ms))
            .attr("cy", fy(dot.value))
            .attr("r", 3)
            .attr("fill", color)
            .attr("stroke", "#ccc")
            .attr("stroke-width", 1)

        group.append('text')
            .attr("class", "cnn-text")
            .text(dot.value)
            .attr("x", fx(dot.ms))
            .attr("y", fy(dot.value) - 10)
            .attr("text-anchor", "middle")
            .attr("display", "none") // base
            .attr("font-family", "sans-serif") // base
            .attr("font-size", "16px") // base
            .attr("fill", "black") // base
            .attr("font-weight", "bold") // base
    }


    /**
     * 차트를 표시할 대상을 지정
     * @param selector {string}
     * @description - cnn.setTarget = "body";
     */
    set setTarget(selector) { this.#config.target = selector; }

    /**
     * 차트의 너비를 지정, default=600
     * @param width {number}
     * @description - cnn.setWidth = 600;
     */
    set setWidth(width) { this.#config.width = width; }

    /**
     * 차트의 높이를 지정, default=400
     * @param height {number}
     * @description - cnn.setHeight = 400;
     */
    set setHeight(height) { this.#config.height = height; }

    /**
     * 차트의 padding을 지정, default=30
     * @param padding {number}
     * @description - cnn.setPadding = 30;
     */
    set setPadding(padding) { this.#config.padding = padding; }

    /**
     * 그래프의 최대 높이를 지정, default=300
     * @param height {number}
     * @description - cnn.setInnerHeight = 300;
     */
    set setInnerHeight(height) { this.#config.innerHeight = height; }

    /**
     * 그래프의 색상 스케일을 지정, default=["#FFA270", "#C64017"]
     * @param start {string}
     * @param end {string}
     * @description - cnn.setAreaColor = ["#FFA270", "#C64017"];
     */
    set setAreaColor([start, end]) {
        this.#config.color.start = start;
        this.#config.color.end = end;
    }

    /**
     * 차트의 마진값 설정, default=[40, 40]
     * @param top {number}
     * @param bottom {number}
     * @description - cnn.setMargin = [40, 40];
     */
    set setMargin([top, bottom]) {
        this.#config.margin.top = top;
        this.#config.margin.bottom = bottom;
    }
}
