var cityList = [
    {"province":"北京","city":["北京"]},
    {"province":"天津","city":["天津"]},
    {"province":"河北","city":["石家庄","唐山","秦皇岛","邯郸","邢台","保定","张家口","承德","沧州","廊坊","衡水"]},
    {"province":"山西","city":["太原","大同","阳泉","长治","晋城","朔州","晋中","运城","忻州","临汾","吕梁"]},
    {"province":"内蒙古","city":["呼和浩特","包头","乌海","赤峰","通辽","鄂尔多斯","呼伦贝尔","巴彦淖尔","乌兰察布","兴安盟","锡林郭勒盟","阿拉善盟"]},
    {"province":"辽宁","city":["沈阳","大连","鞍山","抚顺","本溪","丹东","锦州","营口","阜新","辽阳","盘锦","盘锦","朝阳","葫芦岛"]},
    {"province":"吉林","city":["长春","吉林","四平","辽源","通化","白山","松原","白城","延边"]},
    {"province":"黑龙江","city":["哈尔滨","齐齐哈尔","鸡西","鹤岗","双鸭山","大庆","伊春","佳木斯","七台河","牡丹江","黑河","绥化","大兴安岭"]},
    {"province":"上海","city":["上海"]},
    {"province":"江苏","city":["南京","无锡","徐州","常州","苏州","南通","连云港","淮安","盐城","扬州","镇江","泰州","宿迁"]},
    {"province":"浙江","city":["杭州","宁波","温州","嘉兴","湖州","绍兴","金华","衢州","舟山","台州","丽水"]},
    {"province":"安徽","city":["合肥","芜湖","蚌埠","淮南","马鞍山","淮北","铜陵","安庆","黄山","滁州","阜阳","宿州","六安","亳州","池州","宣城"]},
    {"province":"福建","city":["福州","厦门","莆田","三明","泉州","漳州","南平","龙岩","宁德"]},
    {"province":"江西","city":["南昌","景德镇","萍乡","九江","新余","鹰潭","赣州","吉安","宜春","抚州","上饶"]},
    {"province":"山东","city":["济南","青岛","淄博","枣庄","东营","烟台","潍坊","济宁","泰安","威海","日照","莱芜","临沂","德州","聊城","滨州","菏泽"]},
    {"province":"河南","city":["郑州","开封","洛阳","平顶山","安阳","鹤壁","新乡","焦作","济源","濮阳","许昌","漯河","三门峡","南阳","商丘","信阳","周口","驻马店"]},
    {"province":"湖北","city":["武汉","黄石","十堰","宜昌","襄阳","鄂州","荆门","孝感","荆州","黄冈","咸宁","随州","恩施","仙桃","潜江","天门","神农架"]},
    {"province":"湖南","city":["长沙","株洲","湘潭","衡阳","邵阳","岳阳","常德","张家界","益阳","郴州","永州","怀化","娄底","湘西"]},
    {"province":"广东","city":["广州","韶关","深圳","珠海","汕头","佛山","江门","湛江","茂名","肇庆","惠州","梅州","汕尾","河源","阳江","清远","东莞","中山","东沙群岛","潮州","揭阳","云浮"]},
    {"province":"广西","city":["南宁","柳州","桂林","梧州","北海","防城港","钦州","贵港","玉林","百色","贺州","河池","来宾","崇左"]},
    {"province":"海南","city":["海口","三亚","三沙","五指山","琼海","儋州","文昌","万宁","东方","定安","屯昌","澄迈","临高","白沙","昌江","乐东","陵水","保亭","琼中"]},
    {"province":"重庆","city":["重庆"]},
    {"province":"四川","city":["成都","自贡","攀枝花","泸州","德阳","绵阳","广元","遂宁","内江","乐山","南充","眉山","宜宾","广安","达州","雅安","巴中","资阳","阿坝","甘孜","凉山"]},
    {"province":"贵州","city":["贵阳","六盘水","遵义","安顺","铜仁","黔西南","毕节","黔东南","黔南"]},
    {"province":"云南","city":["昆明","曲靖","玉溪","保山","昭通","丽江","普洱","临沧","楚雄","红河","文山","西双版纳","大理","德宏","怒江","迪庆"]},
    {"province":"西藏","city":["拉萨","昌都","山南","日喀则","那曲","阿里","林芝"]},
    {"province":"陕西","city":["西安","铜川","宝鸡","咸阳","渭南","延安","汉中","榆林","安康","商洛"]},
    {"province":"甘肃","city":["兰州","嘉峪关","金昌","白银","天水","武威","张掖","平凉","酒泉","庆阳","定西","陇南","临夏","甘南"]},
    {"province":"青海","city":["西宁","海东","海北","黄南","海南","果洛","玉树","海西"]},
    {"province":"宁夏","city":["银川","石嘴山","吴忠","固原","中卫"]},
    {"province":"新疆","city":["乌鲁木齐","克拉玛依","吐鲁番","哈密","昌吉","博尔塔拉","巴音郭楞","阿克苏","克孜勒苏","喀什","和田","伊犁","塔城","阿勒泰","石河子","阿拉尔","图木舒克","五家渠"]},
    {"province":"台湾","city":["台北","高雄","台南","台中","金门","南投","基隆","新竹","嘉义","新北","宜兰","新竹","桃园","苗栗","彰化","嘉义","云林","屏东","台东","花莲","澎湖","连江"]},
    {"province":"香港","city":["香港岛","新界","离岛","九龙","油尖旺","深水埗","葵青","东区","九龙城","沙田","黄大仙","屯门","观塘","南区","西贡","荃湾","元朗"]},
    {"province":"澳门","city":["澳门","澳门半岛"]},
    {"province":"南海诸岛","city":["南海诸岛","东沙群岛","西沙群岛","中沙群岛","南沙群岛"]}
];
// 地域分布
Array.prototype.indexAs = function (name) {
    for (let i = 0; i < this.length; i++) {
      if (this[i].name == name) {
        return i;
      }
    }
    return -1;
}
export function areaMap(resData) {
  var data = [] ;
  for (let n = 0; n < cityList.length; n++) {
    for (let k = 0; k < cityList[n].city.length; k++) {
      for (let i = 0; i < resData.length; i++) {
        if (resData[i].name == cityList[n].city[k]) {
          let index = data.indexAs(resData[i].name);
          if (index == -1) {
            let temp = {
                name: cityList[n].province,
                value: resData[i].value
            };
            data.push(temp);
          }else{
            data[index].value += resData[i].value;
          }
        }
      }
    }
  }
  return data;
}
 


