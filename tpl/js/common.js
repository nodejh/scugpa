$(document).ready(function(){

	$("#button").click(function(){

		// var url = 'index.php/index/index/';
		// var post_data = {'do':'first'}; 
		// $.get(url, post_data, function(res){

		// 	$('#container-form').hide();
		// 	var result = res.split('HTTP/1.1');
		// 	//console.log(result);

		// 	//指导性教学计划
		// 	var zdxjxjhStart = result[2].indexOf('<table');
		// 	var zdxjxjhEnd = result[2].indexOf('</body>');
		// 	var zdxjxjh = result[2].substring(zdxjxjhStart,zdxjxjhEnd);
		// 	//全部成绩
		// 	var qbcjStart = result[4].indexOf('<table');
		// 	var qbcjEnd = result[4].indexOf('</body>');
		// 	var qbcj = result[4].substring(qbcjStart,qbcjEnd);
		// 	//不及格成绩
		// 	var bjgStart = result[6].indexOf('<table');
		// 	var bjgEnd = result[6].indexOf('</body>');
		// 	var bjg = result[6].substring(bjgStart,bjgEnd);
		// 	$(zdxjxjh).appendTo('body');
		// 	$(qbcj).appendTo('body');
		// 	$(bjg).appendTo('body');
		
		var zjh = $("#zjh").val();
		var mm = $('#mm').val();
		var post_data = {'zjh':zjh,'mm':mm};

		$.post(url, post_data, function(data){
			console.log(data);
		});
			
		});
	});

});
