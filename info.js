
var arr = [];

for (var key in localStorage) {  
    if(key == "start")
        continue;
    var point = JSON.parse(localStorage.getItem(key));
    if(point == null)
        break;
    if(typeof(point) != "object")
        continue;
    arr.push(point)
}

info(); 


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

// LOAD INFO
function info() {
    table = `
        <tr>
            <th>ID</th>
            <th>Tên địa điểm</th>
        </tr>`;
    
    for (var i = 0; i < arr.length; i++) {
        var op = document.createElement('option');
        op.setAttribute('value',`${arr[i].id}`);
        op.text = arr[i].name;
        document.getElementById('select').appendChild(op);

        table +=    `<tr>
                        <td style="text-align:center">${arr[i].id}</td>
                        <td style="padding-left: 20px">${arr[i].name}</td>
                    </tr>`
    }
    var start = JSON.parse(localStorage.getItem("start"));
    if(start != null) {
        document.getElementById('select').value = start.id;
    }
    document.getElementById('location').innerHTML = table;
}

function search() {
    window.localStorage.clear();
    for(var i = 0; i < arr.length; i++) {
        localStorage.setItem(i, JSON.stringify(arr[i]));
    }
    var value = document.getElementById('select').value;
    for (var i = 0; i < arr.length; i++) {
        if(value == arr[i].id)
        localStorage.setItem("start", JSON.stringify(arr[i]));
    }
    localStorage.setItem("Slove", JSON.stringify("GTS1"));
    location.reload()
}

function search2() {
    localStorage.setItem("Slove", JSON.stringify("GTS2"));
    location.reload()
}