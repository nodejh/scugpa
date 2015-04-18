<?php

if(defined('FYSCU_ROOT')){
	


class FYTPL{
	private static $output='';
	private static $config = array();
	//初始化
	public function init(){
		//global $config;
	}
	
	
	//模板入口函数，
	public function template($filename,$path='',$static=0){
		if(empty(self::$config)){
			self::$config = CONFIG::get('fytpl');
		}
		$path = $path?$path:self::$config['tpl_path'];
		if($static){
			return rtrim($path,'/').'/'.$filename.'.htm'; 
		}
		$tpl = rtrim($path,'/').'/'.$filename.'.htm';
		
		if(((time()-filemtime(self::$config['tpl_path'].'c/'.md5($tpl).'.php'))>self::$config['cache_time'])||self::$config['debug']==1){
			if(is_file($tpl)){
				$content = file_get_contents($tpl);	
				$content = ' '.$content;
				$content = self::subtemplate($content);
				$content = self::branchparse($content);
				$content = self::loopparse($content);
				//JS压缩
				if(self::$config['js_cache']){
					$content = self::js_compress($content,1);
				}
				else{
					$content = self::js_compress($content,0);
				}
				$content = self::template_psrae($content);
				self::$output = $content;
			}else{
				die('FILE NOT EXIST:'.$tpl);	
			}
			return self::display($tpl);
		}else{
			return self::display($tpl,1);
		}
	}
	
	//显示内容，当然会检测缓存时间神马的
	private function display($tpl,$cache=0){
		if(empty(self::$config)){
			self::$config = CONFIG::get('fytpl');
		}
		if($cache==1){
			//使用缓存
			$filename = self::$config['tpl_path'].'c/'.md5($tpl).'.php';
		}else{
			//更新缓存
			$name = self::$config['tpl_path'].'c/'.md5($tpl).'.php';
			if(self::$config['debug']==1){
				$name=self::$config['tpl_path'].'c/'.'debug_file.php';
			}
			//die($name);
			
			$sig = file_put_contents($name, self::$output);
				
			if(!$sig){
				echo '<meta http-equiv="content-type"content="text/html; charset=UTF-8"/>';
				FYTOOL::debug('对不起,目录 '.self::$config['tpl_path'].'c/ 不可写入，请检查文件权限。');
			}
			
			$filename = $name;
		}
		return $filename;
	}
		
	//处理subtemplate标签，
	private function subtemplate($content){
		$i=0;
		while(strpos($content, '{subtemplate ',$i)) {
			$i = strpos($content, '{subtemplate ',$i);
			$len = strpos($content, '}',$i)-$i-13;
			$subflie = substr($content, $i+13,strpos($content, '}',$i)-$i-13);
			$subcontent=file_get_contents(self::$config['tpl_path'].$subflie.'.htm');
			$content = str_replace('{subtemplate '.$subflie.'}', $subcontent, $content);
		}
		return $content;
	}
	
	//分支结构
	private function branchparse($content){
		$flagArr = array('==','!=','>=','<=','>','<');	
		$i=0;
		while(strpos($content,'{if ',$i)) {
			$i=strpos($content,'{if ',$i);
			$condition = substr($content,$i+4,strpos($content,'}',$i+4)-$i-4);
			$content = str_replace('{if '.$condition.'}', '<?php if('.$condition.'){ ?>', $content);
		}
		$i=0;
		while(strpos($content,'{else}',$i)) {
			$content = str_replace('{else}', '<?php }else{ ?>', $content);
		}
		$i=0;
		while(strpos($content,'{/if}',$i)) {
			$content = str_replace('{/if}', '<?php } ?>', $content);
		}
		$i=0;
		while(strpos($content,'{elseif ',$i)) {
			$i=strpos($content,'{elseif ',$i);
			$condition = substr($content,$i+8,strpos($content,'}',$i+8)-$i-8);
			$content = str_replace('{elseif '.$condition.'}', '<?php }elseif('.$condition.'){ ?>', $content);
		}
		return $content;
	}

	//循环结构
	private function loopparse($content){
		$i=0;
		while ($i=strpos($content,'{loop ',$i)) {
			$condition = substr($content,$i+6,strpos($content,'}',$i+6)-$i-6);
			$options = explode(' ',$condition);
			$content = str_replace('{loop '.$condition.'}', '<?php if(isset('.$options[0].')&&is_array('.$options[0].'))foreach('.$options[0].' as '.$options[1].'=>'.$options[2].'){ ?>', $content);
			$content = str_replace('{/loop}', '<?php } ?>', $content);
		}
		return $content;	
	}
	//变量替换
	private function template_psrae($content){
		$i=0;
		while($i=strpos($content,'{$',$i)) {
			$var_name = substr($content,$i+1,strpos($content, '}',$i+1)-$i-1);
			$content=str_replace('{'.$var_name.'}', '<?php if(isset('.$var_name.'))echo '.$var_name.'; ?>', $content);
		}
		return $content;
	}
	//JS压缩
	private function js_compress($content,$sig=1){
		if(!$sig){
			return $content;
		}
		if(empty(self::$config)){
			self::$config = CONFIG::get('fytpl');
		}
		
		$i = strpos($content,'{js}',0);
		$j = strpos($content,'{/js}',$i+4);
		$tmp = substr($content,$i+4,$j-$i-4);
		$arr = explode(';',trim($tmp));
		$ct = '';
		if(!$i){
			return $content;
		}
		foreach($arr as $k=>$v){
			$v = trim($v);
			if($sig){
				$ct .= file_get_contents(FYSCU_ROOT.self::$config['tpl_path'].$v).' ';
			}
			else {
				$ct .= '<script type="text/javascript" src="/fyscu'.self::$config['tpl_path'].$v.'"></script>';
			}
		}
		if($sig){
			$file = self::$config['tpl_path'].'c/js_'.uniqid().'.js';
			$name = FYSCU_ROOT.$file;
			$path = '/fyscu'.$file;
			file_put_contents($name, $ct);
			$content = str_replace('{js}'.$tmp.'{/js}','<script type="text/javascript" src="'.$path.'"></script>', $content);
		}else{
			$content = str_replace('{js}'.$tmp.'{/js}',$ct, $content);
		}
		return $content;
	}
	
}



}
?>