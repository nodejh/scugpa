<?php

if(defined('FYSCU_ROOT')){
	

class action_base{
	protected $_args;
	protected $_data_display = array();
	
	/**
	 * 构造函数，在controller的dispatcher里面创建
	 * @param $arr 数组，url路由以外的附加参数
	 */
	function __construct($arr){
		$this->_args = $arr;
	}
	/**
	 * 调用Action的函数，在dispatcher里面调用，
	 * @param 当前执行的Action名字,决定调用子类（具体action类）的哪个方法
	 * 
	 */
	public function call($fun_name){
		if(method_exists($this, $fun_name)||method_exists($this, '__call')){
			$this->beforeAction();
			$this->$fun_name();
			$this->afterAction();
		}
		else{
			FYTOOL::error_ctrl('Action未定义:'.$fun_name);
		}
	}
	/**
	 * 编译处理并引入模板中间件文件
	 * @param 传入具体的模板文件，相对路径在    tpl/ 目录
	 */
	private function template($file=''){
		!empty($this->_data_display)&&extract($this->_data_display);
		include FYTPL::template($file);
	} 
	/**
	 * 声明要传递的数据
	 * @param $key=>$value数组，在模板文件里可以直接引用  $key 来读取数据内容
	 */
	private function assign($data){
		foreach($data as $k=>$v){
			$this->_data_display[$k] = $v ;
		}
	}
	/**
	 * 渲染方法，通过参数$file,$data来进行数据声明和模板编译
	 * @param $file 模板文件名相对路径在    tpl/ 目录
	 * @param $data 需要在模板里使用的数据数组，$key=>$value数组，在模板文件里可以直接引用  $key 来读取数据内容
	 */
	public function render($file='index',$data=array(),$return=false){
		$this->assign($data);
		if($return){
			ob_start();
			$this->template($file);		
			$ct = ob_get_contents();
			ob_end_clean();
			return $ct;
		}else{
			$this->template($file);		
		}

	}	
	/**
	 * 在具体action方法执行之前做的操作
	 */
	protected function beforeAction(){
		//
	}
	/**
	 * 在具体action方法执行之后做的操作
	 */
	protected function afterAction(){
		//
	}
	
	public function get_route(){
		return $this->_args['mod'].'/'.$this->_args['action'];
	}
}
}
?>