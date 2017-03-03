$(function () {
    $('#product_head ul li[data-name="产品"]').addClass('active');

    var user_data = {};// 定义用户信息数据
    var phone = getUrlParam('phone') || ''; // 通过手机号查找用户信息
    var partner_id = getUrlParam('partner_id') || ''; // 渠道编码
    var product_id = getUrlParam('product_id') || ''; //获取产品id
    var order_number = getUrlParam('order_number') || ''; // 获取订单编号
    var idCard_default = $('#fileMapping img').attr('src');
    $('.prev-one').on('click', function () {
        window.location = '/auxiliary_order/stepOne.html?' +
            'product_id=' + product_id + '&phone=' + phone + '&partner_id=' + partner_id + '&order_number=' + order_number;
    });
    $('.step-two').on('click', function () {
        var id_card_url = $('#fileMapping img').attr('src');
        if (id_card_url == idCard_default) {
            id_card_url = '';
        }
        $(this).prop('disabled', true);
        var next_step = true;
        var address_effective = $("#address-effective").val();
        var region = $("#country").val();
        var city = $("#city").val();
        var county = $("#county").val();
        var address_detail = $("#address-detail").val();
        var post_code = $("#post-code").val();
        var reg = /^[1-2][0-9][0-9][0-9]-[0-1]{0,1}[0-9]-[0-3]{0,1}[0-9]$/;
        if (!reg.test(address_effective)) {
            $("#address-effective").addClass('red-shadow');
            next_step = false;
        }
        if (region == '') {
            $("#country").addClass('red-shadow');
            next_step = false;
        }
        if (city == '') {
            $("#city").addClass('red-shadow');
            next_step = false;
        }
        if (county == '') {
            $("#county").addClass('red-shadow');
            next_step = false;
        }
        if (address_detail == '') {
            $("#address-detail").addClass('red-shadow');
            next_step = false;
        }
        if (post_code == '') {
            $("#post-code").addClass('red-shadow');
            next_step = false;
        }
        if (address_effective == '') {
            $("#address-effective").addClass('red-shadow');
            next_step = false;
        }
        if (id_card_url == '') {
            $("#address-false").show();
            next_step = false;
        }
        if (!next_step) {
            $(this).prop('disabled', false);
            var t = $('.red-shadow').eq(0).offset().top;
            $('body').scrollTop(t);
        } else {
            user_data.channel_code = partner_id;
            user_data.product_id = product_id;
            user_data.order_number = order_number;
            user_data.phone = phone;
            user_data.id_card_url = id_card_url;
            user_data.id_card_expire_date = address_effective;
            user_data.address_type = 'CN';
            user_data.address_cn = {};
            user_data.address_cn.country = '中国';
            user_data.address_cn.region = region;
            user_data.address_cn.city = city;
            user_data.address_cn.district = county;
            user_data.address_cn.detail = address_detail;
            user_data.address_cn.postal_code = post_code;
            postData({
                url: base_url + '/zion/assist/operateUser',
                data: JSON.stringify(user_data),
                headers: {
                    mx_secret: $.cookie('mx_secret'), mx_token: $.cookie('mx_token')
                },
                contentType: "application/json; charset=utf-8",
                sucFn: stepTwoSuccess,
                failFn: stepTwoFail
            });
            function stepTwoSuccess(res) {
                var d = res.body;
                if (d) {
                    window.location = '/auxiliary_order/stepThree.html?' +
                        'product_id=' + product_id + '&phone=' + phone + '&partner_id=' + partner_id + '&order_number=' + order_number;
                }
            }

            function stepTwoFail(res) {
                $('.step-two').prop('disabled', false);
                alert(res.msg)
            }
        }
        return false;
    });


    // 获取 省市区地址信息
    var country_data = {'city': '', 'country': '中国', 'region': ''};
    getAddress(country_data, regionData);
    function regionData(res) {
        $('#country').empty().append("<option value=''>" + '请选择' + "</option>" + res);
        $('#country').find('option:first').prop('selected', 'selected');
    }

    // 省变化，市变化
    $('#country').on('change', function () {
        var region = $(this).val();
        if (region != '') {
            var city_data = {'city': '', 'country': '中国', 'region': region};
            getAddress(city_data, cityData);
            function cityData(res) {
                $('#city').empty().append("<option value=''>" + '请选择' + "</option>" + res).prop('disabled', false);
                $('#city').find('option:first').prop('selected', 'selected');
            }
        }
    });
    // 市变化，区变化
    $('#city').on('change', function () {
        var city = $(this).val();
        if (city != '') {
            var county_data = {'city': city, 'country': '中国', 'region': $('#country').val()};
            getAddress(county_data, countyData);
            function countyData(res) {
                $('#county').empty().append("<option value=''>" + '请选择' + "</option>" + res).prop('disabled', false);
                $('#county').find('option:first').prop('selected', 'selected');
            }
        }
    });
    // 手机号不为空，查找用户地址证明信息
    if (phone != '') {
        getData({
            url: base_url + '/zion/assist/customerOrderInfo',
            data: {phone: phone, order_number: order_number},
            headers: {
                mx_secret: $.cookie('mx_secret'), mx_token: $.cookie('mx_token')
            },
            sucFn: addressInfo,
            failFn: noAddressInfo
        })
    }

    // 获取地址信息成功
    function addressInfo(res) {
        var d = res.body;
        if (d && d != null) {
            user_data = d;
            if (d.id_card_expire_date != null && d.id_card_expire_date != '') {
                $('#address-effective').val(d.id_card_expire_date);
            }
            if (d.id_card_url != null && d.id_card_url != '') {
                $('#fileMapping img').attr('src', d.id_card_url);
            }
            if (d.address_type == 'CN' && d.address_cn != null) {
                if (d.address_cn.region != '' && d.address_cn.region != null && d.address_cn.city != '' && d.address_cn.city != null && d.address_cn.district != '' && d.address_cn.district != null) {
                    $('#country').val(d.address_cn.region);
                    var city_data = {'city': '', 'country': '中国', 'region': d.address_cn.region};
                    getAddress(city_data, cityData);
                    function cityData(res) {
                        $('#city').empty().append("<option value=''>" + '请选择' + "</option>" + res).prop('disabled', false).val(d.address_cn.city);
                    }

                    var county_data = {'city': d.address_cn.city, 'country': '中国', 'region': d.address_cn.region};
                    getAddress(county_data, countyData);
                    function countyData(res) {
                        $('#county').empty().append("<option value=''>" + '请选择' + "</option>" + res).prop('disabled', false).val(d.address_cn.district);
                    }
                }
                if (d.address_cn.detail != '' && d.address_cn.detail != null) {
                    $('#address-detail').val(d.address_cn.detail);
                }
                if (d.address_cn.postal_code) {
                    $('#post-code').val(d.address_cn.postal_code);
                }
            }
        }
    }

    function noAddressInfo(res) {
        alert(res.msg);
    }

    // 获取 省市区地址信息
    function getAddress(data, fn) {
        $.ajax({
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(data),
            async: false,
            url: base_url + '/white_label/invest/access_district',
            success: function (res) {
                var d = res.body;
                var html = '';
                if (d && d.length > 0) {
                    $.each(d, function (i) {
                        html += '<option value="' + d[i].name + '">' + d[i].name + '</option>';
                    });
                    // $("#phone-code").empty().append(html);
                    fn(html);
                }
            }
        });
    }

    /*//上传地址证明
     $('#address-proof').change(function () {
     var $this = $(this);
     var val = $(this).val().toLowerCase();
     var regex = new RegExp("(.*?)\.(jpg|jpeg|png|gif|bmp)$");
     if (!(regex.test(val))) {
     $(this).val('');
     alert('图片格式不正确，支持图片格式(.jpg|.jpeg|.png|.gif|.bmp)');
     } else {
     file_upload($this);
     }
     });
     //上传地址照片
     function file_upload(dom) {
     var formData = new FormData($('form')[1]);
     formData.append('file', $("#address-proof")[0].files[0]);
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
     $("#address-false").hide();
     $("#address-uploading").hide();
     dom.siblings('img').attr('src', result.body);
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

    // 图片上传
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