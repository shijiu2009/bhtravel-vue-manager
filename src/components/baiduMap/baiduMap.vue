<template>
  <div style="width:600px">
    <el-row v-show="baiduInfo.isArea" >
      <el-col :span="8">
        <el-form-item label="省份" >
          <el-select style="width:150px"
            v-model="baiduInfo.proxcode"
            placeholder="请选择"
            @change="provinceChange"
          >
            <el-option
              v-for="item in baiduInfo.provinces"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="城市">
          <el-select style="width:150px"
            v-model="baiduInfo.cityxcode"
            placeholder="请选择"
            @change="cityChange"
          >
            <el-option
              v-for="item in baiduInfo.cities"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="区县">
          <el-select v-model="baiduInfo.countyxcode" placeholder="请选择" style="width:150px">
            <el-option
              v-for="item in baiduInfo.countys"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-form-item label="地址">
        <el-col :span="8">
          <el-input v-model="baiduInfo.address" style="width: 90%"></el-input>
        </el-col>
        <el-col :span="8">
          <el-button type="info" @click="getLngAndLat()">解析地址</el-button>
        </el-col>
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item label="位置信息">
        <el-col>
          <el-col :span="8">
            经度：
            <el-input
              id="lng"
              style="display: inline-block; width: 80%"
              v-model="baiduInfo.longitude"
              @change="infoChange"
            ></el-input>
          </el-col>
          <el-col :span="8">
            纬度：
            <el-input
              id="lat"
              style="display: inline-block; width: 80%"
              v-model="baiduInfo.latitude"
              @change="infoChange"
            ></el-input>
          </el-col>
        </el-col>
      </el-form-item>
    </el-row>
    <el-row>
      <el-col :offset="3">
        <baidu-map
          @ready="handler"
          style="width: 500px; height: 300px"
          @click="getClickInfo"
          :scroll-wheel-zoom="false"
        ></baidu-map>
      </el-col>
    </el-row>
  </div>
</template>
<script src="http://libs.baidu.com/jquery/1.9.1/jquery.js"></script>
<script>
import api from "@/api/travelManager/location.js";
export default {
  props: {
    baiduInfo: {
      default: {
        return: {},
      },
    },
  },

  methods: {
    getProvinces: function () {
      this.baiduInfo.isArea = true;
      api.getProvinces().then((result) => {
        if (result.plist != null && result.plist.length > 0) {
          this.baiduInfo.provinces = [];
          for (let i = 0; i < result.plist.length; i++) {
            let obj = {
              value: result.plist[i].xcode,
              label: result.plist[i].name,
            };
            this.baiduInfo.provinces.push(obj);
          }
        }
      });
      if (this.baiduInfo.proxcode != null && this.baiduInfo.proxcode != "") {
        this.baiduInfo.cities = [];
        api.getCities({ proxcode: this.baiduInfo.proxcode }).then((result) => {
          if (result.clist != null && result.clist.length > 0) {
            for (let i = 0; i < result.clist.length; i++) {
              let obj = {
                value: result.clist[i].xcode,
                label: result.clist[i].name,
              };
              this.baiduInfo.cities.push(obj);
            }
          }
        });
      }
      if (this.baiduInfo.cityxcode != null && this.baiduInfo.cityxcode != "") {
        this.baiduInfo.countys = [];
        api.getCountys({ cityxcode: this.baiduInfo.cityxcode }).then((result) => {
          if (result.colist != null && result.colist.length > 0) {
            for (let i = 0; i < result.colist.length; i++) {
              let obj = {
                value: result.colist[i].xcode,
                label: result.colist[i].name,
              };
              this.baiduInfo.countys.push(obj);
            }
          }
        });
      }
    },
    provinceChange: function (val) {
      api.getCities({ proxcode: val }).then((result) => {
        if (result.clist != null && result.clist.length > 0) {
          this.baiduInfo.cities = [];
          this.baiduInfo.cityxcode = "";
          for (let i = 0; i < result.clist.length; i++) {
            let obj = {
              value: result.clist[i].xcode,
              label: result.clist[i].name,
            };
            this.baiduInfo.cities.push(obj);
          }
        }
      });
    },
    cityChange: function (val) {
      api.getCountys({ cityxcode: val }).then((result) => {
        if (result.colist != null && result.colist.length > 0) {
          this.baiduInfo.countys = [];
          this.baiduInfo.countyxcode = "";
          for (let i = 0; i < result.colist.length; i++) {
            let obj = {
              value: result.colist[i].xcode,
              label: result.colist[i].name,
            };
            this.baiduInfo.countys.push(obj);
          }
        }
      });
    },
    //百度地图初始化
    handler({ BMap, map }) {
      this.BMap = BMap;
      this.map = map;
      let lng = this.baiduInfo.longitude;
      let lat = this.baiduInfo.latitude;
      if (lng && lat && lng != "0.0" && lat != "0.0") {
        let point = new BMap.Point(lng, lat);
        map.centerAndZoom(point, 15);
        let marker = new BMap.Marker(point); // 创建标注
        map.addOverlay(marker); // 将标注添加到地图中
        marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
      } else {
        map.centerAndZoom("北海", 15); // 初始化地图,设置城市和地图级别。
      }
    },
    getClickInfo(e) {
      if (this.map != null && this.map != "") {
        this.map.clearOverlays();
        let BMap = this.BMap;
        let point = new BMap.Point(e.point.lng, e.point.lat);
        let marker = new BMap.Marker(point); // 创建标注
        this.map.addOverlay(marker); // 将标注添加到地图中
        marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
        this.baiduInfo.longitude = e.point.lng;
        this.baiduInfo.latitude = e.point.lat;
      }
    },
    getLngAndLat() {
      let address = this.baiduInfo.address;
      if (address && address.length > 0 && this.map != null && this.map != "") {
        let this_ = this;
        let BMap = this.BMap;
        this.map.clearOverlays();
        let myGeo = new BMap.Geocoder();
        myGeo.getPoint(
          address,
          function (point) {
            if (point) {
              let BMap = this_.BMap;
              let map = this_.map;
              map.centerAndZoom(point, 16);
              var marker = new BMap.Marker(point); // 创建标注
              this_.baiduInfo.longitude = point.lng;
              this_.baiduInfo.latitude = point.lat;
              map.addOverlay(marker);
              marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
            }
          },
          "广西壮族自治区"
        );
      }
    },
    infoChange: function () {
      let BMap = this.BMap;
      let lng = this.baiduInfo.longitude;
      let lat = this.baiduInfo.latitude;
      if (lng && lat && lng != "0.0" && lat != "0.0") {
        let point = new BMap.Point(lng, lat);
        map.centerAndZoom(point, 15);
        let marker = new BMap.Marker(point); // 创建标注
        map.addOverlay(marker); // 将标注添加到地图中
        marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
      }
    },
  },
};
</script>
