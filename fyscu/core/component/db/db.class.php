<?php

if(defined('FYSCU_ROOT')){
	

class FYDB  {
	private static $db_conf = array();
    private static $pdo = null;
	private static $conn_pool = array();
	
	/**
	 * 初始化
	 */
	private static function init(){
		if(! self::$pdo instanceof PDO){
			self::$db_conf = CONFIG::get('db');
			foreach(self::$db_conf['conn'] as $k=>$v){
				if($v['auto']==0){
					continue;
				}
				try{
					self::$conn_pool[$k] = new pdo($v['dsn'],$v['user'],$v['password']);
					self::$conn_pool[$k]->query("set names " . $v['charset']);
				}catch(Exception $e){
					continue;
				}
			}
			if(count(self::$conn_pool)>0){
				self::$pdo = current(self::$conn_pool);
			}
		}
	}
	
	/**
	 * 动态添加连接到连接池
	 * @param $sid 唯一编号
	 * @param $dsn 数据源
	 * @param $user 数据库用户名
	 * @param $pw 数据库密码
	 */
	public static function register_conn($sid,$dsn,$user,$pw){
		if(isset(self::$conn_pool[$sid])){
			FYTOOL::error_ctrl($sid.'连接已经被创建，或已有同名连接，请检查sid唯一性。');
		}
		try{
			$pdo = new pdo($dsn,$user,$pw);
			self::$conn_pool[$sid] = $pdo;
		}catch(Exception $e){
			FYTOOL::error_ctrl('PDO connect error:<br>'.var_dump($e));
		}
		
	}
	/**
	 * 热切换当前连接
	 * @param $sid 标记连接的唯一名字，可能是配置文件中定义的key，也可能是手动创建的连接
	 */
	public static function select_conn($sid){
		self::init();
		if(($sid=='')||(!isset(self::$conn_pool[$sid]))){
			FYTOOL::error_ctrl($sid.'未定义，或连接未创建。');
		}else{
			self::$pdo = self::$conn_pool[$sid];
		}
	} 
	/**
	 * 查询一行
	 * @param $table 数据表名
	 * @param $field 需要查找的字段数组
	 * @param $option 附加选项  支持选项： order , limit , group
	 * @return 返回结果集的一条记录
	 */
	public static function find_clumn($table,$fields=array(),$option=array()){
		if(!$table||empty($fields)){
			return null;
		}
		self::init();
		$sql = 'select ';
		if((isset($option['distinct']))&&($option['distinct']==1)){
			$sql .= 'DISTINCT ';
		}
		$sql .= implode($fields, ',').' from '.$table.' where 1 ';
		$data=  array();
		if(isset($option['where'])){
			$where = $option['where'];
			$data = isset($option['data'])?$option['data']:array();
			if($where!=''){
				$sql .= ' and '.$where;
			} 
		}
		if(!empty($option)){
			$sql .= isset($option['group'])?' group by '.$option['group']:'';
			$sql .= isset($option['order'])?' order by '.$option['order']:'';
			$sql .= ' limit 1';
		}
		$result = self::execute($sql,$data);
		return $result[0];
	}
	/**
	 * 查询集合
	 * @param $table 数据表名
	 * @param $field 需要查找的字段数组

	 * @param $option 附加选项  支持选项： order , limit , group
	 * @return 返回结果集
	 */
	public static function find_all($table,$fields=array(),$option=array()){
		if(!$table||empty($fields)){
			return null;
		}
		self::init();
		$sql = 'select ';
		if((isset($option['distinct']))&&($option['distinct']==1)){
			$sql .= 'DISTINCT ';
		}
		$sql .= implode($fields, ',').' from '.$table.' where 1 ';
		$data=  array();
		//where 
		if(isset($option['where'])){
			$where = $option['where'];
			$data = isset($option['data'])?$option['data']:array();
			if($where!=''){
				$sql .= ' and '.$where;
			} 
		}
		
		if(!empty($option)){
			$sql .= isset($option['group'])?' group by '.$option['group']:'';
			$sql .= isset($option['order'])?' order by '.$option['order']:'';
			$sql .= isset($option['limit'])?' limit '.$option['limit']:'';
		}
		
		$result = self::execute($sql,$data);
		return $result;
	}
	
	/**
	 * 查找单个值
	 * @param $table 数据表名
	 * @param $field 需要查找的字段
	 * @param $option 附加选项  支持选项： order , limit , group
	 * @return 返回查询结果的值，成功的话
	 */
	public static function find_value($table,$field,$option=array()){
		if(!$table||empty($field)){
			return null;
		}
		if(is_array($field)){
			$field=array_shift($field);
		}
		self::init();
		$sql = 'select '.$field.' from '.$table.' where 1 ';
		//where 
		if(isset($option['where'])){
			$where = $option['where'];
			$data = isset($option['data'])?$option['data']:array();
			if($where!=''){
				$sql .= ' and '.$where;
			} 
		}
		$sql .= ' limit 1';
		$result = self::execute($sql,$data);
		if(count($result)){
			return $result[0][$field]; 
		}else{
			return null;	
		}
	}
	
	/**
	 * 获取当前PDO实例
	 */
	public static function get_instance(){
		self::init();
		return self::$pdo;
	}
	
	/**
	 * 插入语句
	 * @param $table 数据表名
	 * @param $record 自己组织的键值对，key为字段名，value为字段值
	 * @return 返回最新的自增ID，
	 */
	public static function insert($table,$record){
		if($table==''){
			return null;
		}
		self::init();
		$new_id = false;
		if(!empty($record)){
			$sql = 'insert into '.$table.' set ';
			foreach($record as $k=>$v){
				$v = '\''.$v.'\'';
				$sql .= $k.'='.$v.',';
			}
			$sql = substr($sql,0,strlen($sql)-1);
			self::execute($sql);
			$new_id = self::$pdo->lastInsertId();
		}
		return $new_id;
	} 
	
	/**
	 * 删除记录
	 * @param $table 数据表名
	 * @param $option 选项
	 * @return 返回影响的行数
	 */
	public static function delete($table,$option){
		if($table==''){
			return null;
		}
		self::init();
		$result = false;
		if(isset($option['where'])){ //必须设置选项，防误操作
			$sql = 'delete from '.$table.' where 1 ';
			$where = $option['where'];
			$data = isset($option['data'])?$option['data']:array();
			$sql .= ' and '.$where;
			$result = self::execute($sql,$data);
		}
		return $result;
	}
	
	/**
	 * 更新数据
	 * @param $table 数据表名
	 * @param $record 自己组织的键值对，表示将 key 字段更新为 value的值 
	 * @param $option 选项
	 * @return 返回影响的行数
	 */
	public static function update($table,$record,$option){
		if($table=='')return null;
		self::init();
		$result = false;
		if(!empty($record)){
			$sql = 'update '.$table.' set ';
			foreach($record as $k=>$v){
				if(!is_numeric($v)){
					$v = '\''.$v.'\'';
				}
				$sql .= $k.'='.$v.',';
			}
			$sql = substr($sql,0,strlen($sql)-1);
			$data = array();
			if(isset($option['where'])){
				$where = $option['where'];
				$data = isset($option['data'])?$option['data']:array();
				$sql .= ' where '.$where;
			}
			$result = self::execute($sql,$data);
		}
		return $result;
	}
	
	/**
	 * 原生SQL，慎用
	 */
	public static function raw_select($sql,$data=array()){
		self::init();
		return self::execute($sql, $data);
	}
	public static function raw_exec($sql,$data=array()){
		self::init();
		return self::execute($sql, $data);
	}
	/**
	 * 调试
	 * 
	 */
	public static function debug(){
		self::init();
		var_dump(self::$pdo);
	}
	
	/*************************************************************************************************/
	
	/**
	 * 执行SQL 
	 */
	private static function execute($sql,$data=array()){
		if(isset(self::$db_conf['debug'])&&(self::$db_conf['debug']==1)){
			$msg = 'query: '.$sql.'  ;  data:'.json_encode($data);
			self::debug_output($msg);
		}
		$op = substr($sql,0,6);
		switch ($op) {
			case 'select':
				$statment = self::$pdo -> prepare($sql);
				$statment->setFetchMode(PDO::FETCH_ASSOC);
				$statment->execute($data);	
				$result = $statment->fetchAll();
				if(count($result)){
					return $result;
				}
				else{
					return null;	
				}
				break;
			case 'insert':
				return self::$pdo->exec($sql);
				break;
			case 'delete':
			case 'update':
				$statment = self::$pdo -> prepare($sql);
				$statment->execute($data);
				return $statment->rowCount();
				break;
			default:
				break;
		}
	}
	
	/**
	 * 输出内容
	 */
	 public static function debug_output($msg=''){
	 	$html = '<style>*{padding:0;margin:0;}</style><div style="color:#00f;background:#aaa;border:2px;padding:5px 10%;position:relative;bottom:0px;">';
		$html .=$msg;
		$html .='</div>';
		echo $html;
	}
 }
}
?>