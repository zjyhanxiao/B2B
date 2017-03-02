$(function () {
    var user_data = {};// 定义用户信息数据
    var phone = getUrlParam('phone') || ''; // 通过手机号查找用户信息
    var partner_id = getUrlParam('partner_id') || ''; // 渠道编码
    var product_id = getUrlParam('product_id') || ''; //获取产品id
    var order_number = getUrlParam('order_number') || ''; // 获取订单编号
    var voucher = getUrlParam('voucher') || ''; // 获取通行证
    var bankUs = '', bankNonUs = '';

    getCnBank(); // 默认加载非美国常用银行
    // 获取用户银行信息
    if (phone != '' && voucher != '') {
        getData({
            url: base_url + '/zion/white_label/user_info',
            data: {phone: phone, voucher: voucher, channel_code: partner_id},
            async: false,
            sucFn: bankInfo,
            failFn: failFn
        })
    }
    $('.step-three').on('click', function () {
        $('.error').remove();
        $(this).prop('disabled', true);
        if ($('.banks').css('display') == 'block') {
            $('.banks').append('<div class="error">请选择银行</div>');
            return false;
        }
        if ($('.bank-us').css('display') == 'block') {
            var can_next = true;
            $('.bank-us .routing_number,.bank-us .account_number').css('border-color', '#ccc').removeClass('red-shadow');
            var routing_number = $('.bank-us .routing_number').val();
            var account_number = $('.bank-us .account_number').val();
            var bank_type = $('.bank-us .account_type .checked').html();
            if (routing_number == '') {
                $('.bank-us .routing_number').css('border-color', 'red').addClass('red-shadow');
                can_next = false;
            }
            if (account_number == '') {
                $('.bank-us .account_number').css('border-color', 'red').addClass('red-shadow');
                can_next = false;
            }
            if (can_next) {
                user_data.bank_us.routing_number = routing_number;
                user_data.bank_us.account_number = account_number;
                user_data.bank_us.bank_type = bank_type;
                updateUserInfo(user_data);
            } else {
                var t = $('.red-shadow').eq(0).offset().top;
                $('body').scrollTop(t);
                $(this).prop('disabled', false);
            }
            return false;
        }
        if ($('.bank-us-other').css('display') == 'block') {
            var can_next = true;
            $('.bank-us-other .bank_name,.bank-us-other .bank_address,.bank-us-other .swift_code,.bank-us-other .routing_number,.bank-us-other .account_number').css('border-color', '#ccc').removeClass('red-shadow');
            var bank_name = $('.bank-us-other .bank_name').val();
            var bank_address = $('.bank-us-other .bank_address').val();
            var swift_code = $('.bank-us-other .swift_code').val();
            var routing_number = $('.bank-us-other .routing_number').val();
            var account_number = $('.bank-us-other .account_number').val();
            var bank_type = $('.bank-us-other .account_type .checked').html();
            if (bank_name == '') {
                $('.bank-us-other .bank_name').css('border-color', 'red').addClass('red-shadow');
                can_next = false;
            }
            if (bank_address == '') {
                $('.bank-us-other .bank_address').css('border-color', 'red').addClass('red-shadow');
                can_next = false;
            }
            if (swift_code == '' && routing_number == '') {
                $('.bank-us-other .swift_code').css('border-color', 'red').addClass('red-shadow');
                $('.bank-us-other .routing_number').css('border-color', 'red').addClass('red-shadow');
                can_next = false;
            }
            if (account_number == '') {
                $('.bank-us-other .account_number').css('border-color', 'red').addClass('red-shadow');
                can_next = false;
            }
            if (can_next) {
                user_data.bank_us.bank_name = bank_name;
                user_data.bank_us.bank_address = bank_address;
                user_data.bank_us.routing_number = routing_number;
                user_data.bank_us.swift_code = swift_code;
                user_data.bank_us.account_number = account_number;
                user_data.bank_us.bank_type = bank_type;
                updateUserInfo(user_data);
            } else {
                var t = $('.red-shadow').eq(0).offset().top;
                $('body').scrollTop(t);
                $(this).prop('disabled', false);
            }
            return false;
        }
        if ($('.bank-cn').css('display') == 'block') {
            var can_next = true;
            $('.bank-cn .account_number').css('border-color', '#ccc').removeClass('red-shadow');
            var account_number = $('.bank-cn .bank_name').val();
            if (account_number == '') {
                $('.bank-us-other .account_number').css('border-color', 'red').addClass('red-shadow');
                can_next = false;
            }
            if (can_next) {
                user_data.bank_us.account_number = account_number;
                updateUserInfo(user_data);
            } else {
                var t = $('.red-shadow').eq(0).offset().top;
                $('body').scrollTop(t);
                $(this).prop('disabled', false);
            }
            return false;
        }
        if ($('.bank-cn-other').css('display') == 'block') {
            var can_next = true;
            $('.bank-cn-other .bank_name,.bank-cn-other .bank_address,.bank-cn-other .swift_code,.bank-cn-other .account_number').css('border-color', '#ccc').removeClass('red-shadow');
            var bank_name = $('.bank-cn-other .bank_name').val();
            var bank_address = $('.bank-cn-other .bank_address').val();
            var swift_code = $('.bank-cn-other .swift_code').val();
            var account_number = $('.bank-cn-other .account_number').val();
            var middle_bank_name = $('.bank-cn-other .middle_bank_name').val();
            var middle_bank_address = $('.bank-cn-other .middle_bank_address').val();
            var middle_bank_swift_code = $('.bank-cn-other .middle_bank_swift_code').val();
            if (bank_name == '') {
                $('.bank-cn-other .bank_name').css('border-color', 'red').addClass('red-shadow');
                can_next = false;
            }
            if (bank_address == '') {
                $('.bank-cn-other .bank_address').css('border-color', 'red').addClass('red-shadow');
                can_next = false;
            }
            if (swift_code == '') {
                $('.bank-cn-other .swift_code').css('border-color', 'red').addClass('red-shadow');
                can_next = false;
            }
            if (account_number == '') {
                $('.bank-cn-other .account_number').css('border-color', 'red').addClass('red-shadow');
                can_next = false;
            }
            if (can_next) {
                user_data.bank_us.account_number = account_number;
                updateUserInfo(user_data);
            } else {
                var t = $('.red-shadow').eq(0).offset().top;
                $('body').scrollTop(t);
                $(this).prop('disabled', false);
            }
            return false;
        }
    });

    $('.prev-two').click(function () {
        window.location = '/white_label/address_info.html?' +
            'product_id=' + product_id + '&phone=' + phone + '&partner_id=' + partner_id + '&order_number=' + order_number + '&voucher=' + voucher;
    });

    //点击切换银行类型
    $('.banks').on('click', '.button-white', function () {
        $(this).addClass('button-blue').removeClass('button-white');
        if ($(this).hasClass('non-us-bank')) {
            $('.us-bank').addClass('button-white').removeClass('button-blue');
            user_data.bank_type = 'NON_US';
            getCnBank();
        }
        if ($(this).hasClass('us-bank')) {
            $('.non-us-bank').addClass('button-white').removeClass('button-blue');
            user_data.bank_type = 'US';
            getUsBank();
        }
        return false;
    });

    // 选择常用银行或自己填写
    $('.bank-list').on('click', '.choose-bank', function () {
        $('.step-three').prop('disabled', false);
        $('.banks').hide();
        var len = $('.bank-list a').length;
        var index = $(this).closest('a').index();
        if (index < len - 1) {
            var bank_data;
            if (user_data.bank_type == 'US') {
                bank_data = bankUs[index];
                user_data.bank_us.bank_name = bank_data.bank_name_en;
                user_data.bank_us.bank_address = bank_data.bank_address;
                user_data.bank_us.swift_code = bank_data.bank_swift_code;
                user_data.bank_us.routing_number = bank_data.routing_number;
                writeBankUs(bank_data);
                return false;
            }
            if (user_data.bank_type == 'NON_US') {
                bank_data = bankNonUs[index];
                user_data.bank_non_us.bank_name = bank_data.bank_name_en;
                user_data.bank_non_us.bank_address = bank_data.bank_address;
                user_data.bank_non_us.swift_code = bank_data.bank_swift_code;
                user_data.bank_non_us.middle_bank_name = bank_data.middle_bank_name;
                user_data.bank_non_us.middle_bank_address = bank_data.middle_bank_address;
                user_data.bank_non_us.middle_bank_swift_code = bank_data.middle_bank_swift_code;
                writeBankCn(bank_data);
                return false;
            }
        } else {
            if (user_data.bank_type == 'US') {
                writeBankUsOther();
                return false;
            }
            if (user_data.bank_type == 'NON_US') {
                writeBankCnOther();
                return false;
            }
        }
        return false;
    });


    // 已选银行，再次切换银行
    $('.search_bank, .bank_home').on('click', function () {
        $('.step-three').prop('disabled', false);
        $('.error').remove();
        if (user_data.bank_type == 'US') {
            getUsBank();
            $('.us-bank').addClass('button-blue').removeClass('button-white');
            $('.non-us-bank').addClass('button-white').removeClass('button-blue');
            $('.banks').show().siblings('.bank-us,.bank-us-other,.bank-cn,.bank-cn-other,.middle-bank').hide();
            return false;
        }
        if (user_data.bank_type == 'NON_US') {
            getCnBank();
            $('.us-bank').addClass('button-white').removeClass('button-blue');
            $('.non-us-bank').addClass('button-blue').removeClass('button-white');
            $('.banks').show().siblings('.bank-us,.bank-us-other,.bank-cn,.bank-cn-other,.middle-bank').hide();
            return false;
        }
    });
    // 获取非美银行列表
    function getCnBank() {
        var base_bank_data = {'type': '1'};
        getData({
            data: base_bank_data,
            url: base_url + '/white_label/invest/access_bank_dic',
            async: false,
            sucFn: getCnSuc,
            failFn: failFn
        });
    }

    function getCnSuc(res) {
        var d = res.body;
        if (d && d != null) {
            bankNonUs = d;
            var html = '';
            $.each(d, function (i, item) {
                html +=
                    '<a>' +
                    '<div class="col-md-4">' +
                    '<div class="form-line choose-bank">' +
                    '<div style="float: left; width: 30%; height:60px;">' +
                    '<img class="bank-icon" style="margin-top: 10px;"' +
                    'src="' + item.bank_url + '"' +
                    'alt="">' +
                    '</div>' +
                    '<div style="float: right; width: 70%; height:60px;">' +
                    '<p style="text-align: left;">' + item.bank_name_cn + '</p>' +
                    '<p style="text-align: left;">' + item.bank_name_en + '</p>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</a>';
            });
            html +=
                '<a>' +
                '<div class="col-md-4">' +
                '<div class="form-line choose-bank">' +
                '<div style="float: left; width: 30%; height:60px;">' +
                '<img class="bank-icon" style="margin-top: 10px; width: 38px"' +
                'src="http://localhost:8080/version/dist/img/other_bank.png"' +
                'alt="">' +
                '</div>' +
                '<div style="float: right; width: 70%; height:60px;">' +
                '<p style="text-align: left; font-size: 18px; line-height: 60px; color: #159bd6;">' +
                '其他银行</p>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</a>';
            $('.bank-list').html(html);
        }
    }

    // 获取美国银行列表
    function getUsBank() {
        var base_bank_data = {'type': '2'};
        getData({
            data: base_bank_data,
            url: base_url + '/white_label/invest/access_bank_dic',
            async: false,
            sucFn: getUsSuc,
            failFn: failFn
        });
    }

    function getUsSuc(res) {
        var d = res.body;
        if (d && d != null) {
            bankUs = d;
            var html = '';
            $.each(d, function (i, item) {
                html +=
                    '<a>' +
                    '<div class="col-md-4">' +
                    '<div class="form-line choose-bank">' +
                    '<div style="float: left; width: 30%; height:60px;">' +
                    '<img class="bank-icon" style="margin-top: 10px;"' +
                    'src="' + item.bank_url + '"' +
                    'alt="">' +
                    '</div>' +
                    '<div style="float: right; width: 70%; height:60px;">' +
                    '<p style="text-align: left;">' + item.bank_name_en + '</p>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</a>';
            });
            html +=
                '<a>' +
                '<div class="col-md-4">' +
                '<div class="form-line choose-bank">' +
                '<div style="float: left; width: 30%; height:60px;">' +
                '<img class="bank-icon" style="margin-top: 10px; width: 38px"' +
                'src="http://localhost:8080/version/dist/img/other_bank.png"' +
                'alt="">' +
                '</div>' +
                '<div style="float: right; width: 70%; height:60px;">' +
                '<p style="text-align: left; font-size: 18px; line-height: 60px; color: #159bd6;">' +
                '其他银行</p>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</a>';
            $('.bank-list').html(html);
        }
    }

    function bankInfo(res) {
        var d = res.body;
        if (d != null && d != '') {
            user_data = d;
            if (user_data.bank_type == '' || user_data.bank_type == null) {
                user_data.bank_type = 'NON_US';
            }
            if (d.bank_type == 'US') {

            } else {

            }
        }
    }


    // 写入美国银行信息
    function writeBankUs(data) {
        if (data) {
            if (data.bank_url) {
                $('.bank-us .bank_url img').attr('src', data.bank_url);
            }
            if (data.bank_name_en) {
                $('.bank-us .bank_name_en').html(data.bank_name_en);
            }
            if (data.bank_swift_code) {
                $('.bank-us .swift_code').html('SWIFT：' + data.bank_swift_code);
            }
            if (data.routing_number) {
                $('.bank-us .routing_number').val(data.routing_number);
            }
            if (data.account_number) {
                $('.bank-us .account_number').val(data.account_number);
            }
            if (data.account_type == 'Savings') {
                $('.bank-us .account_type .savings').addClass('checked').siblings('.checking').removeClass('checked');
            } else {
                $('.bank-us .account_type .checking').addClass('checked').siblings('.savings').removeClass('checked');
            }
        }
        $('.bank-us').show().siblings('.bank-us-other,.bank-cn,.bank-cn-other,.middle-bank').hide();
    }

    // 写入非美银行信息
    function writeBankCn(data) {
        if (data) {
            if (data.bank_url != '' && data.bank_url != null && data.bank_url != undefined) {
                $('.bank-cn .bank_url img').attr('src', data.bank_url);
            }
            if (data.bank_name_cn) {
                $('.bank-cn .bank_name_cn').html(data.bank_name_cn);
            }
            if (data.bank_name_en) {
                $('.bank-cn .bank_name_en').html(data.bank_name_en);
            }
            if (data.swift_code) {
                $('.bank-cn .swift_code').html('SWIFT：' + data.swift_code);
            }
            if (data.account_number) {
                $('.bank-cn .account_number').val(data.account_number);
            }
            if (data.bank_name) {
                $('.bank-cn .bank_name_en').html(data.bank_name);
            }
        }
        $('.bank-cn').show().siblings('.bank-us-other,.bank-us,.bank-cn-other,.middle-bank').hide();
    }

    // 写入美国其他银行信息
    function writeBankUsOther(data) {
        if (data) {
            if (data.bank_name) {
                $('.bank-us-other .bank_name').val(data.bank_name);
            }
            if (data.bank_address) {
                $('.bank-us-other .bank_address').val(data.bank_address);
            }
            if (data.swift_code) {
                $('.bank-us-other .swift_code').val(data.swift_code);
            }
            if (data.routing_number) {
                $('.bank-us-other .routing_number').val(data.routing_number);
            }
            if (data.account_number) {
                $('.bank-us-other .account_number').val(data.account_number);
            }
            if (data.account_type == 'Savings') {
                $('.bank-us-other .account_type .savings').addClass('checked').siblings('.checking').removeClass('checked');
            } else {
                $('.bank-us-other .account_type .checking').addClass('checked').siblings('.savings').removeClass('checked');
            }
        }
        $('.bank-us-other').show().siblings('.bank-cn,.bank-us,.bank-cn-other,.middle-bank').hide();
    }

    // 写入非美其他银行信息
    function writeBankCnOther(data) {
        if (data) {
            if (data.bank_name) {
                $('.bank-cn-other .bank_name').val(data.bank_name);
            }
            if (data.bank_address) {
                $('.bank-cn-other .bank_address').val(data.bank_address);
            }
            if (data.swift_code) {
                $('.bank-cn-other .swift_code').val(data.swift_code);
            }
            if (data.account_number) {
                $('.bank-cn-other .account_number').val(data.account_number);
            }
            if (data.have_middle_bank) {
                $('.bank-cn-other .middle_bank_name').val(data.middle_bank_name);
                $('.bank-cn-other .middle_bank_address').val(data.middle_bank_address);
                $('.bank-cn-other .middle_bank_swift_code').val(data.middle_bank_swift_code);
            }
        }
        $('.bank-cn-other,.middle-bank').show().siblings('.bank-us-other,.bank-us,.bank-cn').hide();
    }

    // 提交信息
    function updateUserInfo(data) {
        postData({
            url: base_url + '/white_label/invest/operate_user',
            data: JSON.stringify(data),
            async: false,
            sucFn: updateSuc,
            failFn: failFn
        })
    }

    function updateSuc(res) {
        console.log(res.msg);
        window.location = '/white_label/signature.html?' +
            'product_id=' + product_id + '&phone=' + phone + '&partner_id=' + partner_id + '&voucher=' + voucher + '&order_number=' + res.body.order_number;
    }

    function failFn(res) {
        alert(res.msg);
    }

    $('input,textarea').focus(function () {
        $(this).css('border-color', '#ccc');
    })
});
