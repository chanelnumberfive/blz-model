# blz-model
> 组件针对移动端，为了配合后台保持引入的插件一致，基于jQuery实现

## blz
> blz组件主要为一些共用方法,封装于jQuery上，接口如下

1. $.blz.emptyFn   // 空函数，目前主要用于传参上的赋值。
2. $.blz.isAndroid   // 判断当前移动设备是否为安卓，返回值为布尔值。
3. $.blz.checkTransition   // 检测支持当前设备对transition属性的支持情况，并返回一个支持的前缀（如-webkit-,-moz-,-o-）,以减少代码的书写量。
4. $.blz.requestAnimationFrame   // 对原生requestAnimationFrame方法的向后兼容处理，感觉移动端并无多大用处，如果必须考虑低版本系统的兼容，可考虑！
5. $.blz.initWebGl   // 为获取3d绘图环境canvas.getContext('webgl')的兼容性写法。

***

## blz-lazy-load
> 图片懒加载，主要目的在于减少服务器压力，减少页面加载时间，方法封装于jQuery上

`$(selector).blzLazyLoad(elems,scale,fn)`

1. elems   // 参数为selector滚动时要监测的是否出现在视口（目前视口只针对screen而言）的元素集合，
如document.images,$(selector2)一些类数组的元素集合
2. scale   // 一个比例参数，取值为整数，默认为1，例如scale=2;则在判断elems元素中某一元素进入视野时会将屏幕
的高度放大两倍进行判断（进入视口的判断只支持纵向不支持横向）
3. fn   // 代表一个函数参数，在不传入fn的情况下，会默认为传入的elems参数为一个img元素集合，并默认为都含有data-src属性，
当元素进入视口时会把data-src值赋予该图片的src值，并当所有元素都赋值完毕时，则关闭懒加载；当fn被传参时，会取代当元素进入视野时的默认做法，
该函数会被传入一个参数elem,即此时elems参数中进入视口的元素；

> 关闭懒加载

`$(selector).blzOffLazyLoad();`
