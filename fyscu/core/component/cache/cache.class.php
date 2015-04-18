<?php

if(defined('FYSCU_ROOT')){
	
class CACHE{
	private static $config = null;
	public static function set($key,$data){
		$cache_key = self::gen_key($key);
		$sig = file_put_contents(self::$config['cache_path'].'cache_'.$cache_key, $data);
		if(!$sig)FYTOOL::error_ctrl('can not write cache');
	}
	
	public static function get($key,$cache_time=false){
		$cache_key = self::gen_key($key);
		$cache_time = $cache_time?$cache_time:self::$config['cache_time'];
		
		if((time()-filemtime(self::$config['cache_path'].'cache_'.$cache_key))>$cache_time){
			//过期
			return false;
		}else{
			return file_get_contents(self::$config['cache_path'].'cache_'.$cache_key);
		}
	}
	
	private static function gen_key($str){
		if(self::$config==null){
			self::$config = CONFIG::get('cache');
		}
		return md5($str.self::$config['seed']);
	}
}
}
?>