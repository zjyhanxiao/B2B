$(function () {
    function updateProfile(data,callback) {
        postData({
            url: base_url + '/zion/assist/operateUser',
            data:data,
            sucFn:callback
        })
    }
});
