<header>
<h1>blz-model</h1>
<p><blockquote>jQuery 插件</blockquote></p>
</header>
<hr>
<section>
<h2>blz</h2>
<p>blz组件主要为一些共用方法,封装于jQuery上，接口如下</p>
<ul>
<li>$.blz.emptyFn   // 空函数，目前主要用于传参上的赋值。</li>
<li>$.blz.isAndroid   // 判断当前移动设备是否为安卓，返回值为布尔值。</li>
<li>$.blz.checkTransition   // 检测支持当前设备对transition属性的支持情况，并返回一个支持的前缀（如-webkit-,-moz-,-o-）,以减少代码的书写量。</li>
<li>$.blz.requestAnimationFrame   // 对原生requestAnimationFrame方法的向后兼容处理，感觉移动端并无多大用处，如果必须考虑低版本系统的兼容，可考虑！</li>
<li>$.blz.initWebGl   // 为获取3d绘图环境canvas.getContext('webgl')的兼容性写法。</li>
</ul>
</section>
<hr>
<section>
<h2>blz-lazy-load</h2>
<p><blockquote>图片懒加载，主要目的在于减少服务器压力，减少页面加载时间，方法封装于jQuery上</blockquote></p>
<section>
<h3>开启懒加载</h3>
<pre><strong><code>$(selector).blzLazyLoad(elems,scale,fn)</code></strong></pre>
<ul>
<li>elems   // 参数为selector滚动时要监测的是否出现在视口（目前视口只针对screen而言）的元素集合，如document.images,$(selector2)一些类数组的元素集合</li>
<li>scale   // 一个比例参数，取值为整数，默认为1，例如scale=2;则在判断elems元素中某一元素进入视野时会将屏幕的高度放大两倍进行判断（进入视口的判断只支持纵向不支持横向）</li>
<li>fn   // 代表一个函数参数，在不传入fn的情况下，会默认为传入的elems参数为一个img元素集合，并默认为都含有data-src属性，当元素进入视口时会把data-src值赋予该图片的src值，并当所有元素都赋值完毕时，则关闭懒加载；当fn被传参时，会取代当元素进入视野时的默认做法，该函数会被传入一个参数elem,即此时elems参数中进入视口的元素；</li>
</ul>
</section>
<section>
<section>
<h3>关闭懒加载</h3>
<pre><strong><code>$(selector).blzOffLazyLoad();</code></strong></pre>
</section>
<section>
<h3>demo</h3>
<p><a href="https://chanelnumberfive.github.io/blz-model/model/lazy-load/demo.html">https://chanelnumberfive.github.io/blz-model/model/lazy-load/demo.html</a></p>
</section>
</section>
</section>
<hr>
<section>
<h2>blz-move</h2>
<p><blockquote>基于视口的平移，移动区域默认为视口，不支持自定义滑块移动区域，</blockquote></p>
<section>
<h3>移动</h3>
<pre><strong><code>$(selector).blzMove(option)</code></strong></pre>
<pre>
<code>
  option={
    translateX:0,
    translateY:0
  }
</code>
</pre>
<ul>
<li>translateX,translateY分别为元素对应的css值不支持百分比；由于getBoundingClientRect()在低版本ios上（ios 7 8）不会考虑translate值带来的影响，因此不建议初始化样式时对要平移元素应用translate属性</li>
</ul>
</section>
<section>
<section>
<h3>关闭移动</h3>
<pre><strong><code>$(selector).blzOffMove()</code></strong></pre>
</section>
<section>
<section>
<h3>demo</h3>
<p><a href="https://chanelnumberfive.github.io/blz-model/model/move/demo.html">https://chanelnumberfive.github.io/blz-model/model/move/demo.html</a></p>
</section>
</section>
</section>
<hr>
