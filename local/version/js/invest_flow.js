$(function () {
    var product_id = getUrlParam('product_id') || '';
    var order_number = getUrlParam('order_number') || '';
    $('#fileMapping').height(Math.floor($('#fileMapping').width() * 200 / 340));  //设置图片上传组件高度
    $('.uploader-demo').find('img').load(function () {
        var w = $('.uploader-demo').find('img').width();
        var h = $('.uploader-demo').find('img').height();
        var warp_w = $('#fileMapping').width();
        var warp_h = $('#fileMapping').height();
        if ((w / h) < (warp_w / warp_h)) {
            $('.uploader-demo').find('img').css({width: 'auto', height: '100%'});
        } else {
            $('.uploader-demo').find('img').css({
                width: '100%',
                height: 'auto',
                'margin-top': Math.floor((warp_h - warp_w * h / w) / 2) + 'px'
            });
        }
    });
    if (order_number != '' && $('.about_order').length) {
        $('.about_order').html('<span>订单</span>' + order_number);
    }
    // 辅助下单获取产品信息
    if (product_id != '') {
        getData({
            url: base_url + '/white_label/product_info',
            data: {product_id: product_id},
            sucFn: getProductSuc,
            failFn: getProductFail
        });
    }

    function getProductSuc(res) {
        if (res.body.status !== 'FOR_INVEST') {
            window.location = '/auxiliary_order/errLink.html';
            return false;
        } else {
            $('.about_product').html('<span>' + res.body.name + '</span>');
            // $('.about_product').html('<span>' + res.body.name + '</span>' + res.body.number);
        }
    }

    function getProductFail(res) {
        alert(res.msg)
    }
});
