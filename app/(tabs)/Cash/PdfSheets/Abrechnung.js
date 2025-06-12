// app/(auth)/_layout.tsx
import React, { useCallback, useContext, useState, useMemo, useRef, useEffect } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, Text,Button, ActivityIndicator, Dimensions, Easing, StyleSheet, Image, Animated, TouchableOpacity } from 'react-native';
import {AntDesign, Entypo, Feather, Foundation, MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons"
import { fontSize, height, size, width } from 'react-native-responsive-sizes';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView, BottomSheetFlatList, BottomSheetScrollView, BottomSheetModalProvider,BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import axios from 'axios';
import CountryFlag from "react-native-country-flag";
import LottieView from 'lottie-react-native';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import { BlurView } from 'expo-blur'; // If you're using Expo
import { LineChart } from 'react-native-wagmi-charts';
import { Platform } from 'react-native';
import { Link } from 'expo-router';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

import { router } from 'expo-router';
import { Blur } from '@shopify/react-native-skia';
import { MotiView } from 'moti'

import { FlashList } from "@shopify/flash-list";
import { LinearGradient } from 'expo-linear-gradient';
import debounce from 'lodash.debounce';

import PagerView from 'react-native-pager-view';


import firestore from '@react-native-firebase/firestore';


import ActionSheet, {useSheetRef, FlatList, ScrollView, SheetManager} from 'react-native-actions-sheet';
import { opacity } from 'react-native-redash';
import { TrasnactionReceipeContext } from '@/app/Context/TrasnactionReceipeContext';
import { DateTime } from 'luxon';
import PdfRendererView from 'react-native-pdf-renderer';  // Ensure this is installed and linked



const HEADER_HEIGHT = 300; // The height of the header

















export default  Billing  = () => {
  const {
    CurrentChoosedAsset, 
    Investment,
    BankAccountNumber, 
    setBankAccountNumber,
    PricePerShare,
  } = useContext(TrasnactionReceipeContext)

  const [pdfUri, setPdfUri] = useState(null);
  const [isPdfCreated, setIsPdfCreated] = useState(false);
  const Billing_Sheet = useRef(null); // ✅ Correct ref type

  const shortSymbol = CurrentChoosedAsset.symbol.substring(0, 3);








  const isoDate = CurrentChoosedAsset.transaction_time;


const formattedDate = DateTime.fromISO(isoDate)
  .setLocale('us') // Set locale to German
  .toFormat('dd.MM.yyyy'); // Format to "12.02.2025"






// Format price with commas and the Euro symbol
const formatPrice = (price) => {
  return new Intl.NumberFormat('us-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};










const createHTMLContent = () => {
  return `
<!DOCTYPE html>
<!-- Created by pdf2htmlEX (https://github.com/pdf2htmlEX/pdf2htmlEX) -->
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8"/>
<meta name="generator" content="pdf2htmlEX"/>
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
<style type="text/css">
/*! 
 * Base CSS for pdf2htmlEX
 * Copyright 2012,2013 Lu Wang <coolwanglu@gmail.com> 
 * https://github.com/pdf2htmlEX/pdf2htmlEX/blob/master/share/LICENSE
 */#sidebar{position:absolute;top:0;left:0;bottom:0;width:250px;padding:0;margin:0;overflow:auto}#page-container{position:absolute;top:0;left:0;margin:0;padding:0;border:0}@media screen{#sidebar.opened+#page-container{left:250px}#page-container{bottom:0;right:0;overflow:auto}.loading-indicator{display:none}.loading-indicator.active{display:block;position:absolute;width:64px;height:64px;top:50%;left:50%;margin-top:-32px;margin-left:-32px}.loading-indicator img{position:absolute;top:0;left:0;bottom:0;right:0}}@media print{@page{margin:0}html{margin:0}body{margin:0;-webkit-print-color-adjust:exact}#sidebar{display:none}#page-container{width:auto;height:auto;overflow:visible;background-color:transparent}.d{display:none}}.pf{position:relative;background-color:white;overflow:hidden;margin:0;border:0}.pc{position:absolute;border:0;padding:0;margin:0;top:0;left:0;width:100%;height:100%;overflow:hidden;display:block;transform-origin:0 0;-ms-transform-origin:0 0;-webkit-transform-origin:0 0}.pc.opened{display:block}.bf{position:absolute;border:0;margin:0;top:0;bottom:0;width:100%;height:100%;-ms-user-select:none;-moz-user-select:none;-webkit-user-select:none;user-select:none}.bi{position:absolute;border:0;margin:0;-ms-user-select:none;-moz-user-select:none;-webkit-user-select:none;user-select:none}@media print{.pf{margin:0;box-shadow:none;page-break-after:always;page-break-inside:avoid}@-moz-document url-prefix(){.pf{overflow:visible;border:1px solid #fff}.pc{overflow:visible}}}.c{position:absolute;border:0;padding:0;margin:0;overflow:hidden;display:block}.t{position:absolute;white-space:pre;font-size:1px;transform-origin:0 100%;-ms-transform-origin:0 100%;-webkit-transform-origin:0 100%;unicode-bidi:bidi-override;-moz-font-feature-settings:"liga" 0}.t:after{content:''}.t:before{content:'';display:inline-block}.t span{position:relative;unicode-bidi:bidi-override}._{display:inline-block;color:transparent;z-index:-1}::selection{background:rgba(127,255,255,0.4)}::-moz-selection{background:rgba(127,255,255,0.4)}.pi{display:none}.d{position:absolute;transform-origin:0 100%;-ms-transform-origin:0 100%;-webkit-transform-origin:0 100%}.it{border:0;background-color:rgba(255,255,255,0.0)}.ir:hover{cursor:pointer}</style>
<style type="text/css">
/*! 
 * Fancy styles for pdf2htmlEX
 * Copyright 2012,2013 Lu Wang <coolwanglu@gmail.com> 
 * https://github.com/pdf2htmlEX/pdf2htmlEX/blob/master/share/LICENSE
 */@keyframes fadein{from{opacity:0}to{opacity:1}}@-webkit-keyframes fadein{from{opacity:0}to{opacity:1}}@keyframes swing{0{transform:rotate(0)}10%{transform:rotate(0)}90%{transform:rotate(720deg)}100%{transform:rotate(720deg)}}@-webkit-keyframes swing{0{-webkit-transform:rotate(0)}10%{-webkit-transform:rotate(0)}90%{-webkit-transform:rotate(720deg)}100%{-webkit-transform:rotate(720deg)}}@media screen{#sidebar{background-color:#2f3236;background-image:url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjNDAzYzNmIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDBMNCA0Wk00IDBMMCA0WiIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2U9IiMxZTI5MmQiPjwvcGF0aD4KPC9zdmc+")}#outline{font-family:Georgia,Times,"Times New Roman",serif;font-size:13px;margin:2em 1em}#outline ul{padding:0}#outline li{list-style-type:none;margin:1em 0}#outline li>ul{margin-left:1em}#outline a,#outline a:visited,#outline a:hover,#outline a:active{line-height:1.2;color:#e8e8e8;text-overflow:ellipsis;white-space:nowrap;text-decoration:none;display:block;overflow:hidden;outline:0}#outline a:hover{color:#0cf}#page-container{background-color:#9e9e9e;background-image:url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjOWU5ZTllIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDVMNSAwWk02IDRMNCA2Wk0tMSAxTDEgLTFaIiBzdHJva2U9IiM4ODgiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=");-webkit-transition:left 500ms;transition:left 500ms}.pf{margin:13px auto;box-shadow:1px 1px 3px 1px #333;border-collapse:separate}.pc.opened{-webkit-animation:fadein 100ms;animation:fadein 100ms}.loading-indicator.active{-webkit-animation:swing 1.5s ease-in-out .01s infinite alternate none;animation:swing 1.5s ease-in-out .01s infinite alternate none}.checked{background:no-repeat url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3goQDSYgDiGofgAAAslJREFUOMvtlM9LFGEYx7/vvOPM6ywuuyPFihWFBUsdNnA6KLIh+QPx4KWExULdHQ/9A9EfUodYmATDYg/iRewQzklFWxcEBcGgEplDkDtI6sw4PzrIbrOuedBb9MALD7zv+3m+z4/3Bf7bZS2bzQIAcrmcMDExcTeXy10DAFVVAQDksgFUVZ1ljD3yfd+0LOuFpmnvVVW9GHhkZAQcxwkNDQ2FSCQyRMgJxnVdy7KstKZpn7nwha6urqqfTqfPBAJAuVymlNLXoigOhfd5nmeiKL5TVTV+lmIKwAOA7u5u6Lped2BsbOwjY6yf4zgQQkAIAcedaPR9H67r3uYBQFEUFItFtLe332lpaVkUBOHK3t5eRtf1DwAwODiIubk5DA8PM8bYW1EU+wEgCIJqsCAIQAiB7/u253k2BQDDMJBKpa4mEon5eDx+UxAESJL0uK2t7XosFlvSdf0QAEmlUnlRFJ9Waho2Qghc1/U9z3uWz+eX+Wr+lL6SZfleEAQIggA8z6OpqSknimIvYyybSCReMsZ6TislhCAIAti2Dc/zejVNWwCAavN8339j27YbTg0AGGM3WltbP4WhlRWq6Q/btrs1TVsYHx+vNgqKoqBUKn2NRqPFxsbGJzzP05puUlpt0ukyOI6z7zjOwNTU1OLo6CgmJyf/gA3DgKIoWF1d/cIY24/FYgOU0pp0z/Ityzo8Pj5OTk9PbwHA+vp6zWghDC+VSiuRSOQgGo32UErJ38CO42wdHR09LBQK3zKZDDY2NupmFmF4R0cHVlZWlmRZ/iVJUn9FeWWcCCE4ODjYtG27Z2Zm5juAOmgdGAB2d3cBADs7O8uSJN2SZfl+WKlpmpumaT6Yn58vn/fs6XmbhmHMNjc3tzDGFI7jYJrm5vb29sDa2trPC/9aiqJUy5pOp4f6+vqeJ5PJBAB0dnZe/t8NBajx/z37Df5OGX8d13xzAAAAAElFTkSuQmCC)}}</style>
<style type="text/css">
.ff0{font-family:sans-serif;visibility:hidden;}
@font-face{font-family:ff1;src:url('data:application/font-woff;base64,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')format("woff");}.ff1{font-family:ff1;line-height:1.065430;font-style:normal;font-weight:normal;visibility:visible;}
.m0{transform:matrix(0.250000,0.000000,0.000000,0.250000,0,0);-ms-transform:matrix(0.250000,0.000000,0.000000,0.250000,0,0);-webkit-transform:matrix(0.250000,0.000000,0.000000,0.250000,0,0);}
.v1{vertical-align:-1.080000px;}
.v0{vertical-align:0.000000px;}
.ls0{letter-spacing:0.000000px;}
.sc_{text-shadow:none;}
.sc1{text-shadow:-0.015em 0 transparent,0 0.015em transparent,0.015em 0 transparent,0 -0.015em  transparent;}
.sc0{text-shadow:-0.015em 0 rgb(0,0,0),0 0.015em rgb(0,0,0),0.015em 0 rgb(0,0,0),0 -0.015em  rgb(0,0,0);}
@media screen and (-webkit-min-device-pixel-ratio:0){
.sc_{-webkit-text-stroke:0px transparent;}
.sc1{-webkit-text-stroke:0.015em transparent;text-shadow:none;}
.sc0{-webkit-text-stroke:0.015em rgb(0,0,0);text-shadow:none;}
}
.ws7{word-spacing:-6.534000px;}
.wsa{word-spacing:0.000000px;}
.ws4{word-spacing:43.512000px;}
.ws3{word-spacing:280.784000px;}
.ws6{word-spacing:308.909000px;}
.ws2{word-spacing:318.376000px;}
.ws5{word-spacing:328.760000px;}
.ws1{word-spacing:339.768000px;}
.ws0{word-spacing:420.816000px;}
.ws9{word-spacing:543.966000px;}
.ws8{word-spacing:1807.195000px;}
._2{margin-left:-336.408000px;}
._0{width:30.152000px;}
._3{width:35.888000px;}
._7{width:213.572000px;}
._1{width:330.632000px;}
._8{width:475.217000px;}
._e{width:496.060000px;}
._b{width:536.182000px;}
._9{width:566.622000px;}
._6{width:628.037000px;}
._5{width:656.442000px;}
._4{width:697.637000px;}
._d{width:819.388000px;}
._c{width:949.321000px;}
._a{width:1577.227000px;}
.fc0{color:rgb(0,0,0);}
.fs4{font-size:21.000000px;}
.fs0{font-size:24.000000px;}
.fs1{font-size:27.000000px;}
.fs3{font-size:33.000000px;}
.fs2{font-size:42.000000px;}
.y0{bottom:-0.500000px;}
.y5{bottom:22.200000px;}
.y4{bottom:28.910000px;}
.y3{bottom:35.620000px;}
.y2{bottom:42.340000px;}
.y1{bottom:49.050000px;}
.y6{bottom:56.740000px;}
.y1d{bottom:223.200000px;}
.y1c{bottom:234.600000px;}
.y1b{bottom:264.670000px;}
.y1a{bottom:280.160000px;}
.y19{bottom:297.300000px;}
.y18{bottom:339.330000px;}
.y17{bottom:355.160000px;}
.y16{bottom:370.650000px;}
.y15{bottom:387.780000px;}
.y14{bottom:436.570000px;}
.y13{bottom:452.400000px;}
.y12{bottom:467.890000px;}
.y11{bottom:485.430000px;}
.y10{bottom:496.840000px;}
.yf{bottom:507.820000px;}
.ye{bottom:555.410000px;}
.yd{bottom:593.210000px;}
.yc{bottom:602.290000px;}
.yb{bottom:611.360000px;}
.y20{bottom:620.170000px;}
.ya{bottom:620.430000px;}
.y1f{bottom:629.250000px;}
.y9{bottom:629.510000px;}
.y1e{bottom:638.320000px;}
.y8{bottom:638.590000px;}
.y7{bottom:674.210000px;}
.h9{height:18.149414px;}
.h2{height:20.742188px;}
.h4{height:22.254961px;}
.h5{height:22.294961px;}
.h8{height:23.334961px;}
.h7{height:28.520508px;}
.h6{height:36.298828px;}
.h3{height:731.140000px;}
.h0{height:841.880000px;}
.h1{height:842.500000px;}
.w2{width:499.280000px;}
.w0{width:595.280000px;}
.w1{width:596.000000px;}
.x0{left:0.000000px;}
.x9{left:1.500000px;}
.x1{left:36.750000px;}
.x5{left:48.000000px;}
.x2{left:161.590000px;}
.x3{left:287.850000px;}
.x8{left:299.590000px;}
.x7{left:323.480000px;}
.x6{left:351.000000px;}
.x4{left:440.330000px;}
@media print{
.v1{vertical-align:-1.440000pt;}
.v0{vertical-align:0.000000pt;}
.ls0{letter-spacing:0.000000pt;}
.ws7{word-spacing:-8.712000pt;}
.wsa{word-spacing:0.000000pt;}
.ws4{word-spacing:58.016000pt;}
.ws3{word-spacing:374.378667pt;}
.ws6{word-spacing:411.878667pt;}
.ws2{word-spacing:424.501333pt;}
.ws5{word-spacing:438.346667pt;}
.ws1{word-spacing:453.024000pt;}
.ws0{word-spacing:561.088000pt;}
.ws9{word-spacing:725.288000pt;}
.ws8{word-spacing:2409.593333pt;}
._2{margin-left:-448.544000pt;}
._0{width:40.202667pt;}
._3{width:47.850667pt;}
._7{width:280.762667pt;}
._1{width:440.842667pt;}
._8{width:580.956000pt;}
._e{width:610.413333pt;}
._b{width:660.909333pt;}
._9{width:755.496000pt;}
._6{width:837.382667pt;}
._5{width:850.256000pt;}
._4{width:905.182667pt;}
._d{width:1365.517333pt;}
._c{width:1265.761333pt;}
._a{width:2102.969333pt;}
.fs4{font-size:28.000000pt;}
.fs0{font-size:32.000000pt;}
.fs1{font-size:36.000000pt;}
.fs3{font-size:44.000000pt;}
.fs2{font-size:56.000000pt;}
.y0{bottom:-0.666667pt;}
.y5{bottom:29.600000pt;}
.y4{bottom:38.546667pt;}
.y3{bottom:47.493333pt;}
.y2{bottom:56.453333pt;}
.y1{bottom:65.400000pt;}
.y6{bottom:75.653333pt;}
.y1d{bottom:297.600000pt;}
.y1c{bottom:312.800000pt;}
.y1b{bottom:352.893333pt;}
.y1a{bottom:373.546667pt;}
.y19{bottom:396.400000pt;}
.y18{bottom:452.440000pt;}
.y17{bottom:473.546667pt;}
.y16{bottom:494.200000pt;}
.y15{bottom:517.040000pt;}
.y14{bottom:582.093333pt;}
.y13{bottom:603.200000pt;}
.y12{bottom:623.853333pt;}
.y11{bottom:647.240000pt;}
.y10{bottom:662.453333pt;}
.yf{bottom:677.093333pt;}
.ye{bottom:740.546667pt;}
.yd{bottom:790.946667pt;}
.yc{bottom:803.053333pt;}
.yb{bottom:815.146667pt;}
.y20{bottom:826.893333pt;}
.ya{bottom:827.240000pt;}
.y1f{bottom:839.000000pt;}
.y9{bottom:839.346667pt;}
.y1e{bottom:851.093333pt;}
.y8{bottom:851.453333pt;}
.y7{bottom:898.946667pt;}
.h9{height:24.199219pt;}
.h2{height:27.656250pt;}
.h4{height:29.673281pt;}
.h5{height:29.726615pt;}
.h8{height:31.113281pt;}
.h7{height:38.027344pt;}
.h6{height:48.398438pt;}
.h3{height:974.853333pt;}
.h0{height:1122.506667pt;}
.h1{height:1123.333333pt;}
.w2{width:665.706667pt;}
.w0{width:793.706667pt;}
.w1{width:794.666667pt;}
.x0{left:0.000000pt;}
.x9{left:2.000000pt;}
.x1{left:49.000000pt;}
.x5{left:64.000000pt;}
.x2{left:215.453333pt;}
.x3{left:383.800000pt;}
.x8{left:399.453333pt;}
.x7{left:431.306667pt;}
.x6{left:468.000000pt;}
.x4{left:587.106667pt;}
}
</style>
<script>
/*
 Copyright 2012 Mozilla Foundation 
 Copyright 2013 Lu Wang <coolwanglu@gmail.com>
 Apachine License Version 2.0 
*/
(function(){function b(a,b,e,f){var c=(a.className||"").split(/\s+/g);""===c[0]&&c.shift();var d=c.indexOf(b);0>d&&e&&c.push(b);0<=d&&f&&c.splice(d,1);a.className=c.join(" ");return 0<=d}if(!("classList"in document.createElement("div"))){var e={add:function(a){b(this.element,a,!0,!1)},contains:function(a){return b(this.element,a,!1,!1)},remove:function(a){b(this.element,a,!1,!0)},toggle:function(a){b(this.element,a,!0,!0)}};Object.defineProperty(HTMLElement.prototype,"classList",{get:function(){if(this._classList)return this._classList;
var a=Object.create(e,{element:{value:this,writable:!1,enumerable:!0}});Object.defineProperty(this,"_classList",{value:a,writable:!1,enumerable:!1});return a},enumerable:!0})}})();
</script>
<script>
(function(){/*
 pdf2htmlEX.js: Core UI functions for pdf2htmlEX 
 Copyright 2012,2013 Lu Wang <coolwanglu@gmail.com> and other contributors 
 https://github.com/pdf2htmlEX/pdf2htmlEX/blob/master/share/LICENSE 
*/
var pdf2htmlEX=window.pdf2htmlEX=window.pdf2htmlEX||{},CSS_CLASS_NAMES={page_frame:"pf",page_content_box:"pc",page_data:"pi",background_image:"bi",link:"l",input_radio:"ir",__dummy__:"no comma"},DEFAULT_CONFIG={container_id:"page-container",sidebar_id:"sidebar",outline_id:"outline",loading_indicator_cls:"loading-indicator",preload_pages:3,render_timeout:100,scale_step:0.9,key_handler:!0,hashchange_handler:!0,view_history_handler:!0,__dummy__:"no comma"},EPS=1E-6;
function invert(a){var b=a[0]*a[3]-a[1]*a[2];return[a[3]/b,-a[1]/b,-a[2]/b,a[0]/b,(a[2]*a[5]-a[3]*a[4])/b,(a[1]*a[4]-a[0]*a[5])/b]}function transform(a,b){return[a[0]*b[0]+a[2]*b[1]+a[4],a[1]*b[0]+a[3]*b[1]+a[5]]}function get_page_number(a){return parseInt(a.getAttribute("data-page-no"),16)}function disable_dragstart(a){for(var b=0,c=a.length;b<c;++b)a[b].addEventListener("dragstart",function(){return!1},!1)}
function clone_and_extend_objs(a){for(var b={},c=0,e=arguments.length;c<e;++c){var h=arguments[c],d;for(d in h)h.hasOwnProperty(d)&&(b[d]=h[d])}return b}
function Page(a){if(a){this.shown=this.loaded=!1;this.page=a;this.num=get_page_number(a);this.original_height=a.clientHeight;this.original_width=a.clientWidth;var b=a.getElementsByClassName(CSS_CLASS_NAMES.page_content_box)[0];b&&(this.content_box=b,this.original_scale=this.cur_scale=this.original_height/b.clientHeight,this.page_data=JSON.parse(a.getElementsByClassName(CSS_CLASS_NAMES.page_data)[0].getAttribute("data-data")),this.ctm=this.page_data.ctm,this.ictm=invert(this.ctm),this.loaded=!0)}}
Page.prototype={hide:function(){this.loaded&&this.shown&&(this.content_box.classList.remove("opened"),this.shown=!1)},show:function(){this.loaded&&!this.shown&&(this.content_box.classList.add("opened"),this.shown=!0)},rescale:function(a){this.cur_scale=0===a?this.original_scale:a;this.loaded&&(a=this.content_box.style,a.msTransform=a.webkitTransform=a.transform="scale("+this.cur_scale.toFixed(3)+")");a=this.page.style;a.height=this.original_height*this.cur_scale+"px";a.width=this.original_width*this.cur_scale+
"px"},view_position:function(){var a=this.page,b=a.parentNode;return[b.scrollLeft-a.offsetLeft-a.clientLeft,b.scrollTop-a.offsetTop-a.clientTop]},height:function(){return this.page.clientHeight},width:function(){return this.page.clientWidth}};function Viewer(a){this.config=clone_and_extend_objs(DEFAULT_CONFIG,0<arguments.length?a:{});this.pages_loading=[];this.init_before_loading_content();var b=this;document.addEventListener("DOMContentLoaded",function(){b.init_after_loading_content()},!1)}
Viewer.prototype={scale:1,cur_page_idx:0,first_page_idx:0,init_before_loading_content:function(){this.pre_hide_pages()},initialize_radio_button:function(){for(var a=document.getElementsByClassName(CSS_CLASS_NAMES.input_radio),b=0;b<a.length;b++)a[b].addEventListener("click",function(){this.classList.toggle("checked")})},init_after_loading_content:function(){this.sidebar=document.getElementById(this.config.sidebar_id);this.outline=document.getElementById(this.config.outline_id);this.container=document.getElementById(this.config.container_id);
this.loading_indicator=document.getElementsByClassName(this.config.loading_indicator_cls)[0];for(var a=!0,b=this.outline.childNodes,c=0,e=b.length;c<e;++c)if("ul"===b[c].nodeName.toLowerCase()){a=!1;break}a||this.sidebar.classList.add("opened");this.find_pages();if(0!=this.pages.length){disable_dragstart(document.getElementsByClassName(CSS_CLASS_NAMES.background_image));this.config.key_handler&&this.register_key_handler();var h=this;this.config.hashchange_handler&&window.addEventListener("hashchange",
function(a){h.navigate_to_dest(document.location.hash.substring(1))},!1);this.config.view_history_handler&&window.addEventListener("popstate",function(a){a.state&&h.navigate_to_dest(a.state)},!1);this.container.addEventListener("scroll",function(){h.update_page_idx();h.schedule_render(!0)},!1);[this.container,this.outline].forEach(function(a){a.addEventListener("click",h.link_handler.bind(h),!1)});this.initialize_radio_button();this.render()}},find_pages:function(){for(var a=[],b={},c=this.container.childNodes,
e=0,h=c.length;e<h;++e){var d=c[e];d.nodeType===Node.ELEMENT_NODE&&d.classList.contains(CSS_CLASS_NAMES.page_frame)&&(d=new Page(d),a.push(d),b[d.num]=a.length-1)}this.pages=a;this.page_map=b},load_page:function(a,b,c){var e=this.pages;if(!(a>=e.length||(e=e[a],e.loaded||this.pages_loading[a]))){var e=e.page,h=e.getAttribute("data-page-url");if(h){this.pages_loading[a]=!0;var d=e.getElementsByClassName(this.config.loading_indicator_cls)[0];"undefined"===typeof d&&(d=this.loading_indicator.cloneNode(!0),
d.classList.add("active"),e.appendChild(d));var f=this,g=new XMLHttpRequest;g.open("GET",h,!0);g.onload=function(){if(200===g.status||0===g.status){var b=document.createElement("div");b.innerHTML=g.responseText;for(var d=null,b=b.childNodes,e=0,h=b.length;e<h;++e){var p=b[e];if(p.nodeType===Node.ELEMENT_NODE&&p.classList.contains(CSS_CLASS_NAMES.page_frame)){d=p;break}}b=f.pages[a];f.container.replaceChild(d,b.page);b=new Page(d);f.pages[a]=b;b.hide();b.rescale(f.scale);disable_dragstart(d.getElementsByClassName(CSS_CLASS_NAMES.background_image));
f.schedule_render(!1);c&&c(b)}delete f.pages_loading[a]};g.send(null)}void 0===b&&(b=this.config.preload_pages);0<--b&&(f=this,setTimeout(function(){f.load_page(a+1,b)},0))}},pre_hide_pages:function(){var a="@media screen{."+CSS_CLASS_NAMES.page_content_box+"{display:none;}}",b=document.createElement("style");b.styleSheet?b.styleSheet.cssText=a:b.appendChild(document.createTextNode(a));document.head.appendChild(b)},render:function(){for(var a=this.container,b=a.scrollTop,c=a.clientHeight,a=b-c,b=
b+c+c,c=this.pages,e=0,h=c.length;e<h;++e){var d=c[e],f=d.page,g=f.offsetTop+f.clientTop,f=g+f.clientHeight;g<=b&&f>=a?d.loaded?d.show():this.load_page(e):d.hide()}},update_page_idx:function(){var a=this.pages,b=a.length;if(!(2>b)){for(var c=this.container,e=c.scrollTop,c=e+c.clientHeight,h=-1,d=b,f=d-h;1<f;){var g=h+Math.floor(f/2),f=a[g].page;f.offsetTop+f.clientTop+f.clientHeight>=e?d=g:h=g;f=d-h}this.first_page_idx=d;for(var g=h=this.cur_page_idx,k=0;d<b;++d){var f=a[d].page,l=f.offsetTop+f.clientTop,
f=f.clientHeight;if(l>c)break;f=(Math.min(c,l+f)-Math.max(e,l))/f;if(d===h&&Math.abs(f-1)<=EPS){g=h;break}f>k&&(k=f,g=d)}this.cur_page_idx=g}},schedule_render:function(a){if(void 0!==this.render_timer){if(!a)return;clearTimeout(this.render_timer)}var b=this;this.render_timer=setTimeout(function(){delete b.render_timer;b.render()},this.config.render_timeout)},register_key_handler:function(){var a=this;window.addEventListener("DOMMouseScroll",function(b){if(b.ctrlKey){b.preventDefault();var c=a.container,
e=c.getBoundingClientRect(),c=[b.clientX-e.left-c.clientLeft,b.clientY-e.top-c.clientTop];a.rescale(Math.pow(a.config.scale_step,b.detail),!0,c)}},!1);window.addEventListener("keydown",function(b){var c=!1,e=b.ctrlKey||b.metaKey,h=b.altKey;switch(b.keyCode){case 61:case 107:case 187:e&&(a.rescale(1/a.config.scale_step,!0),c=!0);break;case 173:case 109:case 189:e&&(a.rescale(a.config.scale_step,!0),c=!0);break;case 48:e&&(a.rescale(0,!1),c=!0);break;case 33:h?a.scroll_to(a.cur_page_idx-1):a.container.scrollTop-=
a.container.clientHeight;c=!0;break;case 34:h?a.scroll_to(a.cur_page_idx+1):a.container.scrollTop+=a.container.clientHeight;c=!0;break;case 35:a.container.scrollTop=a.container.scrollHeight;c=!0;break;case 36:a.container.scrollTop=0,c=!0}c&&b.preventDefault()},!1)},rescale:function(a,b,c){var e=this.scale;this.scale=a=0===a?1:b?e*a:a;c||(c=[0,0]);b=this.container;c[0]+=b.scrollLeft;c[1]+=b.scrollTop;for(var h=this.pages,d=h.length,f=this.first_page_idx;f<d;++f){var g=h[f].page;if(g.offsetTop+g.clientTop>=
c[1])break}g=f-1;0>g&&(g=0);var g=h[g].page,k=g.clientWidth,f=g.clientHeight,l=g.offsetLeft+g.clientLeft,m=c[0]-l;0>m?m=0:m>k&&(m=k);k=g.offsetTop+g.clientTop;c=c[1]-k;0>c?c=0:c>f&&(c=f);for(f=0;f<d;++f)h[f].rescale(a);b.scrollLeft+=m/e*a+g.offsetLeft+g.clientLeft-m-l;b.scrollTop+=c/e*a+g.offsetTop+g.clientTop-c-k;this.schedule_render(!0)},fit_width:function(){var a=this.cur_page_idx;this.rescale(this.container.clientWidth/this.pages[a].width(),!0);this.scroll_to(a)},fit_height:function(){var a=this.cur_page_idx;
this.rescale(this.container.clientHeight/this.pages[a].height(),!0);this.scroll_to(a)},get_containing_page:function(a){for(;a;){if(a.nodeType===Node.ELEMENT_NODE&&a.classList.contains(CSS_CLASS_NAMES.page_frame)){a=get_page_number(a);var b=this.page_map;return a in b?this.pages[b[a]]:null}a=a.parentNode}return null},link_handler:function(a){var b=a.target,c=b.getAttribute("data-dest-detail");if(c){if(this.config.view_history_handler)try{var e=this.get_current_view_hash();window.history.replaceState(e,
"","#"+e);window.history.pushState(c,"","#"+c)}catch(h){}this.navigate_to_dest(c,this.get_containing_page(b));a.preventDefault()}},navigate_to_dest:function(a,b){try{var c=JSON.parse(a)}catch(e){return}if(c instanceof Array){var h=c[0],d=this.page_map;if(h in d){for(var f=d[h],h=this.pages[f],d=2,g=c.length;d<g;++d){var k=c[d];if(null!==k&&"number"!==typeof k)return}for(;6>c.length;)c.push(null);var g=b||this.pages[this.cur_page_idx],d=g.view_position(),d=transform(g.ictm,[d[0],g.height()-d[1]]),
g=this.scale,l=[0,0],m=!0,k=!1,n=this.scale;switch(c[1]){case "XYZ":l=[null===c[2]?d[0]:c[2]*n,null===c[3]?d[1]:c[3]*n];g=c[4];if(null===g||0===g)g=this.scale;k=!0;break;case "Fit":case "FitB":l=[0,0];k=!0;break;case "FitH":case "FitBH":l=[0,null===c[2]?d[1]:c[2]*n];k=!0;break;case "FitV":case "FitBV":l=[null===c[2]?d[0]:c[2]*n,0];k=!0;break;case "FitR":l=[c[2]*n,c[5]*n],m=!1,k=!0}if(k){this.rescale(g,!1);var p=this,c=function(a){l=transform(a.ctm,l);m&&(l[1]=a.height()-l[1]);p.scroll_to(f,l)};h.loaded?
c(h):(this.load_page(f,void 0,c),this.scroll_to(f))}}}},scroll_to:function(a,b){var c=this.pages;if(!(0>a||a>=c.length)){c=c[a].view_position();void 0===b&&(b=[0,0]);var e=this.container;e.scrollLeft+=b[0]-c[0];e.scrollTop+=b[1]-c[1]}},get_current_view_hash:function(){var a=[],b=this.pages[this.cur_page_idx];a.push(b.num);a.push("XYZ");var c=b.view_position(),c=transform(b.ictm,[c[0],b.height()-c[1]]);a.push(c[0]/this.scale);a.push(c[1]/this.scale);a.push(this.scale);return JSON.stringify(a)}};
pdf2htmlEX.Viewer=Viewer;})();
</script>
<script>
try{
pdf2htmlEX.defaultViewer = new pdf2htmlEX.Viewer({});
}catch(e){}
</script>
<title></title>
</head>
<body>
<div id="sidebar">
<div id="outline">
</div>
</div>
<div id="page-container">
<div id="pf1" class="pf w0 h0" data-page-no="1"><div class="pc pc1 w0 h0"><img class="bi x0 y0 w1 h1" alt="" src="data:image/png;base64,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/KKjo2Pfvn0rVqy466670j/Y/QrD9LRp0/bv3x/mlJWVlZSU7N69u6GhobW1df78+VdeeeXkyZMz1nDo0KFQfenblvwQnef7zwcAQPidR8rKypITI8eNG7dz584oih588MFPfepTSQ3+91Dm5PzqV78KgVdeXl5bWxtF0XPPPZeE386dO48dOxZF0dixY3fs2BFF0fr16xcuXNj5S1etWjV48OCOjo577733e9/7XhRFzz777NatW5NVRVE0adKk8HVn4uabb/7Od74TtqeysjJsTPo1bEOGDEl2M/Hiiy+GifLy8uXLl0dRdOrUqZEjR/7xj39sbW0Nu3BWvvSlL4VdGDRoUNivP/3pT2e7kk2bNr300kth+v77758zZ04URS0tLbfccsu6deuiKPrpT3/aOfwAAOB85hq//309evQYPXp0mH7nnXeS+Rs3bgwTM2bMGDJkSBRFNTU1b7/9dpe/TVbWkiVLxo8fH14+/PDD//m2JRt28uTJcGrlWenZs2d5eXnnXTtbybHKSy655Gw/+8wzz4SJa665JlRfFEW9evVasmRJmN62bVtbW9t/OFDJsVwAADgHOOJ3dro6CTB9/qFDh7Zv3x7mhMALqqqqwpI33HBDfX390qVL29vbV65c+fWvf72rVaVSqXnz5n3605+Ooig5MzMs8Oc//zk9BSdPnpyfn3/abVu9enV4OXDgwHAry7DA4cOH09f2wQ9+8Jprrum8qubm5pqamrCGAQMGpF8y9y+/MWPiueeeq6ure+utt77//e9HUXTFFVfceeedZzu8NTU1Yc706dPTlxk5cuTOnTvDyaJdnTIaPpiXlzdx4sTx48cXFBRs2LBh7dq177zzTjiD97rrrhs/fvzYsWM/8IEP+G8HAED4nae6ugAsjuNTp04VFRXFcdzU1NTe3h7HcW5u7uzZs8MCv//978PNSIYPHz5ixIiZM2cuXbo0iqKHH344I/wyomXUqFFhIlzDlmxDTU3Nnj17kpcjR47sKvziOH7ggQeWL18ebgwTlp86dWr6Ao2NjV/+8peTy97mz5+fHn7bt2+vqKhoa2vbv3//4cOH4zju27dvRUVF0qJdjVLGNX5LlixJv45u/vz5ffv27Wbf/+WwHzp0KMy5/PLLMxa79tpru/rh8vLyrrrqqqlTp37yk5+8+uqrs7Oza2tr6+vrH3nkkY6Ojo0bN15++eUjRoxob2/fvXv3448/Pn369P379/uHBwBA+JHp0KFDSaKkUqnvfve7hYWF4a3HH388TITLz8rKygoKChoaGl599dUDBw50bphE+pV4//ZNR44dO3bs2LFk24qLixctWnTmH29qatq6dWt6fX37298Od+M8K/379+/Vq9epU6fCCa6zZs3Kzs6eMWPGWa0k/S4vZ/6pOXPmzJkzp6Wlpbq6+pvf/OaaNWvq6upSqdSAAQNmzZo1e/bs2trapUuXVlVVNTU1ubkLAADCjy6DZPTo0cmj5FatWpWeNI899liY6Nev34YNG6IoKi0tDU8p2Lx5czfhF44TRlE0YMCAnJz/+b0mTZq0bNmy5GVJSUk321ZUVJRKpQ4ePBg2YO/evQMHDkxfYMiQIevXr09ehkdH/It/l5ycMWPGzJ0796abbvo3huipp54KN3f55S9/+fnPfz6O46985StTp07t1avXma+koKAg3FCnrq4u463q6urQyWPGjElOZA3+8Ic/LF68+Nlnnz1y5Eh61zU1NS1btmzZsmVu5gkAwDnMzV3Ouu66mt+jR49du3Ylp1A+8sgjySGp3bt3v/HGG2F64cKFlZWVlZWVv/3tb8MHV69e3dVXtLW1hcvhoij6xCc+kb7ARRddNCJNRudkrHDWrFlr1qzJysqKoqi5uXnLli0ZC/Ts2TN9bRlZOHny5JMnT7a0tJw8ebK6ujqpvtzc3DDxt7/9LTky2dDQkOxC8kyIjHH73Oc+F76iubk5/YzKM7nG78Mf/nCY8+STT6Yv89prr02cOLGiouKGG27ofPHhU0899dhjjx09ejTjssOuLkcEAADhd/7q5iK0MPGjH/0oHL/asmVLcv/Jp59+Ov1qt+ifL3574YUX0p9vnrx15MiRL37xiyHSUqnUN77xje63ofttvvrqq2+77bbwctGiRekrOe0KQxn27NkzpGPiQx/6UMikxsbG5JDmQw89FFZYXFycXMKX8RV79uwJZ3vGcZz+wMDTDm8UReGyyTiOt23b9q1vfSsEZ2NjY3iuYBzH48aN6+Y01G5+iH9veAEAQPidd4qKisJj3KMo+sEPfhAmkpugzJ8//+WXX/7d734X/oYrANvb259//vn0lYwZM6a0tLSgoODRRx8Nc2677bbkOQrBE088kZubm5ub27t379zc3DN5LsKiRYvCyaKvv/56+omdURQdOHAgWVX4W11dfdoVDhw4MHm04O233z569OiysrLFixeHOZ0fprdgwYIpU6ZUVlZOmDAh9FVhYWHGaa6lpaVZWVmpVCorK2vQoEGdv7S8vPxjH/tYmL7vvvsKCgrKysqKi4vDEdQoir761a/6PwQAAOH3f+trX/tamNi6desLL7zQ1NQUnkAQRdGtt946Ks2ECRPC/HDVX+LgwYN1dXUnT54ML8eOHfuTn/wk41va29tPpmlpaTnthg0dOvQzn/lMmA73FE138p+l31SmG4sXL+7Zs2cURXEc7927Nzy2PoqivLy8e+65J2Ph7du3V1VVbdiw4cSJE1EUpVKpH/7wh9nZ2Wc7witWrBg+fHiYbmpqqq2tTZ5JePfdd99yyy1nspKLLrrosssu6zy/sLBw9uzZ4dkbAABwbnBzl7NQXFw8YsSIKIrSzyTMyckJx6x69OgR5pSXl8+cOTM8a+H++++fPXt2CIy+ffuWlZWlr3Dy5Mkvv/xyFEWvvfZaFEXDhg1L7qqSlZXVp0+fq666qrKy8uabb05WPmjQoLANGfr169d5Zn5+fti25Jq9efPmvfTSS1EU/f3vf9+1a9cFF1zQ1X1levfunZeXF97t5mnmY8aMef7555ctW1ZdXd3Y2BhG6eMf//jcuXOTg5BDhw7t06fPP/3b5eSUlpbOmTMnOXZ32WWXhYdVdN6p/Pz8sMvJXgwePHjfvn0PPPDAo48+euDAgba2tgsvvDA8z33KlCnd/IKDBg36yEc+Mn78+Ouvv37UqFHZ2dmvv/76b37zm/Xr11966aXjx4+vqKi44oor/KsDAHCOSbmiCQAA4NzmVE8AAADhBwAAgPADAABA+AEAACD8AAAAEH4AAAAIPwAAAIQfAACA8AMAAED4AQAAIPwAAAAQfgAAAAg/AAAAhB8AAADCDwAAQPgBAAAg/AAAABB+AAAACD8AAACEHwAAAMIPAAAA4QcAAIDwAwAAEH4AAAAIPwAAAIQfAAAAwg8AAADhBwAAgPADAABA+AEAAAg/AAAAhB8AAADCDwAAAOEHAACA8AMAAED4AQAAIPwAAACEHwAAAMIPAAAA4QcAAIDwAwAAQPgBAAAg/AAAABB+AAAACD8AAADhBwAAgPADAABA+AEAACD8AAAAEH4AAAAIPwAAAIQfAACA8AMAAED4AQAAIPwAAAAQfgAAAAg/AAAAhB8AAADCDwAAQPgZAgAAAOEHAACA8AMAAED4AQAAIPwAAAAQfgAAAAg/AAAAhB8AAIDwAwAAQPgBAAAg/AAAABB+AAAACD8AAACEHwAAAMIPAABA+AEAACD8AAAAEH4AAAAIPwAAAIQfAAAAwg8AAADhBwAAgPADAAAQfgAAAAg/AAAAhB8AAADCDwAAAOEHAACA8AMAAED4AQAACD8AAACEHwAAAMIPAAAA4QcAAIDwAwAAQPgBAAAg/AAAAIQfAAAAwg8AAADhBwAAgPADAABA+AEAACD8AAAAEH4AAAAIPwAAAOEHAACA8AMAAED4AQAAIPwAAAAQfgAAAAg/AAAAhB8AAIDwAwAAQPgBAAAg/AAAABB+AAAACD8AAACEHwAAAMIPAABA+AEAACD8AAAAEH4AAAAIPwAAAIQfAAAAwg8AAADhBwAAgPADAAAQfgAAAAg/AAAAhB8AAADCDwAAAOEHAACA8AMAAED4AQAACD8AAACEHwAAAMIPAAAA4QcAAIDwAwAAQPgBAAAg/AAAABB+AAAAwg8AAADhBwAAgPADAABA+AEAACD8AAAAEH4AAAAIPwAAAOEHAACA8AMAAED4AQAAIPwAAAAQfgAAAAg/AAAAhB8AAIDwAwAAQPgBAAAg/AAAABB+AAAACD8AAACEHwAAAMIPAAAA4QcAACD8AAAAEH4AAAAIPwAAAIQfAAAAwg8AAADhBwAAgPADAAAQfgAAAAg/AAAAhB8AAADCDwAAAOEHAACA8AMAAED4AQAACD8AAACEHwAAAMIPAAAA4QcAAIDwAwAAQPgBAAAg/AAAABB+AAAAwg8AAADhBwAAgPADAABA+AEAACD8AAAAEH4AAAAIPwAAAOEHAACA8AMAAED4AQAAIPwAAAAQfgAAAAg/AAAAhB8AAADCDwAAQPgBAAAg/AAAABB+AAAACD8AAACEHwAAAMIPAAAA4QcAACD8AAAAEH4AAAAIPwAAAIQfAAAAwg8AAADhBwAAgPADAAAQfgAAAAg/AAAAhB8AAADCDwAAAOEHAACA8AMAAED4AQAAIPwAAACEHwAAAMIPAAAA4QcAAIDwAwAAQPgBAAAg/AAAABB+AAAAwg8AAADhBwAAgPADAABA+AEAACD8AAAAEH4AAAAIPwAAAOEHAACA8AMAAED4AQAAIPwAAAAQfgAAAAg/AAAAhB8AAADCDwAAQPgBAAAg/AAAABB+AAAACD8AAACEHwAAAMIPAAAA4QcAACD8AAAAEH4AAAAIPwAAAIQfAAAAwg8AAADhBwAAgPADAABA+AEAAAg/AAAAhB8AAADCDwAAAOEHAACA8AMAAED4AQAAIPwAAACEHwAAAMIPAAAA4QcAAIDwAwAAQPgBAAAg/AAAABB+AAAAwg8AAADhBwAAgPADAABA+AEAACD8AAAAEH4AAAAIPwAAAIQfAACA8AMAAED4AQAAIPwAAAAQfgAAAAg/AAAAhB8AAADCDwAAQPgBAAAg/AAAABB+AAAACD8AAACEHwAAAMIPAAAA4QcAACD8AAAAEH4AAAAIPwAAAIQfAAAAwg8AAADhBwAAgPADAABA+AEAAAg/AAAAhB8AAADCDwAAAOEHAACA8AMAAED4AQAAIPwAAACEHwAAAMIPAAAA4QcAAIDwAwAAQPgBAAAg/AAAABB+AAAAws8QAAAACD8AAACEHwAAAMIPAAAA4QcAAIDwAwAAQPgBAAAg/AAAAIQfAAAAwg8AAADhBwAAgPADAABA+AEAACD8AAAAEH4AAADCDwAAAOEHAACA8AMAAED4AQAAIPwAAAAQfgAAAAg/AAAAhB8AAIDwAwAAQPgBAAAg/AAAABB+AAAACD8AAACEHwAAAMIPAABA+AEAACD8AAAAEH4AAAAIPwAAAIQfAAAAwg8AAADhBwAAIPwAAAAQfgAAAAg/AAAAhB8AAADCDwAAAOEHAACA8AMAAED4AQAACD8AAACEHwAAAMIPAAAA4QcAAIDwAwAAQPgBAAAg/AAAAIQfAAAAwg8AAADhBwAAgPADAABA+AEAACD8AAAAEH4AAADCDwAAAOEHAACA8AMAAED4AQAAIPwAAAAQfgAAAAg/AAAAhB8AAIDwAwAAQPgBAAAg/AAAABB+AAAACD8AAACEHwAAAMIPAABA+AEAACD8AAAAEH4AAAAIPwAAAIQfAAAAwg8AAADhBwAAgPADAAAQfgAAAAg/AAAAhB8AAADCDwAAAOEHAACA8AMAAED4AQAACD8AAACEHwAAAMIPAAAA4QcAAIDwAwAAQPgBAAAg/AAAAIQfAAAAwg8AAADhBwAAgPADAABA+AEAACD8AAAAEH4AAAAIPwAAAOEHAACA8AMAAED4AQAAIPwAAAAQ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HwAAAMIPAAAA4QcAAIDwAwAAQPgBAAAg/AAAABB+AAAACD8AAADhBwAAgPADAABA+AEAACD8AAAAEH4AAAAIPwAAAIQfAACA8AMAAED4AQAAIPwAAAAQfgAAAAg/AAAAhB8AAADCDwAAQPgBAAAg/AAAABB+AAAACD8AAACEHwAAAMIPAAAA4QcAAIDwAwAAEH4AAAAIPwAAAIQfAAAAwg8AAADhBwAAgPADAABA+AEAAAg/AAAAhB8AAADCDwAAAOEHAACA8AMAAED4AQAAIPwAAAAQfgAAAMIPAAAA4QcAAIDwAwAAQPgBAAAg/AAAABB+AAAACD8AAADhBwAAgPADAABA+AEAACD8AAAAEH4AAAAIPwAAAIQfAACA8AMAAED4AQAAIPwAAAAQfgAAAAg/AAAAhB8AAADCDwAAAOEHAAAg/AAAABB+AAAACD8AAACEHwAAAMIPAAAA4QcAAIDwAwAAEH4AAAAIPwAAAIQfAAAAwg8AAADhBwAAgPADAABA+AEAAAg/AAAAhB8AAADCDwAAAOEHAACA8AMAAED4AQAAIPwAAAAQfgAAAMIPAAAA4QcAAIDwAwAAQPgBAAAg/AAAABB+AAAACD8AAADhBwAAgPADAABA+AEAACD8AAAAEH4AAAAIPwAAAIQfAAAAwg8AAED4AQAAIPwAAAAQfgAAAAg/AAAAhB8AAADCDwAAAOEHAAAg/AAAABB+AAAACD8AAACEHwAAAMIPAAAA4QcAAIDwAwAAEH4AAAAIPwAAAIQfAAAAwg8AAADhBwAAgPADAABA+AEAACD8AAAAhB8AAADCDwAAAOEHAACA8AMAAED4AQAAIPwAAAAQfgAAAMIPAAAA4QcAAIDwAwAAQPgBAAAg/AAAABB+AAAACD8AAADhBwAAgPADAABA+AEAACD8AAAAEH4AAAAIPwAAAIQfAAAAwg8AAED4AQAAIPwAAAAQfgAAAAg/AAAAhB8AAADCDwAAAOEHAAAg/AAAABB+AAAACD8AAACEHwAAAMIPAAAA4QcAAIDwAwAAQPgBAAAIPwAAAIQfAAAAwg8AAADhBwAAgPADAABA+AEAACD8AAAAhB8AAADCDwAAAOEHAACA8AMAAED4AQAAIPwAAAAQfgAAAMIPAAAA4QcAAIDwAwAAQPgBAAAg/AAAABB+AAAACD8AAACEHwAAgPADAABA+AEAACD8AAAAEH4AAAAIPwAAAIQfAAAAwg8AAED4AQAAIPwAAAAQfgAAAAg/AAAAhB8AAADCDwAAAOEHAAAg/AAAABB+AAAACD8AAACEHwAAAMIPAAAA4QcAAIDwAwAAQPgBAAAIPwAAAIQfAAAAwg8AAADhBwAAgPADAABA+AEAACD8AAAAhB8AAADCDwAAAOEHAACA8AMAAED4AQAAIPwAAAAQfgAAAMLPCAAAAIQfAAAAwg8AAADhBwAAgPADAABA+AEAACD8AAAAEH4AAADCDwAAAOEHAACA8AMAAED4AQAAIPwAAAAQfgAAAAg/AAAA4QcAAIDwAwAAQPgBAAAg/AAAABB+AAAACD8AAACEHwAAAMIPAABA+AEAACD8AAAAEH4AAAAIPwAAAIQfAAAAwg8AAADhBwAAIPwAAAAQfgAAAAg/AAAAhB8AAADCDwAAAOEHAACA8AMAABB+AAAACD8AAACEHwAAAMIPAAAA4QcAAIDwAwAAQPgBAAAg/AAAAIQfAAAAwg8AAADhBwAAgPADAABA+AEAACD8AAAAEH4AAADCDwAAAOEHAACA8AMAAED4AQAAIPwAAAAQfgAAAAg/AAAA4QcAAIDwAwAAQPgBAAAg/AAAABB+AAAACD8AAACEHwAAAMIPAABA+AEAACD8AAAAEH4AAAAIPwAAAIQfAAAAwg8AAADhBwAAIPwAAAAQfgAAAAg/AAAAhB8AAADCDwAAAOEHAACA8AMAAED4AQAACD8AAACEHwAAAMIPAAAA4QcAAIDwAwAAQPgBAAAg/AAAAIQfAAAAwg8AAADhBwAAgPADAABA+AEAACD8AAAAEH4AAADCDwAAAOEHAACA8AMAAED4AQAAIPwAAAAQfgAAAAg/AAAAhB8AAIDwAwAAQPgBAAAg/AAAABB+AAAACD8AAACEHwAAAMIPAABA+AEAACD8AAAAEH4AAAAIPwAAAIQfAAAAwg8AAADhBwAAIPwAAAAQfgAAAAg/AAAAhB8AAADCDwAAAOEHAACA8AMAAED4AQAACD8AAACEHwAAAMIPAAAA4QcAAIDwAwAAQPgBAAAg/AAAAIQfAAAAwg8AAADhBwAAgPADAABA+AEAACD8AAAAEH4AAAAIPwAAAOEHAACA8AMAAED4AQAAIPwAAAAQfgAAAAg/AAAAhB8AAIDwAwAAQPgBAAAg/AAAABB+AAAACD8AAACEHwAAAMIPAABA+AEAACD8AAAAEH4AAAAIPwAAAIQfAAAAwg8AAADhBwAAgPADAAAQfgAAAAg/AAAAhB8AAADCDwAAAOEHAACA8AMAAED4AQAACD8AAACEHwAAAMIPAAAA4QcAAIDwAwAAQPgBAAAg/AAAAIQfAAAAwg8AAADhBwAAgPADAABA+AEAACD8AAAAEH4AAAAIPwAAAOEHAACA8AMAAED4AQAAIPwAAAAQfgAAAAg/AAAAhB8AAIDwAwAAQPgBAAAg/AAAABB+AAAACD8AAACEHwAAAMIPAAAA4QcAACD8AAAAEH4AAAAIPwAAAIQfAAAAwg8AAADhBwAAgPADAAAQfgAAAAg/AAAAhB8AAADCDwAAAOEHAACA8AMAAED4AQAACD8AAACEHwAAAMIPAAAA4QcAAIDwAwAAQPgBAAAg/AAAABB+AAAAwg8AAADhBwAAgPADAABA+AEAACD8AAAAEH4AAAAIPwAAAOEHAACA8AMAAED4AQAAIPwAAAAQfgAAAAg/AAAAhB8AAIDwAwAAQPgBAAAg/AAAABB+AAAACD8AAACEHwAAAMIPAAAA4QcAACD8AAAAEH4AAAAIPwAAAIQfAAAAwg8AAADhBwAAgPADAAAQfgAAAAg/AAAAhB8AAADCDwAAAOEHAACA8AMAAED4AQAACD8jAAAAEH4AAAAIPwAAAIQfAAAAwg8AAADhBwAAgPADAABA+AEAAAg/AAAAhB8AAADCDwAAAOEHAACA8AMAAED4AQAAIPwAAACEHwAAAMIPAAAA4QcAAIDwAwAAQPgBAAAg/AAAABB+AAAACD8AAADhBwAAgPADAABA+AEAACD8AAAAEH4AAAAIPwAAAIQfAACA8AMAAED4AQAAIPwAAAAQfgAAAAg/AAAAhB8AAADCDwAAQPgBAAAg/AAAABB+AAAACD8AAACEHwAAAMIPAAAA4QcAAIDwAwAAEH4AAAAIPwAAAIQfAAAAwg8AAADhBwAAgPADAABA+AEAAAg/AAAAhB8AAADCDwAAAOEHAACA8AMAAED4AQAAIPwAAACEHwAAAMIPAAAA4QcAAIDwAwAAQPgBAAAg/AAAABB+AAAACD8AAADhBwAAgPADAABA+AEAACD8AAAAEH4AAAAIPwAAAIQfAACA8AMAAED4AQAAIPwAAAAQfgAAAAg/AAAAhB8AAADCDwAAAOEHAAAg/AAAABB+AAAACD8AAACEHwAAAMIPAAAAAACAHzSbl0mSprVIsuw9d+5P1vpWSdYjezaD9e3EXZ1dkv2TvYfe2vHNu/pO7ZnzyNlLkuvIu9uH33sAAe30rIyaFf0AAAAASUVORK5CYII="/><div class="t m0 x1 h2 y1 ff1 fs0 fc0 sc0 ls0 wsa">Trade Republic Bank GmbH</div><div class="t m0 x1 h2 y2 ff1 fs0 fc0 sc0 ls0 wsa">Brunnenstraße 19-21</div><div class="t m0 x1 h2 y3 ff1 fs0 fc0 sc0 ls0 wsa">10119 Berlin</div><div class="t m0 x2 h2 y1 ff1 fs0 fc0 sc0 ls0">www.traderepublic.com</div><div class="t m0 x2 h2 y2 ff1 fs0 fc0 sc0 ls0">service@traderepublic.com</div><div class="t m0 x3 h2 y1 ff1 fs0 fc0 sc0 ls0 wsa">Sitz der Gesellschaft: Berlin</div><div class="t m0 x3 h2 y2 ff1 fs0 fc0 sc0 ls0 wsa">AG Charlottenburg HRB 244347 B</div><div class="t m0 x3 h2 y3 ff1 fs0 fc0 sc0 ls0 wsa">Umsatzsteuer-ID DE307510626</div><div class="t m0 x4 h2 y1 ff1 fs0 fc0 sc0 ls0">Direktoren</div><div class="t m0 x4 h2 y2 ff1 fs0 fc0 sc0 ls0 wsa">Andreas Torner</div><div class="t m0 x4 h2 y3 ff1 fs0 fc0 sc0 ls0 wsa">Gernot Mittendorfer</div><div class="t m0 x4 h2 y4 ff1 fs0 fc0 sc0 ls0 wsa">Christian Hecker</div><div class="t m0 x4 h2 y5 ff1 fs0 fc0 sc0 ls0 wsa">Thomas Pischke</div><div class="c x5 y6 w2 h3"><div class="t m0 x0 h2 y7 ff1 fs0 fc0 sc0 ls0 wsa">TRADE REPUBLIC BANK GMBH<span class="_ _0"> </span> <span class="_ _1"> </span> <span class="_ _2"></span>BRUNNENSTRASSE 19-21<span class="_ _3"> </span>10119 BERLIN</div><div class="t m0 x6 h4 y8 ff1 fs0 fc0 sc0 ls0 ws0">SEITE<span class="_"> </span><span class="fs1 sc1 wsa v1">1 von 1</span></div><div class="t m0 x6 h5 y9 ff1 fs0 fc0 sc0 ls0 ws1">DATUM<span class="_"> </span><span class="fs1 sc1 v1">${formattedDate}</span></div><div class="t m0 x6 h5 ya ff1 fs0 fc0 sc0 ls0 ws2">AUFTRAG<span class="_"> </span><span class="fs1 sc1 v1">1159-dd4e</span></div><div class="t m0 x6 h5 yb ff1 fs0 fc0 sc0 ls0 ws3">AUSFÜHRUNG<span class="_"> </span><span class="fs1 sc1 v1">655f-86fe</span></div><div class="t m0 x6 h4 yc ff1 fs0 fc0 sc0 ls0 ws4">CRYPTO-WALLET<span class="_"> </span><span class="fs1 sc1 wsa v1">BitGo Deutschland GmbH</span></div><div class="t m0 x6 h5 yd ff1 fs0 fc0 sc0 ls0 ws5">DEPOT<span class="_"> </span><span class="fs1 sc1 v1">0588521101</span></div><div class="t m0 x7 h6 ye ff1 fs2 fc0 sc0 ls0 wsa">CRYPTO BUSINESS BILLING</div><div class="t m0 x0 h7 yf ff1 fs3 fc0 sc0 ls0">OVERVIEW</div><div class="t m0 x0 h8 y10 ff1 fs1 fc0 sc1 ls0 wsa">Markt Order Kauf auf ${formattedDate}, unter 17:41 (Europe/Berlin) im Freiverkehr (Bankhaus Scheich).</div><div class="t m0 x0 h8 y11 ff1 fs1 fc0 sc1 ls0 wsa">Der Kontrahent der Transaktion ist Bankhaus Scheich Wertpapierspezialist AG.</div><div class="t m0 x0 h9 y12 ff1 fs4 fc0 sc0 ls0 ws6">POSITION<span class="_ _4"> </span>QUANTITY<span class="_35"> </span>PRICE<span class="_ _5"> </span>AMOUNT</div><div class="t m0 x0 h8 y13 ff1 fs1 fc0 sc0 ls0 ws7">${CurrentChoosedAsset.coinName}<span class="sc1 wsa"> (${shortSymbol})<span class="_ _6"> </span>${parseFloat(CurrentChoosedAsset.qty).toFixed(6)} Qty.<span class="_ _7"> </span>${formatPrice(PricePerShare)} USD<span class="_ _8"> </span>${formatPrice(Investment)} USD</span></div><div class="t m0 x8 h8 y14 ff1 fs1 fc0 sc0 ls0 wsa">GESAMT<span class="_ _9"> </span>${formatPrice(Investment)} USD</div><div class="t m0 x0 h7 y15 ff1 fs3 fc0 sc0 ls0">BILL</div><div class="t m0 x0 h9 y16 ff1 fs4 fc0 sc0 ls0 ws8">POSITION<span class="_"> </span>BETRAG</div><div class="t m0 x0 h8 y17 ff1 fs1 fc0 sc1 ls0 wsa">Fremdkostenzuschlag<span class="_ _a"> </span>-1,00 USD</div><div class="t m0 x8 h8 y18 ff1 fs1 fc0 sc0 ls0 wsa">GESAMT<span class="_ _b"> </span>-${formatPrice(Investment + 1)} USD</div><div class="t m0 x0 h7 y19 ff1 fs3 fc0 sc0 ls0">BUCHUNG</div><div class="t m0 x0 h9 y1a ff1 fs4 fc0 sc0 ls0 ws9">VERRECHNUNGSKONTO<span class="_ _c"> </span>WERTSTELLUNG<span class="_"> </span>BETRAG</div><div class="t m0 x0 h8 y1b ff1 fs1 fc0 sc1 ls0 wsa">${BankAccountNumber}<span class="_ _d"> </span>${formattedDate}<span class="_ _e"> </span>-${formatPrice(Investment + 1)} USD</div><div class="t m0 x0 h8 y1c ff1 fs1 fc0 sc1 ls0 wsa">Diese Abrechnung wird maschinell erstellt und daher nicht unterschrieben.</div><div class="t m0 x0 h8 y1d ff1 fs1 fc0 sc1 ls0 wsa">Die Cryptowerte werden in einer zentralen Wallet bei dem Cryptoverwahrer BitGo Deutschland GmbH verwahrt.</div><div class="t m0 x9 h8 y1e ff1 fs1 fc0 sc0 ls0 wsa">Elisabeth Bangoura</div><div class="t m0 x9 h8 y1f ff1 fs1 fc0 sc1 ls0 wsa">Henriette-Fürth-Straße 8</div><div class="t m0 x9 h8 y20 ff1 fs1 fc0 sc1 ls0 wsa">60529 Frankfurt am Main</div></div></div><div class="pi" data-data='{"ctm":[1.000000,0.000000,0.000000,1.000000,0.000000,0.000000]}'></div></div>
</div>
<div class="loading-indicator">
<img alt="" src="data:image/png;base64,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"/>
</div>
</body>
</html>
  `;
};

















  // Function to create the PDF
 /* const createPDF = async () => {
    let options = {
      html: createHTMLContent(),
      fileName: 'transaction_receipt2',
      directory: 'Documents',
    };
  
    try {
      const file = await RNHTMLtoPDF.convert(options);
      console.log('PDF Created:', file.filePath);
      setPdfUri(file.filePath);  // Set the URI to the created PDF
      setIsPdfCreated(true);  // Mark PDF as created
    } catch (error) {
      console.error('Error creating PDF:', error);
      console.log('Error', 'Failed to create PDF');
    }
  };
  */

  // Trigger PDF creation on mount
  useEffect(() => {
    createPDF();
  }, []);  // Only run once when the component is mounted

  // Render the PDF using PdfRendererView
  const renderPDF = () => {
    if (!isPdfCreated) {
      return <Text style={{ color: 'white' }}>Generating PDF...</Text>;
    }

    if (!pdfUri) {
      return <Text style={{ color: 'white' }}>No PDF file found.</Text>;
    }

    return (
      <PdfRendererView
      singlePage={true}
        source={`file://${pdfUri}`}  // Ensure the correct file path format
        style={{ height: "100%", width: '100%', backgroundColor: '#F6F5F1',  }}
        distanceBetweenPages={16}
        maxZoom={5}
        onPageChange={(current, total) => {
          console.log(current, total);
        }}
      />
    );
  };



  return (
    <ActionSheet 
    ref={Billing_Sheet} 
    backgroundInteractionEnabled={false}
    gestureEnabled={true}
    isModal={false}
    containerStyle={{
      maxHeight: height(88.5),
      backgroundColor: "#F6F5F1",
      height: height(88.5),
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    }} 
    style={{
      height: "100%",
      backgroundColor: '#fff'
    }}
  >
   {/* ActionSheet header */}
   <View style={{ backgroundColor: '#F6F5F1', height: height(0.6), width: width(11), borderRadius: 50, alignSelf: 'center',   }} />

   <Text style={{ fontSize: size(25), zIndex: 100, color: '#000', marginTop: height(5), marginLeft: width(5), fontWeight: '900' }}>
   Billing
</Text>

<View style={{
 marginTop: height(-8),
  height: "100%",
  width: "100%",
  backgroundColor: "#F6F5F1"
}}>


{renderPDF()}

</View>






<TouchableOpacity style={{
  backgroundColor: '#141414',
  position: 'absolute',
  bottom: height(2),
  right: width(5),
  borderRadius: 15,
  width: size(160),
  height: size(57),
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 5,
  },
  shadowOpacity: 0.34,
  shadowRadius: 6.27,

  elevation: 10,

  alignItems: 'center',
  flexDirection: 'row',
 
}}>
  <Text style={{
    color: '#fff',
    fontWeight: "bold",
    marginLeft: width(5),
    fontSize: size(14),

  }}>
  Share
  </Text>


  <MaterialIcons name='ios-share' style={{
    color: '#fff',
    position: 'absolute',
    right: width(5),
    fontSize: size(18),
  }} />
</TouchableOpacity>
  </ActionSheet>
  );
};






