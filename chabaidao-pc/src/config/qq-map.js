let MAP = function(){
	//定义map变量，调用 TMap.Map() 构造函数创建地图
	var map = new TMap.Map('container', {
		zoom: 14,
		center:new TMap.LatLng(40.0402718, 116.2735831)
	});
	var ipLocation = new TMap.service.IPLocation(); // 新建一个IP定位类
	var markers = new TMap.MultiMarker({
	  map: map,
	  geometries: [],
	});
	var search = new TMap.service.Search({ pageSize: 10 }); // 新建一个地点搜索类
	return {map,ipLocation,markers,search}
}

export {MAP}