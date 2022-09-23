!function(e){function n(){return window.MutationObserver||window.WebKitMutationObserver||window.MozMutationObserver}function i(e,n,i){e.addEventListener(n,i,!1)}function t(e,n,i){e.removeEventListener(n,i,!1)}function o(e){return W+"["+(e="Host page: "+(n=e),e=window.top!==window.self?window.parentIFrame&&window.parentIFrame.getId?window.parentIFrame.getId()+": "+n:"Nested host page: "+n:e)+"]"
var n}function r(e){return P[e]?P[e].log:T}function a(e,n){c("log",e,n,r(e))}function s(e,n){c("info",e,n,r(e))}function d(e,n){c("warn",e,n,!0)}function c(e,n,i,t){!0===t&&"object"==typeof window.console&&console[e](o(n),i)}function u(e){function n(){o("Height"),o("Width"),y(function(){b(H),h(j),F("onResized",H)},H,"init")}function o(e){var n=Number(P[j]["max"+e]),i=Number(P[j]["min"+e]),t=e.toLowerCase(),e=Number(H[t])
a(j,"Checking "+t+" is in range "+i+"-"+n),e<i&&(e=i,a(j,"Set "+t+" to min value")),n<e&&(e=n,a(j,"Set "+t+" to max value")),H[t]=""+e}function r(e){return E.substr(E.indexOf(":")+N+e)}function c(e,n){var i,t,o
i=function(){var i,t
v("Send Page Info","pageInfo:"+(i=document.body.getBoundingClientRect(),t=H.iframe.getBoundingClientRect(),JSON.stringify({iframeHeight:t.height,iframeWidth:t.width,clientHeight:Math.max(document.documentElement.clientHeight,window.innerHeight||0),clientWidth:Math.max(document.documentElement.clientWidth,window.innerWidth||0),offsetTop:parseInt(t.top-i.top,10),offsetLeft:parseInt(t.left-i.left,10),scrollTop:window.pageYOffset,scrollLeft:window.pageXOffset,documentHeight:document.documentElement.clientHeight,documentWidth:document.documentElement.clientWidth,windowHeight:window.innerHeight,windowWidth:window.innerWidth})),e,n)},t=32,B[o=n]||(B[o]=setTimeout(function(){B[o]=null,i()},t))}function u(e){return e=e.getBoundingClientRect(),g(j),{x:Math.floor(Number(e.left)+Number(S.x)),y:Math.floor(Number(e.top)+Number(S.y))}}function l(e){var n=e?u(H.iframe):{x:0,y:0},i={x:Number(H.width)+n.x,y:Number(H.height)+n.y}
a(j,"Reposition requested from iFrame (offset x:"+n.x+" y:"+n.y+")"),window.top!==window.self?window.parentIFrame?window.parentIFrame["scrollTo"+(e?"Offset":"")](i.x,i.y):d(j,"Unable to scroll to requested position, window.parentIFrame not found"):(S=i,M(),a(j,"--"))}function M(){!1!==F("onScroll",S)?h(j):p()}function I(e){var n,i=e.split("#")[1]||"",e=decodeURIComponent(i),t=document.getElementById(e)||document.getElementsByName(e)[0]
t?(n=u(t),a(j,"Moving to in page link (#"+i+") at x: "+n.x+" y: "+n.y),S={x:n.x,y:n.y},M(),a(j,"--")):window.top!==window.self?window.parentIFrame?window.parentIFrame.moveToAnchor(i):a(j,"In page link #"+i+" not found and window.parentIFrame not found"):a(j,"In page link #"+i+" not found")}function k(e){var n,i={}
i=0===Number(H.width)&&0===Number(H.height)?{x:(n=r(9).split(":"))[1],y:n[0]}:{x:H.width,y:H.height},F(e,{iframe:H.iframe,screenX:Number(i.x),screenY:Number(i.y),type:H.type})}function F(e,n){return f(j,e,n)}var z,O,R,T,E=e.data,H={},j=null
"[iFrameResizerChild]Ready"===E?function(){for(var e in P)v("iFrame requested init",x(e),P[e].iframe,e)}():W===(""+E).substr(0,C)&&E.substr(C).split(":")[0]in P?(H=function(){var e=E.substr(C).split(":"),n=e[1]?parseInt(e[1],10):0,i=P[e[0]]&&P[e[0]].iframe,t=getComputedStyle(i)
return{iframe:i,id:e[0],height:n+function(e){if("border-box"!==e.boxSizing)return 0
var n=e.paddingTop?parseInt(e.paddingTop,10):0,e=e.paddingBottom?parseInt(e.paddingBottom,10):0
return n+e}(t)+function(e){if("border-box"!==e.boxSizing)return 0
var n=e.borderTopWidth?parseInt(e.borderTopWidth,10):0,e=e.borderBottomWidth?parseInt(e.borderBottomWidth,10):0
return n+e}(t),width:e[2],type:e[3]}}(),j=H.id,P[j]&&(P[j].loaded=!0),(T=H.type in{true:1,false:1,undefined:1})&&a(j,"Ignoring init message from meta parent page"),!T&&(R=!0,P[O=j]||(R=!1,d(H.type+" No settings for "+O+". Message was: "+E)),R)&&(a(j,"Received: "+E),z=!0,null===H.iframe&&(d(j,"IFrame ("+H.id+") not found"),z=!1),z&&function(){var n=e.origin,i=P[j]&&P[j].checkOrigin
if(i&&""+n!="null"&&!function(){return i.constructor===Array?function(){var e=0,t=!1
for(a(j,"Checking connection is from allowed list of origins: "+i);e<i.length;e++)if(i[e]===n){t=!0
break}return t}():(e=P[j]&&P[j].remoteHost,a(j,"Checking connection is from: "+e),n===e)
var e}())throw new Error("Unexpected message received from: "+n+" for "+H.iframe.id+". Message was: "+e.data+". This error can be disabled by setting the checkOrigin: false option or by providing of array of trusted domains.")
return 1}()&&function(){function e(e,n){function i(){P[s]?c(P[s].iframe,s):o()}["scroll","resize"].forEach(function(t){a(s,e+t+" listener for sendPageInfo"),n(window,t,i)})}function o(){e("Remove ",t)}switch(P[j]&&P[j].firstRun&&P[j]&&(P[j].firstRun=!1),H.type){case"close":m(H.iframe)
break
case"message":u=r(6),a(j,"onMessage passed: {iframe: "+H.iframe.id+", message: "+u+"}"),F("onMessage",{iframe:H.iframe,message:JSON.parse(u)}),a(j,"--")
break
case"mouseenter":k("onMouseEnter")
break
case"mouseleave":k("onMouseLeave")
break
case"autoResize":P[j].autoResize=JSON.parse(r(9))
break
case"scrollTo":l(!1)
break
case"scrollToOffset":l(!0)
break
case"pageInfo":c(P[j]&&P[j].iframe,j),s=j,e("Add ",i),P[s]&&(P[s].stopPageInfo=o)
break
case"pageInfoStop":P[j]&&P[j].stopPageInfo&&(P[j].stopPageInfo(),delete P[j].stopPageInfo)
break
case"inPageLink":I(r(9))
break
case"reset":w(H)
break
case"init":n(),F("onInit",H.iframe)
break
default:0===Number(H.width)&&0===Number(H.height)?d("Unsupported message received ("+H.type+"), this is likely due to the iframe containing a later version of iframe-resizer than the parent page"):n()}var s,u}())):s(j,"Ignored: "+E)}function f(e,n,i){var t=null,o=null
if(P[e]){if("function"!=typeof(t=P[e][n]))throw new TypeError(n+" on iFrame["+e+"] is not a function")
o=t(i)}return o}function l(e){e=e.id,delete P[e]}function m(e){var n=e.id
if(!1!==f(n,"onClose",n)){a(n,"Removing iFrame: "+n)
try{e.parentNode&&e.parentNode.removeChild(e)}catch(e){d(e)}f(n,"onClosed",n),a(n,"--"),l(e)}else a(n,"Close iframe cancelled by onClose event")}function g(n){null===S&&a(n,"Get page position: "+(S={x:window.pageXOffset!==e?window.pageXOffset:document.documentElement.scrollLeft,y:window.pageYOffset!==e?window.pageYOffset:document.documentElement.scrollTop}).x+","+S.y)}function h(e){null!==S&&(window.scrollTo(S.x,S.y),a(e,"Set page position: "+S.x+","+S.y),p())}function p(){S=null}function w(e){a(e.id,"Size reset requested by "+("init"===e.type?"host page":"iFrame")),g(e.id),y(function(){b(e),v("reset","reset",e.iframe,e.id)},e,"reset")}function b(e){function i(i){function t(){Object.keys(P).forEach(function(e){function n(e){return"0px"===(P[i]&&P[i].iframe.style[e])}var i
P[i=e]&&null!==P[i].iframe.offsetParent&&(n("height")||n("width"))&&v("Visibility change","resize",P[i].iframe,i)})}function r(e){a("window","Mutation observed: "+e[0].target+" "+e[0].type),I(t,16)}var s
E||"0"!==e[i]||(E=!0,a(o,"Hidden iFrame detected, creating visibility listener"),(s=n())&&function(){var e=document.querySelector("body")
new s(r).observe(e,{attributes:!0,attributeOldValue:!1,characterData:!0,characterDataOldValue:!1,childList:!0,subtree:!0})}())}function t(n){var t
t=n,e.id?(e.iframe.style[t]=e[t]+"px",a(e.id,"IFrame ("+o+") "+t+" set to "+e[t]+"px")):a("undefined","messageData id not set"),i(n)}var o=e.iframe.id
P[o]&&(P[o].sizeHeight&&t("height"),P[o].sizeWidth&&t("width"))}function y(e,n,i){i!==n.type&&H&&!window.jasmine?(a(n.id,"Requesting animation frame"),H(e)):e()}function v(e,n,i,t,o){var r=!1
t=t||i.id,P[t]&&(function(){var o
i&&"contentWindow"in i&&null!==i.contentWindow?(o=P[t]&&P[t].targetOrigin,a(t,"["+e+"] Sending msg to iframe["+t+"] ("+n+") targetOrigin: "+o),i.contentWindow.postMessage(W+n,o)):d(t,"["+e+"] IFrame("+t+") not found")}(),function(){o&&P[t]&&P[t].warningTimeout&&(P[t].msgTimeout=setTimeout(function(){!P[t]||P[t].loaded||r||(r=!0,d(t,"IFrame has not responded within "+P[t].warningTimeout/1e3+" seconds. Check iFrameResizer.contentWindow.js has been loaded in iFrame. This message can be ignored if everything is working, or you can set the warningTimeout option to a higher value or zero to suppress this warning."))},P[t].warningTimeout))}())}function x(e){return e+":"+P[e].bodyMarginV1+":"+P[e].sizeWidth+":"+P[e].log+":"+P[e].interval+":"+P[e].enablePublicMethods+":"+P[e].autoResize+":"+P[e].bodyMargin+":"+P[e].heightCalculationMethod+":"+P[e].bodyBackground+":"+P[e].bodyPadding+":"+P[e].tolerance+":"+P[e].inPageLinks+":"+P[e].resizeFrom+":"+P[e].widthCalculationMethod+":"+P[e].mouseEvents}function M(t,o){function r(e){var n=e.split("Callback")
2===n.length&&(this[n="on"+n[0].charAt(0).toUpperCase()+n[0].slice(1)]=this[e],delete this[e],d(g,"Deprecated: '"+e+"' has been renamed '"+n+"'. The old method will be removed in the next major version."))}function s(e){var n=P[g][e]
1/0!==n&&0!==n&&(t.style[e]="number"==typeof n?n+"px":n,a(g,"Set "+e+" = "+t.style[e]))}function c(e){if(P[g]["min"+e]>P[g]["max"+e])throw new Error("Value for min"+e+" can not be greater than max"+e)}var u,f,g=(""===(u=t.id)&&(t.id=(f=o&&o.id||L.id+R++,null!==document.getElementById(f)&&(f+=R++),u=f),T=(o||{}).log,a(u,"Added missing iframe ID: "+u+" ("+t.src+")")),u)
g in P&&"iFrameResizer"in t?d(g,"Ignored iFrame, already setup."):(function(e){e=e||{},P[g]={firstRun:!0,iframe:t,remoteHost:t.src&&t.src.split("/").slice(0,3).join("/")},function(e){if("object"!=typeof e)throw new TypeError("Options is not an object")}(e),Object.keys(e).forEach(r,e),function(e){for(var n in L)Object.prototype.hasOwnProperty.call(L,n)&&(P[g][n]=(Object.prototype.hasOwnProperty.call(e,n)?e:L)[n])}(e),P[g]&&(P[g].targetOrigin=!0===P[g].checkOrigin?""===(e=P[g].remoteHost)||null!==e.match(/^(about:blank|javascript:|file:\/\/)/)?"*":e:"*")}(o),function(){switch(a(g,"IFrame scrolling "+(P[g]&&P[g].scrolling?"enabled":"disabled")+" for "+g),t.style.overflow=!1===(P[g]&&P[g].scrolling)?"hidden":"auto",P[g]&&P[g].scrolling){case"omit":break
case!0:t.scrolling="yes"
break
case!1:t.scrolling="no"
break
default:t.scrolling=P[g]?P[g].scrolling:"no"}}(),c("Height"),c("Width"),s("maxHeight"),s("minHeight"),s("maxWidth"),s("minWidth"),"number"!=typeof(P[g]&&P[g].bodyMargin)&&"0"!==(P[g]&&P[g].bodyMargin)||(P[g].bodyMarginV1=P[g].bodyMargin,P[g].bodyMargin=P[g].bodyMargin+"px"),function(o){var r,a=n()
a&&(r=a,t.parentNode&&new r(function(e){e.forEach(function(e){Array.prototype.slice.call(e.removedNodes).forEach(function(e){e===t&&m(t)})})}).observe(t.parentNode,{childList:!0})),i(t,"load",function(){var n,i
v("iFrame.onload",o,t,e,!0),n=P[g]&&P[g].firstRun,i=P[g]&&P[g].heightCalculationMethod in j,!n&&i&&w({iframe:t,height:0,width:0,type:"init"})}),v("init",o,t,e,!0)}(x(g)),P[g]&&(P[g].iframe.iFrameResizer={close:m.bind(null,P[g].iframe),removeListeners:l.bind(null,P[g].iframe),resize:v.bind(null,"Window resize","resize",P[g].iframe),moveToAnchor:function(e){v("Move to anchor","moveToAnchor:"+e,P[g].iframe,g)},sendMessage:function(e){v("Send Message","message:"+(e=JSON.stringify(e)),P[g].iframe,g)}}))}function I(e,n){null===A&&(A=setTimeout(function(){A=null,e()},n))}function k(){"hidden"!==document.visibilityState&&(a("document","Trigger event: Visibility change"),I(function(){F("Tab Visible","resize")},16))}function F(e,n){Object.keys(P).forEach(function(i){var t
P[t=i]&&"parent"===P[t].resizeFrom&&P[t].autoResize&&!P[t].firstRun&&v(e,n,P[i].iframe,i)})}function z(){i(window,"message",u),i(window,"resize",function(){var e
a("window","Trigger event: "+(e="resize")),I(function(){F("Window "+e,"resize")},16)}),i(document,"visibilitychange",k),i(document,"-webkit-visibilitychange",k)}function O(){function n(e,n){n&&(function(){if(!n.tagName)throw new TypeError("Object is not a valid DOM element")
if("IFRAME"!==n.tagName.toUpperCase())throw new TypeError("Expected <IFRAME> tag, found <"+n.tagName+">")}(),M(n,e),i.push(n))}var i
return function(){for(var e=["moz","webkit","o","ms"],n=0;n<e.length&&!H;n+=1)H=window[e[n]+"RequestAnimationFrame"]
H?H=H.bind(window):a("setup","RequestAnimationFrame not supported")}(),z(),function(t,o){var r
switch(i=[],(r=t)&&r.enablePublicMethods&&d("enablePublicMethods option has been removed, public methods are now always available in the iFrame"),typeof o){case"undefined":case"string":Array.prototype.forEach.call(document.querySelectorAll(o||"iframe"),n.bind(e,t))
break
case"object":n(t,o)
break
default:throw new TypeError("Unexpected data type ("+typeof o+")")}return i}}var R,T,E,N,W,C,S,H,j,P,A,L,B
"undefined"!=typeof window&&(N="message".length,C=(W="[iFrameSizer]").length,H=window.requestAnimationFrame,L={autoResize:!(A=S=null),bodyBackground:null,bodyMargin:null,bodyMarginV1:8,bodyPadding:null,checkOrigin:!(E=T=!1),inPageLinks:!(P={}),enablePublicMethods:!(R=0),heightCalculationMethod:"bodyOffset",id:"iFrameResizer",interval:32,log:!(j={max:1,scroll:1,bodyScroll:1,documentElementScroll:1}),maxHeight:1/0,maxWidth:1/0,minHeight:0,minWidth:0,mouseEvents:!0,resizeFrom:"parent",scrolling:!1,sizeHeight:!0,sizeWidth:!1,warningTimeout:5e3,tolerance:0,widthCalculationMethod:"scroll",onClose:function(){return!0},onClosed:function(){},onInit:function(){},onMessage:function(){d("onMessage function not defined")},onMouseEnter:function(){},onMouseLeave:function(){},onResized:function(){},onScroll:function(){return!0}},B={},window.jQuery&&function(e){e.fn?e.fn.iFrameResize||(e.fn.iFrameResize=function(e){return this.filter("iframe").each(function(n,i){M(i,e)}).end()}):s("","Unable to bind to jQuery, it is not fully loaded.")}(window.jQuery),"function"==typeof define&&define.amd?define([],O):"object"==typeof module&&"object"==typeof module.exports&&(module.exports=O()),window.iFrameResize=window.iFrameResize||O())}()
