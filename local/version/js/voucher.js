$(function () {
    var product_id = getUrlParam('product_id') || '';
    var partner_id = getUrlParam('partner_id') || '';
    var phone = getUrlParam('phone') || '';
    var order_number = getUrlParam('order_number') || '';

    $('#get_code').on('click', function () {
        phone = $("#phone").val();
        if(phone==''){
            $("#error").html('请输入您的手机号码');
            return false;
        }else{
            if (phone.indexOf('+') == -1) {
                phone = '+86 ' + phone;
            }
            getData({
                url: base_url + '/zion/common/verify_code',
                data: {phone: phone, channel_code: partner_id},
                async: false,
                sucFn: getCodeSuc,
                failFn: failFn
            });
        }
    });
    
    $('#submit').on('click', function () {
        phone = $("#phone").val();
        var verify_code = $("#verify_code").val();
        if(phone==''){
            $("#error").html('请输入您的手机号码');
            return false;
        }if(get_verify_code==''){
            $("#error").html('请输入您的校验码');
            return false;
        }else{
            if (phone.indexOf('+') == -1) {
                phone = '+86 ' + phone;
            }
            getData({
                url: base_url + '/zion/common/voucher',
                data: {phone: phone, channel_code: partner_id, verify_code: verify_code},
                async: false,
                sucFn: voucherSuc,
                failFn: failFn
            });
        }
    });
    function getCodeSuc(res) {

    }

    function voucherSuc(res) {
        if (phone.indexOf('+') == -1) {
            phone = '+86 ' + phone;
        }
        window.location = '/white_label/base_info.html?product_id=' + product_id + '&partner_id=' + partner_id + '&phone=' + phone + '&access_token=' + res.body;
    }

    function failFn(res) {
        alert(res.msg);
    }


    $('input').on('focus',function () {
        $("#error").css('visibility','hidden');
    })
});

//获取url中的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var s = window.location.search;
    if (/[\u4e00-\u9fa5]/.test(s)) {
        s = decodeURI(s);
    }
    var r = s.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]);
    return null; //返回参数值
}