var m,mm;
var g = google.maps;
var dd,d;
var zoom = 8;
var center = new g.LatLng(41.914541,-71.592407);
var url = 'http://oa-otp.rhcloud.com/house10.jsonp';
var infowindow = new g.InfoWindow();
$(function() {
  mm = new LCC({
semi_major: 6378137,
inverse_flattening: 298.257222101,
standard_parallel_1: 41 + (43/60),
standard_parallel_2: 42 + (41/60),
central_meridian: -71.5,
latitude_of_origin: 41,
false_easting: 200000.0,
false_northing: 750000.0,
unit: 1
});
m = new g.Map($('#map')[0], {
      center: center,
      zoom: zoom,
      mapTypeId: 'roadmap'
    });
    $.get(url,doStuff,'JSONP');
});

var doStuff = function(data){
    dd=data.features;
    d = new mapArray({
      latlng:mm.inverse,
     
      features:dd
        
        });
        var opt = function(color){
           return{ map:m,strokeWeight:1,fillColor:color,fillOpacity:.7}
            
        };
        var c = function(i,a){
           
            a.p.setOptions(opt('#ff0000'))
           
        }
        d.setO(c);
      
            
         
};
var mapArray= function(opt){
    var params = $.extend( {
       features:  [],
       name: 'array',
       map: null,
        latlng: function(xy){return xy;},
       structure: function(o){return [o.geometry,o.properties]}
    },opt);
    var _this = this;
    _this.name = params.name;
    _this.features=[];
    _this.map=params.map;
    _this.latlng = params.latlng;
    _this.structure=params.structure;
    
    _this.add = function(opt){
          var addp = $.extend( {
       array:  [],
       latlng: _this.latlng,
       structure: _this.structure,
       options: null
    },opt);
   
  
    $.each(addp.array,function(i,t){
        var strut = addp.structure(t);
        var geo = strut[0];
        var attr = strut[1];
        var type = geo.type;
        if(type == "Polygon"){
         var polygon = new _this.poly({
             geometry: geo.coordinates[0],
             attributes: attr,
             latlng: addp.latlng,
             options:addp.options
             });
            _this.features.push(polygon);
            if(_this.map){
             polygon.p.setMap(_this.map);   
            }
        }
        });
    };
  
  _this.poly = function(opt){
    var params = $.extend( {
       geometry:  [],
       name: 'poly',
       attributes: {},
       latlng: function(xy){return xy;},
        options: {}
    },opt);
    var _this = this;
    _this.name = params.name;
    _this.attibutes = params.attributes;
    _this.geometry = [];
    _this.type = 'polygon';
    _this.transform = params.latlng;
 _this.options = params.options;
      
        $.each(params.geometry,function(i,t){
         
            var xy = _this.transform(t);
            var point = new g.LatLng(xy[1],xy[0]);
           _this.geometry.push(point); 
        });
        _this.p = new g.Polygon({paths: _this.geometry});
   if(_this.options){
       _this.p.setOptions(_this.options)
   }
    _this.content = "<div class='infowindow'>Senetor: " + _this.attibutes.REP +"<br/>District: " + _this.attibutes.REP_DIST + "</div>";
    g.event.addListener(_this.p, 'click', infofunc);
    function infofunc(event) {
        
         infowindow.setContent(_this.content);
  infowindow.setPosition(event.latLng);

  infowindow.open(m);
}
};
_this.set = function(cond){
    if(cond){
         $.each(_this.features,function(i,t){
     if(cond(t.attibutes)){
  t.p.setMap(_this.map);   
     }else{
      t.p.setMap(null);   
     }
 });
    }else{
 $.each(_this.features,function(i,t){
  t.p.setMap(_this.map);   
 });
    }
};
_this.setMap = function(map,cond){
 _this.map = map;
 if(cond){
  _this.set(cond);   
 }else{
  _this.set();   
 }
    
};
if(params.features.length>0){
    _this.add({array:params.features});
}

_this.setO = function(cond){

 
 
  $.each(_this.features,cond); 

};
};
function LCC(params){
    /*
    based off http://gmaps-utility-gis.googlecode.com/svn/trunk/v3samples/customprojection.html
    */

                                                /*=========parameters=================*/

                                            	params=params||{};

                                        		this.name=params.name||"LCC";

                                        		var _a = (params.semi_major ||6378137.0 )/(params.unit||0.3048006096012192);

                                        		var _f_i=params.inverse_flattening||298.257222101;//this.

                                        		var _phi1 = (params.standard_parallel_1||34.33333333333334) * (Math.PI / 180);

                                        		var _phi2 = (params.standard_parallel_2||36.16666666666666) * (Math.PI / 180);

                                        		var _phiF = (params.latitude_of_origin||33.75) * (Math.PI / 180);

                                        		var _lamdaF = (params.central_meridian||-79.0)* (Math.PI / 180);

                                        		var _FE = params.false_easting||2000000.002616666;//this.

                                        		var _FN = params.false_northing||0.0;//this.

                                        		/*========== functions to calc values, potentially can move outside as static methods=========*/

                                        		var calc_m = function(phi, es){

                                            		var sinphi = Math.sin(phi);

                                             		return Math.cos(phi) / Math.sqrt(1 - es * sinphi * sinphi);

                                        		};

                                        		var calc_t = function(phi, e){

                                            		var esinphi = e * Math.sin(phi);

                                            		return Math.tan(Math.PI / 4 - phi / 2) / Math.pow((1 - esinphi) / (1 + esinphi), e / 2);

                                        		};

                                        		var calc_r = function(a, F, t, n){

                                            		return a * F * Math.pow(t, n)

                                        		};

                                        		var calc_phi = function(t_i, e, phi){

                                            		var esinphi = e * Math.sin(phi);

                                           			return Math.PI / 2 - 2 * Math.atan(t_i * Math.pow((1 - esinphi) / (1 + esinphi), e / 2));

                                        		};

                                        

                                        		var solve_phi = function(t_i, e, init){

                                            		// iteration

                                           			 var i = 0;

                                            		var phi = init;

                                            		var newphi = calc_phi(t_i, e, phi);//this.

                                            		while (Math.abs(newphi - phi) > 0.000000001 && i < 10) {

                                                			i++;

                                                			phi = newphi;

                                                			newphi = calc_phi(t_i, e, phi);//this.

                                            		}

                                            		return newphi;

                                        		}

                                    

                                    		/*=========shared, not point specific params or intermediate values========*/

                                        		var _f = 1.0 /_f_i;//this.

                                        		/*e: eccentricity of the ellipsoid where e^2 = 2f - f^2 */

                                        		var _es = 2 * _f - _f * _f;

                                        		var _e = Math.sqrt(_es);

                                        		var _m1 = calc_m(_phi1, _es);//this.

                                        		var _m2 = calc_m(_phi2, _es);//this.

                                        		var _tF = calc_t(_phiF, _e);//this.

                                        		var _t1 = calc_t(_phi1, _e);//this.

                                        		var _t2 = calc_t(_phi2, _e);//this.

                                        		var _n = Math.log(_m1 / _m2) / Math.log(_t1 / _t2);

                                        		var _F = _m1 / (_n * Math.pow(_t1, _n));

                                        		var _rF = calc_r(_a, _F, _tF, _n);//this.

                                        

                                           /**

                                            * convert lat lng to coordinates 

                                            * @param {Array<double>} latlng array with 2 double: [lat,lng]

                                            * @return {Array<double>} coords array with 2 double: [x,y]

                                            */

                                        		this.forward = function(lnglat){

                                            		var phi = lnglat[1] * (Math.PI / 180);

                                            		var lamda = lnglat[0] * (Math.PI / 180);

                                            		var t = calc_t(phi, _e);//this.

                                            		var r = calc_r(_a, _F, t, _n);//this.

                                            		var theta = _n * (lamda - _lamdaF);

                                            		var E = _FE + r * Math.sin(theta);

                                            		var N = _FN + _rF - r * Math.cos(theta);

                                            		return [E, N];

                                        		};

                                        	 /**

                                            * convert  coordinates to lat lng 

                                            * @param  {Array<double>} coords array with 2 double: [x,y]

                                            * @return {Array<double>} latlng array with 2 double: [lat,lng]

                                            */

                                          	this.inverse = function(xy){

                                            		var E = xy[0];

                                            		var N = xy[1];

                                            		var theta_i = Math.atan((E - _FE) / (_rF - (N - _FN)));

                                            		var r_i = (_n > 0 ? 1 : -1) * Math.sqrt((E - _FE) * (E - _FE) + (_rF - (N - _FN)) * (_rF - (N - _FN)));

                                            		var t_i = Math.pow((r_i / (_a * _F)), 1 / _n);

                                            		var phi = solve_phi(t_i, _e, 0);//this.

                                            		var lamda = theta_i / _n + _lamdaF;

                                            		return  [lamda * (180 / Math.PI),phi * (180 / Math.PI)];

                                        		};

                                            /**

                                             * circum of earth in projected units. This is used in V2's wrap.

                                             * @return double.

                                             */

                                        		this.circum = function(){

                                            		return Math.PI * 2 * _a;

                                        		};

                                        

                                    	}


                        