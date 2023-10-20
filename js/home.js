var tagsArr = ["Wi-Fi", "Open Now", "Photocopier", "Digital Resources", "Wheelchair accessible", "Meeting rooms", "Group Friendly", "Scanner", "Noise Level", "Outdoor seating"];
var selectTagsArr = [];
/**
 * tag click
 */
$(".tags-li").click(function() {
        var index = $(this).index();
        var text = $(this).html();
        if ($(".tags-li").eq(index).hasClass("tags-active")) {
            $(".tags-li").eq(index).removeClass("tags-active");
            //remove tags
            var index1 = selectTagsArr.findIndex(item => item === text)
                // 然后调用js的splice方法
            selectTagsArr.splice(index1, 1)
        } else {
            $(".tags-li").eq(index).removeClass("tags-active");
            $(".tags-li").eq(index).addClass("tags-active");
            selectTagsArr.push(text)
        }
        console.log(selectTagsArr)
        var strings = selectTagsArr.join("&nbsp;&nbsp;&nbsp;")
        $(".select-ul").html(strings)
    })
    /**
     * create card
     */
$(".create-button").click(function() {
        if (selectTagsArr.length == 0) {
            alert("Please select tags")
        } else {
            var strings = selectTagsArr.join("#");
            window.location.href = "./card.html?tags=#" + strings;

        }
    })
    /**
     * submit click
     */
$(".study-button").click(function() {
    var strings = selectTagsArr.join("#");
    window.location.href = "./main.html?tags=#" + strings;
})