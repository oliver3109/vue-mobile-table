// 首先是一个立即执行函数，执行时传入的参数是window和document
(function flexible(window, document) {
  var docEl = document.documentElement; // 返回文档的root元素
  var dpr = window.devicePixelRatio || 1;
  // 获取设备的dpr，即当前设置下物理像素与虚拟像素的比值

  // 调整body标签的fontSize，fontSize = (12 * dpr) + 'px'
  // 设置默认字体大小，默认的字体大小继承自body
  function setBodyFontSize() {
    if (document.body) {
      document.body.style.fontSize = 12 * dpr + "px";
    } else {
      document.addEventListener("DOMContentLoaded", setBodyFontSize);
    }
  }
  setBodyFontSize();

  // set 1rem = viewWidth / 10
  // 设置root元素的fontSize = 其clientWidth / 10 + ‘px’
  function setRemUnit() {
    var clientWidth = docEl.clientWidth; //获取屏幕布局视口宽度
    if (clientWidth >= 750) {
      //[值]为2倍图的大小 防止失真 判断视口大于[值]时最大的默认值就为2倍图的每份大小
      clientWidth = 750;
    } else if (clientWidth <= 320) {
      clientWidth = 320;
    }
    var rem = clientWidth / 10;
    docEl.style.fontSize = rem + "px";
  }

  setRemUnit();

  // 当页面展示或重新设置大小的时候，触发重新
  window.addEventListener("resize", setRemUnit);
  window.addEventListener("pageshow", function (e) {
    if (e.persisted) {
      setRemUnit();
    }
  });

  // 检测0.5px的支持，支持则root元素的class中有hairlines
  if (dpr >= 2) {
    var fakeBody = document.createElement("body");
    var testElement = document.createElement("div");
    testElement.style.border = ".5px solid transparent";
    fakeBody.appendChild(testElement);
    docEl.appendChild(fakeBody);
    if (testElement.offsetHeight === 1) {
      docEl.classList.add("hairlines");
    }
    docEl.removeChild(fakeBody);
  }
})(window, document);
