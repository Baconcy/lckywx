var app = angular
		.module(
				'busNeedForm',
				[ 'ngRoute' ],
				function($httpProvider) {// ngRoute引入路由依赖
					$httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
					$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

					// Override $http service's default transformRequest
					$httpProvider.defaults.transformRequest = [ function(data) {
						/**
						 * The workhorse; converts an object to
						 * x-www-form-urlencoded serialization.
						 * 
						 * @param {Object}
						 *            obj
						 * @return {String}
						 */
						var param = function(obj) {
							var query = '';
							var name, value, fullSubName, subName, subValue, innerObj, i;

							for (name in obj) {
								value = obj[name];

								if (value instanceof Array) {
									for (i = 0; i < value.length; ++i) {
										subValue = value[i];
										fullSubName = name + '[' + i + ']';
										innerObj = {};
										innerObj[fullSubName] = subValue;
										query += param(innerObj) + '&';
									}
								} else if (value instanceof Object) {
									for (subName in value) {
										subValue = value[subName];
										fullSubName = name + '[' + subName
												+ ']';
										innerObj = {};
										innerObj[fullSubName] = subValue;
										query += param(innerObj) + '&';
									}
								} else if (value !== undefined
										&& value !== null) {
									query += encodeURIComponent(name) + '='
											+ encodeURIComponent(value) + '&';
								}
							}

							return query.length ? query.substr(0,
									query.length - 1) : query;
						};

						return angular.isObject(data)
								&& String(data) !== '[object File]' ? param(data)
								: data;
					} ];
				});
app.run([ '$rootScope', '$location', function($rootScope, $location) {
	$rootScope.$on('$routeChangeSuccess', function(evt, next, previous) {
		console.log('路由跳转成功');
		$rootScope.$broadcast('reGetData');
	});
} ]);

// 路由配置
app.config([ '$routeProvider', function($routeProvider) {
	$routeProvider.when('/busNeedIndex', {
		templateUrl : '/lckywx/jsp/busNeed/busNeed.html',
		controller : 'PlatformController'
	}).when('/busNeedInfo/:busneed', {
		templateUrl : '/lckywx/jsp/busNeed/busNeedInfo.html',
		controller : 'BusNeedInfoController'
	}).when('/busNeedList', {
		templateUrl : '/lckywx/jsp/busNeed/busNeedList.html',
		controller : 'PlatformController'
	})
} ]);

app.constant('baseUrl', '/lckywx/');
app.factory('services', [ '$http', 'baseUrl', function($http, baseUrl) {
	var services = {};
	// zq获取做房用时列表A
	services.addBusNeed = function(data) {
		return $http({
			method : 'post',
			url : baseUrl + 'busNeed/addBusNeed.do',
			data : data
		});
	};
	// zq查询班车定制需求
	services.selectBusNeeds = function(data) {
		return $http({
			method : 'post',
			url : baseUrl + 'busNeed/selectBusNeed.do',
			data : data
		});
	};

	return services;
} ]);
app.controller('PlatformController', [
		'$scope',
		'services',
		'$location',
		function($scope, services, $location) {
			var busNeed = $scope;
			busNeed.BusLimit = {
				bune_tel : "",
				bune_num : "",
				bune_time : "",
				bune_gath_time : "",
				bune_gath_pla : "",
				bune_goal_pla : "",
				bune_purp : "",
				bune_remark : ""
			}
			// zq添加包车需求
			busNeed.addBusNeed = function() {
				var busLimit = JSON.stringify(busNeed.BusLimit);
				services.addBusNeed({
					busNeed : busLimit
				}).success(
						function(data) {

							$location.path("busNeedInfo/"
									+ JSON.stringify(data.result));
							if (data.result) {
								alert("是");
								/*
								 * console.log("zq"+JSON
								 * .stringify(data.result));
								 */
							} else {
								alert("否");
							}
						});
			}
			// zq查询班车需求列表
			busNeed.selectBusNeeds = function() {
				
				services.selectBusNeeds({
					startDate : busNeed.startDate,
					endDate : busNeed.endDate
				}).success(function(data) {
					busNeed.busNeedList = data.list;
				});
			}
			// zq初始化
			function initData() {
				console.log("初始化页面信息");
				if ($location.path().indexOf('/busNeedIndex') == 0) {

				} else if ($location.path().indexOf('/busNeedList') == 0) {
					alert("jinlaile");
					var startDate = "2017-01-12";
					var endDate = "2017-08-12";
					services.selectBusNeeds({
						startDate : startDate,
						endDate : endDate
					}).success(function(data) {
						busNeed.busNeedList = data.list;
					});
				}
			}
			initData();
		} ]);
app.controller('BusNeedInfoController', [ '$scope', 'services', '$location',
		'$routeParams', function($scope, services, $location, $routeParams) {

			$scope.BNeed = JSON.parse($routeParams.busneed);

		} ]);

// 时间的格式化的判断
app.filter('dateType', function() {
	return function(input) {
		console.log(input);
		var type = "";
		if (input) {
			type = new Date(input).toLocaleDateString().replace(/\//g, '-');
		}

		return type;
	}
});
// 时间的格式化的判断
app.filter('isOrNotNull', function() {
	return function(input) {
		var type = "";
		if (input) {
			type = input;
		} else {
			type = "无";
		}

		return type;
	}
});