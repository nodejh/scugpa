<?php
/**
 * 
 * MONGO DB 操作类
 * 2014-4-3
 */
if(defined('FYSCU_ROOT')){
	class FY_MONGO{
		private static $config = null;
		private static $instance = null;
	
		private static function init(){		
			if(self::$instance===null){
				self::$config = CONFIG::get('mongo');
				try {
					self::$instance = new Mongo(self::$config['host'].':'.self::$config['port']);
				}catch (Exception $e){
					
				}
			}
			return self::$instance;
		}
		/**
		 * 
		 * 插入
		 * @param $collection string 集合名
		 * @param $data array 数组键值
		 * @param $db string 自定义数据，不使用当前数据库
		 */
		public static function insert($collection,$data,$db=''){
			self::init();
			$db = ($db=='')?self::$config['db']:$db;
			$collection = self::$instance->selectCollection($db,$collection);
			return  $collection->insert($data);
		}
		/**
		 * 
		 * 根据字段值查询
		 * @param string $collection 集合名
		 * @param array $map 过滤条件
		 * @param int $num 数量
		 * @param int $offset 偏移
		 * @param string $db 自定义数据，不使用当前数据库
		 */
		public static function find($collection,$map,$num=1,$offset=0,$db=''){
			
			self::init();
			$db = ($db=='')?self::$config['db']:$db;
			$collection = self::$instance->selectCollection($db,$collection);
			$cursor = $collection->find($map);
			$cursor->snapshot();
			if($num==0){
				
			}else{
				$cursor = $cursor->skip($offset)->limit($num);
			}
			$result= iterator_to_array($cursor);
			return $result;
		}
		/**
		 * 查找全部
		 */
		public static function findAll($collection,$map,$db=''){
			return self::find($collection, $map,0,0,$db);
		}
		/**
		 * 查找一条
		 */
		public static function findOne($collection,$map,$db=''){
			return self::find($collection, $map,1,0,$db);
		}
		
		public static function debug(){
			self::init();
			$map = array();
			FYTOOL::debug(self::findOne('loginfos', $map));
		}	
	}
}
?>