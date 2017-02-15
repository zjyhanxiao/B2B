$(function () {
    var order_number = getUrlParam(order_number);
    getData({
        url: base_url + '/zion/order/amount',
        data:{order_id:order_number}
    })
});