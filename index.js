//全局函数，方便js中获取元素
function getEle(ele) {
    return document.querySelector(ele);
}
function getEles(ele){
	return document.querySelectorAll(ele);
}
(function () {
    var main = getEle("#main"),music = getEle("#music"),sound = getEle("#sound");
    var oLis = getEles("#list>li");
    var winW = document.documentElement.clientWidth;
    var winH = document.documentElement.clientHeight;
    var desW = 640,desH = 1000;
	//当页面尺寸和移动端尺寸不同时，需要对页面进行缩放，使主要内容显示在可视区域
    if (winW / winH < desW / desH) {
        main.style.webkitTransform = "scale(" + winH / desH + ")";
    } else {
        main.style.webkitTransform = "scale(" + winW / desW + ")";
    }
	//默认播放音乐
    function musicPlay() {
        music.play();
        sound.onclick = function () {
            if (utils.hasClass(sound, "rotate")) {
                utils.removeClass(sound, "rotate");
                music.pause();
            } else {
                utils.addClass(sound, "rotate");
                music.play();
            }
        }
    }
    musicPlay();
	//默认让第一页有效果
    oLis[0].firstElementChild.id="list-a1";
	
	//给每个li绑定touch事件
    [].forEach.call(oLis, function () {
        var oLi = arguments[0];
        oLi.index = arguments[1];
		if (oLi.index != 0) {
            oLi.style.display = "none";
        }
        oLi.addEventListener("touchstart", start, false);
        oLi.addEventListener("touchmove", move, false);
        oLi.addEventListener("touchend", end, false);
    });

    function start(e) {
        this.startX = e.changedTouches[0].pageY;
    }

    function move(e) {
        this.flag = true;
        var moveTouch = e.changedTouches[0].pageY;
        var movePos = moveTouch - this.startX;
        var index = this.index;
		//清空类名，非当前页隐藏
        [].forEach.call(oLis, function () {
            arguments[0].className = "";
            if (arguments[1] != index) {
                arguments[0].style.display = "none"
            }
            arguments[0].firstElementChild.id = "";

        })
        if (movePos > 0) {//下滑，显示上一张
            this.prevSIndex = (index == 0 ? oLis.length - 1 : index - 1);
            var duration = -winH + movePos;
        } else if (movePos < 0) {//上滑，显示下一张
            this.prevSIndex = (index == oLis.length - 1 ? 0 : index + 1);
            var duration = winH + movePos;
        }
		//当前项慢慢变小，淡出视口
        this.style.webkitTransform = "scale(" + (1 - Math.abs(movePos) / winH * 1 / 2) + ")  translate(0," + movePos + "px)";
		//让prevIndex显示，同时上移到手指位置
        oLis[this.prevSIndex].style.webkitTransform = "translate(0," + duration + "px)"
        oLis[this.prevSIndex].className = 'zIndex';
        oLis[this.prevSIndex].style.display = "block";
    }

    function end(e) {
        if (this.flag) { //点击事件过滤
            oLis[this.prevSIndex].style.webkitTransform = "translate(0,0)";
            oLis[this.prevSIndex].style.webkitTransition = "0.5s ease-out";
            var _this=this;
            oLis[this.prevSIndex].addEventListener("webkitTransitionEnd", function (e) {
                if (e.target.tagName == "LI") {//去掉li的动画积累
                    this.style.webkitTransition = "";
                }else{//阻止冒泡传播,防止动画干扰
                    e.stopPropagation();
                    return;
                }
                //oLis[_this.index].style.display="none";
                this.firstElementChild.id = "list-a" + (this.index + 1);//给子元素加上动画效果
            }, false)
        }
    }
})();

