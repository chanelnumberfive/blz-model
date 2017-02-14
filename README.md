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
<section>
<h2>blz-cartoon</h2>
<p>css3动画的开关，并没有实现动画，动画还得用css3去实现！</p>
<section>
<h3>开启开关</h3>
<pre>
<code>
$(selectArea).blzCartoon(option);
option={
  cartoonClass:'animation'
}
</code>
</pre>
<ul>
<li>selectArea为激活的开关区域，比如输入document,那么位于document元素下的所有带有data-xxxx(xxx为对应的API名称，详情见下文)的元素具有开关动画的功能</li>
<li>cartoonClass为激活目标动画时要添加的类名，默认值为animation</li>
</ul>
</section>
<section>
<h3>html代码结构</h3>
<pre>
&lt;button type="button" data-cartoon="#cartoon-1"&gt;动画1&lt;/button&gt;
&lt;button type="button" data-cartoon="#cartoon-2"&gt;动画2&lt;/button&gt;
&lt;button type="button" data-cartoon-dismiss="#cartoon-1"&gt;移除动画1&lt;/button&gt;
&lt;button type="button" data-cartoon-dismiss="#cartoon-2"&gt;移除动画2&lt;/button&gt;

&lt;div id="cartoon-1"&gt;
	&lt;div class="slide-up"&gt;&lt;/div&gt;
&lt;/div&gt;
&lt;div id="cartoon-2"&gt;
	&lt;div class="slide-down"&gt;&lt;/div&gt;
&lt;/div&gt;
</pre>
<ul>
<li>带有data-cartoon="#cartoon-1"属性的button按钮,被点击时，就会给#cartoon-1元素，添加animation类名（或者你自定义的类名）；此时位于其下的带有相应动画类名的元素就会执行对应的动画(这些css3动画，必须事先写好，blz-cartoon.js只是实现了一个开关，即为目标元素添加animation类名或移除animation类名);被添加animation类名的元素会发布animation事件，支持冒泡！</li>
<li>同理带有data-cartoon-dismiss="#cartoon-1"属性的按钮，被点击时，就会移除#cartoon-1元素的animation类名，一些由添加animation类名产生的动画也会随之消失；此时#cartoon-1元素会发布offAimation事件，支持冒泡！</li>
<li>带有data-cartoon-toggle的元素被点击时，则会开启动画时则关闭动画，关闭动画时则开启动画</li>
<li>点击任何带有data-cartoon区域以外的元素都会关闭已开启的动画，开启另一个动画，也会关闭另外一个已开启的动画</li>
<li>对于开关动画时发布的自定义事件，也可采用css3动画自带的标准事件animationstart,animationend<a href="https://developer.mozilla.org/en-US/docs/Web/Events">详细地址</a></li>
</ul>
</section>
<section>
<h3>关闭开关</h3>
<pre>
<code>
$(selectArea).blzOffCartoon();
</code>
</pre>
</section>
<section>
<h3>demo</h3>
<p><a href="https://chanelnumberfive.github.io/blz-model/model/cartoon/demo.html">https://chanelnumberfive.github.io/blz-model/model/cartoon/demo.html</a></p>
</section>
</section>
<hr>
