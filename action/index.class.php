<?php

if(!defined('FYSCU_ROOT')){
	exit('非法访问');
}

class index extends action_base{

	public function action_index(){
		$title = '输入学号和密码';
		//$tips = '不仅算绩点，还可查成绩';
		$data['number'] = 0;//加载首页
		if($_POST['button'] == 1){
			$title = '成绩信息';
			//$tips = 'Hello, <span class="cu-error">'.$_POST['zjh'].'</span> ,你的成绩信息如下:';
			$data = $this->curl_login($_POST['zjh'], $_POST['mm']);
			$data['zjh'] = $_POST['zjh'];
			$data['mm'] = $_POST['mm'];
			//var_dump($data);
			//die();
			if($data['number'] == 1000){
				$user = FYDB::find_clumn('gpa_user', array('id','account'), array('where'=>'account='.$_POST['zjh']));
				if($user){
					$details = FYDB::insert('gpa_details', array('uid'=>$user['id'], 'time'=>time(),'info'=>$_SERVER['HTTP_USER_AGENT']));
					if($details){
						$database['number'] = 101;//写入数据库 gpa_details成功
					}else{
						$database['number'] = 1004;//写入数据gpa_detalis库失败
					}
				}else{
					$user = FYDB::insert('gpa_user', array('account'=>$_POST['zjh'],'password'=>$_POST['mm']));
					if($user){
						$database['number'] = 100;//写入数据库 gpa_user成功
						$details = FYDB::insert('gpa_details', array('uid'=>$user, 'time'=>time(),'info'=>$_SERVER['HTTP_USER_AGENT']));
						if($details){
							$database['number'] = 101;//写入数据库 gpa_details成功
						}else{
							$database['number'] = 1004;//写入数据gpa_detalis库失败
						}
					}else{
						$database['number'] = 1003;//写入数据库gpa_user失败
					}
				}
			}else{
				$details = FYDB::insert('gpa_details', array('uid'=>0, 'time'=>time(),'info'=>$_SERVER['HTTP_USER_AGENT']));
				if($details){
					$database['number'] = 101;//写入数据库 gpa_details成功;如果失败，通知管理员。通知功能后期添加
				}else{
					$database['number'] = 1004;//写入数据gpa_detalis库失败
				}
			}
		}

		$this->render('index',array('title' =>$title, 'tips'=>$tips, 'data'=>$data));
	}

	// public function action_grade(){
	// 	$data = $this->curl_login($_POST['zjh'], $_POST['mm']);
	// 	if($data['number'] == 1000){
	// 		$user = FYDB::find_clumn('gpa_user', array('id','account'), array('where'=>'account='.$_POST['zjh']));
	// 		if($user){
	// 			$details = FYDB::insert('gpa_details', array('uid'=>$user['id'], 'time'=>time(),'info'=>$_SERVER['HTTP_USER_AGENT']));
	// 			if($details){
	// 				$database['number'] = 101;//写入数据库 gpa_details成功
	// 			}else{
	// 				$database['number'] = 1004;//写入数据gpa_detalis库失败
	// 			}
	// 		}else{
	// 			$user = FYDB::insert('gpa_user', array('account'=>$_POST['zjh'],'password'=>$_POST['mm']));
	// 			if($user){
	// 				$database['number'] = 100;//写入数据库 gpa_user成功
	// 				$details = FYDB::insert('gpa_details', array('uid'=>$user, 'time'=>time(),'info'=>$_SERVER['HTTP_USER_AGENT']));
	// 				if($details){
	// 					$database['number'] = 101;//写入数据库 gpa_details成功
	// 				}else{
	// 					$database['number'] = 1004;//写入数据gpa_detalis库失败
	// 				}
	// 			}else{
	// 				$database['number'] = 1003;//写入数据库gpa_user失败
	// 			}
	// 		}
	// 	}else{
	// 		$details = FYDB::insert('gpa_details', array('uid'=>0, 'time'=>time(),'info'=>$_SERVER['HTTP_USER_AGENT']));
	// 		if($details){
	// 			$database['number'] = 101;//写入数据库 gpa_details成功
	// 		}else{
	// 			$database['number'] = 1004;//写入数据gpa_detalis库失败
	// 		}
	// 	}
	// 	//$data = $this->curl_login('2012141442029','013991');
	// 	//$data = $this->curl_login('2013141223047','273915');
	// 	$this->render('grade',array('data'=>$data,'title'=>'成绩'));
	// }
	
	public function beforeAction(){
		
	}

	protected function curl_get($url, $cookie_jar, $postfields ,$type){
		$useragent = "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.1.4322; .NET CLR 2.0.50727)";
		$curl = curl_init();
		curl_setopt($curl, CURLOPT_URL, $url);
		curl_setopt($curl, CURLOPT_HEADER, 1);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($curl, CURLOPT_POST, 1);
		curl_setopt($curl, CURLOPT_POSTFIELDS, $postfields);
		curl_setopt($curl, CURLOPT_USERAGENT, $useragent);
		if($type == "setcookie"){
			curl_setopt($curl, CURLOPT_COOKIEJAR, $cookie_jar);
		}elseif ($type == "readcookie") {
			curl_setopt($curl, CURLOPT_COOKIEFILE, $cookie_jar);
			$unlink = unlink($cookie_jar);//读取之后就删除该文件
			if(!$unlink){
				return 'Something Wrong';
			}
		}else{
			return ("Something wrong...");
		}
		$data['html'] = curl_exec($curl);
		$data['http'] = curl_getinfo($curl, CURLINFO_HTTP_CODE);
		//var_dump($data['http']);
		//die();
		curl_close($curl);
		return $data;
	}

	protected function curl_login($zjh, $mm){

		//$url = 'http://202.115.47.141/login.jsp';
		$url = 'http://202.115.47.141/loginAction.do';
		$cookie_jar = tempnam(PROJECT_ROOT.'tpl/c/cookie/','gpa');
		$postfields['zjh'] = $zjh;
		$postfields['mm'] = $mm;

		$login = $this->curl_get($url, $cookie_jar, $postfields , "setcookie");
		
		$data['number'] = $login['http'];
		//echo $data['number'];die();
		if($data['number'] != 200 ){
			$data['number'] = 5000;//教务处出错
			return $data;
		}

		$error_zjh = '你输入的证件号不存在，请您重新输入！';
		$error_mm = '您的密码不正确';

		$match_zjh = preg_match_all("/".$error_zjh."/", iconv('GBK','UTF-8',$login['html']));
		$match_mm = preg_match_all("/".$error_mm."/", iconv('GBK','UTF-8',$login['html']));

		$data['number'] = 1000;
		//echo $match_zjh;
		//exit();
		//var_dump($login['html']);

		if($match_zjh){
			$data['message'] = $error_zjh;
			$data['number'] = 1001;

		}else if($match_mm){
			$data['message'] = $error_mm;
			$data['number'] = 1002;

		}else{

			$gradeLnAllAction = 'http://202.115.47.141/gradeLnAllAction.do';
			//指导性计划的所有成绩
			$lnFajhKcCjInfo['type'] = "ln";
			$lnFajhKcCjInfo['oper'] = "lnFajhKcCjInfo";
			$re[0] = $this->curl_get($gradeLnAllAction, $cookie_jar, $lnFajhKcCjInfo , "readcookie");
			// var_dump($re[0]['http']);
			// die();
			if($re[0]['http'] != 200){
				$data['number'] = 5000;
				return $data;
			}
			$data['lnFajhKcCjInfo'] = $re[0]['html'];

			$qbinfo['type'] = "ln";
			$qbinfo['oper'] = "qbinfo";
			$re[1] = $this->curl_get($gradeLnAllAction, $cookie_jar, $qbinfo , "readcookie");
			if($re[1]['http'] != 200){
				$data['number'] = 5000;
				return $data;
			}
			$data['qbinfo'] = $re[1]['html']; 

			$bjg['type'] = "ln";
			$bjg['oper'] = "bjg";
			$re[2] = $this->curl_get($gradeLnAllAction, $cookie_jar, $bjg , "readcookie");
			if($re[2]['http'] != 200){
				$data['number'] = 5000;
				return $data['number'];
			}
			$data['bjg'] = $re[2]['html'];

		}
		//教务处是gbk的编码
		$data['lnFajhKcCjInfo'] = iconv('GBK', 'UTF-8' ,$data['lnFajhKcCjInfo']);
		$data['qbinfo'] = iconv('GBK', 'UTF-8' ,$data['qbinfo']);
		$data['bjg'] = iconv('GBK', 'UTF-8' ,$data['bjg']);
		return $data;
	}

	
}
?>