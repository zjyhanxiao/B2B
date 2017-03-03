// 图片上传demo
var imgAccept = {
    title: 'Images',
    extensions: 'gif,jpg,jpeg,bmp,png',
    mimeTypes: 'image/*'
};

var uploader_file = function (id, url, imgAccept) {

    var $list = $(id),
        $imgAccept = imgAccept || {
                title: 'Applications',
                extensions: 'pdf',
                mimeTypes: 'application/pdf'
            },
        // 优化retina, 在retina下这个值是2
        ratio = window.devicePixelRatio || 1,

        // 缩略图大小
        thumbnailWidth = 340 * ratio,
        thumbnailHeight = 200 * ratio,

        // Web Uploader实例
        uploader;
    // 初始化Web Uploader
    uploader = WebUploader.create({
        /*server: 'https://api1.meixinglobal.com/web/upload/user_file',
         formData: user_tooken,*/
        // 文件接收服务端。
        server: 'https://prod-gl-api.meixincn.com/web/upload/private',
        // server: baseUrlS + '/oper/product/uploadProductAch',
        // formData: {"mx_token": mx_token, "mx_secret": mx_secret},
        // server: baseUrl + '/oper/product/uploadProductAch',
        // fileVal: 'productAchFile',
        // 自动上传。
        auto: true,
        fileNumLimit: 1,
        // swf文件路径
        // swf: BASE_URL + '/js/Uploader.swf',

        // 选择文件的按钮。可选。
        // 内部根据当前运行是创建，可能是input元素，也可能是flash.
        pick: {
            // id: '.filePicker',
            id: $(id).siblings('.filePicker'),
            multiple: false
        },


        // 只允许选择文件，可选。
        accept: {
            title: 'Images,Applications',
            extensions: 'gif,jpg,jpeg,bmp,png',
            mimeTypes: 'image/!*'
        }
        /*accept: {
         title: 'Applications,Images',
         extensions: 'pdf,gif,jpg,jpeg,bmp,png,',
         mimeTypes: 'application/pdf, image/!*'
         }*/
        // accept: $imgAccept
    });

    // 当有文件添加进来的时候
    uploader.on('fileQueued', function (file) {
        var $li = $(
                '<div id="' + file.id + '" class="file-item thumbnail">' +
                // '<span class="glyphicon glyphicon-remove"></span>' +
                '<img>' +
                // '<div class="info">' + file.name + '</div>' +
                '</div>'
            ),
            $img = $li.find('img');
        $list.html($li);
        // 创建缩略图
        /*uploader.makeThumb(file, function (error, src) {
         if (error) {
         $img.replaceWith('<span>不能预览</span>');
         return;
         }
         $img.attr('src', src);
         }, thumbnailWidth, thumbnailHeight);
         $list.on('click', '.glyphicon-remove', function () {
         uploader.removeFile(file, true);
         })*/
    });
    /*
     $('body').on('click','.glyphicon-remove',function (file) {
     uploader.removeFile( file );
     });*/

    // 文件上传过程中创建进度条实时显示。
    uploader.on('uploadProgress', function (file, percentage) {
        // console.log(percentage);
        var $li = $('#' + file.id).find('.info'),
            $percent = $li.find('.progress span');

        // 避免重复创建
        if (!$percent.length) {
            $percent = $('<p class="progress"><span></span></p>')
                .appendTo($li)
                .find('span');
        }

        $percent.css('width', percentage * 100 + '%');
    });

    // 文件上传成功，给item添加成功class, 用样式标记上传成功。
    uploader.on('uploadSuccess', function (file, response) {
        $('#' + file.id).addClass('upload-state-done');
        var uploadFileUrl = response.body;
        $('.uploader-demo').find('img').attr('src', uploadFileUrl);
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
        $('.step-one,.step-two').prop('disabled',false);
    });

    // 文件上传失败，现实上传出错。
    uploader.on('uploadError', function (file) {
        var $li = $('#' + file.id),
            $error = $li.find('div.error');

        // 避免重复创建
        if (!$error.length) {
            $error = $('<div class="error"></div>').appendTo($li);
        }

        $error.text('上传失败');
    });

    // 完成上传完了，成功或者失败，先删除进度条。
    uploader.on('uploadComplete', function (file) {
        uploader.removeFile(file, true);
        $('#' + file.id).find('.progress').remove();
    });
};
