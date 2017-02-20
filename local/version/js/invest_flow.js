$(function () {
    var product_id = getUrlParam('product_id') || '';
    var order_number = getUrlParam('order_number') || '';
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
        $('.about_product').append('<span>' + res.body.name + '</span>' + res.body.number);
    }

    function getProductFail(res) {
        alert(res.msg)
    }
});
