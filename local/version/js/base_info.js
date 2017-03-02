$(function () {
    var user_data = {}; // 用户数据
    var phone = getUrlParam('phone') || ''; // 通过手机号查找用户信息
    var partner_id = getUrlParam('partner_id') || ''; // 渠道编码
    var product_id = getUrlParam('product_id') || ''; //获取产品id
    var order_number = getUrlParam('order_number') || ''; // 获取订单编号
    var voucher = getUrlParam('voucher') || ''; // 获取通行证

    var passport_photo_default = $('#fileMapping img').attr('src');
    $('.step-one').on('click', function () {
        var passport_photo = $('#fileMapping img').attr('src');
        if (passport_photo == passport_photo_default) {
            passport_photo = '';
        }
        $(this).prop('disabled', true);
        var next_step = true;
        var last_name = $("#last_name").val();
        var first_name = $("#first_name").val();
        phone = $('#phone-code').val() + ' ' + $("#phone").val();
        var email = $("#email").val();
        var date_of_birth = $("#date-of-birth").val();
        var source_of_income = $("#source-of-income").val();
        var industry = $("#industry").val();
        var occupation = $("#occupation").val();
        var passport_number = $("#passport-number").val();
        var effective = $("#effective").val();
        var birth_reg = /^[1][0-9][0-9][0-9]-[0-1]{0,1}[0-9]-[0-3]{0,1}[0-9]$/;
        var reg = /^[2][0-9][0-9][0-9]-[0-1]{0,1}[0-9]-[0-3]{0,1}[0-9]$/;
        var passport_arr = passport_number.split('');
        var passport_len = passport_arr.length;
        if (last_name == '') {
            $("#last_name").addClass('red-shadow');
            next_step = false;
        }
        if (first_name == '') {
            $("#first_name").addClass('red-shadow');
            next_step = false;
        }
        if (phone == '' || phone.length < 6) {
            $("#phone").addClass('red-shadow');
            next_step = false;
        }
        if (email == '') {
            $("#email").addClass('red-shadow');
            next_step = false;
        }
        if (email.indexOf('@') == -1 || email.indexOf('.') == -1) {
            $('#email').addClass('red-shadow');
            next_step = false;
        }
        if (date_of_birth == '') {
            next_step = false;
            $("#date-of-birth").addClass('red-shadow');
        }
        if (!birth_reg.test(date_of_birth)) {
            next_step = false;
            $("#date-of-birth").addClass('red-shadow');
        }
        if (source_of_income == '') {
            next_step = false;
            $("#source-of-income").addClass('red-shadow');
        }
        if (industry == '') {
            next_step = false;
            $("#industry").addClass('red-shadow');
        }
        if (occupation == '') {
            next_step = false;
            $("#occupation").addClass('red-shadow');
        }
        if (occupation == '') {
            next_step = false;
            $("#occupation").addClass('red-shadow');
        }
        if (passport_number == '') {
            next_step = false;
            $("#passport-number").addClass('red-shadow');
        }
        if (passport_len != 9) {
            next_step = false;
            $("#passport-number").addClass('red-shadow');
        }
        if (effective == '') {
            next_step = false;
            $("#effective").addClass('red-shadow');
        }
        if (passport_photo == '') {
            next_step = false;
            $("#passport-false").show();
            $('body').scrollTop($('#passport-false').eq(0).offset().top);
        }
        if (!reg.test(effective)) {
            $("#effective").addClass('red-shadow');
        }
        if (!next_step) {
            var t = $('.red-shadow').eq(0).offset().top;
            $('body').scrollTop(t);
            $(this).prop('disabled', false);
        } else {
            user_data.channel_code = partner_id;
            user_data.product_id = product_id;
            user_data.order_number = order_number;
            user_data.phone = phone;
            user_data.last_name = last_name;
            user_data.first_name = first_name;
            user_data.email = email;
            user_data.investor_type = 1;
            user_data.base_info = {};
            user_data.base_info.date_of_birth = date_of_birth;
            user_data.base_info.source_of_capital = source_of_income;
            user_data.base_info.country_of_birth = '中国';
            user_data.base_info.country_of_tax_residency = '中国';
            user_data.base_info.foreign_tax_number = 'CN N/A';
            user_data.base_info.nationality = '中国';
            user_data.base_info.industry = industry;
            user_data.base_info.occupation = occupation;
            user_data.passport_number = passport_number;
            user_data.passport_expire_date = effective;
            user_data.passport_url = passport_photo;
            user_data.voucher = voucher;
            user_data.product_id = product_id;
            postData({
                url: base_url + '/zion/white_label/operate_user',
                data: JSON.stringify(user_data),
                contentType: "application/json; charset=utf-8",
                sucFn: stepOneSuccess,
                failFn: stepOneFail
            });
            function stepOneSuccess(res) {
                var d = res.body;
                if (d != null && d.order_number != '' && d.order_number != null && d.order_number != undefined) {
                    order_number = d.order_number;
                }
                if (order_number == '') {
                    window.location = '/white_label/address_info.html?' +
                        'product_id=' + product_id + '&phone=' + phone + '&partner_id=' + partner_id + '&voucher=' + voucher;
                } else {
                    window.location = '/white_label/address_info.html?' +
                        'product_id=' + product_id + '&phone=' + phone + '&partner_id=' + partner_id + '&order_number=' + order_number + '&voucher=' + voucher;
                }


            }

            function stepOneFail(res) {
                $('.step-one').prop('disabled', false);
                alert(res.msg)
            }
        }
        return false;
    });

    //获取行业
    var industry_data = {'industry': ''};
    $.ajax({
        type: 'post',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(industry_data),
        async: false,
        url: base_url + '/white_label/invest/access_careers',
        success: function (res) {
            var d = res.body;
            var html = '';
            $.each(d, function (i) {
                html += '<option value="' + d[i].nameCn + '">' + d[i].nameCn + '</option>';
            });
            $("#industry").empty().append("<option value=''>" + '请选择' + "</option>" + html);
        }
    });

    //获取职业
    $("#industry").on('change', function () {
        $("#occupation").prop('disabled', false);
        var industry = $("#industry").val();
        if (industry != '') {
            var data = {'industry': industry};
            var pd = JSON.stringify(data);
            $.ajax({
                type: 'post',
                dataType: 'json',
                contentType: 'application/json',
                data: pd,
                url: base_url + '/white_label/invest/access_careers',
                success: function (res) {
                    var d = res.body;
                    var html = '';
                    $.each(d, function (i) {
                        html += '<option value="' + d[i].nameCn + '">' + d[i].nameCn + '</option>';
                    });
                    $("#occupation").empty().append("<option value=''>" + '请选择' + "</option>" + html);
                }
            });
        } else {
            $("#occupation").empty();
        }
    });

    //获取电话区号
    /*    var country_data = {'city': '', 'country': '', 'region': ''};
     $.ajax({
     type: 'post',
     dataType: 'json',
     contentType: 'application/json',
     data: JSON.stringify(country_data),
     async: false,
     url: base_url + '/white_label/invest/access_district',
     success: function (res) {
     var d = res.body;
     var html = '';
     $.each(d, function (i) {
     html += '<option value="' + d[i].cellcode + '">' + d[i].name + ' ' + d[i].cellcode + '</option>';
     });
     $("#phone-code").empty().append(html);
     }
     });*/

    // 通过手机号获取渠道用户信息
    if (phone != '' && voucher != '') {
        getData({
            url: base_url + '/zion/white_label/user_info',
            data: {phone: phone, voucher: voucher, channel_code: partner_id},
            sucFn: baseInfo,
            failFn: noBaseInfo
        })
    }

    // 获取渠道信息成功
    function baseInfo(res) {
        var d = res.body;
        if (d && d != null) {
            user_data = d;
            $('#last_name').val(d.last_name);
            $('#first_name').val(d.first_name);
            if (d.phone != '' && d.phone.indexOf(' ')) {
                $('#phone-code,#phone').prop('disabled', true);
                $('#phone').val(d.phone.split(' ')[1]);
                // $("#phone-code").val(d.phone.split(' ')[0]);
            }
            $('#email').val(d.email);
            $('#date-of-birth').val(d.base_info.date_of_birth);
            $('#source-of-income').val(d.base_info.source_of_capital);
            $('#industry').val(d.base_info.industry);
            $('#passport-number').val(d.passport_number);
            $('#effective').val(d.passport_expire_date);
            $('#fileMapping img').attr('src', d.passport_url);
            if (d.base_info.industry != '' && d.base_info.industry != null &&
                d.base_info.occupation != '' && d.base_info.occupation != null
            ) {
                var occupation = d.base_info.occupation;
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify({'industry': d.base_info.industry}),
                    url: base_url + '/white_label/invest/access_careers',
                    success: function (res) {
                        var d = res.body;
                        var html = '';
                        $.each(d, function (i) {
                            html += '<option value="' + d[i].nameCn + '">' + d[i].nameCn + '</option>';
                        });
                        $("#occupation").empty().append("<option value=''>" + '请选择' + "</option>" + html).val(occupation).prop('disabled', false);
                    }
                })
            }
        }
    }

    function noBaseInfo(res) {
        alert(res.msg)
    }


    //上传护照
    /*    $('#passport-proof').change(function () {
     $("#passport-false").hide();
     var $this = $(this);
     var val = $(this).val().toLowerCase();
     var regex = new RegExp("(.*?)\.(jpg|jpeg|png|gif|bmp)$");
     if (!(regex.test(val))) {
     $(this).val('');
     alert('图片格式不正确，支持图片格式(.jpg|.jpeg|.png|.gif|.bmp)');
     } else {
     file_passport_upload($this);
     }
     });*/
    /*    function file_passport_upload(dom) {
     var formData = new FormData($('form')[0]);
     formData.append('file', $("#passport-proof")[0].files[0]);
     $.ajax({
     url: 'https://prod-gl-api.meixincn.com/web/upload/private',
     dataType: 'json',
     type: 'post',
     data: formData,
     async: false,
     cache: false,
     contentType: false,
     processData: false,
     success: function (result, status) {
     if (result.code == 1) {
     $("#passport-false").hide();
     // $("#passport-uploading").hide();
     var passport_photo = result.body;
     dom.siblings('img').attr('src', passport_photo);
     }
     if (result.code != 1) {
     alert("上传失败,请重新上传");
     }
     }
     });
     }

     //上传组件
     $('.fa-upload-pic').find('a').click(function () {
     $(this).siblings('input').trigger('click');
     });*/

    //获取焦点后移除红框
    $('input').on('focus', function () {
        $(this).removeClass('red-shadow');
    });
    $('select').on('focus', function () {
        $(this).removeClass('red-shadow');
    });
    $('textarea').on('focus', function () {
        $(this).removeClass('red-shadow');
    });

    //时间样式
    var dateFormat = "yyyy-mm-dd";
    var match = new RegExp(dateFormat.replace(/(\w+)\W(\w+)\W(\w+)/, "^\\s*($1)\\W*($2)?\\W*($3)?([0-9]*).*").replace(/m|d|y/g, "\\d"));
    var replace = "$1/$2/$3$4".replace(/\//g, dateFormat.match(/\W/));

    function doFormat(target) {
        target.value = target.value.replace(/(^|\W)(?=\d\W)/g, "$10").replace(match, replace).replace(/(\W)+/g, "$1");
    }

    $(".date_input_style").on('keyup', function (e) {
        if (!e.ctrlKey && !e.metaKey && (e.keyCode == 32 || e.keyCode > 46))
            doFormat(e.target)
    });

    $('#fileMapping').click(function () {
        $('.filePicker input').trigger('click');
    });
    uploader_file('#fileMapping');


    $('.uploader-demo').find('img').load(function () {
        var w = $('.uploader-demo').find('img').width();
        var h = $('.uploader-demo').find('img').height();
        var warp_w = $('.file-item').width();
        var warp_h = $('.file-item').height();
        if ((w / h) < (warp_w / warp_h)) {
            $('.uploader-demo').find('img').css({width: 'auto', height: '100%'});
        } else {
            $('.uploader-demo').find('img').css({
                width: '100%',
                height: 'auto',
                'margin-top': Math.floor((warp_h - warp_w * h / w) / 2) + 'px'
            });
        }
    })
});