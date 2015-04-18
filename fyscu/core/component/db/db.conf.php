<?php

if(defined('FYSCU_ROOT')){	
	return array(
		//此处可以定义多个数据库连接，
		'conn'=>array(
			'db1'=>array(
			'dsn'=>'mysql:host=127.0.0.1;port=3306;dbname=gpa',				//数据源
			'user'=>'root',														//用户名
			'password'=>'',														//密码
			'charset'=>'UTF8',													//编码
			'auto'=>1,															//是否自动连接，建议不要设置太多的auto	
			),
			/**
			 * more db conf
			 */
		),
		'v'=>'3.0.0'
	);
}else{
	return array();
}
?>