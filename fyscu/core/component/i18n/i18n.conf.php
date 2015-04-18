<?php

if(defined('FYSCU_ROOT')){

	return array(
		'v'=>'1.0.0',
		'dic_path'=>PROJECT_ROOT.'dic/',											//字典存放目录，
		'support_list'=>'zh-cn,en,',												//支持列表，采用标准语言标识，逗号分隔
	);
}else{
	return array();
}


?>