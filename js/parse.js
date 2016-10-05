var number = 0;
var parsedArray = [];
var optionValue;

function printArray(array){
    array.forEach(function(v){
        //console.log(v);
    });
}

$(document).ready(function(){
    optionValue = $("#outputSelect").val();
    function parseUrl(url, findClass){

        var outputArray = [];
        var encodedURL = encodeURIComponent(url);

        $.post({
            url: "php/parse.php",
            data: "url=" + encodedURL,
            async: true,
            success: function(data){
                $(data).find(findClass).each(function(){
                    outputArray.push(this.innerText);
                })

				if(optionValue === "careerTable"){
					var start, mid, end, oldCareer, newCareer;
					//Append to Table
					$.each(outputArray, function(i,v){
						start = (v.toLowerCase().indexOf("from") >= 0) ? 5 : 0;
						mid = v.toLowerCase().search(" to ");
						end = (mid >= 0) ? mid : v.length;
						oldCareer = v.slice(start, end);
						newCareer = v.slice(end + 4, v.length);
						number++;

						parsedArray.push({"oldCareer": oldCareer, "newCareer": newCareer});

						var appendString = "<tr><td>" + number + "</td><td>" + oldCareer  + "</td><td>" + newCareer + "</td></tr>";
						$("#outputTableBody").append(appendString);
					});
				}else{
					$.each(outputArray, function(i,v){
						var appendString = v + "<br />";
						$("#output").append(appendString);
					});
				}

            }
        });
    }

    $("#parseButton").click(function(){

        var url = $("#urlInput").text();
        var startPage = $("#startPage").text()=="" ? "null" : Number($("#startPage").text());
        var endPage = Number($("#endPage").text());
        var findClass = $("#findClass").text();

        //Restore to original state
        if(optionValue === "careerTable"){
            $("#outputTable").show();
            $("#output").replaceWith(originalState.clone());
        }else{
            $("#outputTable").hide();
        }
        number = 0;
        parsedArray= [];

        if(isNaN(startPage)){
            parseUrl(encodeURI(url), findClass);
        }else if(startPage <= endPage){
            for(i = startPage; i < endPage + 1; i++){
                parseUrl(encodeURI(url + i), findClass);
            }
        }
    });

	//Check outputSelection option
	$("#outputSelect").change(function(){
		optionValue = this.value;
		if(optionValue === "careerTable"){
			$("#outputTable").show();
			$("#output").replaceWith(originalState.clone());
		}else{
			$("#outputTable").hide();
		}
	});


    //Set default view formats
    $("#loading").hide();
	//$("#outputTable").hide();
	var originalState = $("#output").clone(); //Copy of the original div
    console.log(originalState);

});

//Show loading gif on ajaxStart
$(document).ajaxStart(function(){
    $("#loading").show();
}).ajaxStop(function(){
    $("#loading").hide();
    //Run functions after ajaxStop
    printArray(parsedArray);
	if(optionValue === "careerTable"){
        $("#outputTable").DataTable({
            "paging":   false,
            "ordering": true,
            "info":     false,
            "searching":   false
        });
	}
});
