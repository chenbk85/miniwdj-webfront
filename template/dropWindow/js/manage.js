$(function() {

    var opts = {
      lines: 11, // The number of lines to draw
      length: 6, // The length of each line
      width: 3, // The line thickness
      radius: 7, // The radius of the inner circle
      corners: 1, // Corner roundness (0..1)
      rotate: 42, // The rotation offset
      color: '#000', // #rgb or #rrggbb
      speed: 1.6, // Rounds per second
      trail: 53, // Afterglow percentage
      shadow: false, // Whether to render a shadow
      hwaccel: false, // Whether to use hardware acceleration
      className: 'spinner', // The CSS class to assign to the spinner
      zIndex: 2e9, // The z-index (defaults to 2000000000)
      top: 'auto', // Top position relative to parent in px
      left: 'auto' // Left position relative to parent in px
    };
    var target = document.getElementById('spiner');
    var spinner = new Spinner(opts).spin(target);

    var pn = null;
    // 全部应用的翻页
    $('.allapps-content .pagination li').live('click',
    function() {
        var page = parseInt($(this).find('a').text());

        $('.allapps-content .pagination li').removeClass('current');
        $(this).addClass('current');

        $('.allapps-content .carousel').fadeOut(100);
        $('.allapps-content .carousel').eq(page - 1).fadeIn(100);

         var cur_page = parseInt($('.allapps-content .pagination .current').find('a').text()) || 1,
        total_page = parseInt($('.allapps-content .pagination li').last().find('a').text()) || 1;

        if (cur_page == 1) {
            $('.prev').hide();
            $('.next').show();
        }
        else if (cur_page == total_page) {
            $('.next').hide();
            $('.prev').show();
        } else {
            $('.prev').show();
            $('.next').show();
        }

    });

    // 全部应用的删除
    $('.allapps-content .app .unstall').live('click',
    function() {
        var obj = $(this);
        pn = obj.data('pn');
        $('#delete-title').html(obj.data('title'))
        $('.delete-mask').show();
        $('.delate-asure').show();
        $('.delete-loading').hide();
    });

    $('.delate-asure .delete-yes').live('click', function(){
        var obj = $(this);
        location.href = "app:delete:" + pn;
        //RemoveApp(obj);
        $('.delate-asure').hide();
        $('.delete-loading').fadeIn();
    })

    $('.delate-asure .delete-no').live('click', function(){
        //location.href = "app:delete:" + obj.data('pn');
        //RemoveApp(obj);
        $('.delete-mask').hide();
    })

    // 点击应用图标跳转
    $('.allapps-content .app img,.update-content .app img').live('click',
    function() {
        var obj = $(this);
        location.href = "app:show:" + obj.data('pn');
    })

    // 点击应用图标跳转
    $('.allapps-content .app .name,.update-content .app .name').live('click',
    function() {
        var obj = $(this).prev();
        location.href = "app:show:" + obj.data('pn');
    })


    // 更新应用的翻页
    $('.update-content .pagination li').live('click',
    function() {
        var page = parseInt($(this).find('a').text());

        $('.update-content .pagination li').removeClass('current');
        $(this).addClass('current');

        $('.update-content .carousel').fadeOut();
        $('.update-content .carousel').eq(page - 1).fadeIn();

    });

    // 更新应用的删除
    $('.update-content .app .unstall').live('click',
    function() {
        var obj = $(this);
        RemoveUpdateApp(obj);
    });

});

function HideSpin(){
    $('.delete-loading').hide();
    $('.delete-mask').hide();
}

function RemoveAppByPn(pn) {
    RemoveApp($('#app_' + hex_md5(pn)));
    RemoveUpdateApp($('#update_app_' + hex_md5(pn)));
}

function RemoveUpdateAppByPn(pn) {
    RemoveUpdateApp($('#update_app_' + hex_md5(pn)));
}

function JumpToFirstPage() {
    $('.allapps-content .pagination li').first().click();
}
// 添加app
function AddApp(json) {
    // 如果已经存在
    if ($('#app_' + hex_md5(json.pn)).length > 0) {
        return;
    }

    var insert_content = '';
    var insert_app = '<li class="app" id="app_' + hex_md5(json.pn) + '">\
                        <a class="show-unstall" href="#" hideFocus="true">\
                        <span class="unstall" data-pn="' + json.pn + '" data-title="'+ json.name +'"></span>\
                        <img src="' + json.icon + '" class="icon" width="68" data-pn="' + json.pn + '" />\
                        <span class="name" title="' + json.name + '"> ' + decodeURIComponent(json.name) + ' </span> \
                        </a>\
                        </li>';

    $('.downloaded .original').append(insert_app);
    $('.slides.downloaded').miniSlides({
        count : 20
    });
}

// 删除app
function RemoveApp(obj) {

    var cur_page = parseInt($('.allapps-content .pagination .current').find('a').text()) || 1,
    total_page = parseInt($('.allapps-content .pagination li').last().find('a').text()) || 1,
    next_page,
    cur_container = $(obj).closest('.carousel');

    $(obj).closest('.app').remove();
    // 如果删的不是最后一页
    if (cur_page != total_page) {
        if (cur_container.find('.app').length == 0) {
            cur_container.remove();
            $('.allapps-content .pagination .current').remove();

            next_page = cur_page + 1;

            var page_li = $('.allapps-content .pagination li');

            page_li.eq(next_page - 1).click();

            for (var i = 0; i < page_li.length; i++) {
                page_li.eq(i).find('a').text(i + 1);
            }

        }
    }
    // 如果删的是最后一页
    else {
        if (cur_container.find('.app').length == 0) {
            // 还剩最后一页
            if (total_page == 1) {
                cur_container.find('ul').html('');
            } else {
                cur_container.remove();
            }

            // 总共还剩2页
            if (total_page == 2) {
                $('.allapps-content .pagination').html('');
                $('.allapps-content .carousel').show();
            }

            $('.allapps-content .pagination .current').remove();
            next_page = cur_page - 1;
            var page_li = $('.allapps-content .pagination li');
            page_li.eq(next_page - 1).click();
        }
    }

}

function RemoveAllApps(){

    $('.allapps-content .pagination').html('');
    $('.update-content .pagination').html('');

    $('.allapps-content .carousel').each(function(i){

        if ( i == 0 ){
            $(this).find('ul').html('');
        }else{
            $(this).remove();
        }

    });

    $('.update-content .carousel').each(function(i){
        if ( i == 0 ){
            $(this).find('ul').html('');
        }else{
            $(this).remove();
        }
    });

    $('.update-content .update-all').remove();
    $('.next').hide();
    $('.prev').hide();
}


// 增加 Update app
function AddUpdateApp(json) {
    // 如果已经存在
    if ($('#update_app_' + hex_md5(json.pn)).length > 0) {
        return;
    }

    var insert_content = '';

    var insert_app = '<li class="app" id="update_app_' + hex_md5(json.pn) + '">\
                        <a class="show-unstall" href="#" hideFocus="true">\
                        <img src="' + json.icon + '" class="icon" width="68" data-pn="' + json.pn + '" />\
                        <span class="name" title="' + json.name + '">' + decodeURIComponent(json.name) + '</span>   \
                        <a href="app:update:'+ json.url +'#pn='+ json.pn +'&name='+decodeURIComponent(json.name)+'&icon='+json.icon+'" class="update" onClick="$(\'.down-tab\').click();" hideFocus="true" data-url="' + json.url +'">升级</a> \
                        </a>\
                        </li>';

    $('.need-update .original').append(insert_app);
    $('.slides.need-update').miniSlides({
         count : 12
    });
}

// 删除 update app
function RemoveUpdateApp(obj) {

    var cur_page = parseInt($('.update-content .pagination .current').find('a').text()) || 1,
    total_page = parseInt($('.update-content .pagination li').last().find('a').text()) || 1,
    next_page,
    cur_container = $(obj).closest('.carousel');

    $(obj).closest('.app').remove();
    // 如果删的不是最后一页
    if (cur_page != total_page) {
        if (cur_container.find('.app').length == 0) {
            cur_container.remove();
            $('.update-content .pagination .current').remove();

            next_page = cur_page + 1;

            var page_li = $('.update-content .pagination li');

            page_li.eq(next_page - 1).click();

            for (var i = 0; i < page_li.length; i++) {
                page_li.eq(i).find('a').text(i + 1);
            }

        }
    }
    // 如果删的是最后一页
    else {
        if (cur_container.find('.app').length == 0) {

            // 还剩最后一页
            if (total_page == 1) {
                cur_container.find('ul').html('');
            } else {
                cur_container.remove();
            }

            // 总共还剩2页
            if (total_page == 2) {
                $('.update-content .pagination').html('');
                $('.update-content .carousel').show();
            }

            $('.update-content .pagination .current').remove();
            next_page = cur_page - 1;
            var page_li = $('.update-content .pagination li');
            page_li.eq(next_page - 1).click();

        }
    }

}
function jumpToNextPage(){

    var allapps = $('.allapps-content'),
    updateapps = $('.update-content'),
    pagination ;

    if ( allapps.css('display') == 'block' ){
        pagination = allapps.find('.pagination');
    }else{
        pagination = updateapps.find('.pagination');
    }

    var cur_page = parseInt(pagination.find('.current').find('a').html()),
    total_page = parseInt(pagination.find('li').last().find('a').html()),
    next_page ;

    if ( cur_page == total_page ){
        next_page = cur_page;
    }else if( cur_page == 1 && total_page > 1){
        next_page = 2;
    }else{
        next_page = cur_page + 1;
    }

    pagination.find('li').eq(next_page - 1).click();

}

function jumpToPrevPage(){

    var allapps = $('.allapps-content'),
    updateapps = $('.update-content'),
    pagination ;

    if ( allapps.css('display') == 'block' ){
        pagination = allapps.find('.pagination');
    }else{
        pagination = updateapps.find('.pagination');
    }

    var cur_page = parseInt(pagination.find('.current').find('a').html()),
    prev_page ;

    if ( cur_page == 1 ){
        prev_page = cur_page;
    }else{
        prev_page = cur_page - 1;
    }

    pagination.find('li').eq(prev_page - 1).click();
}


$(function() {
    $('.down-tab').on('click',
    function() {
        $('.title').html("下载管理");
        $(this).addClass('down-tab-current');
        $('.apps-tab').removeClass('apps-tab-current');
        $('.up-tab').removeClass('up-tab-current');
        $('.task-content').show();
        $('.update-content').hide();
        $('.allapps-content').hide();
    });
    $('.apps-tab').on('click',
    function() {
        $('.title').html("我的应用");
        $(this).addClass('apps-tab-current');
        $('.down-tab').removeClass('down-tab-current');
        $('.up-tab').removeClass('up-tab-current');
        $('.task-content').hide();
        $('.update-content').hide();
        $('.allapps-content').show();
    });
    $('.up-tab').on('click',
    function() {
        $('.title').html("应用升级")
        $(this).addClass('up-tab-current');
        $('.down-tab').removeClass('down-tab-current');
        $('.apps-tab').removeClass('apps-tab-current');
        $('.task-content').hide();
        $('.update-content').show();
        $('.allapps-content').hide();
    });

    $('.next').live('click', function(){
        var cur_page = parseInt($('.allapps-content .pagination .current').find('a').text()) || 1,
        total_page = parseInt($('.allapps-content .pagination li').last().find('a').text()) || 1;

        jumpToNextPage();
        if (cur_page == total_page - 1) {
            $(this).hide();
        }
        $('.prev').show();

    });
    $('.prev').live('click', function(){
        jumpToPrevPage();

        var cur_page = parseInt($('.allapps-content .pagination .current').find('a').text()) || 1,
        total_page = parseInt($('.allapps-content .pagination li').last().find('a').text()) || 1;

        if (cur_page == 1) {
            $(this).hide();
        }
        $('.next').show();
    })
});