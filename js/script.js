document.getElementById("submit").onclick = function() {
    myFunction()
};
var des = document.getElementById('description')
var results = [];

function myFunction() {
    while (layers.length > 0) {
        map.removeLayer(layers.pop())
    }
    var library = document.getElementById("namelibrary").value
    for (i in markerInfos) {
        if (markerInfos[i]["library"] == library) {
            markerInfos[i]["marker"].addTo(map)
            layers.push(markerInfos[i]["marker"])
            des.innerHTML = markerInfos[i]['total']
        }
    }

}

var layers = []
var map = undefined
var markerInfos = []

function show(results) {
    // document.getElementById("submit").onclick = function() {show()};
    console.log(results);

    var myMap = L.map("map").setView([-21, 148], 4);
    map = myMap
    console.log(myMap)

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</ a> contributors'
    }).addTo(myMap);

    // var a1=document.getElementById("namelibrary"); 
    $.each(results, function(recordID, recordValue) {

        // var recordLatitude = recordValue["Latitude (Decimal)"];
        // var recordLongitude = recordValue["Longitude (Decimal)"];
        // var recordName = recordValue["Branch Name"];
        // var recordPhone = recordValue["Phone"];
        // var recordPostcode = recordValue['Address Postcode']
        // var recordURL = recordValue["Directory URL"];
        // var recordAddress = recordValue['Address Line 1']
        var recordLatitude = recordValue["Latitude"];
        var recordLongitude = recordValue["Longitude"];
        var recordName = recordValue["Facilities"];
        var recordPhone = recordValue["Phone"];
        var recordPostcode = recordValue['Summary']
        var recordURL = recordValue["Website"];
        var recordAddress = recordValue['Address']
        var recordTotal = [recordName, recordLatitude, recordLongitude, recordPostcode, recordPhone, recordURL, recordAddress];

        var marker = L.marker([recordTotal[1], recordTotal[2]]);
        layers.push(marker);
        marker.addTo(myMap);
        var popupText = "<strong>" + 'Name: ' + recordTotal[0] + ', Address: ' + recordTotal[6] + ', Postcode: ' + recordTotal[3] + ', Phone: ' + recordTotal[4];
        marker.bindPopup(popupText).openPopup();
        markerInfos.push({
            'library': recordTotal[0],
            'marker': marker,
            'total': popupText,

        });
    })

};


$(document).ready(function() {
    var data = {
        resource_id: "0f223803-897b-46e3-8fbb-930ad1925673",
        limit: 1000,
        q: ""
    }
    $.ajax({
        // url: "https://www.data.qld.gov.au/api/3/action/datastore_search",
        url: "https://www.data.brisbane.qld.gov.au/data/api/3/action/datastore_search",
        data: data,
        dataType: "jsonp",
        cache: true,
        async: false,
        success: function(res) {
            results = results.concat(res.result.records)
            console.log(res.result.records)
            getCafeData()

        }
    });
    // setTimeout(() => {
    //     show(results);
    //     drawHtml(results)
    // }, (3000));

});

function getCafeData() {
    var data = {
        resource_id: "69ed0503-43db-4873-abd6-9fcc500b805b",
        limit: 100,
        q: ""
    }
    $.ajax({
        // url: "https://www.data.qld.gov.au/api/3/action/datastore_search",
        url: "https://www.data.brisbane.qld.gov.au/data/api/3/action/datastore_search",
        data: data,
        dataType: "jsonp",
        cache: true,
        async: false,
        success: function(res) {
            var data = jsonData2.resultSet;
            var cafeData = res.result.records;
            console.log(cafeData)

            var dataAfter = []
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                var obj = cafeData[i];
                item.Address = obj['Business Address'];
                item.cafeFlag = true;
                dataAfter.push(item)
            }
            results = results.concat(dataAfter)
            console.log(results)
            filterData()
        }
    });
}

function filterData() {
    var url = window.location.href;
    var index = url.lastIndexOf("\=");
    var tags = url.substring(index + 1, url.length);
    var tagsArr = tags.split("#");
    tagsArr = tagsArr.slice(1);
    for (var i = 0; i < tagsArr.length; i++) {
        tagsArr[i] = tagsArr[i].replace("%20", " ")
    }
    console.log(tagsArr)
    var data = results;
    //查看当前数据是否含有选中tags标签数据
    var filterDatas = [];
    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < tagsArr.length; j++) {
            var keyWord = tagsArr[j];
            if (data[i].Facilities.indexOf(keyWord) >= 0) {
                filterDatas.push(data[i]);
                break;
            }
        }

    }
    console.log(filterDatas)

    show(filterDatas);
    drawHtml(filterDatas)
}

function drawHtml(results) {
    var html = "";
    for (var i = 0; i < results.length; i++) {
        var item = results[i];
        html += '<div class="library-li" >' +
            '<div class="library-title">' +
            '<span class="card-icon">' + item["Venue"] + '</span>' +
            '</div>' +
            '<div class="time-container">' +
            '<div class="blue-words">open now!opening hours:</div>' +
            '<div>' + item["Open"] + '</div>' +
            '</div>' +
            '<div class="star-container">' +
            '<i class="starfill-icon"></i>' +
            '<i class="starfill-icon"></i>' +
            '<i class="starfill-icon"></i>' +
            '<i class="starfill-icon"></i>' +
            '<i class="star-icon"></i>' +
            ' </div>' +
            '<div class="tag-container"> Tags:' +
            '<span class="normal-words">' + item["Facilities"] + '</span>' +
            '</div>' +

            '<div class="more-container" onclick="jumpDetail(' + JSON.stringify(item).replace(/"/g, '&quot;') + ')">' +
            '>>more information & reviews' +
            '</div>' +
            '</div>'
    }
    $(".library-ul").html(html)
}

function jumpDetail(item) {
    window.location.href = "./detail.html?id=" + item._id;
    localStorage.setItem("libiraryItem", JSON.stringify(item))

}