/*
    @usage
    const ffnn = new FfnnChart();
    ffnn.target = "#nodeChart";
    ffnn.nodes = [4, 6, 3];
    ffnn.course = [3, 3, 5, 1];
    ffnn.hiddenLayer = 2;
    ffnn.show();
 */

/**
 * FFNN Chart를 그리기 위한 클래스, d3 라이브러리 필요
 */
class FfnnChart {
    #config = {
        target: "", // 그래프를 표시할 svg 태그의 선택자
        inputNode: 1, // Input Node의 수
        hiddenNode: 1, // Hidden Node의 수
        outputNode: 1, // Output Node의 수
        hiddenLevel: 1, // Hidden Layer의 수
        course: [] // 강조할 선의 경로
    }

    #adjust = 42; #radius = 10; // 원의 크기 및 간격에 대한 계수

    constructor() {}

    /**
     * 차트를 표시하는 메소드
     * @description - ffnn.show()
     */
    show() {
        const tag = this.#init();
        this.#build(tag)
    }

    /**
     * @private
     * 기본값을 설정하는 메소드
     */
    #init() {
        let tag = {}

        // init svg, use d3 Library
        let svg = d3.select(this.#config.target);
        let width = svg.attr("width");
        let height = svg.attr("height");

        // d3 color scheme
        tag.color = d3.scaleOrdinal(d3.schemeCategory10);

        // elements for data join
        tag.link = svg.append("g").selectAll(".link");
        if(this.#config.course.length > 0) {
            tag.accent = svg.append("g").selectAll(".accent");
        }
        tag.node = svg.append("g").attr("class", "ffnn-nodeBody").selectAll(".node");

        //	simulation initialization
        tag.simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(d => { return d.id; }))
            .force("charge", d3.forceManyBody().strength(-500))
            .force("center", d3.forceCenter(width / 2, height / 2));
            // .force("center", d3.forceCenter(width, height));

        tag.graph = this.#makeGraph();

        return tag;
    }

    /**
     * @private
     * graph 설정 값을 생성하는 메소드
     */
    #makeGraph() {
        const input = this.#config.inputNode;
        const hidden = this.#config.hiddenNode;
        const output = this.#config.outputNode;
        const layerLavel = (2+this.#config.hiddenLevel);
        const courseLength = this.#config.course.length;
        const maxCnt = Math.max(input, hidden, output);

        // limit max node
        if(maxCnt < 6) { this.#adjust = 50; this.#radius = 30; }
        else { this.#adjust = 50 - ((maxCnt-5) * 4.7); this.#radius = 30 - ((maxCnt-5) * 4.7); }

        // limit adjust node
        if(this.#adjust > 50) { this.#adjust = 50; }
        else if(this.#adjust < 10) { this.#adjust = 10; }

        // limit radius node
        if(this.#radius > 30) { this.#radius = 30; }
        else if(this.#radius < 10) { this.#radius = 10; }

        // create Node : Hidden Layer의 레벨에 따라 다르게 동작
        let arrayCnt = 0; let groupIndex = 1;
        let layerArray = []; let sum = input;
        for(let i = 0; i<layerLavel; i++) {
            if(i === 0) { layerArray.push(createNode(sum, `${groupIndex++}`, input)) } // input 일 때
            else if(i === layerLavel-1) { layerArray.push(createNode(sum, `${groupIndex++}`, output)) } // output 일 때
            else { layerArray.push(createNode(sum, `${groupIndex++}`, hidden)) } // hidden 일 때

            arrayCnt++;

            // 마지막 루프에서 output을 더한다, 그게 아니면 히든을 더한다
            if(i === layerLavel-2) sum += output;
            else sum += hidden;
        }

        // create Link
        const linkArr = createLink();

        // create Nodes
        let nodeArr = []
        for(let i=0; i<layerArray.length; i++) {
            nodeArr = nodeArr.concat(layerArray[i]);
        }

        // create Accent
        let accentArr = {}
        if(this.#config.course.length > 0) {
            accentArr = createAccent(this.#config.course);
        }

        return {'nodes': nodeArr, 'links': linkArr, 'accent': accentArr};

        /** Node에 대한 정보를 설정하는 메소드 */
        function createNode(target, group, groupCnt) {
            let nodeArray = []; let s = 1;

            for(let i = arrayCnt; i<target; i++) {
                arrayCnt = i;
                nodeArray.push({
                    "id" : String(arrayCnt), "group" : group, "sort" : String(s++), "groupCnt" : String(groupCnt), "maxCnt" : String(maxCnt)
                });
            }

            return nodeArray;
        }

        /** Link에 대한 정보를 설정하는 메소드 */
        function createLink() {
            let id = 0; let linkArray = [];

            // 레이어의 개수 만큼 만든다
            for(let i=1; i<layerArray.length; i++) {
                makeLink(layerArray[i-1], layerArray[i]);
            }

            function makeLink(start, end) {
                for (let i=0; i<start.length; i++){
                    const startNode = start[i];

                    for(let j=0; j<end.length; j++) {
                        const endNode = end[j];
                        const link = { "source" : startNode['id'], "target" : endNode['id'], "id" : String(id++) };
                        linkArray.push(link);
                    }
                }
            }

            return linkArray;
        }

        /** Accent에 대한 정보를 설정하는 메소드 */
        function createAccent(course) {
            let links = []; let node = 0;
            for(let i=0; i<courseLength; i++) {
                if(i === 0) {
                    links.push(`${course[i]-1}`); node += input;
                }
                else {
                    links.push(`${node + course[i]-1}`); node += hidden;
                }
            }

            let _accentArr = [];
            for(let i=1; i<courseLength; i++) {
                _accentArr.push({"source": `${links[i-1]}`, "target": `${links[i]}`, "id": `${i-1}`})
            }

            return _accentArr;
        }
    }

    /**
     * @private
     * 입력된 값을 기반으로 차트를 생성하는 메소드
     */
    #build(tag) {
        const adjust = this.#adjust;

        // Create Link Line Tag
        tag.link = tag.link.data(tag.graph.links); // DATA JOIN : Update link set based on current state
        tag.link.exit().remove(); // EXIT : Remove old links
        tag.link = tag.link.enter().append("line") // ENTER : Create new links as needed.
            .attr("class", "ffnn-link")
            .merge(tag.link);

        // Create Node Circle Tag
        tag.node = tag.node.data(tag.graph.nodes); // DATA JOIN
        tag.node.exit().remove(); // EXIT
        tag.node.enter().append("circle") // ENTER
            .attr("class", "ffnn-node")
            .attr("r", this.#radius)
            .attr("fill", d => { return tag.color(d.group); })
            .attr("cx",   d => { return getCx(d.group); })
            .attr("cy",   d => { return getCy(d.sort, d.maxCnt, d.groupCnt); })
            .merge(tag.node);

        // Create Accent Line Tag
        if(this.#config.course.length > 0) {
            tag.accent = tag.accent.data(tag.graph.accent); // DATA JOIN
            tag.accent.exit().remove(); // EXIT
            tag.accent = tag.accent.enter().append("line") // ENTER
                .attr("class", "ffnn-accent")
                .merge(tag.accent);
        }

        // Set nodes, links, accent and alpha target for simulation
        tag.simulation.nodes(tag.graph.nodes);
        tag.simulation.force("link").links(tag.graph.links);
        tag.simulation.force("link").links(tag.graph.accent);

        // Draw line : use x, y attribute
        setTimeout(_ => {
            drawLine(tag.link);
            if(this.#config.course.length > 0) {
                drawLine(tag.accent);
            }
        }, 100);

        tag.simulation.alphaTarget(0.3).restart();
        moveCenter(this.#config.target);


        /**
         * 태그의 x 좌표를 지정하는 메소드
         */
        function getCx(group) {
            const width_x = 150;
            return group * width_x;
        }

        /**
         * 각 태그의 y 좌표를 지정하는 메소드
         */
        function getCy(sort, maxCnt, groupCnt) {
            let cy = sort * (adjust*2);
            const minus = maxCnt - groupCnt;
            if(minus > 0) {
                const addVar = minus*adjust;
                cy += addVar;
            }
            return cy;
        }

        /**
         * 각 노드를 연결하는 선을 그리는 메소드
         */
        function drawLine(target) {
            target.attr("x1", d => { return getCx(d.source.group); })
                .attr("y1", d => { return getCy(d.source.sort, d.source.maxCnt, d.source.groupCnt); })
                .attr("x2", d => { return getCx(d.target.group); })
                .attr("y2", d => { return getCy(d.target.sort, d.target.maxCnt, d.target.groupCnt); });
        }

        /**
         * 그래프가 가운데 위치하도록 ViewBox를 조정하는 메소드
         */
        function moveCenter(target) {
            const g = d3.select(`${target} .ffnn-nodeBody`).node().getBoundingClientRect();
            const s = d3.select(`${target}`).node().getBoundingClientRect();

            let x0 = g.x - s.x;             let y0 = g.y - s.y;
            let x1 = x0-(s.width-g.width);  let y1 = y0-(s.height-g.height);
            let xc = (x0+x1)/2;             let yc = (y0+y1)/2;

            const svg = d3.select(`${target}`);
            const width = svg.attr('width'); const height = svg.attr('height');

            svg.attr("viewBox", [xc, yc, width, height]);
        }
    }

    /**
     * 그래프를 표시할 svg 태그를 선택하는 메소드
     * @param selector {string}
     * @description - ffnn.setTarget = "body";
     */
    set target(selector) { this.#config.target = String(selector); }

    /**
     * Input Node의 수를 지정하는 메소드, default=1;
     * @param numberOf {number}
     * @description - ffnn.setInput = 4;
     */
    set input(numberOf) { this.#config.inputNode = (numberOf > 0) ? numberOf : 1; }

    /**
     * Hidden Node의 수를 지정하는 메소드, default=1;
     * @param numberOf {number}
     * @description - ffnn.setHidden = 8;
     */
    set hidden(numberOf) { this.#config.hiddenNode = (numberOf > 0) ? numberOf : 1; }

    /**
     * Output Node의 수를 지정하는 메소드, default=1;
     * @param numberOf {number}
     * @description - ffnn.setOutput = 2;
     */
    set output(numberOf) { this.#config.outputNode = (numberOf > 0) ? numberOf : 1; }

    /**
     * Hidden Layer의 수를 지정하는 메소드, default=1;
     * @param numberOf {number}
     * @description - ffnn.hiddenLayer = 1;
     */
    set hiddenLayer(numberOf) { this.#config.hiddenLevel = (numberOf > 0) ? numberOf : 1; }

    /**
     * 노드의 수를 일괄적으로 지정하는 메소드
     * @param input {number}
     * @param hidden {number}
     * @param output {number}
     * @description - ffnn.nodes = [4, 8, 2];
     */
    set nodes([input, hidden, output]) {
        this.#config.inputNode = (input > 0) ? input : 1;
        this.#config.hiddenNode = (hidden > 0) ? hidden : 1;
        this.#config.outputNode = (output > 0) ? output : 1;
    }

    /**
     * Optional, 강조 표시할 라인을 지정하는 메소드
     * @param course {Array<number>}
     * @description - ffnn.course = [1, 4, 2];
     */
    set course(course) {
        this.#config.course = course;
    }
}
