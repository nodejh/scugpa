<?php

if(defined('FYSCU_ROOT')){
	
	return array(
		'v'=>'2.0.0',
		'tpl_path'=>PROJECT_ROOT.'tpl/',											//模板文件的根目录路径，一般很少改
		'debug'=>1,																	//设置为1时，总是编译模板，适合开发阶段
		'cache_time'=>120,															//编译缓存时间
		'js_cache'=>0,																//js压缩的开关，0表示不压缩
	);
}else{
	return array();
}
?>