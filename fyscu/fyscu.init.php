<?php
//永远定位到 fyscu.init.php的所在目录作为起点目录
define('FYSCU_ROOT', dirname(__FILE__).'/');
define('START_TIME', microtime(1));
//引入全局工具文件
require FYSCU_ROOT . './core/function/common.func.php';



//注册全局变量
$FY_G = array(
	'var'=>array('component'=>array())
);


//引入配置文件定义的功能模块
if (is_array(CONFIG::get('modules'))) {
	include FYSCU_ROOT . './core/lib/action_base.class.php';
	include FYSCU_ROOT . './core/lib/controller.class.php';
	foreach (CONFIG::get('modules') as $k => $v) {
			//根据配置，引入相关的类文件，和相应功能文件
			if($v){
				
				if(in_array($k, $FY_G['var']['component'])){
					//do nothing
				}else{
					if(is_file(FYSCU_ROOT.'./core/component/' . $k . '/' . $k . '.conf.php')){
						CONFIG::add($k, include FYSCU_ROOT.'./core/component/' . $k . '/' . $k . '.conf.php');
					}
					include FYSCU_ROOT . './core/component/' . $k . '/' . $k . '.class.php';
					FYTOOL::FY_set_global('component', $k);	
				}
			}
	}
	
} else {
	FYTOOL::error_ctrl('配置文件[组件配置]出错，请核对。');
}
//FYTOOL::END_TIME('load module');
//FYTOOL::debug($FY_G);
//控制器：URL路由
$controller = new controller();
$controller->dispatcher();


/*
 * 术语：
 * modules   组件
 * controller  控制器
 * mod 控制器处理类
 * action 控制器处理类决定执行的行为
 * 
 */
?>