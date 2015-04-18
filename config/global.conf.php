<?php
/*
 * 配置文件
 * */
class CONFIG{
	private static $config = array(
		'system'=>array(
			'VERSION'=>'2.7.1',
			'charset'=>'utf-8',
			'date'=>'2014-10-10',
		),
		//组件开关
		'modules'=>array(
			'db'=>1,																	//数据库	
			'fytpl'=>1,																	//模板引擎
			'i18n'=>0,																	//国际化
			'mongo'=>0,																	//芒果DB
			'flow'=>0,
			'cache'=>0,
		),
		//controller属于核心组件，请不要删除原配置，
		'controller'=>array(
			'split' => '.php',															//pathinfo 的起始位置标识，根据实际情况修改
			'DEFAULT_MOD'=>'index', 													//默认的模块
			'DEFAULT_ACTION'=>'index', 													//默认的action
			'CATCH_ALL'=>false, 														//拦截器，所有访问会引导到这个路由
		),

		
		
	
		
	);
	
	
	public static function get($key='all'){
		if($key=='all'){
			return self::$config;
		}else{
			return self::$config[$key];
		}
	}
	
	public static function add($key,$value=array()){
		if(!isset(self::$config[$key])){
			self::$config[$key] = $value;
		}
	}
}

function CONFIG($key=''){
	return CONFIG::get($key);
}






?>