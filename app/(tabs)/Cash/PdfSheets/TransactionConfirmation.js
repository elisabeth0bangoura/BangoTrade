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
.ws6{word-spacing:0.000000px;}
.ws4{word-spacing:73.826000px;}
.ws2{word-spacing:144.464000px;}
.ws1{word-spacing:339.768000px;}
.ws3{word-spacing:342.560000px;}
.ws0{word-spacing:420.816000px;}
.ws5{word-spacing:690.509000px;}
._2{margin-left:-336.408000px;}
._0{width:30.152000px;}
._3{width:35.888000px;}
._7{width:78.863000px;}
._8{width:139.166000px;}
._4{width:204.845000px;}
._5{width:228.173000px;}
._a{width:234.548000px;}
._9{width:316.367000px;}
._1{width:330.632000px;}
._6{width:442.079000px;}
._c{width:506.879000px;}
._d{width:553.657000px;}
._b{width:777.133000px;}
.fc1{color:rgb(128,128,128);}
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
.y13{bottom:378.030000px;}
.y12{bottom:416.060000px;}
.y11{bottom:431.550000px;}
.y10{bottom:456.180000px;}
.yf{bottom:498.600000px;}
.ye{bottom:514.090000px;}
.yd{bottom:538.720000px;}
.yc{bottom:573.560000px;}
.yb{bottom:611.360000px;}
.y17{bottom:611.960000px;}
.ya{bottom:620.430000px;}
.y16{bottom:621.040000px;}
.y9{bottom:629.510000px;}
.y15{bottom:630.110000px;}
.y8{bottom:638.590000px;}
.y14{bottom:639.000000px;}
.y7{bottom:674.210000px;}
.h8{height:18.149414px;}
.h2{height:20.742188px;}
.h4{height:22.254961px;}
.h5{height:22.294961px;}
.h9{height:23.334961px;}
.h7{height:28.520508px;}
.h6{height:36.298828px;}
.h3{height:731.140000px;}
.h0{height:841.880000px;}
.h1{height:842.500000px;}
.w2{width:499.280000px;}
.w0{width:595.280000px;}
.w1{width:596.000000px;}
.x0{left:0.000000px;}
.x7{left:1.500000px;}
.x1{left:35.250000px;}
.x5{left:48.000000px;}
.x2{left:160.090000px;}
.x3{left:286.350000px;}
.x6{left:351.000000px;}
.x4{left:438.830000px;}
@media print{
.v1{vertical-align:-1.440000pt;}
.v0{vertical-align:0.000000pt;}
.ls0{letter-spacing:0.000000pt;}
.ws6{word-spacing:0.000000pt;}
.ws4{word-spacing:98.434667pt;}
.ws2{word-spacing:192.618667pt;}
.ws1{word-spacing:453.024000pt;}
.ws3{word-spacing:456.746667pt;}
.ws0{word-spacing:561.088000pt;}
.ws5{word-spacing:920.678667pt;}
._2{margin-left:-448.544000pt;}
._0{width:40.202667pt;}
._3{width:47.850667pt;}
._7{width:105.150667pt;}
._8{width:185.554667pt;}
._4{width:273.126667pt;}
._5{width:304.230667pt;}
._a{width:312.730667pt;}
._9{width:421.822667pt;}
._1{width:440.842667pt;}
._6{width:589.438667pt;}
._c{width:675.838667pt;}
._d{width:738.209333pt;}
._b{width:1036.177333pt;}
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
.y13{bottom:504.040000pt;}
.y12{bottom:554.746667pt;}
.y11{bottom:575.400000pt;}
.y10{bottom:608.240000pt;}
.yf{bottom:664.800000pt;}
.ye{bottom:685.453333pt;}
.yd{bottom:718.293333pt;}
.yc{bottom:764.746667pt;}
.yb{bottom:815.146667pt;}
.y17{bottom:815.946667pt;}
.ya{bottom:827.240000pt;}
.y16{bottom:828.053333pt;}
.y9{bottom:839.346667pt;}
.y15{bottom:840.146667pt;}
.y8{bottom:851.453333pt;}
.y14{bottom:852.000000pt;}
.y7{bottom:898.946667pt;}
.h8{height:24.199219pt;}
.h2{height:27.656250pt;}
.h4{height:29.673281pt;}
.h5{height:29.726615pt;}
.h9{height:31.113281pt;}
.h7{height:38.027344pt;}
.h6{height:48.398438pt;}
.h3{height:974.853333pt;}
.h0{height:1122.506667pt;}
.h1{height:1123.333333pt;}
.w2{width:665.706667pt;}
.w0{width:793.706667pt;}
.w1{width:794.666667pt;}
.x0{left:0.000000pt;}
.x7{left:2.000000pt;}
.x1{left:47.000000pt;}
.x5{left:64.000000pt;}
.x2{left:213.453333pt;}
.x3{left:381.800000pt;}
.x6{left:468.000000pt;}
.x4{left:585.106667pt;}
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
<div id="pf1" class="pf w0 h0" data-page-no="1"><div class="pc pc1 w0 h0"><img class="bi x0 y0 w1 h1" alt="" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABKgAAAaVCAIAAACQxGAoAAAACXBIWXMAABYlAAAWJQFJUiTwAAAgAElEQVR42uzda3AV9cH48T1JAIlFCJckRGMIoFiloY1YLKRgHGsb2opgpQRrwdZpZ6pl2k5xkIEpHacDLR1q7UU7joVisVatEBWQ2ygEsBCwlgYv9GIamZbEWIncIck+L37/2f/pSROgfZ55fPDzeZHZs2fPnt3fyZvv7C0Vx3EEAADAuSvLEAAAAAg/AAAAhB8AAADCDwAAAOEHAACA8AMAAED4AQAAIPwAAACEHwAAAMIPAAAA4QcAAIDwAwAAQPgBAAAg/AAAABB+AAAAwg8AAADhBwAAgPADAABA+AEAACD8AAAAEH4AAAAIPwAAAIQfAACA8AMAAED4AQAAIPwAAAAQfgAAAAg/AAAAhB8AAADCDwAAQPgBAAAg/AAAABB+AAAACD8AAACEHwAAAMIPAAAA4QcAACD8AAAAEH4AAAAIPwAAAIQfAAAAwg8AAADhBwAAgPADAABA+AEAAAg/AAAAhB8AAADCDwAAAOEHAACA8AMAAED4AQAAIPwAAACEHwAAAMIPAAAA4QcAAIDwAwAAQPgBAAAg/AAAABB+AAAAwg8AAADhBwAAgPADAABA+AEAACD8AAAAEH4AAAAIPwAAAIQfAACA8AMAAED4AQAAIPwAAAAQfgAAAAg/AAAAhB8AAADCDwAAQPgBAAAg/AAAABB+AAAACD8AAACEHwAAAMIPAAAA4QcAAIDwAwAAEH4AAAAIPwAAAIQfAAAAwg8AAADhBwAAgPADAABA+AEAAAg/AAAAhB8AAADCDwAAAOEHAACA8AMAAED4AQAAIPwAAACEHwAAAMIPAAAA4QcAAIDwAwAAQPgBAAAg/AAAABB+AAAACD8AAADhBwAAgPADAABA+AEAACD8AAAAEH4AAAAIPwAAAIQfAACA8AMAAED4AQAAIPwAAAAQfgAAAAg/AAAAhB8AAADCDwAAQPgBAAAg/AAAABB+AAAACD8AAACEHwAAAMIPAAAA4QcAAIDwAwAAEH4AAAAIPwAAAIQfAAAAwg8AAADhBwAAgPADAABA+AEAAAg/AAAAhB8AAADCDwAAAOEHAACA8AMAAED4AQAAIPwAAAAQfgAAAMIPAAAA4QcAAIDwAwAAQPgBAAAg/AAAABB+AAAACD8AAADhBwAAgPADAABA+AEAACD8AAAAEH4AAAAIPwAAAIQfnIWOjo7a2lrjAADAOSPHEPB/V3t7e2Nj4+HDhy+66KK8vLwz/NSpU6c2bdq0evXq/fv3T506dfLkyeedd14URYcPH16zZs3q1avXr1/f1NTU0dFhhAEAODc44ncau3fv7t+/f15eXv/+/TtPjBo16o033siYn5+ff80116xYsSKO44y1Pf7442HJvLy8kSNHZrw7fPjwZFV5eXnDhg2rrq7esGFD+jLz589PFkjfkmHDhnXe+Dlz5mQsOWzYsFtvvfWVV14JC9TV1XVeVfi7bdu2Bx54IGN+SUnJZz/72R07doSPr1mzJiwwfvz49KxKVtjU1BRF0fvf//6MbS4pKbn99tv/8Y9/JJ8qLCwMCzQ2NmbsxV133TV48OCioqKFCxemf8s999xTWFg4dOjQUaNG9e/ff9y4cTt37uzmp3zrrbeWLl06derU/Pz8iRMn/vjHP66pqZk+fXpJSckdd9xx/fXX5+fnT5s2bfny5WGzAQDgnOGI32m0tbUdPHiwq3f79u3b0dHReYEtW7Zs2bJlw4YNy5YtS5+/cuXK1tbWMN3a2rpnz56ysrLk3dbW1vRVtba2vv7667/+9a+vv/76FStWDBgwIIqiY8eOJWtIl52d3Xnm0aNHM7YtrHPVqlUbNmy4+uqru9m7tra2EydOdP74G2+88cQTTyxatGj27NmnTp0KCxw6dChZJo7jjC185513MuYcPHjw5z//+a5du7Zt23b++eeHOSdPngwfz9iSd955J5TY4cOHw5y//OUvN9xww8svvxxFUSqVCn9feOGFj370owsWLLj77rs7787PfvazO++8s729PZmTfPDNN9+8//77M+YDAIDwew/p3bv3iBEjwvRf//rXY8eOpVKpCy+88H3ve18URRdeeGFSO9nZ2TfffHMURfX19Xv37o3jePny5bfddtuECRPCMqdOnXr66afjOE6lUuFvTU1Nevglq6qsrMzJydm3b19jY2Mcx+vXr7/tttueeuqpZIFUKtWnT5+ioqLkU/369etqF+I4vvzyy8vKyo4ePbpx48ajR48eOXJk3rx5GzduTBbo1atXaWlpxo4n08XFxddee21HR8fu3btffvnljo6OefPmfeELX+jmG0M+JRUX5lRXV1988cXNzc2/+MUvOjo69uzZs2zZsjvuuCP9g92vMExPnTp17969YU5ZWVlJScnOnTubmppOnTo1d+7cyy+/fNKkSRlrOHDgQKi+9G1LfojO8/3nAwAg/N5DysrKkhMjx40bt3379iiK7r///k996lNJDf6/oczJ+dWvfhUCr7y8vL6+PoqiZ599Ngm/7du3HzlyJIqisWPHbtu2LYqitWvXzp8/v/OXrlixYvDgwR0dHXfffff3vve9KIqeeeaZzZs3J6uKomjixInh687EjTfe+J3vfCdsT1VVVdiY9GvYhgwZkuxm4oUXXggT5eXlS5cujaLo5MmTI0eO/OMf/3jq1KmwC2flS1/6UtiFQYMGhf3605/+dLYr2bBhw4svvhim77333lmzZkVRdOLEiZtuumnNmjVRFP30pz/tHH4AAPBe5hq//349evQYPXp0mH777beT+evXrw8T1dXVQ4YMiaKorq7urbfe6vK3ycpatGhRRUVFePnggw/+59uWbNjx48fDqZVnpWfPnuXl5Z137Wwlxyovuuiis/3s008/HSauuuqqUH1RFPXq1WvRokVhesuWLW1tbf/hQCXHcgEA4BzgiN/Z6eokwPT5Bw4c2Lp1a5gTAi+oqakJS1533XWNjY2LFy9ub29fvnz517/+9a5WlUql5syZ8+lPfzqKouTMzLDAn//85/QUnDRpUn5+/mm3beXKleHlwIEDw60swwIHDx5MX9sHP/jBq666qvOqWltb6+rqwhoGDBiQfsncv/zGjIlnn322oaHhzTff/P73vx9F0WWXXXb77bef7fDW1dWFOdOmTUtfZuTIkdu3bw8ni3Z1ymj4YF5e3oQJEyoqKgoKCtatW7d69eq33347nMF7zTXXVFRUjB079gMf+ID/dgAAhN97VFcXgMVxfPLkyaKiojiOW1pa2tvb4zjOzc2dOXNmWOD3v/99uBnJ8OHDR4wYMX369MWLF0dR9OCDD2aEX0a0jBo1KkyEa9iSbairq9u1a1fycuTIkV2FXxzH991339KlS8ONYcLyU6ZMSV+gubn5y1/+cnLZ29y5c9PDb+vWrZWVlW1tbXv37j148GAcx3379q2srExatKtRyrjGb9GiRenX0c2dO7dv377d7Pu/HPYDBw6EOZdeemnGYldffXVXP1xeXt4VV1wxZcqUT37yk1deeWV2dnZ9fX1jY+NDDz3U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AAAg/AAAABB+AAAACD8AAACEHwAAAMIPAABA+BkCAAAA4QcAAIDwAwAAQPgBAAAg/AAAABB+AAAACD8AAACEHwAAgPADAABA+AEAACD8AAAAEH4AAAAIPwAAAIQfAAAAwg8AAED4AQAAIPwAAAAQfgAAAAg/AAAAhB8AAADCDwAAAOEHAACA8AMAABB+AAAACD8AAACEHwAAAMIPAAAA4QcAAIDwAwAAQPgBAAAIPwAAAIQfAAAAwg8AAADhBwAAgPADAABA+AEAACD8AAAAhB8AAADCDwAAAOEHAACA8AMAAED4AQAAIPwAAAAQfgAAAAg/AAAA4QcAAIDwAwAAQPgBAAAg/AAAABB+AAAACD8AAACEHwAAgPADAABA+AEAACD8AAAAEH4AAAAIPwAAAIQfAAAAwg8AAED4AQAAIPwAAAAQfgAAAAg/AAAAhB8AAADCDwAAAOEHAACA8AMAABB+AAAACD8AAACEHwAAAMIPAAAA4QcAAIDwAwAAQPgBAAAIPwAAAIQfAAAAwg8AAADhBwAAgPADAABA+AEAACD8AAAAEH4AAADCDwAAAOEHAACA8AMAAED4AQAAIPwAAAAQfgAAAAg/AAAA4QcAAIDwAwAAQPgBAAAg/AAAABB+AAAACD8AAACEHwAAgPADAABA+AEAACD8AAAAEH4AAAAIPwAAAIQfAAAAwg8AAADhBwAAIPwAAAAQfgAAAAg/AAAAhB8AAADCDwAAAOEHAACA8AMAABB+AAAACD8AAACEHwAAAMIPAAAA4QcAAIDwAwAAQPgBAAAIPwAAAIQfAAAAwg8AAADhBwAAgPADAABA+AEAACD8AAAAEH4AAADCDwAAAOEHAACA8AMAAED4AQAAIPwAAAAQfgAAAAg/AAAA4QcAAIDwAwAAQPgBAAAg/AAAABB+AAAACD8AAACEHwAAAMIPAABA+AEAACD8AAAAEH4AAAAIPwAAAIQfAAAAwg8AAADhBwAAIPwAAAAQfgAAAAg/AAAAhB8AAADCDwAAAOEHAACA8AMAABB+AAAACD8AAACEHwAAAMIPAAAA4QcAAIDwAwAAQPgBAAAg/AAAAIQfAAAAwg8AAADhBwAAgPADAABA+AEAACD8AAAAEH4AAADCDwAAAOEHAACA8AMAAED4AQAAIPwAAAAQfgAAAAg/AAAA4QcAAIDwAwAAQPgBAAAg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AwAAQPgBAAAg/AAAABB+AAAACD8AAADhBwAAgPADAABA+AEAACD8AAAAEH4AAAAIPwAAAIQfAAAAwg8AAED4AQAAIPwAAAAQfgAAAAg/AAAAhB8AAADCDwAAAOEHAAAg/AAAABB+AAAACD8AAACEHwAAAMIPAAAA4QcAAIDwAwAAEH4AAAAIPwAAAIQfAAAAwg8AAADhBwAAgPADAABA+AEAACD8AAAAhB8AAADCDwAAAOEHAACA8AMAAED4AQAAIPwAAAAQfgAAAMIPAAAA4QcAAIDwAwAAQPgBAAAg/AAAABB+AAAACD8AAADhZwgAAACEHwAAAMIPAAAA4QcAAIDwAwAAQPgBAAAg/AAAABB+AAAAwg8AAADhBwAAgPADAABA+AEAACD8AAAAEH4AAAAIPwAAAOEHAACA8AMAAED4AQAAIPwAAAAQfgAAAAg/AAAAhB8AAADCDwAAQPgBAAAg/AAAABB+AAAACD8AAACEHwAAAMIPAAAA4QcAACD8AAAAEH4AAAAIPwAAAIQfAAAAwg8AAADhBwAAgPADAAAQfgAAAAg/AAAAhB8AAADCDwAAAOEHAACA8AMAAED4AQAAIPwAAACEHwAAAMIPAAAA4QcAAIDwAwAAQPgBAAAg/AAAABB+AAAAwg8AAADhBwAAgPADAABA+AEAACD8AAAAEH4AAAAIPwAAAOEHAACA8AMAAED4AQAAIPwAAAAQfgAAAAg/AAAAhB8AAADCDwAAQPgBAAAg/AAAABB+AAAACD8AAACEHwAAAMIPAAAA4QcAACD8AAAAEH4AAAAIPwAAAIQfAAAAwg8AAADhBwAAgPADAABA+AEAAAg/AAAAhB8AAADCDwAAAOEHAACA8AMAAED4AQAAIPwAAACEHwAAAMIPAAAA4QcAAIDwAwAAQPgBAAAg/AAAABB+AAAAwg8AAADhBwAAgPADAABA+AEAACD8AAAAEH4AAAAIPwAAAIQfAACA8AMAAED4AQAAIPwAAAAQfgAAAAg/AAAAhB8AAADCDwAAQPgBAAAg/AAAABB+AAAACD8AAACEHwAAAMIPAAAA4QcAACD8AAAAEH4AAAAIPwAAAIQfAAAAwg8AAADhBwAAgPADAABA+AEAAAg/AAAAhB8AAADCDwAAAOEHAACA8AMAAED4AQAAIPwAAACEHwAAAMIPAAAA4QcAAIDwAwAAQPgBAAAg/AAAABB+AAAACD8AAADhBwAAgPADAABA+AEAACD8AAAAEH4AAAAIPwAAAIQfAACA8AMAAED4AQAAIPwAAAAQfgAAAAg/AAAAhB8AAADCDwAAQPgBAAAg/AAAABB+AAAACD8AAACEHwAAAMIPAAAA4QcAAIDwAwAAEH4AAAAIPwAAAIQfAAAAwg8AAADhBwAAgPADAJ4B8W4AAA2+SURBVABA+AEAAAg/AAAAhB8AAADCDwAAAOEHAACA8AMAAED4AQAAIPwAAACEHwAAAMIPAAAA4QcAAIDwAwAAQPgBAAAg/AAAABB+AAAACD8AAADhBwAAgPADAABA+AEAACD8AAAAEH4AAAAIPwDgv9qvkxQGgSiKog9xAVmCW4lpJd2ms69kolAEC3Wcc2aW1cCfXQAQfgAAAMIPAAAA4QcAAIDwAwAAQPgBAAAg/AAAABB+AAAACD8AAACEHwAAgPADAABA+AEAACD8AAAAEH4AAAAIPwAAAIQfAAAAwg8AAED4AQAAIPwAAAAQfgAAAAg/AAAAhB8AAADCDwAAAOEHAAAg/AAAABB+AAAACD8AAACEHwAAAMIPAAAA4QcAAIDwAwAAQPgBAAAIPwAAAIQfAAAAwg8AAADhBwAAgPADAABA+AEAACD8AAAAhB8AAADCDwAAAOEHAACA8AMAAED4AQAAIPwAAAAQfgAAAMIPAAAA4QcAAIDwAwAAQPgBAAAg/AAAABB+AAAACD8AAACEHwAAgPADAABA+AEAACD8AAAAEH4AAAAIPwAAAIQfAAAAwg8AAED4AQAAIPwAAAAQfgAAAAg/AAAAhB8AAADCDwAAAOEHAAAg/IwAAABA+AEAACD8AAAAEH4AAAAIPwAAAIQfAAAAwg8AAADhBwAAIPwAAAAQfgAAAAg/AAAAhB8AAADCDwAAAOEHAACA8AMAABB+AAAACD8AAACEHwAAAMIPAAAA4QcAAIDwAwAAQPgBAAAg/AAAAIQfAAAAwg8AAADhBwAAgPADAABA+AEAACD8AAAAEH4AAADCDwAAAOEHAACA8AMAAED4AQAAIPwAAAAQfgAAAAg/AAAA4QcAAIDwAwAAQPgBAAAg/AAAABB+AAAACD8AAACEHwAAAMIPAABA+AEAACD8AAAAEH4AAAAIPwAAAIQfAAAAwg8AAADhBwAAIPwAAAAQfgAAAAg/AAAAhB8AAADCDwAAAOEHAACA8AMAABB+AAAACD8AAACEHwAAAMIPAAAA4QcAAIDwAwAAQPgBAAAg/AAAAIQfAAAAwg8AAADhBwAAgPADAABA+AEAACD8AAAAEH4AAADCDwAAAOEHAACA8AMAAED4AQAAIPwAAAAQfgAAAAg/AAAAhB8AAIDwAwAAQPgBAAAg/AAAABB+AAAACD8AAACEHwAAAMIPAABA+AEAACD8AAAAEH4AAAAIPwAAAIQfAAAAwg8AAADhBwAAIPwAAAAQfgAAAAg/AAAAhB8AAADCDwAAAOEHAACA8AMAAED4AQAACD8AAACEHwAAAMIPAAAA4QcAAIDwAwAAQPgBAAAg/AAAAIQfAAAAwg8AAADhBwAAgPADAABA+AEAACD8AAAAEH4AAADCDwAAAOEHAACA8AMAAED4AQAAIPwAAAAQfgAAAAg/AAAAhB8AAIDwAwAAQPgBAAAg/AAAABB+AAAACD8AAACEHwAAAMIPAABA+AEAACD8AAAAEH4AAAAIPwAAAIQfAAAAwg8AAADhBwAAgPADAAAQfgAAAAg/AAAAhB8AAADCDwAAAOEHAACA8AMAAED4AQAACD8AAACEHwAAAMIPAAAA4QcAAIDwAwAAQPgBAAAg/AAAAIQfAAAAwg8AAADhBwAAgPADAABA+AEAACD8AAAAEH4AAAAIPwAAAOEHAACA8AMAAED4AQAAIPwAAAAQfgAAAAg/AAAAhB8AAIDwAwAAQPgBAAAg/AAAABB+AAAACD8AAACEHwAAAMIPAABA+AEAACD8AAAAEH4AAAAIPwAAAIQfAAAAwg8AAADhBwAAgPADAAAQfgAAAAg/AAAAhB8AAADCDwAAAOEHAACA8AMAAED4AQAACD8AAACEHwAAAMIPAAAA4QcAAIDwAwAAQPgBAAAg/AAAABB+AAAAwg8AAADhBwAAgPADAABA+AEAACD8AAAAEH4AAAAIPwAAAOEHAACA8AMAAED4AQAAIPwAAAAQfgAAAAg/AAAAhB8AAIDwAwAAQPgBAAAg/AAAABB+AAAACD8AAACEHwAAAMIPAAAA4QcAACD8AAAAEH4AAAAIPwAAAIQfAAAAwg8AAADhBwAAgPADAAAQfgAAAAg/AAAAhB8AAADCDwAAAOEHAACA8AMAAED4AQAACD8AAACEHwAAAMIPAAAA4QcAAIDwAwAAQPgBAAAg/AAAABB+AAAAwg8AAADhBwAAgPADAABA+AEAACD8AAAAEH4AAAAIPwAAAOEHAACA8AMAAED4AQAAIPwAAAAQfgAAAAg/AAAAhB8AAIDwMwIAAADhBwAAgPADAABA+AEAACD8AAAAEH4AAAAIPwAAAIQfAACA8AMAAED4AQAAIPwAAAAQfgAAAAg/AAAAhB8AAADCDwAAQPgBAAAg/AAAABB+AAAACD8AAACEHwAAAMIPAAAA4QcAAIDwAwAAEH4AAAAIPwAAAIQfAAAAwg8AAADhBwAAgPADAABA+AEAAAg/AAAAhB8AAADCDwAAAOEHAACA8AMAAED4AQAAIPwAAACEHwAAAMIPAAAA4QcAAIDwAwAAQPgBAAAg/AAAABB+AAAACD8AAADhBwAAgPADAABA+AEAACD8AAAAEH4AAAAIPwAAAIQfAACA8AMAAED4AQAAIPwAAAAQfgAAAAg/AAAAhB8AAADCDwAAQPgBAAAg/AAAABB+AAAACD8AAACEHwAAAMIPAAAA4QcAAIDwAwAAEH4AAAAIPwAAAIQfAAAAwg8AAADhBwAAgPADAABA+AEAAAg/AAAAhB8AAADCDwAAAOEHAACA8AMAAED4AQAAIPwAAAAQfgAAAMIPAAAA4QcAAIDwAwAAQPgBAAAg/AAAABB+AAAACD8AAADhBwAAgPADAABA+AEAACD8AAAAEH4AAAAIPwAAAIQfAACA8AMAAED4AQAAIPwAAAAQfgAAAAg/AAAAhB8AAADCDwAAAOEHAAAg/AAAABB+AAAACD8AAACEHwAAAMIPAAAA4QcAAIDwAwAAEH4AAAAIPwAAAIQfAAAAwg8AAADhBwAAgPADAABA+AEAAAg/AAAAhB8AAADCDwAAAOEHAACA8AMAAED4AQAAIPwAAAAQfgAAAMIPAAAA4QcAAIDwAwAAQPgBAAAg/AAAABB+AAAACD8AAADhBwAAgPADAABA+AEAACD8AAAAEH4AAAAIPwAAAIQfAAAAwg8AAED4AQAAIPwAAAAQfgAAAAg/AAAAhB8AAADCDwAAAOEHAAAg/AAAABB+AAAACD8AAACEHwAAAMIPAAAA4QcAAIDwAwAAEH4AAAAIPwAAAIQfAAAAwg8AAADhBwAAgPADAABA+AEAACD8AAAAhB8AAADCDwAAAOEHAACA8AMAAED4AQAAIPwAAAAQfgAAAMIPAAAA4QcAAIDwAwAAQPgBAAAg/AAAABB+AAAACD8AAADhBwAAgPADAABA+AEAACD8AAAAEH4AAAAIPwAAAIQfAAAAwg8AAED4AQAAIPwAAAAQfgAAAAg/AAAAhB8AAADCDwAAAOEHAAAg/AAAABB+AAAACD8AAACEHwAAAMIPAAAA4QcAAIDwAwAAQPgBAAAIPwAAAIQfAAAAwg8AAADhBwAAgPADAABA+AEAACD8AAAAhB8AAADCDwAAAOEHAACA8AMAAED4AQAAIPwAAAAQfgAAAMIPAAAA4QcAAIDwAwAAQPgBAAAg/AAAABB+AAAACD8AAACEHwAAgPADAABA+AEAACD8AAAAEH4AAAAIPwAAAIQfAAAAwg8AAED4AQAAIPwAAAAQfgAAAAg/AAAAhB8AAADCDwAAAOEHAAAg/AAAABB+AAAACD8AAACEHwAAAMIPAAAA4QcAAIDwAwAAQPgBAAAIPwAAAIQfAAAAwg8AAADhBwAAgPADAABA+AEAACD8AAAAhB8AAADCDwAAAOEHAACA8AMAAED4AQAAIPwAAAAQfgAAAMLPCAAAAIQfAAAAwg8AAADhBwAAgPADAABA+AEAACD8AAAAEH4AAADCDwAAAOEHAACA8AMAAED4AQAAIPwAAAAQfgAAAAg/AAAA4QcAAIDwAwAAQPgBAAAg/AAAABB+AAAACD8AAACEHwAAAMIPAABA+AEAACD8AAAAEH4AAAAIPwAAAIQfAAAAwg8AAADhBwAAIPwAAAAQfgAAAAg/AAAAhB8AAADCDwAAAOEHAACA8AMAABB+AAAACD8AAACEHwAAAMIPAAAA4QcAAIDwAwAAQPgBAAAg/AAAAIQfAAAAwg8AAADhBwAAgPADAABA+AEAACD8AAAAEH4AAADCDwAAAOEHAACA8AMAAED4AQAAIPwAAAAQfgAAAAg/AAAA4QcAAIDwAwAAQPgBAAAg/AAAABB+AAAACD8AAACEHwAAAMIPAABA+AEAACD8AAAAEH4AAAAIPwAAAIQfAAAAwg8AAADhBwAAIPwAAAAQfgAAAAg/AAAAhB8AAADCDwAAAOEHAACA8AMAAED4AQAACD8AAACEHwAAAMIPAAAA4QcAAIDwAwAAQPgBAAAg/AAAAIQfAAAAwg8AAADhBwAAgPADAABA+AEAACD8AAAAEH4AAADCDwAAAOEHAACA8AMAAED4AQAAAAAA8G+aXZsk+Yy6JPvie/KeWSv1SQ6VPcef9dPCXZNzksvM3muxNqy8q3Qbz9wrZx9JnpV/r43vfQFRO+6uQwt3agAAAABJRU5ErkJggg=="/><div class="t m0 x1 h2 y1 ff1 fs0 fc0 sc0 ls0 ws6">Trade Republic Bank GmbH</div><div class="t m0 x1 h2 y2 ff1 fs0 fc0 sc0 ls0 ws6">Brunnenstraße 19-21</div><div class="t m0 x1 h2 y3 ff1 fs0 fc0 sc0 ls0 ws6">10119 Berlin</div><div class="t m0 x2 h2 y1 ff1 fs0 fc0 sc0 ls0">www.traderepublic.com</div><div class="t m0 x2 h2 y2 ff1 fs0 fc0 sc0 ls0">service@traderepublic.com</div><div class="t m0 x3 h2 y1 ff1 fs0 fc0 sc0 ls0 ws6">Sitz der Gesellschaft: Berlin</div><div class="t m0 x3 h2 y2 ff1 fs0 fc0 sc0 ls0 ws6">AG Charlottenburg HRB 244347 B</div><div class="t m0 x3 h2 y3 ff1 fs0 fc0 sc0 ls0 ws6">Umsatzsteuer-ID DE307510626</div><div class="t m0 x4 h2 y1 ff1 fs0 fc0 sc0 ls0">Direktoren</div><div class="t m0 x4 h2 y2 ff1 fs0 fc0 sc0 ls0 ws6">Andreas Torner</div><div class="t m0 x4 h2 y3 ff1 fs0 fc0 sc0 ls0 ws6">Gernot Mittendorfer</div><div class="t m0 x4 h2 y4 ff1 fs0 fc0 sc0 ls0 ws6">Christian Hecker</div><div class="t m0 x4 h2 y5 ff1 fs0 fc0 sc0 ls0 ws6">Thomas Pischke</div><div class="c x5 y6 w2 h3"><div class="t m0 x0 h2 y7 ff1 fs0 fc0 sc0 ls0 ws6">TRADE REPUBLIC BANK GMBH<span class="_ _0"> </span> <span class="_ _1"> </span> <span class="_ _2"></span>BRUNNENSTRASSE 19-21<span class="_ _3"> </span>10119 BERLIN</div><div class="t m0 x6 h4 y8 ff1 fs0 fc0 sc0 ls0 ws0">SEITE<span class="_"> </span><span class="fs1 sc1 ws6 v1">1 von 1</span></div><div class="t m0 x6 h5 y9 ff1 fs0 fc0 sc0 ls0 ws1">DATUM<span class="_"> </span><span class="fs1 sc1 v1">10.02.2025</span></div><div class="t m0 x6 h5 ya ff1 fs0 fc0 sc0 ls0 ws2">IBAN<span class="_"> </span><span class="fs1 sc1 v1">DE34100123450588521101</span></div><div class="t m0 x6 h5 yb ff1 fs0 fc0 sc0 ls0 ws3">BIC<span class="_"> </span><span class="fs1 sc1 v1">TRBKDEBBXXX</span></div><div class="t m0 x0 h6 yc ff1 fs2 fc0 sc0 ls0">ÜBERWEISUNGSBESTÄTIGUNG</div><div class="t m0 x0 h7 yd ff1 fs3 fc0 sc0 ls0">ÜBERWEISUNGSDETAILS</div><div class="t m0 x0 h8 ye ff1 fs4 fc0 sc0 ls0 ws4">BETRAG<span class="_"> </span>STATUS<span class="_ _4"> </span>ÜBERWEISUNGSDATUM<span class="_ _5"> </span>TYP<span class="_ _6"> </span>REFERENZ</div><div class="t m0 x0 h9 yf ff1 fs1 fc0 sc1 ls0 ws6">2,00€<span class="_ _7"> </span>Ausgeführt<span class="_ _8"> </span>10.02.2025<span class="_ _9"> </span>SEPA Überweisung<span class="_ _a"> </span>ELISABETH BANGOURA</div><div class="t m0 x0 h7 y10 ff1 fs3 fc0 sc0 ls0 ws6">ANGABEN ZUM SENDER</div><div class="t m0 x0 h8 y11 ff1 fs4 fc0 sc0 ls0 ws5">NAME<span class="_"> </span>IBAN<span class="_ _b"> </span>BIC</div><div class="t m0 x0 h9 y12 ff1 fs1 fc0 sc1 ls0 ws6">Elisabeth Bangoura<span class="_ _c"> </span>BE82967202061268<span class="_ _d"> </span>TRWIBEB1</div><div class="t m0 x0 h9 y13 ff1 fs1 fc1 sc1 ls0 ws6">Bitte beachte, dass dieses Dokument lediglich eine Bestätigung deiner Transaktionsanfrage darstellt und keinen Nachweis für die Ausführung darstellt.</div><div class="t m0 x7 h2 y14 ff1 fs0 fc0 sc0 ls0 ws6">ELISABETH BANGOURA</div><div class="t m0 x7 h9 y15 ff1 fs1 fc0 sc1 ls0 ws6">Henriette-Fürth-Straße 8</div><div class="t m0 x7 h9 y16 ff1 fs1 fc0 sc1 ls0">60529</div><div class="t m0 x7 h9 y17 ff1 fs1 fc0 sc1 ls0 ws6">Frankfurt am Main</div></div></div><div class="pi" data-data='{"ctm":[1.000000,0.000000,0.000000,1.000000,0.000000,0.000000]}'></div></div>
</div>
<div class="loading-indicator">
<img alt="" src="data:image/png;base64,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"/>
</div>
</body>
</html>

  `;
};







export default TransactionConfirmation = () => {
  const [pdfUri, setPdfUri] = useState(null);
  const [isPdfCreated, setIsPdfCreated] = useState(false);
  const TransactionConfirmation_Sheet = useRef(null); // ✅ Correct ref type

  // Function to create the PDF
/*  const createPDF = async () => {
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
    ref={TransactionConfirmation_Sheet} 
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
Transaction confirmation

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
