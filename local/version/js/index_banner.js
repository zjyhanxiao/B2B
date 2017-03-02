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
    $('#banner_tabs .flex-prev').click(function() {
        bannerSlider.prev()
    });
    $('#banner_tabs .flex-next').click(function() {
        bannerSlider.next()
    });


    $('.phone').mouseover(function () {
        $('.phone_before').css('display','none')
        $('.phone_after').css('display','block')
    });
    $('.phone').mouseout(function () {
        $('.phone_before').css('display','block')
        $('.phone_after').css('display','none')
    });

    var d, h;
    function scroll( fn ) {
        var beforeScrollTop = document.body.scrollTop,
            fn = fn || function() {};
        window.addEventListener("scroll", function() {
            var afterScrollTop = document.body.scrollTop,
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
//        console.log(d);
//        console.log(h);
            if(h<720){
                $header.fadeIn();
                $headerWhite.fadeOut();
            }else if(h>720){
                $header.fadeOut();
                $headerWhite.fadeIn();
            }
        }else{
            $header.hide();
            $headerWhite.hide();
        }
    });

/*    if(!window.name){
        alert("第一次开这个窗口！name值"+ window.name);
        window.name = 'lijia';

    }else{
        alert('刷新操作 name值：'+ window.name);
    }*/
});