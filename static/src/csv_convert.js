/**
 * csv를 헤더와 데이터로 나누어 배열로 만드는 함수
 * @param csv {text} - csv 문자열
 * @param delimiter {string} - csv의 구분자 역할
 * @param labeling {boolean} - csv가 라벨링 되어있는지 확인
 * @return {{values: *[], header: *[]}|{values: *[], header: *}}
 */
function makeCompotable(csv, delimiter, labeling) {
    const raw = csv.split("\n");
    const array = [];

    for (const e of raw) {
        array.push(e.split(delimiter))
    }

    for (const i in array) {
        for (const j in array[i]) {
            array[i][j] = array[i][j].replace(" ", "").replace("\r", "");
        }
    }

    if(labeling) {
        return {header: array[0], values: array.slice(1, array.length)};
    }
    else {
        return {header: [], values: array}
    }
}

/**
 * 각 행을 배열로 하여 2차원 배열로 반환하는 함수
 * @param csv {text} - 변경할 csv 문자열
 * @param delimiter {string} - csv의 구분자 역할을 하는 문자, default=','
 * @param labeling {boolean} - csv가 라벨링이 되어있으면 true, 아니면 false, default=false
 * @return {number[][]} - [ [0, 0], [1, 1], ..., [10, 10] ]
 */
function csvRowToArray(csv, delimiter = ",", labeling=true) {
    let {values} = makeCompotable(csv, delimiter, labeling);

    // number 변환
    values = values.map(e => e.map(el => {
        if(isNaN(Number(el))) {
            return el;
        }
        else {
            return Number(el);
        }
    }));

    return values;
}

/**
 * 각 열을 배열로 하여 2차원 배열로 반환하는 함수
 * @param csv {text} - 변경할 csv 문자열
 * @param delimiter {string} - csv의 구분자 역할을 하는 문자, default=','
 * @param labeling {boolean} - csv가 라벨링이 되어있으면 true, 아니면 false, default=false
 * @return {number[][]} - [ [0, 1 ...., 10], [0, 1, ..., 10] ]
 */
function csvColToArray(csv, delimiter=",", labeling=true) {
    const {values} = makeCompotable(csv, delimiter, labeling);
    const csvArray = Array.from(Array(values[0].length), _=>new Array(values.length));

    // number 변환 및 pivoting
    for (let i = 0; i < values[0].length; i++) {
        for (let j = 0; j < values.length; j++) {
            if(!isNaN(Number(values[j][i]))) {
                csvArray[i][j] = Number(values[j][i]);
            }
            else {
                csvArray[i][j] = values[j][i];
            }
        }
    }

    return csvArray;
}

/**
 * 각 열을 속성으로 하여 객체로 반환하는 함수
 * @param csv {text} - 변경할 csv 문자열
 * @param delimiter {string} - csv의 구분자 역할을 하는 문자, default=','
 * @param labeling {boolean} - csv가 라벨링이 되어있으면 true, 아니면 false, default=false
 * @return {Object} - { value1: [0, 1, ..., 10], value2: [0, 1, ..., 10] }
 */
function csvToObj(csv, delimiter=",", labeling=true) {
    let {header, values} = makeCompotable(csv, delimiter, labeling);
    let csvObject = {};

    if(!labeling) {
        for (let i = 0; i < values[0].length; i++) {
            header.push('value'+i);
        }
    }

    // 객체 초기화
    for (const el of header) {
        csvObject[el] = [];
    }

    // 배열 요소 number 전환
    values = values.map(e => e.map(el => {
        if(isNaN(Number(el))) {
            return el;
        }
        else {
            return Number(el);
        }
    }));

    // 객체에 배열 할당
    for (let i = 0; i < header.length; i++) {
        for (let j = 0; j < values.length; j++) {
            csvObject[header[i]].push(values[j][i]);
        }
    }

    return csvObject;
}
