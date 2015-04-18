<?php
header("Content-type:text/html;charset=utf-8");
error_reporting(0);
//可选的定义，在   URL 路由中需要用到入口文件切分   URI ，不定义时默认用  ‘.php’
define('__ENTRANCE__', basename(__FILE__));
define('PROJECT_ROOT', dirname(__FILE__).'/');
define('PROJECT_NAME', 'gpa2.0');
define('ACTION_PATH',PROJECT_ROOT.'./action/');
//引入全局配置文件
require PROJECT_ROOT . './config/global.conf.php';
//引入框架核心
require PROJECT_ROOT . './fyscu/fyscu.init.php';

?>