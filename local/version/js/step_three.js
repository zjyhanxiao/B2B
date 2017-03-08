$(function () {
    var user_data = {};// 定义用户信息数据
    var phone = getUrlParam('phone') || ''; // 通过手机号查找用户信息
    var partner_id = getUrlParam('partner_id') || ''; // 渠道编码
    var product_id = getUrlParam('product_id') || ''; //获取产品id
    var order_number = getUrlParam('order_number') || ''; // 获取订单编号
    var access_token = getUrlParam('access_token') || ''; // 获取通行证
    var bankUs = '', bankNonUs = '';

    getCnBank(); // 默认加载非美国常用银行
    // 获取用户银行信息
    if (phone != '') {
        getData({
            url: base_url + '/zion/assist/customerOrderInfo',
            data: {phone: phone, order_number: order_number},
            async: false,
            headers: {
                mx_secret: $.cookie('mx_secret'), mx_token: $.cookie('mx_token')
            },
            contentType: "application/json; charset=utf-8",
            sucFn: bankInfo,
            failFn: failFn
        })
    }
    $('.step-three').on('click', function () {
        user_data.product_id = product_id;
        user_data.channel_code = partner_id;
        user_data.order_number = order_number;
        user_data.phone = phone;
        user_data.access_token = access_token;
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
            var account_type = $('.bank-us .account_type .checked').html();
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
                user_data.bank_us.account_type = account_type;
                updateUserInfo();
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
            var account_type = $('.bank-us-other .account_type .checked').html();
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
                user_data.bank_us.account_type = account_type;
                updateUserInfo();
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
            var account_number = $('.bank-cn .account_number').val();
            if (account_number == '') {
                $('.bank-us-other .account_number').css('border-color', 'red').addClass('red-shadow');
                can_next = false;
            }
            if (can_next) {
                user_data.bank_non_us.account_number = account_number;
                console.log(JSON.stringify(user_data));
                updateUserInfo();
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
                user_data.bank_non_us.bank_name = bank_name;
                user_data.bank_non_us.bank_address = bank_address;
                user_data.bank_non_us.swift_code = swift_code;
                user_data.bank_non_us.account_number = account_number;
                if (middle_bank_name != '' && middle_bank_address != '' && middle_bank_swift_code != '') {
                    user_data.bank_non_us.have_middle_bank = 1;
                    user_data.bank_non_us.middle_bank_name = middle_bank_name;
                    user_data.bank_non_us.middle_bank_address = middle_bank_address;
                    user_data.bank_non_us.middle_bank_swift_code = middle_bank_swift_code;
                }
                updateUserInfo();
            } else {
                var t = $('.red-shadow').eq(0).offset().top;
                $('body').scrollTop(t);
                $(this).prop('disabled', false);
            }
            return false;
        }
        return false;
    });

    $('.prev-two').click(function () {
        window.location = '/auxiliary_order/stepTwo.html?' +
            'product_id=' + product_id + '&phone=' + phone + '&partner_id=' + partner_id + '&order_number=' + order_number;
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
                bank_data.account_number = '';
                user_data.bank_us.bank_name = bank_data.bank_name_en;
                user_data.bank_us.bank_address = bank_data.bank_address;
                user_data.bank_us.swift_code = bank_data.bank_swift_code;
                user_data.bank_us.routing_number = bank_data.routing_number;
                writeBankUs(bank_data);
                return false;
            }
            if (user_data.bank_type == 'NON_US') {
                bank_data = bankNonUs[index];
                bank_data.account_number = '';
                user_data.bank_non_us.bank_name = bank_data.bank_name_en;
                user_data.bank_non_us.bank_address = bank_data.bank_address;
                user_data.bank_non_us.swift_code = bank_data.bank_swift_code;
                user_data.bank_non_us.middle_bank_name = bank_data.middle_bank_name;
                user_data.bank_non_us.middle_bank_address = bank_data.middle_bank_address;
                user_data.bank_non_us.middle_bank_swift_code = bank_data.middle_bank_swift_code;
                if (bank_data.middle_bank_address != '' && bank_data.middle_bank_swift_code != '' && bank_data.middle_bank_address != '') {
                    user_data.bank_non_us.have_middle_bank = 1;
                }
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
    // 切换账户类型
    $('.account_type button').click(function () {
        if ($(this).hasClass('checked')) {
            return false;
        } else {
            $(this).addClass('checked').siblings('button').removeClass('checked');
        }
    });

    // 已选银行，再次切换银行
    $('.changeBank').on('click', function () {
        $('.step-three').prop('disabled', false);
        $('input,textarea').val('');
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
                'src="/version/dist/img/other_bank.png"' +
                'alt="">' +
                '</div>' +
                '<div style="float: right; width: 70%; height:60px;">' +
                '<p style="text-align: left; font-size: 14px; line-height: 60px; color: #159bd6;">' +
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
                'src="/version/dist/img/other_bank.png"' +
                'alt="">' +
                '</div>' +
                '<div style="float: right; width: 70%; height:60px;">' +
                '<p style="text-align: left; font-size: 14px; line-height: 60px; color: #159bd6;">' +
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
        if (d && d != null) {
            user_data = d;
            if (user_data.bank_type == '' || user_data.bank_type == null) {
                user_data.bank_type = 'NON_US';
            }
            if (d.bank_type == 'US' && d.bank_us.swift_code != null) {
                $('.banks').hide();
                if (d.bank_url && d.bank_name_cn) {
                    var bank_us_data = d.bank_us;
                    bank_us_data.bank_name_cn = d.bank_name_cn;
                    bank_us_data.bank_url = d.bank_url;
                    writeBankUs(bank_us_data);
                } else {
                    writeBankUsOther(d.bank_us);
                }
                return false;
            }
            if (d.bank_type == 'NON_US' && d.bank_non_us.swift_code != null) {
                $('.banks').hide();
                if (d.bank_url && d.bank_name_cn) {
                    var bank_cn_data = d.bank_non_us;
                    bank_cn_data.bank_name_cn = d.bank_name_cn;
                    bank_cn_data.bank_url = d.bank_url;
                    writeBankCn(bank_cn_data);
                } else {
                    writeBankCnOther(d.bank_non_us);
                }
                return false;
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
            if (data.bank_name) {
                $('.bank-us .bank_name_en').html(data.bank_name);
            }
            if (data.bank_swift_code) {
                $('.bank-us .swift_code').html('SWIFT：' + data.bank_swift_code);
            }
            if (data.swift_code) {
                $('.bank-us .swift_code').html('SWIFT：' + data.swift_code);
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
            if (data.bank_name) {
                $('.bank-cn .bank_name_en').html(data.bank_name);
            }
            if (data.swift_code) {
                $('.bank-cn .swift_code').html('SWIFT：' + data.swift_code);
            }
            if (data.bank_swift_code) {
                $('.bank-cn .swift_code').html('SWIFT：' + data.bank_swift_code);
            }
            if (data.account_number) {
                $('.bank-cn .account_number').val(data.account_number);
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
    function updateUserInfo() {
        delete user_data['bank_url'];
        delete user_data['bank_name_cn'];
        delete user_data['bank_us']['bank_url'];
        delete user_data['bank_us']['bank_name_cn'];
        delete user_data['bank_non_us']['bank_url'];
        delete user_data['bank_non_us']['bank_name_cn'];
        if (order_number == '') {
            postData({
                url: base_url + '/zion/white_label/operate_user',
                data: JSON.stringify(user_data),
                async: false,
                contentType: "application/json; charset=utf-8",
                sucFn: updateSuc,
                failFn: failFn
            });
            postData({
                url: base_url + '/zion/white_label/create_order',
                data: JSON.stringify(user_data),
                async: false,
                contentType: "application/json; charset=utf-8",
                sucFn: updateSuc,
                failFn: failFn
            });
        } else {
            postData({
                url: base_url + '/zion/white_label/operate_user',
                data: JSON.stringify(user_data),
                async: false,
                contentType: "application/json; charset=utf-8",
                sucFn: updateSuc,
                failFn: failFn
            });
        }
    }

    function updateSuc(res) {
        var d = res.body;
        if (d && d.order_number) {
            order_number = d.order_number;
        }
        if (order_number !== '') {
            window.location = '/white_label/signature.html?' +
                'product_id=' + product_id + '&phone=' + phone + '&partner_id=' + partner_id + '&access_token=' + access_token + '&order_number=' + order_number;
        }
    }

    function failFn(res) {
        alert(res.msg);
    }

    $('input,textarea').focus(function () {
        $(this).css('border-color', '#ccc');
    })
});
