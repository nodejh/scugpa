<?php

if(defined('FYSCU_ROOT')){


class controller{
	private $_uri ;
	private $_mod ;
	private $_action ;
	private $_file_path ;
	private $_args = array();
	
	/**
	 * 控制器构造函数
	 * 设置uri属性，并调用路由函数
	 */
	function __construct(){
		$this->_uri = trim($_SERVER['REQUEST_URI'],'/');
		$this->route();
	}
	/**
	 * 设置GET参数，保存到属性 args ，至此，初始化控制器完毕
	 */
	private function set_args($arr){
		$c = count($arr);
		if($c>1){
			for($i=0;$i<$c;$i+=2){
				$this->_args[$arr[$i]] = isset($arr[$i+1])?$arr[$i+1]:null;
			}
		}
		$this->_args['mod'] = $this->_mod;
		$this->_args['action'] = $this->_action;
	}
	/**
	 * 路由函数
	 * 
	 */
	private function route(){
		//加载控制器配置文件
		$ctrl_conf = CONFIG::get('controller');
		//处理uri信息, tmp[1]为路由字符串
		$tmp = explode(defined('__ENTRANCE__')?__ENTRANCE__:$ctrl_conf['split'], '/'.$this->_uri,2);
		
		if($ctrl_conf['CATCH_ALL']){
			//如果定义了全局拦截器，则自动导向到配置的路由。系统维护时使用。
			$tmp[1] = $ctrl_conf['CATCH_ALL']; 
		}
		if(isset($_GET['r'])){
			$tmp[1] = $_GET['r'];
		}
		if(isset($tmp[1])){
			$tmp = explode('/', trim($tmp[1],'/'),3);
		}
		else{
			$tmp = '';
		}
		//设置属性mod和action, 没有指定时定义为配置文件中的默认值。
		$this->_mod = (isset($tmp[0])&&$tmp[0]!='')?$tmp[0]:$ctrl_conf['DEFAULT_MOD'];
		$this->_action = isset($tmp[1])?$tmp[1]:$ctrl_conf['DEFAULT_ACTION'];
		//定义需要调用的action类文件
		$this->_file_path = PROJECT_ROOT.'action/'.$this->_mod.'.class.php';
		//如果存在更多GET参数，则调用set_args函数
		$this->set_args(explode('/',trim(isset($tmp[2])?$tmp[2]:'','/')));
		
	}
	
	public function get_attr($str){
		return $this->$str;
	}
	
	/**
	 * 一切从这里开始~
	 * 
	 */
	public function dispatcher(){
		//先判断是否存在这个类文件
		
		if(is_file($this->_file_path)){
			include $this->_file_path;
			//文件中是否定义了需要调用的CLASS
			if(class_exists($class=$this->_mod)){
				
				//创建实例，并调用CALL函数，CALL函数在action的父类里定义
				$action = new $class($this->_args);
				$action->call('action_'.$this->_action);
			}else{
				$msg = 'MOD CLASS 不存在：'.$this->_action;
				FYTOOL::error_ctrl($msg);
			}
		}else{
			$msg = 'MOD文件不存在：'.$this->_mod;
			FYTOOL::error_ctrl($msg);
		}
	}
}
	
}
?>