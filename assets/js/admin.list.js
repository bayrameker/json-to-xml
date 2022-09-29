(function($) {
    "use strict";

    function handle_ajax(button, data, type, cb) {
        button.addClass('loading');
        button.attr("disabled", "true");
        jQuery.ajax({
            url: "/tiny_transfer_list/handle",
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType: "json",
            type: type,
            success: function(response) {
                setTimeout(() => {
                    button.removeClass("loading");
                    button.removeAttr("disabled");
                }, 1000);

                if (response.code == 200) {
                    spop({
                        template: response.msg,
                        position: "top-center",
                        style: "success",
                        autoclose: 1200,
                        onClose: function() {
                            if (cb) {
                                cb();
                            }
                        }
                    });
                } else {
                    spop({
                        template: response.msg,
                        position: "top-center",
                        style: "error",
                        autoclose: 1200
                    });
                }
            }
        });
    }

    // clearing-expired click
    jQuery(document).on('click', '.clearing-expired-btn', function() {
        var button = jQuery(this);
        handle_ajax(button, {}, "POST", function() {
            button.remove();
        });
    });

    let num = jQuery('.clearing-expired-btn').attr("data-num");
    if (num >= 10) {
        jQuery('.clearing-expired-btn').click();
    }
})(jQuery);