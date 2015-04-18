<?php

if(defined('FYSCU_ROOT')){	
	return array(
		'v'=>'0.1.1',
		'cache_path'=>PROJECT_ROOT.'tpl/c/',	//缓存存放的地方
		'seed'=>'hdu%^$hsjr',					//生成key的种子串
		'cache_time'=>60,
	);
}else{
	return array();
}
?>