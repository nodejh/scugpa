<?php

if(defined('FYSCU_ROOT')){


class FYI18N  {
	//字典文件存放目录
	private static $_dic_path = '';
	
	//当前语言
	private static $_lang = '';
	
	//支持列表
	private static $_support_list = array();
	
	//字典
	private static $_dic = array();
	
	public static function init(){
		$conf = CONFIG::get('i18n');
		self::$_dic_path = $conf['dic_path'];
		self::$_support_list = explode(',', trim($conf['support_list'],','));
		self::$_lang = self::_check_lang();
		
		if(is_file(self::$_dic_path.self::$_lang.'.dic.php')){
			self::$_dic = include self::$_dic_path.self::$_lang.'.dic.php';
		}
		else {
			if(is_dir(self::$_dic_path)){
				//新建字典
				copy(FYSCU_ROOT.'dic/tpl.dic.php', self::$_dic_path.self::$_lang.'.dic.php');
			}else{
				//新建目录
				FYTOOL::r_copy(FYSCU_ROOT.'core/modules/i18n/dic/', self::$_dic_path);
				copy(FYSCU_ROOT.'dic/tpl.dic.php', self::$_dic_path.self::$_lang.'.dic.php');
			}
		}
		
	}
	
	/**
	 * 检测当前语言环境
	 */
	private static function _check_lang(){
		session_start();
		//支持列表
		$langSuportList = self::$_support_list;
		
		//来自页面点击语言选项,最优先
		if(isset($_GET['lang'])&&in_array($_GET['lang'], $langSuportList)){
			$_SESSION['lang'] = $_GET['lang'];
			setcookie('lang',$_GET['lang'],time()+3600*24*7);
			return $_GET['lang'];
		}
		
		//来自浏览器SESSION 保持本次回话语言选项，次优先
		if(isset($_SESSION['lang'])&&in_array($_SESSION['lang'], $langSuportList)){
			return $_SESSION['lang'];
		}
		
		//以上均不成立，但获取到用户浏览器cookie，第三优先
		if(isset($_COOKIE['lang'])&&in_array($_COOKIE['lang'], $langSuportList)){
			$_SESSION['lang'] = $_GET['lang'];
			return $_COOKIE['lang'];
		}
		
		$langs=explode(',',$_SERVER['HTTP_ACCEPT_LANGUAGE']);
		
		foreach ($langs as $v){
			$v = current(explode(';', strtolower($v)));
			$v = (substr($v,0,2)!='zh')?substr($v,0,2):$v;
			if(in_array($v, $langSuportList)){
				$_SESSION['lang'] = $v;
				setcookie('lang',$v,time()+3600*24*7);
				return $v;
			}
		}
	}
	
	/**
	 * 
	 * 词汇登记、转化、输出函数
	 * @param string $str 词汇
	 */
	public static function T($str=''){
		$lang = self::$_lang;
		$key = base64_encode($str);
		if(isset(self::$_dic[$key])){//存在这个键值
			return self::$_dic[$key];
		}else{
			$content = @file_get_contents(self::$_dic_path.$lang.'.dic.php');
			$content = str_replace('\'_KEY_\'=>\'_V_\',', '\''.$key.'\'=>\''.$str.'\',//'.$str.PHP_EOL.'\'_KEY_\'=>\'_V_\',', $content);
			file_put_contents(self::$_dic_path.$lang.'.dic.php', $content);
			self::$_dic = include self::$_dic_path.$lang.'.dic.php';
			return $str;
		}
	}
 }
 FYI18N::init();
	
}


?>