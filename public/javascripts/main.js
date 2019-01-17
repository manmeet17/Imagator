$(function () {
    $('.uploadPic').click(function (e) {
        e.preventDefault();
        var file = $(".postFiles")[0].files;
        var fd = new FormData();
        for (let i = 0; i < file.length; i++) {
            var f = file[i];
            fd.append('photo', f);
        }
        console.log(fd.entries());
        for (var key of fd.entries()) {
            console.log(key[0] + ' , ' + key[1]);

        }
        $.ajax({
            url: '/image',
            type: "POST",
            data: fd,
            cache: false,
            contentType: false,
            processData: false,
            success: function (res) {
                console.log(res);
                // window.location.href="/image";
            },
            error: function(error) {
                console.log(error);
            }
        });
    });
});