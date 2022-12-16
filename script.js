// var file = JSON.parse(localStorage.getItem("file"));
//window.localStorage.clear();
import abc from "./db.json"  assert {type: 'json'};

var arr = abc.location;

var edge = 10;

class Point {
    constructor() {
        this.id;
        this.name;
        this.review;
        this.x;
        this.y;
    }
}

// CREATE GRAPH
class Graph {
    constructor() {
        this.matrix = [];
        this.point = [];
    }

    initMatrix(arr) {
        this.matrix = [];
        this.point = [];
        for(var i = 0; i < arr.length; i++) {
            var p = new Point()
            p.id = arr[i].id;
            p.name = arr[i].name;
            p.x = arr[i].x;
            p.y = arr[i].y;
            p.review = 0;
            this.point.push(p);

            this.matrix.push([]);
            for(var j = 0; j < arr.length; j++) {
                var distance = calculateDistance(arr[i], arr[j]);
                this.matrix[i].push(distance);
            }   
        }
    }

    createMatrix(arr) {
        for(var i = 0; i < arr.length; i++) {
            var p = new Point()
            p.id = arr[i].id;
            p.name = arr[i].name;
            p.x = arr[i].x;
            p.y = arr[i].y;
            p.review = 0;
            this.point.push(p);

            this.matrix.push([]);
            for(var j = 0; j < arr.length; j++) {
                var distance = calculateDistance(arr[i], arr[j]);
                this.matrix[i].push(distance);
            }   
        }
    }
    
}

// CREATE GTS
class GTS {
    constructor() {
        this.Tour = []
        this.Cost = 0
    }

    Slove(graph, start) {
        var V = start;
        this.Tour.push(V);
        graph.point[V.id].review = 1;

        while (true) {
            var vtMin = -1;
            // Tìm đỉnh kề
            var i = 0;
            for(; i < graph.point.length; i++) {
                if (graph.point[i].review == 0 && graph.matrix[V.id][graph.point[i].id] != 0) {
                    vtMin = i;
                    break;       
                }
            }

            // Kiểm tra xem đã duyệt hết đồ thị chưa
            if (vtMin == - 1)
            {
                this.Tour.push(start);
                this.Cost += graph.matrix[V.id][start.id];
                return;
            }

            // Tìm đỉnh kề gần nhất
            for(; i < graph.point.length; i++) {
                if (graph.point[i].review == 0 && graph.matrix[V.id][graph.point[i].id] != 0 &&
                     graph.matrix[V.id][graph.point[i].id] < graph.matrix[V.id][graph.point[vtMin].id]) {
                    vtMin = i;
                }
            }

            graph.point[vtMin].review = 1 // Thăm đỉnh kề gần nhất
            this.Tour.push(graph.point[vtMin]);
            this.Cost += graph.matrix[V.id][graph.point[vtMin].id];
            V = graph.point[vtMin];
        }
    }
}

class GTS2 {
    constructor() {
        this.Tour = []
        this.Cost = 0
    }

    Slove(graph) {
        // min_Tour = []
        // min_Cost = -1
        for(var i = 0; i < graph.point.length; i++) {
            var new_gts = new GTS();
            graph.initMatrix(arr)

            new_gts.Slove(graph, graph.point[i]);
            if (this.Cost == 0) {
                this.Tour = new_gts.Tour
                this.Cost = new_gts.Cost
            } else if (new_gts.Cost < this.Cost) {
                this.Tour = new_gts.Tour
                this.Cost = new_gts.Cost
            }
        }
    }
}

//GET LOCATION

//window.localStorage.clear();
for(var i = 0; i < arr.length; i++) {
    localStorage.setItem(i, JSON.stringify(arr[i]));
}
clearStart();
function clearStart() {
    var start = JSON.parse(localStorage.getItem("start"));
    if (start != null) {
        var count = 0
        for(var i = 0; i < arr.length; i++) {
            if (start.x == arr[i].x && start.y == arr[i].y) {
                count++;
            }
        }
        if(count == 0) {
            localStorage.removeItem("start");
        }
    }
}

// ================================== START =======================================
//GET CONTAINER
var container = document.getElementById('container');
var svg = document.getElementById('svg');
// var line = document.getElementById('line');
// const ctx = line.getContext('2d');


// Tạo giao diện bản đồ
var rows = maxX(0) + 1, columns = maxY(0) + 1;
var map = createMap(rows, columns);
container.appendChild(map);


// Tạo cấu trúc bản đồ
var graph = new Graph();
graph.createMatrix(arr);

// Tạo giao diện các đỉnh
createPoint(arr);

// Lấy vị trí của điểm trên bản đồ
createPosition(arr);

if (JSON.parse(localStorage.getItem("Slove")) == "GTS1") {
    run();
} else {
    run2();
}



// ====================================== END ===================================


// DROW LINE
function drowLine(Tour) {
    for(var i = 0; i < Tour.length - 1; i++) {
        var newLine = document.createElementNS('http://www.w3.org/2000/svg','line');
        newLine.setAttribute('x1',`${arr[Tour[i].id].w}`);
        newLine.setAttribute('y1',`${arr[Tour[i].id].h}`);
        newLine.setAttribute('x2',`${arr[Tour[i+1].id].w}`);
        newLine.setAttribute('y2',`${arr[Tour[i+1].id].h}`);
        newLine.setAttribute("style", "stroke:rgb(0,0,0);stroke-width:2;")
        svg.append(newLine);
    }
}


// CALCULATE DISTANCE BETWEEN 2 POINTS
function calculateDistance(a, b) {
    return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
}

// CREATE MAP
function createMap(rows, columns) {
    var map = document.createElement('div');
    for(var i = 0; i < rows; i++) {
        var row = createRow(i, columns);
        map.appendChild(row);
    }
    return map;
}

// CREATE MATRIX
// function createMatrix(arr) {
//     var matrix = [];
//     for(var i = 0; i < arr.length; i++) {
//         matrix.push([]);
//         for(var j = 0; j < arr.length; j++) {
//             var distance = calculateDistance(arr[i], arr[j]);
//             matrix[i].push(distance);
//         }   
//     }
//     return matrix;
// }


// CREATE ROW
function createRow(rows, columns) {
    var row = document.createElement('p');
    for(var i = 0; i < columns; i++) {
        var cell = createCell(edge, '');
        row.appendChild(cell);
    }
    row.className = 'row';
    return row;
}

// CREATE CELL
function createCell(edge, text) {
    var cell = document.createElement('div');
    var content = document.createElement('p');
    
    cell.className = "cell";
    content.className = "content";
    cell.appendChild(content);

    content.style =   `width: ${edge}px;
                        height: ${edge}px;
                        padding: ${edge}px;`;
    content.innerHTML = text;

    return cell;
}

// CREATE POINT
function createPoint(arr) {
    var rows = document.querySelectorAll('.row');
    for(var i = 0; i < arr.length; i++) {
        var row = rows[arr[i].x];
        var cells = row.querySelectorAll('.cell');

        var cell = cells[arr[i].y];
        var content = cell.querySelector('.content');

        content.style = `width: ${edge}px;
                        height: ${edge}px;
                        padding: ${edge}px; 
                        background-color: blue;`;
        content.innerHTML = `${arr[i].id}`;    
    }
}

function createPosition(arr) {
    var rows = document.querySelectorAll('.row');
    for(var i = 0; i < arr.length; i++) {
        var row = rows[arr[i].x];
        var cells = row.querySelectorAll('.cell');
        var cell = cells[arr[i].y];
        arr[i].h = cell.offsetTop - document.querySelector('.cell').clientWidth / 2 - 20;
        arr[i].w = cell.offsetLeft - document.querySelector('.cell').clientWidth / 2 - 20;

        // Tạo thông báo khi rê chuột vào
        var tb = document.createElement('div');
        tb.className = "tb";
        // tb.style =  ``;
        tb.textContent = arr[i].name;
        cell.appendChild(tb);
    }
}

function run() {
    var gts = new GTS();

    var start = JSON.parse(localStorage.getItem("start"));
    if(start != null) {
        // Tạo giao diện cho đỉnh bắt đầu
        var row = document.querySelectorAll('.row')[start.x];
        var cell = row.querySelectorAll('.cell')[start.y];

        var content = cell.querySelector('.content');

        content.style = `width: ${edge}px;
                        height: ${edge}px;
                        padding: ${edge}px;
                        background-color: red;`;

        // Giải pháp
        gts.Slove(graph, start)


        var tour0 = document.getElementById('tour0');
        var tour = document.getElementById('tour');
        for (var i = 0; i < gts.Tour.length; i++) {
            tour.innerText += gts.Tour[i].name;
            tour0.innerText += gts.Tour[i].id;
            if(i + 1 < gts.Tour.length) {
                tour.innerText += "==>"
                tour0.innerText += "==>"
            }
        }
        document.getElementById('cost').textContent = gts.Cost;
        drowLine(gts.Tour);
    }
}

function run2() {
    var gts2 = new GTS2();
    // Giải pháp
    gts2.Slove(graph)

    // Tạo giao diện cho đỉnh bắt đầu
    var row = document.querySelectorAll('.row')[gts2.Tour[0].x];
    var cell = row.querySelectorAll('.cell')[gts2.Tour[0].y];

    var content = cell.querySelector('.content');

    content.style = `width: ${edge}px;
                    height: ${edge}px;
                    padding: ${edge}px;
                    background-color: red;`;


    var tour0 = document.getElementById('tour0');
    var tour = document.getElementById('tour');
    for (var i = 0; i < gts2.Tour.length; i++) {
        tour.innerText += gts2.Tour[i].name;
        tour0.innerText += gts2.Tour[i].id;
        if(i + 1 < gts2.Tour.length) {
            tour.innerText += "==>"
            tour0.innerText += "==>"
        }
    }
    document.getElementById('cost').textContent = gts2.Cost;
    drowLine(gts2.Tour);
}


function maxX(x) {
    var x = 0;
    for(var i = 0; i < arr.length; i++) {
        if(arr[i].x > x)
            x = arr[i].x
    }
    return x;
}

function maxY(y) {
    var y = 0;
    for(var i = 0; i < arr.length; i++) {
        if(arr[i].y > y)
            y = arr[i].y
    }
    return y;
}

// ====================================== LOCATION ================================


