jQuery(document).ready(function($){
   $(".fancybox").fancybox({
        afterShow: function () {
            var $modal = $(".fancybox-inner");
            $modal.find("select").select2({dropdownParent: $modal});
        }
    });

    

    $('.fancybox_spec').fancybox();
    //graphical select function call
    $("#outer_main_wrapper").find('select').select2();

    $("#content").find('select').select2();


    //simple show hide function
    $('.opener').click(function(){
        $(this).next().slideToggle('slow');
        $(this).toggleClass('active');
        $(this).find('span').toggleClass('icon-up-open');
        $(this).find('span').toggleClass('icon-down-open');
    });

    //scroll to anchor 
    $('.scroll_to').click(function(){
        var goal = $(this).attr('href');
        if($('.navbar-wrapper-fixed').hasClass('fixed_nav')){
            $('body').scrollTo(goal, {duration: 'slow', offset: -50});
        } else {
            $('body').scrollTo(goal, {duration: 'slow', offset: -200});
        }

        return false;
    });


    var screenWidth             = $(window).width();
    var screenHeight            = $(window).height();
    //sidebar
    if(screenWidth >= 1024 && $('body').hasClass('sidebar-menu') && ($('body').hasClass('d2g-doctor-overview') || $('body').hasClass('single-d2g_doctor'))){
        var $window                 = $(window),
            $mainMenuBarAnchor      = $('#doctor_wrapper');

        // Run this on scroll events. to make the sidebar fixed
        $window.scroll(function() {
            if($mainMenuBarAnchor.length){
                var window_top = $window.scrollTop();
                var div_top = $mainMenuBarAnchor.offset().top - 85;
                var div_height = $mainMenuBarAnchor.height();
                var side_height = $('.sidebar').height();

                if (window_top > div_top) {

                    $('body').addClass('fixed_state');

                    var width = document.getElementById('doctor_wrapper').offsetWidth;
                    var widthSidebar = width * 0.25;

                    //console.log(widthSidebar);

                    $('#content_wrapper').css('margin-left', 25 + '%');
                    $('#doctor_list_wrapper_outer').css('margin-left', 25 + '%');
                    $('.sidebar').css('width', widthSidebar + 'px');
                } else {
                    $('body').removeClass('fixed_state');
                    $('.sidebar').removeAttr('style');
                    $('#content_wrapper').css('margin-left', 0);
                    $('#doctor_list_wrapper_outer').css('margin-left', 0);
                }

                //console.log(window_top);

                var window_top_dif = $('.header_slider').height() + $('.how_to_row').height();

                if (window_top - window_top_dif > (div_height - side_height)) {
                    topz = window_top - window_top_dif - (div_height - side_height);
                    $('.sidebar').css('top', 85 - topz + 'px');
                }

            }
        });
    }
    

    $('.tab_link').click(function(){
        var myRef = $(this).attr('ref-loc');
        $('.d2g_tab_content_wrapper').addClass('hide');
        $(myRef).removeClass('hide');
    });

    $('.remove_btn').click(function(){
        $(this).parent().remove();

        return false;
    });

   
    var backLink = localStorage.getItem('backlink');
    if(backLink != null){
        $('#backLink').attr('href', backLink);
    }
    

});

//checks the email function
function isEmail(email) {
    var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if(!regex.test(email)) {
        return 'notOK';
    } else {
        return 'OK';
    }
}