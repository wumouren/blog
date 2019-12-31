## 概念原理
***
在项目开发中，会有一些事件高频触发的场景，例如:     
&emsp;1、浏览器窗口的缩放，页面的滑动触发的 `resize` ，`scroll`   
&emsp;2、鼠标事件 `onmousemove` ，`onmousedown`， `onmouseup`   
&emsp;3、输入框录入触发的 `keyup` ，`keydown`   
&emsp;&emsp;......    

为了优化此类场景，我们通常会使用两种方案：    
&emsp;节流：事件高频触发中，每 n 秒执行一次。    
&emsp;防抖：事件高频触发后，间隔 n 秒执行一次。    

关于二者之间的区别，由以上原理可知，是执行回调函数的时机不同：节流函数的回调执行时机是在高频触发中，而防抖函数的回调函数执行时机是在高频触发后。

## 实现
****
根据以上原理，我们可以写出第一版简单实现：    

`html` 页面代码

```html
<body>
   <div id="root" style="width: 500px;height: 200px;background: yellow;"></div>
    <script>
      function func(e) {
        console.log('mousemve', this, e);
      }
      // 节流
      function throttle(){}
      //防抖
      function debounce(){}

      root.addEventListener('mousemove', throttle(func, 1000));
    </script>
</body>
```

### 防抖
```js
/**
 *  思路：
 *  每次事件触发删除已有定时器，设置新的定时器，等待 n 秒触发事件回调
 **/
function debounce(fn, wait){
  let timer;
  return function(...args){
    let ctx = this;
    clearTimeout(timer);
    timer = setTimeout(function(){
      fn.apply(ctx, args);
      timer = null;
    }, wait)
  }
}
```
效果图：
![debounce](https://raw.githubusercontent.com/wumouren/blog/master/img/debounce.gif)
### 节流
节流函数的实现有两种方式：  
&emsp;1、时间戳   
&emsp;2、定时器

**时间戳实现**
```js
/**
 * 思路：
 * 每次事件触发，对比当前时间和上次回调执行时间，若间隔大于等待时间则执行
 **/
function throttle(fn, wait){
  let previous = 0;
  return function(...args){
    let ctx = this;
    let now = +new Date();
    if(now - previous > wait){
      fn.apply(ctx, args);
      previous = now;
    }
  }
}
```
效果图：
![时间戳节流](https://raw.githubusercontent.com/wumouren/blog/master/img/throttle1.gif)


**定时器实现**
```js
/**
 * 思路：
 * 每次事件触发，判断定时器是否存在
 * 若不存在则设置定时器，
 * 若存在则等待定时器执行完毕之后重新设置定时器
 **/
function throttle(fn, wait){
  let timer;
  return function(...args){
    let ctx = this;
    if(!timer){
      timer = setTimeout(function(){
        timer = null;
        fn.apply(ctx, args)
      }, wait)
    }
  }
}
```
效果图：
![定时器节流](https://raw.githubusercontent.com/wumouren/blog/master/img/throttle2.gif)
## 改进
***
通过以上处理，我们已经可以对高频事件的执行频率及时机加以控制，但是，通过观察我们发现上述代码还存在以下问题：    
&emsp;1、在防抖函数中，鼠标初次进入色块时，回调函数未执行   
&emsp;2、在时间戳节流中，鼠标离开色块，间隔 1 秒后回调函数不会执行    
&emsp;3、在定时器节流中，鼠标初次进入色块时，回调函数未执行   

针对以上问题，我们对函数做出以下调整：

**防抖**    
接受一个 option 参数对象，控制初次触发是否执行回调函数，option 为对象便于扩展其他控制功能  
```js
/**
 *  思路：
 *  !timer 为 true 则认为是首次触发
 *  leading 等于 true 则首次触发执行回调
 **/
function debounce(fn, wait, option={}){
  let timer;
  let { leading } = option;
  return function(...args){
    let ctx = this;
    if(!timer && leading === true){ // 初次触发执行回调
      fn.apply(ctx, args);
    }
    clearTimeout(timer);
    timer = setTimeout(function(){
      fn.apply(ctx, args);
      timer = null;
    }, wait)
  }
}
```

**节流**    
我们整合时间戳实现和定时器实现，完成初次触发及鼠标离开后的回调执行
```js
/**
 *  思路：
 *  计算出距离下次事件执行的时间：wait - (now - previous)
 *  若距离下次执行的时间 <=0 则执行回调，并清除定时器
 *  若未到执行时间，且没有定时器，则设置定时器，确保鼠标脱离色块后，依旧执行最后一次事件回调
 **/
function throttle(fn, wait) {
  let previous = 0;
  let timer;
  return function (...args) {
    let ctx = this;
    let now = +new Date();
    let remaining = wait - (now - previous);
    
    if (remaining <= 0) {
      if(timer){
        clearTimeout(timer);
        timer = null;
      }
      fn.apply(ctx, args);
      previous = now;
    } else if (!timer) {
      timer = setTimeout(function () {
        previous = +new Date();
        timer = null;
        fn.apply(ctx, args);
      }, remaining)
    }
  }
}
```
## 优化
***
在节流函数中，我们还可以通过传递 `option` 配置参数对初次触发及尾随触发的回调执行加以控制。

## 最后
***
以上，我们已经对节流和防抖做了简单了解。

