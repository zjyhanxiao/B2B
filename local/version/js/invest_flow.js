$(function () {
    var product_id = getUrlParam('product_id') || '';
    var order_number = getUrlParam('order_number') || '';
    $('#fileMapping').height(Math.floor($('#fileMapping').width()*200/340));
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
            $('.about_product').html('<span>' + res.body.name + '</span>' + res.body.number);
        }
    }

    function getProductFail(res) {
        alert(res.msg)
    }
});
