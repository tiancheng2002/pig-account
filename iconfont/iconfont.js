Component({
  properties: {
    // zhangben3x | fenxiang | renqing | huankuan | qicheyongpin | yule2 | jiekuandan-copy | jiekuandan | banbenhao | lingshi | fangzi-active | gupiao_ | gouwuche- | hongbao- | weibiaoti-- | riyong | shuma | gongzi | kehuliebiaojinqian | fangdai | tuikuan | xiaoshengyi | wodejiangjin | zhuanzhang | shenghuojiaofei | baoxian | lvhang | canyin | chongwu1 | yundong | fahongbao | icon_fuel | icon_makeup | icon_shopping | icon_study | icon_smoke_wine | guanyuwomen | jietiao | weixinzhifu | zhifu-_weixinzhifu | xianjin | xinyongqia | yinhangka1 | zhifu-zhifubao | icon_clothes | icon_medicine | icon_phone | icon_tour | icon_traffic
    name: {
      type: String,
    },
    // string | string[]
    color: {
      type: null,
      observer: function(color) {
        this.setData({
          colors: this.fixColor(),
          isStr: typeof color === 'string',
        });
      }
    },
    size: {
      type: Number,
      value: 48,
      observer: function(size) {
        this.setData({
          svgSize: size,
        });
      },
    },
  },
  data: {
    colors: '',
    svgSize: 48,
    quot: '"',
    isStr: true,
  },
  methods: {
    fixColor: function() {
      var color = this.data.color;
      var hex2rgb = this.hex2rgb;

      if (typeof color === 'string') {
        return color.indexOf('#') === 0 ? hex2rgb(color) : color;
      }

      return color.map(function (item) {
        return item.indexOf('#') === 0 ? hex2rgb(item) : item;
      });
    },
    hex2rgb: function(hex) {
      var rgb = [];

      hex = hex.substr(1);

      if (hex.length === 3) {
        hex = hex.replace(/(.)/g, '$1$1');
      }

      hex.replace(/../g, function(color) {
        rgb.push(parseInt(color, 0x10));
        return color;
      });

      return 'rgb(' + rgb.join(',') + ')';
    }
  }
});
