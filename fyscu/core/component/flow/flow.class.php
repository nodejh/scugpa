<?php
/**
 * 
 * PHP 流程操作
 * 2014-8-23
 * version:0.1.0
 * 
 * DEMO:
 * 	public function action_test(){
		function t1($name){
			
			return $name.' say: t1 ok,';
		}
		function t2($str){
			return $str.'t2 ok,';
		}
		function t3($str){
			return $str.'t3 ok,';
		}
		$f = new FY_FLOW();
		$sig = $f->next(t1,'lanhao')->next(t2)->next(t3)->result();
		var_dump($sig);
	}
 * 
 */
if(defined('FYSCU_ROOT')){
	class FY_FLOW{
		
		//存放每个切面的输出结果，也作为下个切面的输入数据
		private $_param = null;
		
		//处理成功与否的信号量
		private  $_flag = true;
		
		//流程化关键函数
		public function next($func,$param=null){
			$p = ($param == null)?$this->_param:$param;
			//执行切面逻辑
			if($p==null){
				$ret = $func();
			}
			else{
				$ret = $func($p);
			}
			//如果有需要的话，判断处理结果，
			if(is_bool($ret)){
				$this->_flag = $ret && $this->_flag;
			}
			//存放当前切面的返回值
			$this->_param = $ret;
			//返回当前对象
			return $this;
		}
		
		//如果你需要输出最后一个切面的结果
		public function result(){
			return $this->_param;
		}
		//或者你需要输出全部切面是否都成功
		public function end(){
			return $this->_flag;
		}
	}
}
?>