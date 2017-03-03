/**
 * Created by zhiqiang.li on 2017/3/2.
 */
$(function () {
    $('body').scrollTop(0);
    if($(document).scrollTop()==0){
    }else{
        $("#zhichiBtnBox").show();
    }
    var bannerSlider = new Slider($('#banner_tabs'), {
        time: 5000,
        delay: 400,
        event: 'hover',
        auto: true,
        mode: 'fade',
        controller: $('#bannerCtrl'),
        activeControllerCls: 'active'
    });
    $('#banner_tabs .flex-prev').click(function() {
        bannerSlider.prev()
    });
    $('#banner_tabs .flex-next').click(function() {
        bannerSlider.next()
    });


    $('.phone').mouseover(function () {
        $('.phone_before').css('display','none');
        $('.phone_after').css('display','block')
    });
    $('.phone').mouseout(function () {
        $('.phone_before').css('display','block');
        $('.phone_after').css('display','none')
    });

    var d, h;
    function scroll( fn ) {
        var beforeScrollTop = $(document).scrollTop, //用元素获取高度,在firefox/IE下会有兼容性问题
            fn = fn || function() {};
        window.addEventListener("scroll", function() {
            var afterScrollTop = $(document).scrollTop,
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
        console.log(d);
        console.log(h);
          if(h<80){
            $header.fadeIn();
            $headerWhite.fadeOut();
          }else if(h>80){
            $header.fadeOut();
            $headerWhite.fadeIn();
          }
        }else{
            $header.hide();
            $headerWhite.hide();
        }
    });

});