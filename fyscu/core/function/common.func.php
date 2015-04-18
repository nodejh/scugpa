<?php

if(defined('FYSCU_ROOT')){


class FYTOOL {
	/**
	 * 返回框架版本
	 */
	public static function fyscu_info(){
		print_r(__VERSION__);
	}	
	/**
	 * 
	 */
	public static function END_TIME($tips=''){
		echo '<!-- ',$tips,':',microtime(1)-START_TIME,'-->';
	}
	/**
	 * 获取表单的值
	 */
	public static function get_gp_value($key,$method='request'){
		switch (strtolower($method)) {
			case 'post':
				$value = isset($_POST[$key])?$_POST[$key]:'';
				break;
			case 'get':
				$value = isset($_GET[$key])?$_GET[$key]:'';
				break;
			
			default:
				$value = isset($_REQUEST[$key])?$_REQUEST[$key]:'';
				break;
				break;
		}
		return $value;
	}
	 
	/**
	 * 数据调试
	 */ 
	public static function debug($arr){
		if(is_object($arr)){
			var_dump($arr);
		}else{
			echo '<pre>';
			print_r($arr);	
		}
		
		die();
	}
	
	/**
	 * 字符串截取   兼容
	 */
	public static function cb_substr($string, $length, $dot = ' ...',$charset='utf-8') {
		if(strlen($string) <= $length){
			return $string;
		}
		$pre = chr(1);
		$end = chr(1);
		$string = str_replace(array('&amp;', '&quot;', '&lt;', '&gt;'), array($pre.'&'.$end, $pre.'"'.$end, $pre.'<'.$end, $pre.'>'.$end), $string);
		$strcut = '';
		if($charset == 'utf-8') {
			$n = $tn = $noc = 0;
			while($n < strlen($string)) {
				$t = ord($string[$n]);
				if($t == 9 || $t == 10 || (32 <= $t && $t <= 126)) {
					$tn = 1; 
					$n++; 
					$noc++;
				} elseif(194 <= $t && $t <= 223) {
					$tn = 2; 
					$n += 2; 
					$noc += 2;
				} elseif(224 <= $t && $t <= 239) {
					$tn = 3; 
					$n += 3; 
					$noc += 2;
				} elseif(240 <= $t && $t <= 247) {
					$tn = 4; 
					$n += 4; 
					$noc += 2;
				} elseif(248 <= $t && $t <= 251) {
					$tn = 5; 
					$n += 5; 
					$noc += 2;
				} elseif($t == 252 || $t == 253) {
					$tn = 6; 
					$n += 6; 
					$noc += 2;
				} else {
					$n++;
				}
				if($noc >= $length) {
					break;
				}
			}
			if($noc > $length) {
				$n -= $tn;
			}
			$strcut = substr($string, 0, $n);
		} else {
			for($i = 0; $i < $length; $i++) {
				$strcut .= ord($string[$i]) > 127 ? $string[$i].$string[++$i] : $string[$i];
			}
		}
		$strcut = str_replace(array($pre.'&'.$end, $pre.'"'.$end, $pre.'<'.$end, $pre.'>'.$end), array('&amp;', '&quot;', '&lt;', '&gt;'), $strcut);
		$pos = strrpos($strcut, chr(1));
		if($pos !== false) {
			$strcut = substr($strcut,0,$pos);
		}
		return $strcut.$dot;
	}

	/**
	 * 输出错误信息
	 */
	public static function error_ctrl($msg){
		echo '<meta http-equiv="content-type"content="text/html; charset=UTF-8"/>';
		echo '<div style="width:200px;height:100px;border:2px solid #aaa;background-color:#eee;margin:50px auto;padding:50px;">'.$msg.'</div>';
		self::debug('');
	}
	/**
	 * 注册全局变量
	 */
	public static function FY_set_global($key,$value){
		global $FY_G;
		$FY_G['var'][$key][] = $value;
				
	}
	
	/**
	 * 递归复制文件
	 */
	public static function r_copy($src,$dst) {  // 原目录，复制到的目录

	    $dir = opendir($src);
	    @mkdir($dst);
	    while(false !== ( $file = readdir($dir)) ) {
	        if (( $file != '.' ) && ( $file != '..' )) {
	            if ( is_dir($src . '/' . $file) ) {
	                self::r_copy($src . '/' . $file,$dst . '/' . $file);
	            }
	            else {
	                copy($src . '/' . $file,$dst . '/' . $file);
	            }
	        }
	    }
	    closedir($dir);
	}
	

	/**
	 * ip2long 处理数值过大的问题
	 */
	public static function FY_ip2long($ip){
		return bindec( decbin( ip2long( $ip ) ) );
	}	
}
}
?>