 <!DOCTYPE html>
<html>
	<head>
		<title><?php if(isset($title))echo $title; ?></title>
		<meta http-equiv="content-type"content="text/html; charset=UTF-8"/>
		<base href="/gpa2.0/" />
		<link href="tpl/css/amazeui.min.css" rel="stylesheet" type="text/css" />
		<link href="tpl/css/style.css" rel="stylesheet" type="text/css" />
	</head>
	<body>
<header class="cu-center cu-header">
	<h1 class="cu-h1">SCU GPA</h1>
	<span class="cu-span" id="tips">不仅算绩点，还可查成绩</span>	
</header>
<!--登陆页面-->
<section id="index">
<div class="am-g">
  <div class="am-u-sm-10 am-u-md-6 am-u-lg-4 am-u-sm-centered">
    <form class="am-form" method="post" action="" >
      <fieldset class="am-form-set">
<!--       <input type="hidden" name="hash" value="<?php if(isset($hash))echo $hash; ?>" /> -->
      	<div class="am-form-group" id="div-zjh">
      		<label for="zjh" id="label-zjh">学号</label>
        	<input type="text" id="zjh" name="zjh" placeholder="教务处学号" class="am-form-field" required />
        </div>
        <div class="am-form-group" id="div-mm">	
        	<label for="mm" id="label-mm">密码</label>
        	<input type="password" id="mm" name="mm" placeholder="教务处密码" class="am-form-field" required />
        </div>	
      </fieldset>
      <button type="submit" class="am-btn am-btn-primary am-btn-block" id="button" name="button" value="1">
     		<i class="am-icon-hand-o-right" id="button-icon"></i> 一键查询
			
      </button>
    </form>
  </div>
</div>
</section>
<!--成绩信息页面-->
<section id="gpa">
	<div  class="am-g">
		<!--成绩信息-->
		<div id="grade" class="am-u-sm-10 am-u-md-8 am-u-lg-6 am-u-sm-centered">
			
		</div>
		<!--尚不及格信息-->
		<div id="failling"  class="am-u-sm-10 am-u-md-8 am-u-lg-6 am-u-sm-centered">
		
		</div>
		<!--曾不及格信息-->
		<div id="failled"  class="am-u-sm-10 am-u-md-8 am-u-lg-6 am-u-sm-centered">
		
		</div>
	</div>	
</section>

<footer class="cu-center cu-footer">
	<a href="http://fyscu.com" target="_blank">@飞扬俱乐部</a>·「<a href="http://lab.fyscu.com" target="_blank">研发实验室</a>」出品 &nbsp;&nbsp;|&nbsp;&nbsp; <a href="http://jianghang.name/index.php/archives/19/" target="_blank">计算规则·反馈</a>
</footer>
</body>

<script type="text/javascript" src="tpl/js/jquery.js"></script>
<script type="text/javascript">
$(document).ready(function(){
	/*************初始化*************/
	//设置全局变量
	var fail;
	var grade;

	var result = <?php echo json_encode($data); ?>;
	//后台的证件号
	var zjh = result.zjh ? result.zjh :'';
	var mm = result.mm ? result.mm :'';
	//console.log(zjh);
	//判断学号密码是否正确
	switch (result.number){
		case 0:
			//alert('欢迎使用');
			//showTips('不仅算绩点，还可查成绩');
			$('#gpa').hide();
			checkInput();
			clickButton();
			break;
		case 1000:
			alert('成功，请稍后');
			$('#index').remove();
			showTips();
			$('#gpa').show();
			caculate();
			//addTableGrade();
			//addTableFail();
			break;
		case 1001:
			//alert('学号错误');
			//showTips('不仅算绩点，还可查成绩');
			checkInput();
			zjhError();
			//window.location.href = 'index.php/index/';
			break;
		case 1002:
			//alert('密码错误');
			//showTips('不仅算绩点，还可查成绩');
			checkInput();
			mmError();
			//window.location.href = 'index.php/index/';
			break;	
		case 5000:
			//alert('教务处出错');
			//showTips('教务处貌似崩了哦，待会再重试吧~');
			$('#index').remove();
			showTips();
			$('#gpa').show();
			checkInput();
			jwcError();
			break;				
		default :
			alert(result.number);
			alert('Something wrong！请联系 QQ571963318');
			break;	
	}
	
	//显示头部tips信息
	function showTips(text){
		$('#tips').html('Hello,<span class="cu-error">' + zjh +'</span>,你的成绩信息如下：' );
	}

	//点击 button
	function clickButton(){
		$('#button').click(function(){
			$('#button-icon').removeClass('am-icon-hand-o-right').addClass('am-icon-spinner am-icon-spin');
		});
	}
	//表单验证
	function checkInput(){
		//验证证件号，即学号
		$('#zjh').focus(function(){
			$('#label-zjh').removeClass('cu-error').text('学号');
			var number = /^\d{9,15}$/;		
			$(this).keyup(function (){
				zjh = $(this).val();				
				var resulet = number.test(zjh); 
				if(resulet) {
					$('#div-zjh').removeClass('am-form-warning').addClass('am-form-success');
				}else{
					$('#div-zjh').removeClass('am-form-success').addClass('am-form-warning');
				}

				toButton();
			});

			$(this).blur(function(){
				var zjh = $(this).val();
				var result = number.test(zjh);
				if(!result){
					zjhError();
				}
			});
		});
		//验证密码
		$('#mm').focus(function() {
			$('#label-mm').removeClass('cu-error').text('密码');
			$(this).keyup(function () {
				mm = $(this).val();
				if(mm.length > 2){
					$('#div-mm').removeClass('am-form-warning').addClass('am-form-success');
				}else{
					$('#div-mm').removeClass('am-form-success').addClass('am-form-warning');
				}

				toButton();
			});
		});
	}

	//显示学号密码
	function showInput(){
		$('#zjh').val(zjh);
		$('#mm').val(mm);
	}
	//学号错误
	function zjhError(){
		$('#label-zjh').text('!学号错误').addClass('cu-error');
		showInput();
	}

	//密码错误
	function mmError(){
		$('#label-mm').text('!密码错误').addClass('cu-error');
		showInput();
	}

	//教务处出错
	function jwcError(){
		$('#tips').text('教务处貌似崩了哦，待会再试吧~').addClass('cu-error');
		showInput();
	}

	//显示和禁止按钮
	function toButton(){
		if($('#div-zjh').hasClass('am-form-warning') || $('#div-mm').hasClass('am-form-warning')){
			$('#button').addClass('am-disabled');
		}else{
			$('#button').removeClass('am-disabled');
		}
	}
    //保留小数点
    function fomatFloat(src){
    	pos = 3;     
    	return Math.round(src*Math.pow(10, pos))/Math.pow(10, pos);     
  	}


    //是否为正整数,返回boolean 
    function isPositiveNum(s){ 
    	var re = /^[0-9]*[1-9][0-9]*$/ ;  
    	return re.test(s)  
	}

	//将分数转化为绩点
	function changeGpa(data){
		var f = parseFloat(data);
		var result;

		if(isNaN(f)){
			if(data == '优秀'){
				result = 4.0; 
			}else if(data == '良好'){
				result = 3.6;
			}else if(data == '中等'){
				result = 2.7;
			}else if((data == '通过') || (data == '及格')){
				result = 1.0;
			}else if((data == '未通过') || (data == '不及格')){
				result = 0;
			}
		}else{
			if(data >= 95 && data <= 100){
				result = 4;
			}else if(data >=90 && data < 95){
				result = 3.8;
			}else if(data >= 85 && data < 90 ){
				result = 3.6;
			}else if(data >=80 && data < 85){
 				result = 3.2;
			}else if(data >= 75 && data < 80){
				result = 2.7;
			}else if(data >= 70 && data < 75){
				result = 2.2;
			}else if(data >= 65 && data <70){
				result = 1.7;
			}else if(data >= 60 && data < 65){
				result = 1;
			}else if(data < 60){
				result = 0;
			}
		}

		return result;
	}

	//将等级转化为分数
	function changeGrade(data){
		var f = parseFloat(data);
		var result;
		if(isNaN(f)){
			if(data == '优秀'){
				result = 95; 
			}else if(data == '良好'){
				result = 85;
			}else if(data == '中等'){
				result = 75;
			}else if((data == '通过') || (data == '及格')){
				result = 60;
			}else if((data == '未通过') || (data == '不及格')){
				result = 0;
			}
		}else{
			result = f;
		}

		return result;
	}


	//分析计算抓取到的网页
	function caculate(){
		/****************分割字符串，得到html对象，并渲染到隐藏标签中 Start************************/	
		//不及格成绩
		var failGradeStart = result.bjg.indexOf('<table');
		var failGradeEnd = result.bjg.indexOf('</body');
		var failGrade = result.bjg.substring(failGradeStart, failGradeEnd);
		//指导性教学计划
		var guideStart = result.lnFajhKcCjInfo.indexOf('<table');
		var guideEnd = result.lnFajhKcCjInfo.indexOf('</body>');
		var guideGrade = result.lnFajhKcCjInfo.substring(guideStart,guideEnd);
		//全部成绩
		var allGradeStart = result.qbinfo.indexOf('<table');
		var allGradeEnd = result.qbinfo.indexOf('</body>');
		var allGrade = result.qbinfo.substring(allGradeStart,allGradeEnd);

		/************不及格成绩 Start**************************************************/
		//var fail = new Array();
		fail = new Array();
		var selectFail = $(failGrade).find("table.titleTop2");

		selectFail.each(function(i){
			fail[i] = i; //fail[0]尚不及格 fail[1]曾不及格
			fail[i] = new Array();
			var selectFailEach = $("tbody tr td table tbody tr", this);
			selectFailEach.each(function(j){
				fail[i][j] = j;//fail[i][j] 第j门未通过课程
				fail[i][j] = new Array();
				var selectFailEachDetails = $("td", this);

				selectFailEachDetails.each(function(k){
					fail[i][j][k] = $.trim($(this).text());//fail[i][j][0]课程号，fail[i][j][1]课序号，fail[i][j][2]课程名，fail[i][j][3]英文课程名，fail[i][j][4]学分，fail[i][j][5]课程属性，fail[i][j][6]成绩，fail[i][j][7]考试时间，fail[i][j][8]未通过原因 
				});
			});
		});
		//console.log(fail);


		/*******************指导性教学计划 Start********************/
		var guide = new Array();
		var selectGuide = $(guideGrade).filter("table#tblHead.title");

		selectGuide.each(function(i){
			var selectGuideHead = $("tbody tr td table tbody tr td b", this);
			var selectGuideTitle = $(this).next().next().find("tbody tr td.pageAlign tbody tr");
			guide[i] = new Array();

			selectGuideTitle.each(function(j){
				guide[i].term = selectGuideHead.text();
				guide[i][j] = new Array();
				var selectGuideTitleContent = $("td", this);

				selectGuideTitleContent.each(function(k){
					guide[i][j][k] = $.trim($(this).text());
				});
			});
		});
		//console.log(guide);


		/****************全部及格成绩 Start*******************/
		//var grade = new Array();
		grade = new Array();
		var selectTerm = $(allGrade).filter("table#tblHead.title");
	
		selectTerm.each(function(i){
			grade[i] = new Array();
			grade[i].term = $(this).find("tbody tr td table tbody tr td b").text();//学期名称
			var selectGradeArea = $(this).next().next();//本学期成绩信息所在的html对象

			selectGradeArea.each(function(j){
		 		var selectGradeClass = $("td.pageAlign table tbody tr", this);//第i学期的所有课程信息
		 		grade[i][j] = new Array();//第i学期第j门课程

		 		selectGradeClass.each(function(k){
		 			var selectGradeClassDetails = $("td", this);
		 			grade[i][j][k] = new Array();
		 				selectGradeClassDetails.each(function(l){
		 					grade[i][j][k][l] = $.trim($(this).text());//分别获取第i学期的第j门课程基本信息，并去掉空格，存为数组
		 			});		 		
		 		});
		 	});

		});

		//console.log(grade);//灵异现象。在使用pop()方法之前和之后console.log()的结果完全一样
		var gradeLength = grade.length;//总学期数
		//console.log(gradeLength);
		for(var i = 0; i < gradeLength; i++){
			var n = grade[i][0].length - 1;//课程总数
			grade[i]['info'] = $.trim(grade[i][0][n]);
			grade[i]['term'] = grade[i]['term'].substr(0, 12);
			grade[i][0].pop();
		}
		//console.log(grade);


		//尚不及格成绩
		var failling = fail[0];
		if(failling != ''){

			for(var i=0; i<failling.length; i++){

				for(var j=0; j<failling.length; j++){

					if((i != j) && failling[j][0] == failling[i][0]){

						if(failling[i][7] < failling[j][7]){
							failling.splice(i, 1);
						}else{
							failling.splice(j, 1);
						}
					}
				}
			}
		}
		//console.log(failling);//failling[i][0] 课程号

		var guideInfo = new Array();
		var guideLength = guide.length;
		var n, x, y, z;
		var termNumber = parseInt((guideLength - 1) / 3);//学期数
		if(!isPositiveNum(termNumber)){
			termNumber = 8;
		}

		for(var i =0; i < termNumber; i++){
			x = parseInt(parseFloat(i * 3) + parseFloat(1));
			y = parseInt(parseFloat(i * 3) + parseFloat(2));
			z = parseInt(parseFloat(i * 3) + parseFloat(3));
			//该学期有必修或选修
			if(guide[y][1]){
				guideInfo[i] = guide[y];

				if(guide[z] != ''){
					delete(guide[z].term);
					guideInfo[i] = guide[z].concat(guideInfo[i]);
				}
				guideInfo[i]['term'] = guide[y].term.substr(0, 12);//2013-2014学年秋(两学期)
			}
		}
		//console.log(guideInfo);//guideInfo[i]第i学期 guideInfo[i][j][0] 第i学期第j门课程的课程号
		//用不及格成绩的课程号和guideInfo的课程号对比。如果一样，则将guideInfo的学期名称和grade的学期名称对比。如果一样，则将failling添加到grade数组
		var guideInfoLength = guideInfo.length;
		for(var i = 0; i < guideInfoLength; i++){

			for(j in guideInfo[i]){

				for(k in failling){

					if(failling[k][0] == guideInfo[i][j][0]){

						for(l in grade){

							if(grade[l].term == guideInfo[i].term){
								var m = grade[l][0].length;
								grade[l][0][m] = failling[k];
								var n = guideInfo[i].length - 1;
								grade[l][0].info = guideInfo[i][n];
							}
						}
					}
				}
			}
			//console.log(grade.length);
		}
		//console.log(grade);


		//计算每学期的绩点
		var finalTremNumber = grade.length;//学期总数
		var iTermNumber = 0;//第i学期的课程数
		var allCredit = new Array();//总学分
		var obligatoryCredit = new Array();//必修总学分
		var allGradeCredit = new Array();//必修成绩 * 课程学分
		var obligatoryGradeCredit = new Array();//选修成绩 * 课程学分
		var allGpaCredit = new Array();//必修绩点 * 课程学分
		var obligatoryGpaCredit = new Array();//选修绩点 * 课程学分
		var allAverage = new Array(); //平均分
		var obligatoryAverage = new Array();//必修平均分
		var allGpa = new Array();//绩点
		var obligatoryGpa = new Array();

		for(var i = 0; i < finalTremNumber; i++){
			iTermNumber = grade[i][0].length;//第i学期课程总数
			//creditTerm = grade[i].term;//学分的学期名字，用来做下标
			//console.log(grade[i].term);
			allCredit[i] = 0;//初始化总学分
			obligatoryCredit[i] = 0;//初始化必修总学分

			allGradeCredit[i] = 0;//初始化 必修成绩 * 课程学分
			obligatoryGradeCredit[i] = 0;//初始化 选修成绩 * 课程学分

			allGpaCredit[i] = 0;//初始化 必修绩点 * 课程学分
			obligatoryGpaCredit[i] = 0;//初始化 选修绩点 * 课程学分

			allAverage[i] = 0;
			obligatoryAverage[i] = 0;
			allGpa[i] = 0;
			obligatoryGpa[i] = 0;

			for(var j = 0; j < iTermNumber; j++){
				//将形教的学分转化为0.25
				var situation = grade[i][0][j][2].substr(0, 5);
				if(situation == "形势与政策"){
					grade[i][0][j][4] = 0.25;
				}
				// grade[i][0][j][4] 学分
				if(grade[i][0][j][5] == '必修'){
					//学分
					allCredit[i] += parseFloat(grade[i][0][j][4]);
					obligatoryCredit[i] += parseFloat(grade[i][0][j][4]);
					//成绩*学分
					allGradeCredit[i] += (changeGrade(grade[i][0][j][6]) * parseFloat(grade[i][0][j][4]));
					obligatoryGradeCredit[i] += (changeGrade(grade[i][0][j][6]) * parseFloat(grade[i][0][j][4]));
					//绩点*学分
					allGpaCredit[i] += (changeGpa(grade[i][0][j][6]) * parseFloat(grade[i][0][j][4]));
					obligatoryGpaCredit[i] += (changeGpa(grade[i][0][j][6]) * parseFloat(grade[i][0][j][4]));

				}else{
					allCredit[i] += changeGrade(grade[i][0][j][4]);
					allGradeCredit[i] += (changeGrade(grade[i][0][j][6]) * parseFloat(grade[i][0][j][4]));
					allGpaCredit[i] += (changeGpa(grade[i][0][j][6]) * parseFloat(grade[i][0][j][4])); parseFloat
				}
			}

			//分母为0
			if(allCredit[i] == 0){
				allAverage[i] = 0;
				allGpa[i] = 0;
			}else{
				allAverage[i] = fomatFloat(allGradeCredit[i] / allCredit[i]); //平均分
				allGpa[i] = fomatFloat(allGpaCredit[i] / allCredit[i]);	//绩点
			}

			if(obligatoryCredit[i] == 0){
				obligatoryAverage[i] = 0;
				obligatoryGpa[i] = 0;
				}else{
				obligatoryAverage[i] = fomatFloat(obligatoryGradeCredit[i] / obligatoryCredit[i]);	//必修平均分
				obligatoryGpa[i] = fomatFloat(obligatoryGpaCredit[i] / obligatoryCredit[i]); //必修绩点
			}
		}
		var finalGradeLength = grade.length;

		for(var i = 0; i < finalGradeLength; i++){
			grade[i]['allAverage'] = allAverage[i];
			grade[i]['obligatoryAverage'] = obligatoryAverage[i];
			grade[i]['allGpa'] = allGpa[i];
			grade[i]['obligatoryGpa'] = obligatoryGpa[i];
			//grade[i]['info'][0] = grade[i]['info'][0].split(' ');
		}
		//console.log(grade);
	}

	//渲染所有学期的成绩
	function addTableGrade(){

		console.log(grade);
		var gradeLength = grade.length - 1;
		//将学期倒叙排列
		for(var i = gradeLength; i >= 0; i--){
			//添加表头
			$('#grade').append('<table class="am-table am-table-bordered am-table-striped am-table-hover"><thead><tr class="am-primary"><th colspan="2">' + grade[i].term + '</th><th>加权平均分</th><th>平均绩点</th></tr><tr class="am-primary"><th colspan="2">不含选修</th><th>' + grade[i].obligatoryAverage +'</th><th>' + grade[i].obligatoryGpa +'</th></tr><tr class="am-primary"><th colspan="2">包含选修</th><th>' + grade[i].allAverage +'</th><th>' + grade[i].allGpa +'</th></tr><tr class="am-success"><th>课程名</th><th>学分</th><th>成绩</th><th>属性</th></tr></thead><tbody id="grade-tbody'+ i +'"></tbody></table>');
			//表内容
			var gradeDetalisLength = grade[i][0].length;

			for(var j = 0; j < gradeDetalisLength; j++){
				$('#grade-tbody' + i).append('<tr><td>' + grade[i][0][j][2] + '</td><td>' + grade[i][0][j][4] + '</td><td>' + grade[i][0][j][6] + '</td><td>' + grade[i][0][j][5] + '</td></tr>');
			}
			$('#grade-tbody'+ i).append('<tr><td colspan="4">' + grade[i].info + '</td></tr>')
		}
	}

	//渲染不及格成绩
	function addTableFail(){
		//尚不及格
		if(fail[0] != ''){
			$('#failling').append('<table class="am-table am-table-bordered am-table-striped am-table-hover"><thead><tr><th colspan="5" class="am-warning">尚不及格</th></tr><tr  class="am-warning"><th>课程名</th><th>学分</th><th>成绩</th><th>属性</th><th>考试时间</th></tr></thead><tbody id="failling-tbody"></tbody></table>');
			var faillingLength = fail[0].length;
			for(var i = 0; i < faillingLength; i++){
				$('#failling-tbody').append('<tr><td>' + fail[0][i][2] + '</td><td>' + fail[0][i][4] + '</td><td>' + fail[0][i][6] + '</td><td>' + fail[0][i][5] + '</td><td>' + fail[0][i][7] + '</td></tr>');
			}
		}
		//曾不及格
		if(fail[1] != ''){
			$('#failled').append('<table class="am-table am-table-bordered am-table-striped am-table-hover"><thead><tr><th colspan="5" class="am-danger">曾不及格</th></tr><tr  class="am-danger"><th>课程名</th><th>学分</th><th>成绩</th><th>属性</th><th>考试时间</th></tr></thead><tbody id="failled-tbody"></tbody></table>');
			var failledLength = fail[1].length;
			for(var i = 0; i < failledLength; i++){
				$('#failled-tbody').append('<tr><td>' + fail[1][i][2] + '</td><td>' + fail[1][i][4] + '</td><td>' + fail[1][i][6] + '</td><td>' + fail[1][i][5] + '</td><td>' + fail[1][i][7] + '</td></tr>');
			}
		}
	}


});	
</script>



<!DOCTYPE html>
<html>
	<head>
		<title><?php if(isset($title))echo $title; ?></title>
		<meta http-equiv="content-type"content="text/html; charset=UTF-8"/>
		<base href="/gpa2.0/" />
		<link href="tpl/css/amazeui.min.css" rel="stylesheet" type="text/css" />
		<link href="tpl/css/style.css" rel="stylesheet" type="text/css" />
	</head>
	<body>
