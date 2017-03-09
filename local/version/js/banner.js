/**
 * Created by zhiqiang.li on 2017/3/2.
 */
$(function () {
    $('body').scrollTop(0);
    var bannerSlider = new Slider($('#banner_tabs'), {
        time: 5000,
        delay: 400,
        event: 'hover',
        auto: true,
        mode: 'fade',
        controller: $('#bannerCtrl'),
        activeControllerCls: 'active'
    });
    $('#banner_tabs .flex-prev').click(function () {
        bannerSlider.prev()
    });
    $('#banner_tabs .flex-next').click(function () {
        bannerSlider.next()
    });


    $('.phone').mouseover(function () {
        $('.phone_before').css('display', 'none');
        $('.phone_after').css('display', 'block')
    });
    $('.phone').mouseout(function () {
        $('.phone_before').css('display', 'block');
        $('.phone_after').css('display', 'none')
    });

    var d, h;
    /*    function scroll( fn ) {
     var beforeScrollTop = $(window).scrollTop(),
     fn = fn || function() {};
     window.addEventListener("scroll", function() {
     var afterScrollTop = $(window).scrollTop(),
     delta = afterScrollTop - beforeScrollTop;
     if( delta === 0 ) return false;
     fn( delta > 0 ? "down" : "up" );
     beforeScrollTop = afterScrollTop;
     }, false);
     }
     scroll(function(direction) {
     d =  direction;
     h = $(document).scrollTop();
     var $header = $(".nav-bg");
     var $headerWhite = $(".nav-bg-white");
     if(d=="up"){
     // console.log(d);
     // console.log(h);
     if(h<600){
     $header.fadeIn();
     $headerWhite.fadeOut();
     }else if(h>600){
     $header.fadeOut();
     $headerWhite.fadeIn();
     }
     }else{
     $header.hide();
     $headerWhite.hide();
     }
     });*/


    var scrollFunc = function (e) {
        var $header = $(".nav-bg");
        var $headerWhite = $(".nav-bg-white");
        h = $(document).scrollTop();
        e = e || window.event;
        if (e.wheelDelta > 0 || e.detail < 0) {
            //如果是IE/Opera/Chrome浏览器
            if (h < 100) {
                if ($header.css('display') == 'none') {
                    $header.fadeIn();
                }
                $headerWhite.hide();
            }
            if (h >= 100) {
                if ($headerWhite.css('display') == 'none') {
                    $headerWhite.fadeIn();
                }
                $header.hide();
            }
        } else {
            $header.hide();
            $headerWhite.hide();
        }
    };

    if (window.addEventListener) {
        //非firefox
        window.addEventListener('mousewheel', scrollFunc, false);
        //firefox
        window.addEventListener('DOMMouseScroll', scrollFunc, false);
    }

});