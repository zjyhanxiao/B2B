/**
 * Created by zhiqiang.li on 2017/1/17.
 */

// var baseUrlChannel = 'https://gl-api2.meixincn.com/channel';
var baseUrlChannel = 'https://prod-gl-api.meixincn.com/channel';
var invest_success = false;
$(function () {
    // 让用户知道，如果要关掉此页面则会丢去所有工作
    window.onbeforeunload = function() { 
        if (!invest_success)
            return "您还未完成本次认购，如果关闭此窗口则会丢失所有目前填写的信息。请点击取消完成认购。"; 
    };

    $("#signature-line").jSignature({width: 800, height: 220});
    var jSignatureDefult = $('#signature-line').jSignature('getData');
    $('#Modal').modal({
        show:false,
        backdrop:'/channel-static'
    });
    //定义全局变量
    var next_step = false, data = '', d=[], index='', industry='',product_id='', len='', html = '',document_id='';
    var last_name='', first_name='', phone='', email='', date_of_birth='', source_of_income='', occupation='', passport_number='', effective='';
    var county ='', address_detail='', post_code='', address_effective='';
    var signature = '', routing_number = '', have_middle_bank ='';
    var bank_name = '', bank_address='', swift_code='', account_number='', middle_bank_name='', middle_bank_address='', middle_bank_swift_code='', account_type = 'checking';
    var invest_par_value ='', minimum_invest_amount='';
    var invest_amount = '', account_number_secret='';
    var bank_type = '', payment_method = '', accreditation = '', addreess_non_cn = '';
    var bank_non_us = {}, bank_us = {}, base_info ={}, address_cn ={},channel_code='';

    //获取url中的参数
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (r != null) return unescape(r[2]);
        return null; //返回参数值
    }
    product_id = getUrlParam('product_id') || 'error';
    channel_code = getUrlParam('partner_id') || 'error';

    if(product_id == 'error'|| channel_code == 'error'){
        $("#invest-error").show();
        $("#base-info .base-info-title").hide();
        $("#base-info .base-info-wrapper").hide();
    }

  /*  //投资人类型
    $("#us-investor").on('click',function () {
        $(this).find('span').addClass('dark-blue').removeClass('light-silver');
        $(this).removeClass('border-silver').addClass('border-blue').find('p').addClass('dark-blue').removeClass('light-silver');
        $("#non-us-investor").removeClass('border-blue').addClass('border-silver').find('p').addClass('light-silver').removeClass('dark-blue');
        $("#non-us-investor").find('span').addClass('light-silver').removeClass('dark-blue');
        $(".us-investor-introduce").show();
        $(".investor-introduce").hide();
    });
    $("#non-us-investor").on('click',function () {
        $(this).find('span').addClass('dark-blue').removeClass('light-silver');
        $(this).removeClass('border-silver').addClass('border-blue').find('p').addClass('dark-blue').removeClass('light-silver');
        $("#us-investor").removeClass('border-blue').addClass('border-silver').find('p').addClass('light-silver').removeClass('dark-blue');
        $("#us-investor").find('span').addClass('light-silver').removeClass('dark-blue');
        $(".investor-introduce").show();
        $(".us-investor-introduce").hide();
    });

    //是否合格投资人
    $(".confirm .white-confirm").on('click',function () {
         $(".confirm .blue-confirm").addClass('confirm-investor');
         $(".confirm .white-confirm").hide();
         $(".confirm .confirm-wrapper p").hide();
    });
    $(".confirm .blue-confirm").on('click',function () {
         $(".confirm .white-confirm").show();
         $(this).removeClass('confirm-investor');
        $(".confirm .confirm-wrapper p").hide();
    });

    //非美国投资人确认
    $(".cn").on('click',function () {
        $(this).find('img').show();
        $(this).next('div').find('img').hide();
    });
    $(".non-cn").on('click',function () {
        $(this).find('img').show();
        $(this).prev('div').find('img').hide();
    });*/


// 第一页

    //获取产品
    $.ajax({
        type: 'get',
        dataType:'json',
        contentType:'application/json',
        url: baseUrlChannel + '/product_list',
        success: function (res) {
            if(res.code==1){
                d = res.body;
                $.each(d,function (i) {
                    if(product_id==d[i].id){
                        console.log(d[i].name);
                        $("#invest-error").hide();
                        $("#base-info .base-info-title").show();
                        $("#base-info .base-info-wrapper").show();
                        $(".product_name").html(d[i].name);
                    }else{
                        // console.log(d[i].name+2);
                        // $("#invest-error").show();
                        // $("#base-info .base-info-title").hide();
                        // $("#base-info .base-info-wrapper").hide();
                    }
                });
            }
        }
    });

    //获取行业
    data = {'industry':''};
    $.ajax({
        type: 'post',
        dataType:'json',
        contentType:'application/json',
        data: JSON.stringify(data),
        url: baseUrlChannel + '/invest/access_careers',
        success: function (res) {
            d = res.body;
            var html ='';
            $.each(d,function (i) {
                html += '<option>' + d[i].nameCn + '</option>';
            });
            $("#industry").empty().append("<option>"+ '请选择' +"</option>" + html);
        }
    });

    //获取职业
    $("#industry").on('change',function () {
        $("#occupation").prop('disabled',false);
        industry = $("#industry").val();
        if(industry!='请选择'){
            data = {'industry':industry};
            var pd = JSON.stringify(data);
            $.ajax({
                type: 'post',
                dataType:'json',
                contentType:'application/json',
                data: pd,
                url: baseUrlChannel + '/invest/access_careers',
                success: function (res) {
                    d = res.body;
                    var html ='';
                    $.each(d,function (i) {
                        html += '<option>' + d[i].nameCn + '</option>';
                    });
                    $("#occupation").empty().append("<option>"+ '请选择' +"</option>" + html);
                }
            });
        }else{
            $("#occupation").empty();
        }
    });

    //获取电话区号
    data = {'city':'', 'country':'', 'region':''};
    var pd = JSON.stringify(data);
    $.ajax({
        type: 'post',
        dataType:'json',
        contentType:'application/json',
        data: pd,
        url: baseUrlChannel + '/invest/access_district',
        success: function (res) {
            d = res.body;
            var html ='';
            $.each(d,function (i) {
                html += '<option value="' + d[i].cellcode + '">' + d[i].name + ' ' + d[i].cellcode + '</option>';
            });
            $("#phone-code").empty().append(html);
        }
    });

    //上传护照
    $('#passport-proof').change(function () {
        // $("#passport-uploading").show();
        $("#passport-false").hide();
        var $this=$(this);
        var val = $(this).val().toLowerCase();
        var regex = new RegExp("(.*?)\.(jpg|jpeg|png|gif|bmp)$");
        if (!(regex.test(val))) {
            $(this).val('');
            alert('图片格式不正确，支持图片格式(.jpg|.jpeg|.png|.gif|.bmp)');
        } else {
            file_passport_upload($this);
        }
    });

    //完成用户基本信息页 进入到用户地址信息页
    $(".step-one").on('click',function () {
        next_step=true;
        last_name = $("#last_name").val();
        first_name = $("#first_name").val();
        phone = '+86 ' + $("#phone").val();
        email = $("#email").val();
        date_of_birth = $("#date-of-birth").val();
        source_of_income = $("#source-of-income").val();
        industry = $("#industry").val();
        occupation = $("#occupation").val();
        passport_number = $("#passport-number").val();
        effective = $("#effective").val();
        var birth_reg = /^[1][0-9][0-9][0-9]-[0-1]{0,1}[0-9]-[0-3]{0,1}[0-9]$/;
        var reg = /^[2][0-9][0-9][0-9]-[0-1]{0,1}[0-9]-[0-3]{0,1}[0-9]$/;
        var passport_arr = passport_number.split('');
        var passport_len = passport_arr.length;
        if(last_name == ''){
            $("#last_name").addClass('red-shadow');
            t = $('.red-shadow').eq(0).offset().top;
            $('body').scrollTop(t);
            next_step = false;
            return false;
        }
        if(first_name == ''){
            $("#first_name").addClass('red-shadow');
            t = $('.red-shadow').eq(0).offset().top;
            $('body').scrollTop(t);
            next_step = false;
            return false;
        }
        if(phone == '' || phone.length < 6){
            $("#phone").addClass('red-shadow');
            t = $('.red-shadow').eq(0).offset().top;
            $('body').scrollTop(t);
            next_step = false;
            return false;
        }
        if(email == ''){
            $("#email").addClass('red-shadow');
            t = $('.red-shadow').eq(0).offset().top;
            $('body').scrollTop(t);
            next_step = false;
            return false;
        }
        if (email.indexOf('@') == -1 || email.indexOf('.') == -1) {
            $('#email').addClass('red-shadow');
            t = $('.red-shadow').eq(0).offset().top;
            $('body').scrollTop(t);
            next_step = false;
            return false;
        }
        if(date_of_birth == ''){
            next_step = false;
            $("#date-of-birth").addClass('red-shadow');
            t = $('.red-shadow').eq(0).offset().top;
            $('body').scrollTop(t);
            return false;
        }
        if (!birth_reg.test(date_of_birth)) {
            $("#date-of-birth").addClass('red-shadow');
            t = $('.red-shadow').eq(0).offset().top;
            $('body').scrollTop(t);
            return false;
        }
        if(source_of_income == ''){
            next_step = false;
            $("#source-of-income").addClass('red-shadow');
            t = $('.red-shadow').eq(0).offset().top;
            $('body').scrollTop(t);
            return false;
        }
        if(industry == ''){
            next_step = false;
            $("#industry").addClass('red-shadow');
            t = $('.red-shadow').eq(0).offset().top;
            $('body').scrollTop(t);
            return false;
        }
        if(occupation == ''){
            next_step = false;
            $("#occupation").addClass('red-shadow');
            t = $('.red-shadow').eq(0).offset().top;
            $('body').scrollTop(t);
            return false;
        }
        if(passport_number == ''){
            next_step = false;
            $("#passport-number").addClass('red-shadow');
            t = $('.red-shadow').eq(0).offset().top;
            $('body').scrollTop(t);
            return false;
        }
        if(passport_len != 9){
            next_step = false;
            $("#passport-number").addClass('red-shadow');
            t = $('.red-shadow').eq(0).offset().top;
            $('body').scrollTop(t);
            return false;
        }
        if(effective == ''){
            next_step = false;
            $("#effective").addClass('red-shadow');
            t = $('.red-shadow').eq(0).offset().top;
            $('body').scrollTop(t);
            return false;
        }if(passport_photo == ''){
            next_step = false;
            $("#passport-false").show();
            $('body').scrollTop($('#passport-false').eq(0).offset().top);
            return false;
        }
        if (!reg.test(effective)) {
            $("#effective").addClass('red-shadow');
            t = $('.red-shadow').eq(0).offset().top;
            $('body').scrollTop(t);
            return false;
        }
        if (next_step){
            $("#passport-false").hide();
            $("#base-info").removeClass('active').next().addClass('active');
            $('body').scrollTop(0);
        }
    });

// 第二页

    //获取省份
    data = {'country':'中国','city':'','region':''};
    $.ajax({
        type: 'post',
        dataType:'json',
        contentType:'application/json',
        data: JSON.stringify(data),
        url: baseUrlChannel + '/invest/access_district',
        success: function (res) {
            d = res.body;
            var html ='';
            $.each(d,function (i) {
                html += '<option>' + d[i].name + '</option>';
            });
            $("#country").empty().append("<option>"+ '请选择' +"</option>" + html);
        }
    });

    //获取市
    var region = '';
    $("#country").on('change',function () {
        if($("#country").val()!='请选择'){
            $("#city").prop('disabled',false);
            region = $("#country").val();
            data = {'country':'中国','city':'','region':region};
            var pd = JSON.stringify(data);
            $.ajax({
                type: 'post',
                dataType:'json',
                contentType:'application/json',
                data: pd,
                url: baseUrlChannel + '/invest/access_district',
                success: function (res) {
                    d = res.body;
                    var html ='';
                    $.each(d,function (i) {
                        html += '<option>' + d[i].name + '</option>';
                    });
                    $("#city").empty().append("<option>"+ '请选择' +"</option>" + html);
                }
            });
        }
    });

    //获取区
    var city = '';
    $("#city").on('change',function () {
        if($("#region").val()!='请选择'){
            $("#county").prop('disabled',false);
            city = $("#city").val();
            data = {'country':'中国','city':city,'region':region};
            var pd = JSON.stringify(data);
            $.ajax({
                type: 'post',
                dataType:'json',
                contentType:'application/json',
                data: pd,
                url: baseUrlChannel + '/invest/access_district',
                success: function (res) {
                    d = res.body;
                    var html ='';
                    $.each(d,function (i) {
                        html += '<option>' + d[i].name + '</option>';
                    });
                    $("#county").empty().append("<option>"+ '请选择' +"</option>" + html);
                }
            });
        }
    });

    //上传地址证明
    $('#address-proof').change(function () {
        var $this=$(this);
        var val = $(this).val().toLowerCase();
        var regex = new RegExp("(.*?)\.(jpg|jpeg|png|gif|bmp)$");
        if (!(regex.test(val))) {
            $(this).val('');
            alert('图片格式不正确，支持图片格式(.jpg|.jpeg|.png|.gif|.bmp)');
        } else {
            file_upload($this);
        }
    });

    //完成用户地址信息页  下一步到银行页
    $(".step-two").on('click',function () {
        address_effective = $("#address-effective").val();
        region = $("#country").val();
        city = $("#city").val();
        county = $("#county").val();
        address_detail = $("#address-detail").val();
        post_code = $("#post-code").val();
        var reg = /^[1-2][0-9][0-9][0-9]-[0-1]{0,1}[0-9]-[0-3]{0,1}[0-9]$/;
        if (!reg.test(address_effective)) {
            $("#address-effective").addClass('red-shadow');
            t = $('.red-shadow').eq(0).offset().top;
            $('body').scrollTop(t);
            // alert('请输入正确的日期格式');
            return false;
        }
        /*var reg_unicode = /^[\u2E80-\u9FFF]+$/;
        if (!reg_unicode.test(address_detail)) {
            $("#address-detail").addClass('red-shadow');
            t = $('.red-shadow').eq(0).offset().top;
            $('body').scrollTop(t);
            // alert('请输入正确的日期格式');
            return false;
        }*/
        if(region == '请选择' || region == ''){
            $("#country").addClass('red-shadow');
            t = $('.red-shadow').eq(0).offset().top;
            $('body').scrollTop(t);
            next_step = false;
            return false;
        }
        if(city == '请选择' || city == ''){
            $("#city").addClass('red-shadow');
            t = $('.red-shadow').eq(0).offset().top;
            $('body').scrollTop(t);
            next_step = false;
            return false;
        }
        if(county == '请选择' || county == ''){
            $("#county").addClass('red-shadow');
            t = $('.red-shadow').eq(0).offset().top;
            $('body').scrollTop(t);
            next_step = false;
            return false;
        }
        if(address_detail == ''){
            $("#address-detail").addClass('red-shadow');
            t = $('.red-shadow').eq(0).offset().top;
            $('body').scrollTop(t);
            next_step = false;
            return false;
        }
        if(post_code == ''){
            $("#post-code").addClass('red-shadow');
            t = $('.red-shadow').eq(0).offset().top;
            $('body').scrollTop(t);
            next_step = false;
            return false;
        }
        if(address_effective == ''){
            $("#address-effective").addClass('red-shadow');
            t = $('.red-shadow').eq(0).offset().top;
            $('body').scrollTop(t);
            next_step = false;
            return false;
        }
        if(address_photo == ''){
            $("#address-false").show();
            $('body').scrollTop($('#address-false').eq(0).offset().top);
            next_step = false;
            return false;
        } else {
            next_step = true;
            $("#address-prove").removeClass('active').next().addClass('active');
            $('body').scrollTop(0);
        }
    });

    //返回到第一页
    $(".prev-one").on('click',function () {
        $("#address-prove").removeClass('active').prev().addClass('active');
        $('body').scrollTop(0);
    });

// 第三页

    //选择美国银行或非美银行
    $(".non-us-bank").on('click',function () {
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
    $(".us-bank").on('click',function () {
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
    $(".button").on('click',function () {
        $('input').removeClass('red-shadow');
        $('textarea').removeClass('red-shadow');
        var non_us = $(".non-us-bank").hasClass('button-blue');
        var us = $(".us-bank").hasClass('button-blue');
        if(non_us){
            bank_type = 'NON_US';
            have_middle_bank = '1';
            data = {'type':'1'};
            $.ajax({
                type: 'get',
                dataType:'json',
                contentType:'application/json',
                data:data,
                url: baseUrlChannel + '/invest/access_bank_dic',
                success: function (res) {
                    d = res.body;
                    var html ='';
                    $.each(d,function (i) {
                        html += '<a><div class="col-md-4"><div class="form-line choose-bank">' +
                            '<div style="float: left; width: 30%; height:60px;"><img class="bank-icon" style="margin-top: 10px;" src="'+ d[i].bank_url +'" alt=""></div> ' +
                            '<div style="float: right; width: 70%; height:60px;"><p style="text-align: left;">'+ d[i].bank_name_cn +'</p><p style="text-align: left;">'+ d[i].bank_name_en +'</p></div>' +
                            '</div></div></a>';
                    });
                    $(".bank-list").empty().append(html);
                }
            });
        }
        if(us){
            bank_type = 'US';
            have_middle_bank = '0';
            data = {'type':'2'};
            $.ajax({
                type: 'get',
                dataType:'json',
                contentType:'application/json',
                data:data,
                url: baseUrlChannel + '/invest/access_bank_dic',
                success: function (res) {
                    d = res.body;
                    var html ='';
                    $.each(d,function (i) {
                        html+= '<a><div class="col-md-4"><div class="form-line choose-bank">' +
                            '<div style="float: left; width: 30%; height: 50px;"><img class="bank-icon" style="margin-top: 5px;" src="'+ d[i].bank_url +'" alt=""></div> ' +
                            '<div style="float: right; width: 70%; margin-top: 7px;"><p style="text-align: left;">'+ d[i].bank_name_cn +'</p><p style="text-align: left;">'+ d[i].bank_name_en +'</p></div>' +
                            '</div></div></a>';
                    });
                    $(".bank-list").empty().append(html);
                }
            });
        }
    });

    //选择银行后添加和去除样式
    $("body").on('click','.choose-bank',function () {
        //$(this).addClass('has_checked').closest('a').siblings('a').find('.choose-bank').removeClass('has_checked');
        index = $(this).closest('a').prev('a').index();

        $('#Modal').modal('hide');

        if(bank_type == 'US'){
            $('#Modal').modal('hide');
            $("#bank-name").val(d[index+1].bank_name_en);
            $("#bank-address").val(d[index+1].bank_address);
            $("#swift-code").val(d[index+1].bank_swift_code);
            $("#routing-number").val(d[index+1].routing_number);
            $("#account-number").val('');
            $("#middle-bank-name").val(d[index+1].middle_bank_name);
            $("#middle-bank-address").val(d[index+1].middle_bank_address);
            $("#middle-bank-swift-code").val(d[index+1].middle_bank_swift_code);
        }else{
            $('#Modal').modal('hide');
            $("#bank-name").val(d[index+1].bank_name_en);
            $("#bank-address").val(d[index+1].bank_address);
            $("#swift-code").val(d[index+1].bank_swift_code);
            $("#account-number").val('');
            $("#middle-bank-name").val(d[index+1].middle_bank_name);
            $("#middle-bank-address").val(d[index+1].middle_bank_address);
            $("#middle-bank-swift-code").val(d[index+1].middle_bank_swift_code);
        }

    });
    //选中checking or saving
    $("#checking").on('click',function () {
        account_type = 'checking';
        $(this).addClass('checked');
        $("#saving").removeClass('checked');
    });

    $("#saving").on('click',function () {
        account_type = 'saving';
        $(this).addClass('checked');
        $("#checking").removeClass('checked');
    });

    //完成第三页 进入第四页
    next_step = false;
    $(".step-three").on('click',function () {
        bank_name = $("#bank-name").val();
        bank_address = $("#bank-address").val();
        swift_code = $("#swift-code").val();
        routing_number = $("#routing-number").val();
        account_number = $("#account-number").val();
        middle_bank_name = $("#middle-bank-name").val();
        middle_bank_address = $("#middle-bank-address").val();
        middle_bank_swift_code = $("#middle-bank-swift-code").val();
        if(bank_name == ''){
            $("#bank-name").addClass('red-shadow');
            t = $('.red-shadow').eq(0).offset().top;
            $('body').scrollTop(t);
            next_step = false;
            return false;
        }
        if(bank_address == ''){
            $("#bank-address").addClass('red-shadow');
            t = $('.red-shadow').eq(0).offset().top;
            $('body').scrollTop(t);
            next_step = false;
            return false;
        }
        if(swift_code == ''){
            $("#swift-code").addClass('red-shadow');
            t = $('.red-shadow').eq(0).offset().top;
            $('body').scrollTop(t);
            next_step = false;
            return false;
        }
        if(swift_code == ''){
            $("#swift-code").addClass('red-shadow');
            t = $('.red-shadow').eq(0).offset().top;
            $('body').scrollTop(t);
            next_step = false;
            return false;
        }
        if(bank_type == 'US'){
            if(routing_number == ''){
                $("#routing-number").addClass('red-shadow');
                t = $('.red-shadow').eq(0).offset().top;
                $('body').scrollTop(t);
                next_step = false;
                return false;
            }
        }
        /*if(middle_bank_name == ''){
            $("#middle-bank-name").addClass('red-shadow');
            next_step = false;
            return false;
        }*/
        /*if(middle_bank_address == ''){
            $("#middle-bank-address").addClass('red-shadow');
            next_step = false;
            return false;
        }*/
        /*if(middle_bank_swift_code == ''){
            $("#middle-bank-swift-code").addClass('red-shadow');
            next_step = false;
            return false;
        }*/
        if(account_number == ''){
            $("#account-number").addClass('red-shadow');
            t = $('.red-shadow').eq(0).offset().top;
            $('body').scrollTop(t);
            next_step = false;
            return false;
        }else{
            next_step = true;
        }
        if(next_step){
            if(bank_type == 'US'){
                $(".get-middle-bank").hide();
                $("#routing-number-wrapper").show();
                $("#get-bank-aba").show();
            }else{
                $(".get-middle-bank").show();
                $("#routing-number-wrapper").hide();
                $("#get-bank-aba").hide();
            }
            $("#bank-info").removeClass('active').next().addClass('active');
            $('body').scrollTop(0);
            //账户号加密处理
            account_number_secret = '**********' + account_number.substr(account_number.length-4);
            $("#get-name").html(first_name + ' ' + last_name);
            $("#get-phone").html(phone);
            $("#get-email").html(email);
            $("#get-date-of-birth").html(date_of_birth);
            $("#get-source-of-income").html(source_of_income);
            $("#get-industry").html(industry);
            $("#get-occupation").html(occupation);
            $("#get-passport-number").html(passport_number);
            $("#get-effective").html(effective);
            $(".get-bank-name").html(bank_name);
            $("#get-bank-address").html(bank_address);
            $("#get-Swift-code").html(swift_code);
            $("#get-aba").html(routing_number);
            $("#get-bank-user-name").html(first_name + ' ' + last_name);
            $(".get-bank-user-account").html(account_number_secret);
            $("#get-middle-bank-name").html(middle_bank_name);
            $("#get-middle-bank-address").html(middle_bank_address);
            $("#get-middle-bank-swift-code").html(middle_bank_swift_code);
            $(".get-address-line2").html(address_detail);
            $(".get-address-line1").html(region + " " + city + " " + county);
            $(".get-address-line3").html(post_code);

            var product = {'product_id':product_id};
            $.ajax({
                type: 'get',
                dataType:'json',
                contentType:'application/json',
                data:product,
                url: baseUrlChannel + '/product_info',
                success: getProductInfo
            })
        }
    });

    function getProductInfo(res) {
        var d = res.body;
        if(d == 0){
            alert('请检查您的产品ID是否有误');
        }
        invest_par_value = d.invest_par_value;
        minimum_invest_amount = d.minimum_invest_amount;
        $(".product-name").html(d.name);
        $(".product-rate").html('预计年化收益: '+ d.return_rate +'%');
        $(".product-deadline").html('投资期限: '+d.invest_term +'个月');
        $(".invest-par-value").html(invest_par_value);
        $(".invest-amounts").val(minimum_invest_amount);
    }
    
    //返回到第二页
    $(".prev-two").on('click',function () {
        $("#bank-info").removeClass('active').prev().addClass('active');
        $('body').scrollTop(0);
    });

//第四页

    $(".invest-amounts").change(function () {
        if($(".invest-amounts").val()<minimum_invest_amount){
            $(".invest-amounts").val(minimum_invest_amount);
        }if($(".invest-amounts").val()%invest_par_value!=0){
            alert('投资金额必须为 '+ invest_par_value +' 的整数倍');
            // $(".invest-amounts").val(minimum_invest_amount);
        }
    });

    $('.add').click(function () {
        $('.invest-amounts').val(parseInt($('.invest-amounts').val())+invest_par_value);
    });
    
    $('.sub').click(function () {
        if ($('.invest-amounts').val()<=minimum_invest_amount){
            $('.invest-amounts').val(minimum_invest_amount);
        }else {
            $('.invest-amounts').val(parseInt($('.invest-amounts').val())-invest_par_value);
        }
    });

    //进入第五页 签名&订单文档
    $(".step-four").on('click',function () {
        invest_amount = $(".invest-amounts").val();
        $(".get-invest-amount").html('  $ '+ invest_amount);
        $("#invest-info").removeClass('active').next().addClass('active');
        $('body').scrollTop(0);
        $(".investor-signature").html(first_name + ' ' +last_name);

        //查询产品文档
        var product = {'product_id':product_id, 'investor_type':'1'};
        $.ajax({
            type: 'get',
            dataType: 'json',
            contentType: 'application/json',
            data: product,
            url: baseUrlChannel + '/product_document',
            success: getProductDocument
        });

    });
    
    function getProductDocument(res) {
        var p = res.body;
        $.each(p,function (i) {
            html += '<p class="documents">'+
                '<span class="document_checkbox"><input name="checkbox" type="checkbox" style="width: 15px; height: 15px;" id="document_' + i + '"/></span>'+
                '<label for="document_' + i + '"><span class="font-14"> 我已阅读并接受 </span><a data-id="'+ p[i].id +'" class="get-documents font-14">' + p[i].document_name + '</a></label>'+
                // '<span class="font-14"> 我已阅读并接受 </span><a href="../../../../../subdoc.channel-channel-html" data-id="'+ p[i].id +'" class="get-documents font-14" target="_blank">' + p[i].document_name + '</a>'+
                '</p>';
        });
        $("#get-invest-document").empty().append(html);
    }

    /* Open document preview */
    function openDocumentPreview(document_id, populate_data) {
        $("#document-preview").width("100%");

        $(function () {
            $('#document-loading').show();
            $.ajax({
                type:"post",
                url: baseUrlChannel + '/doc/preview',
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(populate_data),
                success: populate
            });

            function populate(res) {
                $('#document-loading').hide();
                $("#document-element-wrapper").html('<iframe id="document-preview-element" src="vendor/pdfjs/web/viewer.html?file=' + res.body + '#page=1"></iframe>');
                $("#document-preview-element").width($(window).width());
                $("#document-preview-element").height($(window).height() - 45);
                $("#document-preview-element").css('margin-top', '40px');
            }
        })
    }

    /* Close when someone clicks on the "x" symbol inside the overlay */
    function closeDocumentPreview() {
        $("#document-element-wrapper").html("");
        $("#document-preview").width("0%");
    }

    $("#get-invest-document").on('click', '.documents a', function () {
        var pdf = null;
        document_id = $(this).data('id');

        //映射文档
        bank_non_us = {'account_number':account_number, 'bank_address':bank_address, 'bank_name':bank_name, 'have_middle_bank':have_middle_bank,
            'middle_bank_address':middle_bank_address, 'middle_bank_name':middle_bank_name, 'middle_bank_swift_code':middle_bank_swift_code, 'swift_code':swift_code};
        bank_us = {'account_number':account_number, 'account_type':account_type, 'bank_address':bank_address,
            'bank_name':bank_name, 'routing_number':routing_number, 'swift_code':swift_code};
        base_info = {'country_of_birth':'中国','country_of_tax_residency':'中国', 'date_of_birth':date_of_birth, 'foreign_tax_number':'CN N/A', 'industry':industry,
            'occupation':occupation, 'nationality':'中国', 'source_of_capital':source_of_income, 'ssn':''};
        address_cn = {'city':city,'country':'中国', 'detail': address_detail, 'district':county,
            'postal_code':post_code, 'region': region};
        accreditation = {"debt_amount": 0, "spouse_email": "string", "spouse_first_name": "string",
            "spouse_last_name": "string", "spouse_phone": "string", "type": "INCOME", "with_spouse": false};
        addreess_non_cn = {'city':city, 'country':'中国', 'line1':'line1', 'line2':'line2',
            'postal_code':'postal_code', 'region':'region'};
        pdf = {
            'address_non_cn':addreess_non_cn, 'address_type':'CN', 'bank_non_us':bank_non_us,
            'bank_type':bank_type, 'bank_us':bank_us, 'base_info':base_info, 'bill_expire_date':'', 'bill_number':'', 'bill_url':'',
            'channel_code':channel_code, 'document_id':document_id, 'driving_license_expire_date':'', 'driving_license_number':'',
            'address_cn':address_cn, 'email':email, 'first_name':first_name, 'id_card_number':'',
            'last_name':last_name, 'invest_amount':invest_amount, 'investor_type':'1',
            'id_card_url':address_photo, 'id_card_expire_date':address_effective, 'passport_url':passport_photo, 'passport_number':passport_number,
            'passport_expire_date':effective, 'signature':signature, 'phone':phone, 'spouse_signature':''
        };

        openDocumentPreview(document_id, pdf);
        return false;
    });

    $("#document-preview .close-document-preview").click(function() {
        closeDocumentPreview();
    });

    //返回到第三页
    $(".prev-three").on('click',function () {
        $("#invest-info").removeClass('active').prev().addClass('active');
        $('body').scrollTop(0);
    });

// 第五页

    var achLiDom = '<li role="presentation" class="nav-1"><a href="#ach" role="tab" data-toggle="tab">自动扣款 / ACH</a></li>';
    var wireLiDom = '<li role="presentation" class="nav-2"><a href="#wire" role="tab" data-toggle="tab">银行电汇 / Wire</a></li>';
    var checkLiDom = '<li role="presentation" class="nav-3"><a href="#check" role="tab" data-toggle="tab">支票 / Check</a></li>';
    var achDom = '<div role="tabpanel" class="tab-pane active" id="ach"> <div> <p class="light-blue golden-announce">确认入金后，美信金融将在三个工作日内完成扣款操作。您可以在 “我的投资” 中查看订单状态。</p> <div class="row"> <div class="col-md-3"> <div class="form-inline"> <label for="get-ach-user-name">账户名</label> </div> </div> <div class="col-md-9"> <div class="form-inline"> <p class="form-control input-sm" id="get-ach-user-name"></p> </div> </div> </div> <div class="row"> <div class="col-md-3"> <div class="form-inline"> <label for="get-ach-bank-name">银行名称</label> </div> </div> <div class="col-md-9"> <div class="form-inline"> <p class="form-control input-sm" id="get-ach-bank-name"></p> </div> </div> </div> <div class="row"> <div class="col-md-3"> <div class="form-inline"> <label for="get-ach-aba">ABA / routing #</label> </div> </div> <div class="col-md-9"> <div class="form-inline"> <p class="form-control input-sm" id="get-ach-aba"></p> </div> </div> </div> <div class="row"> <div class="col-md-3"> <div class="form-inline"> <label for="get-ach-account-number">账户号</label> </div> </div> <div class="col-md-9"> <div class="form-inline"> <p class="form-control input-sm" id="get-ach-account-number"></p> </div> </div> </div> <div class="font-14 ach-document"> <input style="width: 15px; height: 15px;" type="checkbox" id="ach-document-checkbox"/> <label for="ach-document-checkbox"><span class="font-14">我已认真阅读并接受</span> <a class="font-14" href="javascript:;" target="_blank;">自动扣款协议 / ACH Agreement</a></label> <p class="red-shadow" style="display:none;">请认真阅读并接受自动扣款协议 / ACH Agreement</p> </div> </div> </div>'
    var wireDom = '<div role="tabpanel" class="tab-pane" id="wire"> <div class="golden-announce"> <p class="light-blue">请注意：请使用您之前选择的银行账户 (<span class="get-bank-name">Bank of America</span>, <span class="get-bank-user-account"> **** **** **** ****</span>) 完成入金。</p> <p style="color: #555;">我们将把以下支付信息发到您的邮箱。请您在三个工作日内完成打款操作。</p> </div> <div> <div class="row"> <div class="col-md-3"> <div class="form-inline"> <label for="get-wire-user-name">收款人名字</label> </div> </div> <div class="col-md-9"> <div class="form-inline"> <p class="form-control input-sm" id="get-wire-user-name"></p> </div> </div> </div> <div class="row"> <div class="col-md-3"> <div class="form-inline"> <label for="get-wire-user-address">收款人地址</label> </div> </div> <div class="col-md-9"> <div class="form-inline"> <p class="form-control input-sm" id="get-wire-user-address"></p> </div> </div> </div> <div class="row"> <div class="col-md-3"> <div class="form-inline"> <label for="get-wire-bank-name">收款银行</label> </div> </div> <div class="col-md-9"> <div class="form-inline"> <p Class="form-control input-sm" id="get-wire-bank-name"></p> </div> </div> </div> <div class="row"> <div class="col-md-3"> <div class="form-inline"> <label for="get-wire-bank-address">收款银行地址</label> </div> </div> <div class="col-md-9"> <div class="form-inline"> <p class="form-control input-sm" id="get-wire-bank-address"></p> </div> </div> </div> <div class="row"> <div class="col-md-3"> <div class="form-inline"> <label for="get-wire-bank-aba" style="width: 110px;">ABA / Routing #</label> </div> </div> <div class="col-md-9"> <div class="form-inline"> <p class="form-control input-sm" id="get-wire-bank-aba"></p> </div> </div> </div> <div class="row"> <div class="col-md-3"> <div class="form-inline"> <label for="get-wire-swift-code">Swift Code</label> </div> </div> <div class="col-md-9"> <div class="form-inline"> <p class="form-control input-sm" id="get-wire-swift-code"></p> </div> </div> </div> <div class="row"> <div class="col-md-3"> <div class="form-inline"> <label for="get-wire-account">账户号</label> </div> </div> <div class="col-md-9"> <div class="form-inline"> <p class="form-control input-sm" id="get-wire-account"></p> </div> </div> </div> <div class="row"> <div class="col-md-3"> <div class="form-inline"> <label for="get-wire-remark">备注栏请填写</label> </div> </div> <div class="col-md-9"> <div class="form-inline"> <p class="form-control input-sm" id="get-wire-remark"></p> </div> </div> </div> </div> </div>'
    var checkDom = '<div role="tabpanel" class="tab-pane" id="check"> <div class="golden-announce"> <p class="light-blue">请注意：请使用您之前选择的银行账户 (<span class="get-bank-name">Bank of America</span>, <span class="get-bank-user-account"> **** **** **** ****</span>) 完成入金。</p> <p style="color: #555;">我们将把以下支付信息发到您的邮箱。请您在三个工作日内寄出支票。</p> </div> <div> <div class="row"> <div class="col-md-3"> <div class="form-inline"> <label for="get-check-user-name">收款人</label> </div> </div> <div class="col-md-9"> <div class="form-inline"> <p class="form-control input-sm" id="get-check-user-name"></p> </div> </div> </div> <div class="row"> <div class="col-md-3"> <div class="form-inline"> <label for="get-check-bank-name">银行账户名称</label> </div> </div> <div class="col-md-9"> <div class="form-inline"> <p class="form-control input-sm" id="get-check-bank-name"></p> </div> </div> </div> <div class="row"> <div class="col-md-3"> <div class="form-inline"> <label for="get-check-post-address" style="width: 140px;">请将支票寄至以下地址</label> </div> </div> <div class="col-md-9"> <div class="form-inline"> <p class="form-control input-sm" id="get-check-post-address"></p> </div> </div> </div> </div> </div>'

    $(".step-five").on('click',function (e) {
        next_step = false;
        if($("[name=checkbox]:not(:checked)").length==0){
            $("#document-waring").hide();
            //获取签名
            signature = $('#signature-line').jSignature('getData');
            if (signature != jSignatureDefult) {
                console.log('签名验证通过');
                $(".signature-default").hide();
                signature = $('#signature-line').jSignature('getData');
                next_step = true;
                $("#invest-signature").removeClass('active').next().addClass('active');
                $('body').scrollTop(0);
                //获取可选择的支付方式
                var product = {'product_id':product_id};
                $.ajax({
                    type: 'get',
                    dataType: 'json',
                    contentType: 'application/json',
                    data: product,
                    url: baseUrlChannel + '/product/payment_list',
                    success: getProductPayment
                });
            } else {
                $(".signature-default").show();
                next_step = false;
                return false;
            }
        }
        else{
            $("#document-waring").show();
            $('body').scrollTop($('#get-invest-document').eq(0).offset().top - 50);

        }
    //加载第六页信息
        function getProductPayment(res) {
            var d = res.body;
            if(d.is_ach_enabled){
                $("#nav-golden").append(achLiDom);
                $("#nav-golden-list").append(achDom);
                $(".ach-document a").attr('href',d.ach.document);
                $("#get-ach-user-name").html(first_name + " " + last_name);
                $("#get-ach-bank-name").html(bank_name);
                $("#get-ach-aba").html(routing_number);
                $("#get-ach-account-number").html(account_number);
            }
            if(d.is_receive_bank_enabled){
                $("#nav-golden").append(wireLiDom);
                $("#nav-golden-list").append(wireDom);
                $("#get-wire-user-name").html(d.receive_bank.account_name);
                $("#get-wire-user-address").html(d.receive_bank.account_address);
                $("#get-wire-bank-name").html(d.receive_bank.bank_name);
                $("#get-wire-bank-address").html(d.receive_bank.bank_address);
                $("#get-wire-bank-aba").html(d.receive_bank.routing_number);
                $("#get-wire-swift-code").html(d.receive_bank.swift_code);
                $("#get-wire-account").html(d.receive_bank.account_number);
                $("#get-wire-remark").html(d.receive_bank.remark);
                $(".get-bank-name").html(bank_name);
                $(".get-bank-user-account").html(account_number_secret);
            }
            if(d.is_check_enabled){
                $("#nav-golden").append(checkLiDom);
                $("#nav-golden-list").append(checkDom);
                $("#get-check-user-name").html(d.check.receiver_name);
                $("#get-check-bank-name").html(d.check.remark);
                $("#get-check-post-address").html(d.check.mailing_address);
                $(".get-bank-name").html(bank_name);
                $(".get-bank-user-account").html(account_number_secret);
            }
            len =  $("#nav-golden").find('li').length;
            if(len == 1){
                $("#nav-golden").find('li').css('width','100%');
            }if(len == 2){
                $("#nav-golden").find('li').css('width','50%');
            }if(len == 3){
                $("#nav-golden").find('li').css('width','33.3%');
            }
            if (len == 1) {
                $("#golden-page-title").html("入金方式");
            } else {
                $("#golden-page-title").html("选择入金方式");
            }
            $("#nav-golden").find('li:first').addClass('active');
            $("#nav-golden-list").find('div:first').addClass('active');
        }
    });


    //返回到第四页
    $(".prev-four").on('click',function () {
        $("#invest-signature").removeClass('active').prev().addClass('active');
        $('body').scrollTop(0);
        $("#get-invest-document").empty();
        html = '';
    });


//点击完成 创建用户 && 创建订单
    $(".ach-document").on('click',function () {
        if($("[name=pay]:not(:checked)").length==0){
            $(".ach-warning").hide();
        }
    });

    $("body").on('click','#finish',function () {
        if($(".nav-1").hasClass('active')){
            payment_method = 'ach';
            if($("[name=pay]:not(:checked)").length==0){
                $(".ach-warning").hide();
            }else{
                $(".ach-warning").show();
                return false;
            }
        }
        if($(".nav-2").hasClass('active')){
            payment_method = 'wire'
        }
        if($(".nav-3").hasClass('active')){
            payment_method = 'check'
        }
        //创建用户
        bank_non_us = {'account_number':account_number, 'bank_address':bank_address, 'bank_name':bank_name, 'have_middle_bank':have_middle_bank,
        'middle_bank_address':middle_bank_address, 'middle_bank_name':middle_bank_name, 'middle_bank_swift_code':middle_bank_swift_code, 'swift_code':swift_code};
        bank_us = {'account_number':account_number, 'account_type':account_type,'swift_code':'swift_code',
            'bank_address':bank_address, 'bank_name':bank_name, 'routing_number':routing_number};
        base_info = {'country_of_birth':'中国', 'country_of_tax_residency':'中国', 'foreign_tax_number':'CN N/A',
            'date_of_birth':date_of_birth, 'industry':industry, 'occupation':occupation, 'nationality':'中国', 'source_of_capital':source_of_income};
        address_cn = {'city':city, 'country':'中国', 'detail': address_detail, 'district':county,
            'postal_code':post_code, 'region': region};
        data = {
            'address_type':'CN', 'bank_non_us':bank_non_us, 'bank_type':bank_type, 'bank_us':bank_us,
            'base_info':base_info, 'channel_code':channel_code, 'address_cn':address_cn, 'email':email, 'first_name':first_name, 'last_name':last_name, 'investor_type':'1',
            'id_card_url':address_photo, 'id_card_expire_date':address_effective, 'passport_url':passport_photo, 'passport_number':passport_number, 'passport_expire_date':effective, 'phone':phone, 'signature':signature
        };
        var userInfoReqVo = JSON.stringify(data);
        $.ajax({
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            data: userInfoReqVo,
            url: baseUrlChannel + '/invest/operate_user',
            success: createUsers
        });

    });
    function createUsers(res) {
        if(res.code==1){
            data = {'channel_code':channel_code, 'invest_amount':invest_amount, 'payment_method':payment_method, 'phone':phone, 'product_id':product_id};
            var orderForm = JSON.stringify(data);
            $.ajax({
                type: 'post',
                dataType: 'json',
                contentType: 'application/json',
                data: orderForm,
                url: baseUrlChannel + '/order/create_order',
                success: createOrder
            });
        }else{
            alert(res.msg);
            return false;
        }
    }
    
    function createOrder(res) {
        if(res.code==1){
            var d = res.body;
            $("#invest-success").show();
            invest_success = true;
            // $("#finish").prop('disabled','disabled');
            $("#invest-golden").removeClass('active').next().addClass('active');
            $("#order-number").html('订单编号: '+ d);
            $(window).scrollTop(0);
        }else{
            alert(res.msg);
            return false;
        }

    }

    //返回到第五页
    $(".prev-five").on('click',function () {
        $("#invest-golden").removeClass('active').prev().addClass('active');
        $('body').scrollTop(0);
        $("#nav-golden").empty();
        $("#nav-golden-list").empty();
    });

    //上传护照照片
    var passport_photo = '',address_photo = '';
    function file_passport_upload(dom) {
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
                    passport_photo = result.body;
                    dom.siblings('img').attr('src',passport_photo);
                    default_passport_photo = false;
                    console.log(passport_photo);
                }
                if (result.code == -1) {
                    alert("上传失败,请重新上传");
                }
            }
        });
    }

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
                    address_photo = result.body;
                    dom.siblings('img').attr('src',address_photo);
                    default_passport_photo = false;
                    console.log(address_photo);
                }
                if (result.code == -1) {
                    alert("上传失败,请重新上传");
                }
            }
        });
    }

    //上传组件
    $('.fa-upload-pic').find('a').click(function(){
        $(this).siblings('input').trigger('click');
    });

    //获取焦点后移除红框
    $('input').on('focus',function () {
        $(this).removeClass('red-shadow');
    });
    $('select').on('focus',function () {
        $(this).removeClass('red-shadow');
    });
    $('textarea').on('focus',function () {
        $(this).removeClass('red-shadow');
    });

    //时间样式
    var dateFormat = "yyyy-mm-dd";
    var match = new RegExp(dateFormat.replace(/(\w+)\W(\w+)\W(\w+)/, "^\\s*($1)\\W*($2)?\\W*($3)?([0-9]*).*").replace(/m|d|y/g, "\\d"));
    var replace = "$1/$2/$3$4".replace(/\//g, dateFormat.match(/\W/));
    function doFormat(target) {
        target.value = target.value.replace(/(^|\W)(?=\d\W)/g, "$10").replace(match, replace).replace(/(\W)+/g, "$1");
    }
    $(".date_input_style").on('keyup',function(e) {
        if(!e.ctrlKey && !e.metaKey && (e.keyCode == 32 || e.keyCode > 46))
            doFormat(e.target)
    });
});

// Prevent clicking back in the browser button!
(function (global) { 

    if(typeof (global) === "undefined") {
        throw new Error("window is undefined");
    }

    var _hash = "!";
    var noBackPlease = function () {
        global.location.href += "#";

        // making sure we have the fruit available for juice (^__^)
        global.setTimeout(function () {
            global.location.href += "!";
        }, 50);
    };

    global.onhashchange = function () {
        if (global.location.hash !== _hash) {
            global.location.hash = _hash;
        }
    };

    global.onload = function () {            
        noBackPlease();

        // disables backspace on page except on input fields and textarea..
        document.body.onkeydown = function (e) {
            var elm = e.target.nodeName.toLowerCase();
            if (e.which === 8 && (elm !== 'input' && elm  !== 'textarea')) {
                e.preventDefault();
            }
            // stopping event bubbling up the DOM tree..
            e.stopPropagation();
        };          
    }

})(window);