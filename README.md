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
<section>
<h2>blz-agreement</h2>
<p><blockquote>工作中老是遇到一行蓝色的文字协议条款，点击时要求弹出浮层让用户关闭浮层时还停留在原页面，为了复用便把此功能封装成了jQuery插件</blockquote></p>
<section>
<h3>开启协议（有点别扭。。。）</h3>
<pre>&lt;div data-blz-agreement="url-1 url-2 url-3"&gt;恋爱保险协议大学名录&lt;/div&gt;

<strong><code>$(selectorArea).blzGetAgreement();</code></strong></pre>
<ul>
<li>slelectArea 表示一个选择区域，开启协议后，点击位于selectorArea区域下的元素时，如果被点击的元素带有data-blz-agreement属性，则会向body元素append一个弹层，并读取data-blz-agreement中的url数据依次赋予javascript对象Image的实例，这些实例全部加载完毕后最终会添加到一个事先准备好的#blz-agreement-wrapper盒中</li>
</ul>
</section>
<section>
<h3>关闭协议</h3>
<pre><strong><code>$(selectorArea).blzOffGetAgreement();</code></strong></pre>
</section>
<section>
<h3>demo</h3>
<p><a href="https://chanelnumberfive.github.io/blz-model/model/agreement/demo.html">https://chanelnumberfive.github.io/blz-model/model/agreement/demo.html</a></p>
</section>
</section>
<hr>
<section>
<h2>blz-dialog</h2>
<p><blockquote>对话框,前期使用weui的样式库，看见其有一套不错的对话框样式，但就是死活没找到与之配套的js文件，.........自己写！</blockquote></p>
<section>
<h3>开启弹窗</h3>
<pre><strong><code>
$.weui.alert({
	title:'你好',
	article:'我是对话框alert',
	sureCallback:function(){
	// 点击确定按钮时的回调	
	}
});

$.weui.confirm({
	title:'你好',
	article:'我是对话框confirm',
	cancelText:'取消',
	sureText:'确定',
	sureHref:'javascript:void(0);',
	cancelHref:'javascript:void(0);',
	cancelCallback:function(){
	// 点击取消按钮时的回调	
	},
	sureCallback:function(){
	// 点击确定按钮时的回调	
	}
});

$.weui.warn({
	title:'你好',
	article:'我是对话框warn'
});

$.weui.tip('你好我是对话框tip');

$.weui.loading('你好，我是loading');

$.weui.loading(selector,'你好，我是partLoading');
</code></strong></pre>
</section>
<section>
<h3>demo</h3>
<p><a href="https://chanelnumberfive.github.io/blz-model/model/dialog/demo.html">https://chanelnumberfive.github.io/blz-model/model/dialog/demo.html</a></p>
</section>
</section>
<hr>
<section>
<h2>blz-scrollto</h2>
<p><blockquote>在做项目时遇到一个滚动至顶部的按钮，直接调用document.body.scrollTop=0,这画面太美，有点不敢看！然后结合requestAniamtionFrame写出一个滚动较为缓慢的动画</blockquote></p>
<section>
<h3>开启滚动</h3>
<pre><strong><code>
$(scrollElem).blzScrollto(displacement,time,callback);
</code></strong></pre>
<ul>
<li>displacement // 参数代表scrollElem要滚动的位移，既然是位移，那就是相对运动，你不能输入个0，指望着浏览器回滚到顶部，得输入要滚动的距离</li>
<li>time // 参数time代表scrollElem滚动持续的时间，单位ms默认为300ms</li>
<li>callback // 参数callback代表滚动结束时执行的回调函数</li>
</ul>
</section>
<section>
<h3>demo</h3>
<p><a href="https://chanelnumberfive.github.io/blz-model/model/scrollto/demo.html"></a></p>
</section>
</section>


<section>
<h2></h2>
<p><blockquote></blockquote></p>
<section>
<h3></h3>
<pre><strong><code></code></strong></pre>
</section>
<section>
<section>
<h3></h3>
<pre><strong><code></code></strong></pre>
</section>
<section>
<h3></h3>
<p><a href="https://chanelnumberfive.github.io/blz-model/model/lazy-load/demo.html"></a></p>
</section>
</section>
</section>
