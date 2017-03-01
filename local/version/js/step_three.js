$(function () {
    $('#product_head ul li[data-name="产品"]').addClass('active');

    var user_data = {}; // 定义用户信息数据
    var user_phone = getUrlParam('phone') || ''; // 通过手机号查找用户信息
    var partner_id = getUrlParam('partner_id') || ''; // 渠道编码
    var product_id = getUrlParam('product_id') || ''; //获取产品id
    var order_number = getUrlParam('order_number') || ''; // 获取订单编号

    $('.prev-two').on('click', function () {
        window.location = '/auxiliary_order/stepTwo.html?' +
            'product_id=' + product_id + '&phone=' + user_phone + '&partner_id=' + partner_id + '&order_number=' + order_number;
    });
    // 第三步提交信息
    $(".step-three").on('click', function () {
        $(this).prop('disabled', true);
        var next_step = true;
        var bank_type;
        if ($('.non-us-bank').hasClass('button-blue')) {
            bank_type = 'NON_US';
        } else {
            bank_type = 'US';
        }
        var bank_name = $("#bank-name").val();
        var bank_address = $("#bank-address").val();
        var swift_code = $("#swift-code").val();
        var routing_number = $("#routing-number").val() || '';
        var account_number = $("#account-number").val();
        var middle_bank_name = $("#middle-bank-name").val() || '';
        var middle_bank_address = $("#middle-bank-address").val() || '';
        var middle_bank_swift_code = $("#middle-bank-swift-code").val() || '';
        var have_middle_bank = 0;
        var account_type = 'Checking';
        if (bank_name == '') {
            $("#bank-name").addClass('red-shadow');
            next_step = false;
        }
        if (bank_address == '') {
            $("#bank-address").addClass('red-shadow');
            next_step = false;
        }
        if (swift_code == '') {
            $("#swift-code").addClass('red-shadow');
            next_step = false;
        }
        if (bank_type == 'US') {
            if (routing_number == '') {
                $("#routing-number").addClass('red-shadow');
                next_step = false;
            }
            if ($('#saving').hasClass('checked')) {
                account_type = 'Savings'
            } else {
                account_type = 'Checking';
            }
        } else {
            if (middle_bank_name != '' && middle_bank_address != '' && middle_bank_swift_code != '') {
                have_middle_bank = 1;
            }
        }
        if (account_number == '') {
            $("#account-number").addClass('red-shadow');
            next_step = false;
        }

        if (!next_step) {
            var t = $('.red-shadow').eq(0).offset().top;
            $('body').scrollTop(t);
            $(this).prop('disabled', false);
        } else {
            user_data.channel_code = partner_id;
            user_data.product_id = product_id;
            user_data.order_number = order_number;
            user_data.phone = user_phone;
            user_data.bank_type = bank_type;
            if (bank_type == 'NON_US') {
                user_data.bank_non_us = {};
                user_data.bank_non_us.bank_name = bank_name;
                user_data.bank_non_us.bank_address = bank_address;
                user_data.bank_non_us.swift_code = swift_code;
                // user_data.bank_non_us.routing_number = routing_number;
                user_data.bank_non_us.account_number = account_number;
                user_data.bank_non_us.have_middle_bank = have_middle_bank;
                if (have_middle_bank) {
                    user_data.bank_non_us.middle_bank_name = middle_bank_name;
                    user_data.bank_non_us.middle_bank_address = middle_bank_address;
                    user_data.bank_non_us.middle_bank_swift_code = middle_bank_swift_code;
                }
            } else {
                user_data.bank_us = {};
                user_data.bank_us.bank_name = bank_name;
                user_data.bank_us.bank_address = bank_address;
                user_data.bank_us.swift_code = swift_code;
                user_data.bank_us.routing_number = routing_number;
                user_data.bank_us.account_number = account_number;
                user_data.bank_us.account_type = account_type;
            }
            postData({
                url: base_url + '/zion/assist/operateUser',
                data: JSON.stringify(user_data),
                headers: {
                    mx_secret: $.cookie('mx_secret'), mx_token: $.cookie('mx_token')
                },
                contentType: "application/json; charset=utf-8",
                sucFn: stepThreeSuccess,
                failFn: stepThreeFail
            })
            function stepThreeSuccess(res) {
                var d = res.body;
                if (d) {
                    window.location = '/auxiliary_order/information_validation.html?' +
                        'product_id=' + product_id + '&phone=' + user_phone + '&partner_id=' + partner_id + '&order_number=' + order_number;
                }

            }

            function stepThreeFail(res) {
                $('.step-three').prop('disabled', false);
                alert(res.msg)
            }
        }
        return false;
    });


    // 手机号不为空，查找用户银行信息
    if (user_phone != '') {
        getData({
            url: base_url + '/zion/assist/customerInfo',
            data: {phone: user_phone},
            headers: {
                mx_secret: $.cookie('mx_secret'), mx_token: $.cookie('mx_token')
            },
            sucFn: bankInfo,
            failFn: noBankInfo
        })
    }
    // 获取银行信息成功
    function bankInfo(res) {
        alertMsg(res.msg);
        var d = res.body;
        if (d && d != null) {
            user_data = d;
            if (d.bank_type == 'US') {
                $('.non-us-bank').addClass('button-white').removeClass('button-blue');
                $('.us-bank').addClass('button-blue').removeClass('button-white');
                $(".middle-bank").hide();
                $(".checking-saving").show();
                $("#routing-number-wrapper").show();
                if (d.bank_us) {
                    $('#bank-name').val(d.bank_us.bank_name);
                    $('#bank-address').val(d.bank_us.bank_address);
                    $('#swift-code').val(d.bank_us.swift_code);
                    $('#routing-number').val(d.bank_us.routing_number);
                    $('#account-number').val(d.bank_us.account_number);
                    if (d.bank_us.account_type == 'Savings') {
                        $("#saving").addClass('checked');
                        $("#checking").removeClass('checked');
                    } else {
                        $("#saving").removeClass('checked');
                        $("#checking").addClass('checked');
                    }
                    if (d.bank_us.swift_code == '' || d.bank_us.swift_code == null) {
                        $('.banks').show();
                    }
                }
            } else {
                $('.non-us-bank').addClass('button-blue').removeClass('button-white');
                $('.us-bank').addClass('button-white').removeClass('button-blue');
                $(".middle-bank").show();
                $(".checking-saving").hide();
                $("#routing-number-wrapper").hide();
                $('#bank-name').val(d.bank_non_us.bank_name);
                $('#bank-address').val(d.bank_non_us.bank_address);
                $('#swift-code').val(d.bank_non_us.swift_code);
                $('#account-number').val(d.bank_non_us.account_number);
                if (d.bank_non_us.have_middle_bank) {
                    $('.middle-bank-info').show();
                    $('#middle-bank-name').val(d.bank_non_us.middle_bank_name);
                    $('#middle-bank-address').val(d.bank_non_us.middle_bank_address);
                    $('#middle-bank-swift-code').val(d.bank_non_us.middle_bank_swift_code);
                }
                if (d.bank_non_us.swift_code == '' || d.bank_non_us.swift_code == null) {
                    $('.banks').show();
                }
            }
        }
    }

    function noBankInfo(res) {
        alert(res.msg);
    }

    //选择美国银行或非美银行
    $(".non-us-bank").on('click', function () {
        $(".common-bank-detail input").val('');
        $(".common-bank-detail textarea").val('');
        $(this).addClass('button-blue').removeClass('button-white');
        $('.us-bank').addClass('button-white').removeClass('button-blue');
        $(".middle-bank").show();
        $(".middle-bank-info").show();
        $(".checking-saving").hide();
        $("#routing-number-wrapper").hide();
        // $("#swift-code").prev().html('Swiftcode');
    });
    $(".us-bank").on('click', function () {
        $(".common-bank-detail input").val('');
        $(".common-bank-detail textarea").val('');
        $(this).addClass('button-blue').removeClass('button-white');
        $('.non-us-bank').addClass('button-white').removeClass('button-blue');
        $(".middle-bank").hide();
        $(".middle-bank-info").hide();
        $(".checking-saving").show();
        $("#routing-number-wrapper").show();
        // $("#swift-code").prev().html('Routing Number');
    });

    //点击查找银行
    $(".button").on('click', function () {
        $('input').removeClass('red-shadow');
        $('textarea').removeClass('red-shadow');
        var non_us = $(".non-us-bank").hasClass('button-blue');
        var us = $(".us-bank").hasClass('button-blue');
        if (non_us) {
            var data = {'type': '1'};
            $.ajax({
                type: 'get',
                dataType: 'json',
                contentType: 'application/json',
                data: data,
                url: base_url + '/white_label/invest/access_bank_dic',
                success: function (res) {
                    d = res.body;
                    var html = '';
                    $.each(d, function (i) {
                        html += '<a><div class="col-md-4"><div class="form-line choose-bank">' +
                            '<div style="float: left; width: 30%; height:60px;"><img class="bank-icon" style="margin-top: 10px;" src="' + d[i].bank_url + '" alt=""></div> ' +
                            '<div style="float: right; width: 70%; height:60px;"><p style="text-align: left;">' + d[i].bank_name_cn + '</p><p style="text-align: left;">' + d[i].bank_name_en + '</p></div>' +
                            '</div></div></a>';
                    });
                    $(".bank-list").empty().append(html);
                }
            });
        }
        if (us) {
            var data = {'type': '2'};
            $.ajax({
                type: 'get',
                dataType: 'json',
                contentType: 'application/json',
                data: data,
                url: base_url + '/white_label/invest/access_bank_dic',
                success: function (res) {
                    d = res.body;
                    var html = '';
                    $.each(d, function (i) {
                        html += '<a><div class="col-md-4"><div class="form-line choose-bank">' +
                            '<div style="float: left; width: 30%; height: 50px;"><img class="bank-icon" style="margin-top: 5px;" src="' + d[i].bank_url + '" alt=""></div> ' +
                            '<div style="float: right; width: 70%; margin-top: 7px;"><p style="text-align: left;">' + d[i].bank_name_cn + '</p><p style="text-align: left;">' + d[i].bank_name_en + '</p></div>' +
                            '</div></div></a>';
                    });
                    $(".bank-list").empty().append(html);
                }
            });
        }
    });

    //选择银行后添加和去除样式
    $("body").on('click', '.choose-bank', function () {
        //$(this).addClass('has_checked').closest('a').siblings('a').find('.choose-bank').removeClass('has_checked');
        var index = $(this).closest('a').prev('a').index();

        $('#Modal').modal('hide');

        if ($(".us-bank").hasClass('button-blue')) {
            $('#Modal').modal('hide');
            $("#bank-name").val(d[index + 1].bank_name_en);
            $("#bank-address").val(d[index + 1].bank_address);
            $("#swift-code").val(d[index + 1].bank_swift_code);
            $("#routing-number").val(d[index + 1].routing_number);
            $("#account-number").val('');
            $("#middle-bank-name").val(d[index + 1].middle_bank_name);
            $("#middle-bank-address").val(d[index + 1].middle_bank_address);
            $("#middle-bank-swift-code").val(d[index + 1].middle_bank_swift_code);
        } else {
            $('#Modal').modal('hide');
            $("#bank-name").val(d[index + 1].bank_name_en);
            $("#bank-address").val(d[index + 1].bank_address);
            $("#swift-code").val(d[index + 1].bank_swift_code);
            $("#account-number").val('');
            $("#middle-bank-name").val(d[index + 1].middle_bank_name);
            $("#middle-bank-address").val(d[index + 1].middle_bank_address);
            $("#middle-bank-swift-code").val(d[index + 1].middle_bank_swift_code);
        }

    });
    //选中checking or saving
    $("#checking").on('click', function () {
        $(this).addClass('checked');
        $("#saving").removeClass('checked');
    });

    $("#saving").on('click', function () {
        $(this).addClass('checked');
        $("#checking").removeClass('checked');
    });

    $('#Modal').modal({
        show: false,
        backdrop: '/channel-static'
    });
});