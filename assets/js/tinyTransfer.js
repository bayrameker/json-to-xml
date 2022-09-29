/* -------------------------------------------------------------------
 * Author Name           : Bbfpl
 * Author URI            : https://codecanyon.net/user/bbfpl
 * Version               : 1.0.0
 * File Name             : tinyTransfer.js
------------------------------------------------------------------- */
(function($) {
    "use strict";

    let TinyTransferApp = {
        container: ".tiny-transfer",
        DATA: {},
        UUID: "",
        options: {},
        _toast: false,
        _ismobile: false,
        templates: {
            base: `<!-- tinyTransfer form -->
            <div class="tiny-transfer-form type-email" data-type="email">
                <form>
                    <input class="ui-uploader-input" type="file" multiple="">
                </form>
                <!-- scrollbar -->
                <div class="scrollbar form-scrollbar">
                    <!-- files -->
                    <div class="files">
                        <div class="files-empty flex flex-center">
                            <div class="files-add-event flex">
                                <div class="flex flex-middle">
                                    <i class="iconfont icon-jiahao1"></i>
                                </div>
                                <div class="add-files-label">
                                    <strong>Drag & drop files here</strong>
                                    <p>Browse files</p>
                                </div>
                            </div>
                        </div>
                        <div class="files-list" >
                            <div class="files-queue"></div>
                            <div class="files-add-more">
                                <div class="files-add-event flex">
                                    <div class="flex flex-middle">
                                        <i class="iconfont icon-jiahao"></i>
                                    </div>
                                    <div class="add-files-label">
                                        <strong>Add more files</strong>
                                        <p></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- fields -->
                    <div class="fields">
                        <div class="field-recipient">
                            <div class="field-recipient-summary">
                                <span></span> ,<a></a>
                            </div>
                            <div class="field-recipient-container">
                                <div class="recipients"></div>
                                <div class="input">
                                    <input type="text" name="recipient" placeholder="Email to">
                                </div>
                            </div>
                        </div>

                        <div class="input">
                            <input type="text" name="sender" placeholder="Your email">
                        </div>
                        <div class="textarea">
                            <textarea type="text" name="message" class="autoExpand" placeholder="Message"></textarea>
                        </div>
                    </div>
                    <!-- options -->
                    <div class="options" style="display: none">
                        <div class="option-item options-type">
                            <label class="form-radio">
                                <input type="radio" name="type" value="email" checked><i class="form-icon"></i> Send email
                            </label>
                            <label class="form-radio">
                                <input type="radio" name="type" value="link" ><i class="form-icon"></i> Get link
                            </label>
                        </div>
                        <div class="options-features">
                            <div class="option-item">
                                <label>Expires after</label>
                                <div>
                                    <select name="expires_after" class="dropdown">
                                        <option value="1">1 day</option>
                                        <option value="2">2 day</option>
                                        <option value="3">3 day</option>
                                        <option value="4">4 day</option>
                                        <option value="7">1 week</option>
                                        <option value="14">2 week</option>
                                        <option value="21">3 week</option>
                                        <option value="28">4 week</option>
                                    </select>
                                </div>
                            </div>
                            <div class="option-item">
                                <label>Password</label>
                                <div>
                                    <input type="text" name="password" placeholder="Set password">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- progress -->
                <div class="tiny-transfer-progress">
                    <div class="progress-svg">
                        <svg viewBox="-1 -1 34 34">
                            <circle cx="16" cy="16" r="15.9" fill="none" class="circle"/>
                            <circle cx="16" cy="16" r="15.9" fill="none" class="progress"/>
                        </svg>
                        <div class="progress-label"><strong>0</strong><span>%</span></div>
                    </div>
                    <div class="transferring-warp">
                        <h2>Transferring...</h2>
                        <p><a class="file-num details-open"></a></p>
                        <p></p>
                    </div>
                    <div class="cancel-warp">
                        <h2>Cancel this transfer?</h2>
                    </div>
                </div>
                <div class="tiny-transfer-complete">
                    <div class="email-complete">
                        <span class="complete-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512.001 512.001"><circle cx="256" cy="256" r="256" fill="#5C5E70"/><g fill="#34ABE0"><path class="fack-star" d="M469.87 206.196c-3.883 0-7.03-3.147-7.03-7.03V187.91c0-3.882 3.147-7.03 7.03-7.03 3.88 0 7.028 3.148 7.028 7.03v11.26c0 3.882-3.148 7.028-7.03 7.028zM469.87 263.776c-3.883 0-7.03-3.147-7.03-7.03V245.49c0-3.882 3.147-7.03 7.03-7.03 3.88 0 7.028 3.148 7.028 7.03v11.258c0 3.88-3.148 7.028-7.03 7.028zM504.288 229.358h-11.26c-3.88 0-7.028-3.147-7.028-7.03 0-3.88 3.147-7.028 7.03-7.028h11.258c3.882 0 7.03 3.147 7.03 7.03 0 3.88-3.15 7.028-7.03 7.028zM446.707 229.358H435.45c-3.882 0-7.03-3.147-7.03-7.03 0-3.88 3.148-7.028 7.03-7.028h11.258c3.882 0 7.03 3.147 7.03 7.03-.003 3.88-3.15 7.028-7.03 7.028zM391.867 22.724c-3.882 0-7.03-3.147-7.03-7.03V7.03c0-3.883 3.148-7.03 7.03-7.03s7.03 3.147 7.03 7.03v8.665c0 3.883-3.148 7.03-7.03 7.03zM391.867 67.048c-3.882 0-7.03-3.147-7.03-7.03v-8.665c0-3.882 3.148-7.03 7.03-7.03s7.03 3.148 7.03 7.03v8.666c0 3.88-3.148 7.028-7.03 7.028zM418.362 40.553h-8.666c-3.882 0-7.03-3.147-7.03-7.03s3.148-7.028 7.03-7.028h8.666c3.882 0 7.03 3.147 7.03 7.03s-3.148 7.028-7.03 7.028zM374.038 40.553h-8.666c-3.882 0-7.03-3.147-7.03-7.03s3.148-7.028 7.03-7.028h8.666c3.882 0 7.03 3.147 7.03 7.03s-3.148 7.028-7.03 7.028z"/></g><path class="fire" d="M305.852 124.76c-1.274 0-2.564-.347-3.724-1.074-3.29-2.06-4.286-6.398-2.226-9.687 10.31-16.464 18.895-32.582 25.513-47.907 1.54-3.563 5.673-5.204 9.24-3.666 3.562 1.54 5.204 5.676 3.664 9.24-6.9 15.975-15.82 32.728-26.507 49.794-1.332 2.13-3.62 3.3-5.96 3.3z" fill="#FF5A5A"/><path class="fire" d="M215.974 234.747c-1.874 0-3.744-.745-5.127-2.22-2.656-2.83-2.514-7.278.317-9.935.323-.303 32.638-30.776 64.89-73.917 2.323-3.11 6.728-3.746 9.838-1.42 3.11 2.323 3.745 6.728 1.42 9.838-33.03 44.182-65.178 74.484-66.53 75.752-1.36 1.27-3.085 1.902-4.808 1.902z" fill="#34ABE0"/><path  class="fire" d="M278.15 244.885c-1.91 0-3.81-.772-5.197-2.294-2.614-2.868-2.41-7.313.46-9.93 32.72-29.824 97.504-82.768 163.752-102.266 3.723-1.095 7.63 1.034 8.727 4.758 1.096 3.724-1.034 7.63-4.758 8.727-63.544 18.7-126.424 70.16-158.25 99.17-1.35 1.23-3.045 1.835-4.735 1.835z" fill="#F9F9F9"/><g fill="#FF5A5A"><path class="fire" d="M290.023 308.794c-2.07 0-4.12-.91-5.507-2.655-2.416-3.04-1.91-7.462 1.128-9.876 2.334-1.855 58.024-45.266 133.17-30.816 3.812.732 6.308 4.417 5.575 8.23-.733 3.812-4.416 6.313-8.23 5.574-68.88-13.246-121.248 27.602-121.77 28.017-1.29 1.024-2.834 1.524-4.367 1.524zM194.78 177.404c-1.062 0-2.138-.24-3.15-.75-3.468-1.74-4.868-5.965-3.125-9.434 11.36-22.624 23.205-58.43 15.11-100.516-.733-3.812 1.764-7.496 5.576-8.23 3.812-.733 7.497 1.764 8.23 5.576 8.84 45.966-4.013 84.906-16.353 109.48-1.234 2.455-3.713 3.874-6.288 3.874z"/></g><path d="M286.378 370.562l-115.545 57.584-67.27 33.54c-34.106-25.317-61.702-58.92-79.8-97.833l11.128-22.33L87.88 235.207l21.002-42.14L286.378 370.56z" fill="#F9F9F9"/><path  d="M286.378 370.562l-182.826 91.115c-9.132-6.78-17.795-14.158-25.945-22.08l167.518-123.913 41.253 54.878z" fill="#E8E8E8"/><g fill="#FF5A5A"><path  d="M76.667 438.69c-21.828-21.432-39.842-46.75-52.903-74.826v-.01l11.14-22.33 41.763 97.165zM286.38 370.56l-115.54 57.578-18.766-43.628-64.19-149.3 21.004-42.142L237.3 321.48"/></g><path fill="#EA4444" d="M286.38 370.56l-115.54 57.578-18.766-43.628 85.227-63.03 7.83-5.797"/><path d="M270.098 373.123L106.316 209.34c-7.938-7.937-7.938-20.806 0-28.744 7.938-7.938 20.807-7.938 28.745 0l163.782 163.78c7.938 7.94 7.938 20.808 0 28.746-7.937 7.938-20.807 7.938-28.744 0z" fill="#F9F9F9"/><path d="M298.843 344.378l-44.07-44.07c7.94 7.94 7.94 20.808 0 28.746s-20.806 7.938-28.744 0l44.068 44.07c7.938 7.937 20.807 7.937 28.745 0 7.938-7.94 7.937-20.81 0-28.746z" fill="#E8E8E8"/><circle class="star" cx="163.391" cy="128.011" r="7.029" fill="#F9F9F9"/><circle class="star" cx="257.317" cy="101.178" r="7.029" fill="#FF5A5A"/><circle class="star" cx="372.328" cy="122.264" r="7.029" fill="#34ABE0"/><g fill="#F9F9F9"><circle class="star" cx="372.328" cy="323.532" r="7.029"/><path class="star" d="M254.9 10.03l8.735 7.768c.74.657 1.753.91 2.714.673l11.35-2.79c2.418-.595 4.468 1.84 3.47 4.122l-4.69 10.708c-.398.906-.323 1.95.198 2.79l6.163 9.933c1.313 2.116-.37 4.818-2.847 4.574l-11.633-1.15c-.984-.098-1.953.295-2.59 1.05l-7.543 8.93c-1.607 1.903-4.697 1.137-5.23-1.295l-2.5-11.42c-.21-.965-.885-1.766-1.8-2.14l-10.824-4.414c-2.305-.94-2.532-4.116-.383-5.374l10.088-5.907c.854-.5 1.406-1.387 1.48-2.373l.853-11.66c.18-2.482 3.13-3.68 4.99-2.025z"/></g><path class="star" d="M485.99 69.64l6.114 12.887c.517 1.09 1.537 1.856 2.728 2.047l14.082 2.268c3 .483 4.143 4.196 1.935 6.283l-10.367 9.797c-.877.83-1.29 2.035-1.104 3.228l2.193 14.094c.467 3.002-2.71 5.236-5.377 3.78l-12.52-6.83c-1.06-.58-2.335-.6-3.412-.053l-12.726 6.443c-2.71 1.372-5.818-.96-5.258-3.946l2.628-14.02c.223-1.185-.154-2.404-1.004-3.26l-10.06-10.112c-2.14-2.154-.884-5.83 2.128-6.22l14.145-1.833c1.196-.155 2.24-.89 2.79-1.962l6.51-12.69c1.385-2.705 5.27-2.644 6.572.1z" fill="#FF5A5A"/></svg></span>

                        <div class="transferring-warp">
                            <h2>You’re done!</h2>

                            <div class="complete-link">
                                <p>Copy your download link <br>
                                    <a class="details-open">see what's inside</a>
                                </p>
                                <input class="form-input" type="text" value="">
                            </div>

                            <div class="complete-email">
                                <p>
                                    <span></span><br>
                                    <a class="details-open">see what's inside</a>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="link-complete"></div>
                </div>
                <!-- footer -->
                <div class="tiny-transfer-footer flex flex-middle">
                    <div class="flex footer-start">
                        <div class="flex flex-middle">
                            <a class="tiny-transfer-toggle-options"><i class="iconfont icon-more-o"></i></a>
                        </div>
                        <div class="tiny-transfer-button" data-type="1">
                            <button class="btn btn-primary disabled">Transfer</button>
                        </div>
                    </div>
                    <div class="flex flex-center footer-cancel-btn">
                        <button class="btn cancel-stop">Cancel</button>
                    </div>
                    <div class="flex flex-center footer-cancel-container">
                        <button class="btn cancel-no">No</button>
                        <button class="btn cancel-yes btn-primary">Yes</button>
                    </div>
                    <div class="flex flex-center footer-complete-container">
                        <button class="btn btn-primary complete-continue">Continue</button>
                    </div>
                </div>
            </div>
            <!-- tinyTransfer details -->
            <div class="tiny-transfer-details">
                <a class="details-close"><i class="iconfont icon-shanchu"></i></a>
                <!-- scrollbar -->
                <div class="scrollbar details-scrollbar">
                    <div class="details-centont"></div>
                </div>
            </div>
            `,
            file_item: `<div class="file-item" data-fid="%%fid%%">
                <div class="file-item-thumbnail">
    
                </div>
                <div class="file-item-body">
                    <p>%%filename%%</p>
                    <span>%%filesize%%</span>
                </div>
                <div class="file-item-status">
                    <span class="file-item-remove">
                        <i class="iconfont icon-shanchu"></i>
                    </span>
                </div>
            </div>`,
            fields_recipient: `<div class="fields-recipient" data-value="%%email%%">
                <p>
                    %%email%% <a class="fields-remove-recipient"><i class="iconfont icon-shanchu"></i></a>
                </p>
            </div>`,
            details: `<h4>Your transfer details</h4>
                <div class="details-subtitle">
                    <span>{files_num} files</span>
                    <span>{files_size}</span>
                    <span>Expires in {files_expires}</span>
                </div>
                {if is_message}
                    <div class="details-message">
                        <h5>Message</h5>
                        <p>{message}</p>
                    </div>
                {/if}
                <div class="details-filelist">
                    <h5>{files_num} files</h5>
                    <ul>
                        {for files_list item}
                        <li>
                            <h6>{item.name}</h6>
                            <p>
                                <span>{item.size}</span>
                                <span>{item.ext}</span>
                            </p>
                        </li>
                        {/for}
                    </ul>
                </div>
            `,
            download_templates: {
                base: `<!-- tinyTransfer download -->
                    <div class="tiny-transfer-form tiny-transfer-download">
                        <div class="password-panel-loading flex flex-center flex-middle">
                            <div class="loading loading-lg"></div>
                        </div>
                    </div>
                `,
                expires: `<div class="tiny-transfer-password">
                        <div class="password-icon flex flex-center">
                            <i class="iconfont icon-system_expired_line"></i>
                        </div>
                        <div class="transferring-warp">
                            <h2>Transfer expired</h2>
                            <p>Sorry, this transfer has expired and is not available any more</p>
                        </div>
                        <!-- footer -->
                        <div class="tiny-transfer-footer flex flex-middle flex-center">
                            <button class="btn btn-primary to-home">Send a file?</button>
                        </div>
                    </div>
                `,
                password_tpl: `<div class="tiny-transfer-password">
                        <div class="password-icon flex flex-center">
                            <i class="iconfont icon-lock-fill"></i>
                        </div>
                        <div class="transferring-warp">
                            <h2>Encrypted File</h2>
                            <div class="password-input">
                                <p>Please enter your download password</p>
                                <input class="form-input" type="text" placeholder="Enter your password">
                            </div>
                        </div>
                        <!-- footer -->
                        <div class="tiny-transfer-footer flex flex-middle flex-center">
                            <button class="btn btn-primary submit-password-btn">Submit</button>
                        </div>
                    </div>
                `,
                download_tpl: `<!-- scrollbar -->
                    <div class="scrollbar download-scrollbar">
                        <div class="transferring-warp">
                            <h2>Ready when you are</h2>
                            <p class="t">Transfer expires in {expires_after} days</p>
                            <div class="download-file-list">
                                {for files item}
                                <div class="file-item">
                                    <div class="file-item-body">
                                        <p>{item.name}</p>
                                        <span>{item.size} · {item.ext}</span>
                                    </div>
                                    <div class="file-item-status">
                                        <span class="file-item-download" data-id="{item.id}">
                                            <i class="iconfont"></i>
                                        </span>
                                    </div>
                                </div>
                                {/for}
                            </div>
                        </div>
                    </div>
                    <!-- footer -->
                    <div class="tiny-transfer-footer flex flex-middle flex-center">
                        {if is_local_file}
                        <button class="btn btn-primary downloads">Downloads</button>
                        {/if}
                    </div>
                `
            }
        },
        validate: {
            is_mail: function(str) {
                var reg = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
                return reg.test(str);
            }
        },
        toast: function(status, msg) {
            if (TinyTransferApp._toast) {
                return false;
            }
            TinyTransferApp._toast = true;
            let str = '<div class="tiny-transfer-alert"><div class="toast toast-' + status + '"></div></div>';
            jQuery(".tiny-transfer").append(str);
            jQuery(".tiny-transfer-alert").fadeIn(300).find(".toast").text(msg);
            setTimeout(function() {
                jQuery(".tiny-transfer-alert").fadeOut(300, function() {
                    TinyTransferApp._toast = false;
                    jQuery(".tiny-transfer-alert").remove();
                });
            }, 2000);
        },
        init: function(options) {

            this.options = options;
            let _type = jQuery(this.container).attr("data-type");
            if (_type == "download") {
                TinyTransferApp.Download.init();
            } else {
                jQuery(this.container).empty().html(this.templates.base);
                this.mobile();
                this.UUID = this.getUUID();
                TinyTransferApp.Input.init();
                TinyTransferApp.Scrollbar.init();
                TinyTransferApp.Options.init();
                TinyTransferApp.Uploader.init(this.options);
                this.events();
            }
        },
        _reset() {
            TinyTransferApp.DATA.reciptent_email = [];
            TinyTransferApp.DATA.type = "email";
            jQuery(this.container).empty().html(this.templates.base);
            this.mobile();
            this.UUID = this.getUUID();
            TinyTransferApp.Scrollbar.init();
            TinyTransferApp.Options.init();
            TinyTransferApp.Uploader.init(this.options);
        },
        mobile: function() {
            let width = window.innerWidth;
            let height = window.innerHeight;
            if (width <= 600) {
                this._ismobile = true;
                jQuery('.scrollbar').height(height - 72);
            }
        },
        getUUID: function() {
            let s = [];
            let hexDigits = "0123456789abcdef";
            for (let i = 0; i < 36; i++) {
                s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
            }
            s[14] = "4";
            s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
            s[8] = s[13] = s[18] = s[23] = "-";

            let uuid = s.join("");
            return uuid;
        },
        Download: {
            id: "",
            download_panel: ".tiny-transfer-download",
            verify: false,
            password: '',
            download_pending: false,
            is_local_file: true,
            init: function() {
                this.id = jQuery(TinyTransferApp.container).attr("data-id");
                jQuery(TinyTransferApp.container).empty().html(TinyTransferApp.templates.download_templates.base);

                this.expires();
            },
            expires: function() {
                let expires = jQuery(TinyTransferApp.container).attr("data-expires");
                if (expires == "true") {
                    let _container = jQuery(this.download_panel).empty();
                    _container.html(TinyTransferApp.templates.download_templates.expires);
                } else {
                    this.verify_page();
                }
                this.events();
            },
            verify_page: function() {
                let that = this;
                let _container = jQuery(this.download_panel).empty();
                let _verify = jQuery(TinyTransferApp.container).attr("data-verify");
                if (_verify == "true") {
                    that.verify = true;
                    _container.html(TinyTransferApp.templates.download_templates.password_tpl);
                } else {
                    that.list({
                        id: that.id
                    });
                }
            },
            do_verify: function(password) {
                let that = this;
                // request
                TinyTransferApp.Request._ajax(TinyTransferApp.options.action.verify, {
                    id: that.id,
                    password: password
                }, function(success, response, status) {
                    if (success == true && response.code == 200) {
                        that.password = password;
                        that.list({
                            id: that.id,
                            password: password
                        });
                    } else {
                        TinyTransferApp.toast('warning', response.msg);
                    }
                });
            },
            list: function(data) {
                let that = this;
                jQuery(that.download_panel).empty().html(TinyTransferApp.templates.download_templates.base);

                // request
                TinyTransferApp.Request._ajax(TinyTransferApp.options.action.download_page_list, data, function(success, response, status) {
                    if (success == true && response.code == 200) {
                        that.is_local_file = response.data["is_local_file"];
                        let html = Template(TinyTransferApp.templates.download_templates.download_tpl, response.data);
                        jQuery(that.download_panel).empty().html(html);
                        TinyTransferApp.mobile();
                        TinyTransferApp.Scrollbar.init();
                    } else {
                        TinyTransferApp.toast('warning', response.msg);
                    }
                });
            },
            download: function(btn, data, cb) {
                let that = this;
                if (that.download_pending) {
                    return false;
                }
                that.download_pending = true;

                jQuery('.file-item-download,.downloads').addClass("disabled");
                btn.addClass("loading");

                if (that.verify) {
                    data.password = that.password;
                }
                // request
                TinyTransferApp.Request._ajax(TinyTransferApp.options.action.download_link, data, function(success, response) {
                    if (success == true && response.code == 200) {
                        if (cb) {
                            cb();
                        }
                        that.execute_download(response.data);
                    } else {
                        TinyTransferApp.toast('warning', response.msg);
                    }
                    that.download_pending = false;
                    setTimeout(function() {
                        jQuery('.file-item-download,.downloads').removeClass("disabled");
                        btn.removeClass("loading");
                    }, 2000);
                });
            },
            execute_download: function(downloadLink) {
                if (!downloadLink) {
                    throw new Error('DownloadFailed');
                }
                return document.location.assign(downloadLink);
            },
            events: function() {
                let that = this;
                // Submit password
                jQuery(document).on("click", ".submit-password-btn", function() {
                    let val = jQuery(".password-input").find("input").val().trim();
                    if (val == "") {
                        TinyTransferApp.toast('warning', 'The password cannot be empty');
                    } else {
                        that.do_verify(val);
                    }
                });

                // Download single file
                jQuery(document).on("click", ".file-item-download", function() {
                    if (that.download_pending) {
                        return;
                    }
                    let $this = jQuery(this);
                    let file_id = jQuery(this).attr("data-id");

                    that.download($this, {
                        type: "single",
                        id: that.id,
                        file_id: file_id
                    }, function() {
                        $this.addClass("download-success");
                    });
                });
                // Download all files
                jQuery(document).on("click", ".downloads", function() {
                    if (!that.is_local_file) {
                        return;
                    }
                    if (that.download_pending) {
                        return;
                    }

                    that.download(jQuery(this), {
                        type: "all",
                        id: that.id
                    });
                });

                // to home
                jQuery(document).on("click", ".to-home", function() {
                    window.location.href = "/";
                });
            },
        },
        // Scrollbar
        Scrollbar: {
            // scrollbar init
            init: function() {
                if (!TinyTransferApp._ismobile) {
                    jQuery(".scrollbar").scrollbar();
                }
            },
            // scrollbar resize
            resize: function(dom) {
                if (!TinyTransferApp._ismobile) {
                    jQuery(dom || ".scrollbar").scrollbar("resize");
                }
            },
            scroll: function(dom, position) {
                if (!TinyTransferApp._ismobile) {
                    jQuery(dom || ".scrollbar").scrollbar("scroll", position, 300);
                }
            }
        },
        Input: {
            init: function() {
                this.radio();
                this.textarea();
                this.click();
                this.keyup();
                this.recipient();
                this.sender();
            },
            radio: function() {
                jQuery(".options-type input[name=type]:eq(0)").prop("checked", 'checked');
            },
            click: function() {
                jQuery(document).on('click', ".fields input[name=sender],.fields textarea", function() {
                    TinyTransferApp.Input.recipient_summary_show();
                    if (jQuery(".options").is(':hidden') == false) {
                        TinyTransferApp.Options.toggle();
                    }
                });
                jQuery(document).on('focus', ".fields input[name=sender],.fields textarea", function() {
                    TinyTransferApp.Input.recipient_summary_show();
                });
            },
            keyup: function() {
                jQuery(document).on('keyup', ".fields input,.fields textarea", function() {
                    TinyTransferApp.check();
                });
            },
            textarea: function() {
                function setHeight(element) {
                    jQuery(element).css({ 'height': 'auto', 'overflow-y': 'hidden' }).height(element.scrollHeight);
                    TinyTransferApp.Scrollbar.resize(".form-scrollbar");
                }
                jQuery('textarea').each(function() {
                    setHeight(this);
                }).on('input', function() {
                    setHeight(this);
                });
            },
            recipient_summary_show() {
                if (TinyTransferApp.DATA.reciptent_email.length > 0) {
                    jQuery(".field-recipient-summary").show();
                    jQuery('.field-recipient-container').hide();
                }
            },
            recipient: function() {
                TinyTransferApp.DATA.reciptent_email = [];

                function add_email(email) {
                    let template = TinyTransferApp.templates.fields_recipient;
                    template = template.replace(new RegExp("%%email%%", "gm"), email);
                    template = jQuery(template);
                    jQuery(".recipients").append(template);
                }

                function validate_email(email) {
                    let emails = email.split(",");
                    let _error = false;
                    emails.forEach(v => {
                        if (TinyTransferApp.validate.is_mail(v)) {
                            TinyTransferApp.DATA.reciptent_email.push(v);
                            add_email(v);
                        } else {
                            _error = true;
                        }
                    });

                    if (_error) {
                        TinyTransferApp.toast('warning', 'Email format error');
                    }

                    TinyTransferApp.Scrollbar.resize(".form-scrollbar");
                    jQuery('.field-recipient-summary').find('span').text(TinyTransferApp.DATA.reciptent_email[0]);
                    jQuery('.field-recipient-summary').find('a').text("+" + TinyTransferApp.DATA.reciptent_email.length + " other");

                    TinyTransferApp.check();
                }

                jQuery(document).on('blur', "input[name=recipient]", function() {
                    let email = jQuery(this).val().trim();
                    if (email != "") {
                        validate_email(email);
                        jQuery(this).val("");
                        TinyTransferApp.Scrollbar.resize(".form-scrollbar");
                    }
                });

                jQuery(document).on('keypress', "input[name=recipient]", function() {
                    if (event.keyCode == "13") {
                        let email = jQuery(this).val().trim();
                        validate_email(email);
                        jQuery(this).val("");
                    }
                });

                jQuery(document).on('click', ".fields-remove-recipient", function() {
                    let _recipient = jQuery(this).parents(".fields-recipient");
                    let _index = _recipient.index();
                    if (_index > -1) {
                        TinyTransferApp.DATA.reciptent_email.splice(_index, 1);
                    }
                    _recipient.remove();
                    TinyTransferApp.check();
                    TinyTransferApp.Scrollbar.resize(".form-scrollbar");
                });

                jQuery(document).on('click', ".field-recipient-summary", function() {
                    jQuery(".field-recipient-summary").hide();
                    jQuery('.field-recipient-container').show();
                    jQuery("input[name='recipient']").focus();
                });

            },
            sender: function() {
                jQuery(document).on('blur', "input[name='sender']", function() {
                    let v = jQuery(this).val().trim();
                    if (!TinyTransferApp.validate.is_mail(v)) {
                        jQuery(this).val("");
                    }
                    TinyTransferApp.check();
                });
            }
        },
        Request: {
            _ajax: function(url, data, cb) {
                $.ajax({
                    url: url,
                    data: data,
                    type: "POST",
                    success: function(response, status, jqXHR) {
                        cb(true, response, status);
                    },
                    error: function(jqXHR, status, error) {
                        cb(false, error, status);
                    }
                });
            }
        },
        // Uploader
        Uploader: {
            files: [],
            files_size: 0,
            cache_queue_files: [],
            progress: {
                percentage_value: 0,
                files_len: 0
            },
            list: {
                success: [],
                error: []
            },
            reset: function() {
                this.files = [];
                this.files_size = 0;
                this.cache_queue_files = [];
                this.progress = {
                    percentage_value: 0,
                    files_len: 0
                };
                this.list = {
                    success: [],
                    error: []
                };
            },
            // Format file size
            format_file_size: function(fileSize) {
                if (fileSize < 1024) {
                    return fileSize + " B";
                } else if (fileSize < 1024 * 1024) {
                    let temp = fileSize / 1024;
                    temp = temp.toFixed(2);
                    return temp + " KB";
                } else if (fileSize < 1024 * 1024 * 1024) {
                    let temp = fileSize / (1024 * 1024);
                    temp = temp.toFixed(2);
                    return temp + " MB";
                } else {
                    let temp = fileSize / (1024 * 1024 * 1024);
                    temp = temp.toFixed(2);
                    return temp + " GB";
                }
            },
            // String to Color
            text_to_color: function(str) {
                if (!str || str.length == 0) return false;
                let hash = 0;
                let colour = "#";
                for (let i = 0; i < str.length; i++) {
                    hash = str.charCodeAt(i) + ((hash << 5) - hash);
                }

                for (let i = 0; i < 3; i++) {
                    colour += ("00" + ((hash >> (i * 2)) & 0xff).toString(16)).slice(-2);
                }
                return colour;
            },
            // Get file id
            get_file_id: function() {
                return Math.random().toString(36).substr(2);
            },
            files_info: function() {
                let files = TinyTransferApp.Uploader.files;
                let size = 0;
                files.forEach(function(v) {
                    size += v.size;
                });
                TinyTransferApp.Uploader.files_size = size;

                jQuery('.files-add-more .add-files-label').find("p").text(files.length + " files added · " + TinyTransferApp.Uploader.format_file_size(size) + " . " + TinyTransferApp.Uploader.format_file_size(TinyTransferApp.options.maxUploadSize) + " remaining");
            },
            // Creates a new file and add it to our list
            qaueued_add_file: function(fid, file) {
                let id = this.get_file_id();
                let template = TinyTransferApp.templates.file_item;
                template = template.replace("%%fid%%", fid);
                template = template.replace("%%filename%%", file.name);
                template = template.replace("%%filesize%%", this.format_file_size(file.size));

                template = jQuery(template);
                template.prop("id", "uploader-qaueued-file-" + id);
                template.data("file-id", id);

                jQuery(".files-queue").append(template);

                // Get file ext
                let startIndex = file.name.lastIndexOf(".");
                let extName = file.name
                    .substring(startIndex + 1, file.name.length)
                    .toLowerCase();
                let allImgExt = "jpg|jpeg|gif|bmp|png|";

                // Determine whether it is a picture file
                let fileItemThumbnail = jQuery("#uploader-qaueued-file-" + id).find(
                    ".file-item-thumbnail"
                );
                if (allImgExt.indexOf(extName + "|") == -1) {
                    fileItemThumbnail.html(
                        '<div style="background-color: ' +
                        this.text_to_color(extName) +
                        '" class="file-item-icon"><i>' +
                        extName +
                        "</i></div>"
                    );
                } else {
                    fileItemThumbnail.html(
                        '<div class="file-item-icon"><img class="preview-img" src=""></div>'
                    );
                    if (typeof FileReader !== "undefined") {
                        let reader = new FileReader();
                        let img = fileItemThumbnail.find("img");

                        reader.onload = function(e) {
                            img.attr("src", e.target.result);
                        };
                        reader.readAsDataURL(file);
                    }
                }
            },
            // init
            init: function(options) {
                let self = this;
                this.reset();
                // upload init
                jQuery(".tiny-transfer-form").uploader({
                        maxSize: options.maxSize,
                        action: options.action.upload,
                        autoUpload: false,
                        chunked: true,
                        chunkSize: options.chunkSize,
                        maxConcurrent: 1,
                        hiddenInput: true
                    }).on("start.uploader", self.onStart)
                    .on("complete.uploader", self.onComplete)
                    .on("filestart.uploader", self.onFileStart)
                    .on("fileprogress.uploader", self.onFileProgress)
                    .on("filecomplete.uploader", self.onFileComplete)
                    .on("fileerror.uploader", self.onFileError)
                    .on("fileremove.uploader", self.onFileRemove)
                    .on("chunkstart.uploader", self.onChunkStart)
                    .on("chunkcomplete.uploader", self.onChunkComplete)
                    .on("chunkerror.uploader", self.onChunkError)
                    .on("queued.uploader", self.onQueued);
            },
            reader: function() {
                let len = jQuery(".files-queue").find(".file-item").length;
                if (len <= 0) {
                    jQuery('.files-empty').show();
                    jQuery(".files-list").hide();
                } else {
                    jQuery('.files-empty').hide();
                    jQuery(".files-list").show();
                }
            },
            all_progress(index, percent) {
                let percentage_value = TinyTransferApp.Uploader.progress.percentage_value;
                let progress_value = 0;
                if (TinyTransferApp.Uploader.progress.files_len == 1) {
                    progress_value = (percentage_value / 100) * percent;
                } else {
                    progress_value = percentage_value * index + (percentage_value / 100) * percent;
                }
                console.log(progress_value);
                let strokeDashOffsetValue = 100 - (parseInt(progress_value) / 100 * 100);
                jQuery(".progress").css("stroke-dashoffset", strokeDashOffsetValue);
                jQuery('.progress-label').find("strong").text(Math.floor(progress_value));

                let n = Math.floor(TinyTransferApp.Uploader.files_size * progress_value / 100);
                jQuery(".transferring-warp").find("p").eq(1).text(TinyTransferApp.Uploader.format_file_size(n) + " of " + TinyTransferApp.Uploader.format_file_size(TinyTransferApp.Uploader.files_size) + " uploaded");
            },
            onStart: function(e, files) {
                TinyTransferApp.Uploader.cache_queue_files = files;
                console.log("Start-Waiting");
                TinyTransferApp.Uploader.progress.percentage_value = 100 / (files.length);
                TinyTransferApp.Uploader.progress.files_len = files.length;
            },
            onComplete: function(e) {
                console.log("Complete");
                jQuery(".cancel-stop").addClass("disabled");
                // All done!
                if (TinyTransferApp.Uploader.files.length === TinyTransferApp.Uploader.list.success.length) {
                    // request
                    TinyTransferApp.Request._ajax(TinyTransferApp.options.action.transfer, {
                        uuid: TinyTransferApp.UUID,
                        type: TinyTransferApp.DATA.type,
                        files: TinyTransferApp.Uploader.list.success.toString(),
                        form: TinyTransferApp.check("data"),
                        expires_after: TinyTransferApp.DATA.expires_after,
                        password: jQuery('input[name=password]').val()
                    }, function(success, response, status) {
                        if (success == true && response.code == 200) {
                            if (TinyTransferApp.DATA.type == "link") {
                                jQuery(".complete-link").find("input").val(window.location.protocol + "//" + window.location.host + '/' + response.id);
                            } else {
                                jQuery(".complete-email").find("span").text("The download email has been sent – your transfer is available for " + TinyTransferApp.DATA.expires_after_text + " days.");
                            }
                            jQuery(".tiny-transfer-progress").hide();
                            jQuery(".tiny-transfer-complete").show();
                            jQuery(".footer-cancel-btn").hide();
                            jQuery(".footer-complete-container").show();
                            TinyTransferApp.Scrollbar.resize(".form-scrollbar");
                            if (!TinyTransferApp._ismobile) {
                                // Details show
                                TinyTransferApp.Details.show();
                            }
                        }
                    });
                } else {
                    TinyTransferApp.toast('warning', "please refresh and try again.");
                }
            },
            onFileStart: function(e, file) {
                console.log("File Start");
            },
            onFileProgress: function(e, file, percent) {
                TinyTransferApp.Uploader.all_progress(file.index, percent);
            },
            onFileComplete: function(e, file, response) {
                response = JSON.parse(response);
                if (response.code == 200) {
                    TinyTransferApp.Uploader.list.success.push(response.data);
                }
            },
            onFileError: function(e, file, error) {
                console.log("File Error", error);
                TinyTransferApp.Uploader.list.error.push(file);
            },
            onChunkStart: function(e, file) {
                // console.log("Chunk Start");
            },
            onChunkComplete: function(e, file, response) {
                // console.log("Chunk Complete");
            },
            onChunkError: function(e, file, error) {
                // console.log("Chunk Error");
            },
            onFileRemove: function(e, fid, files) {
                TinyTransferApp.Uploader.files = files;
                TinyTransferApp.Uploader.files_info();
            },
            onQueued: function(e, files) {
                console.log("onQueued");
                let is_maxsize_file = false;
                let fids = [];
                files.forEach(function(v, i) {
                    if (v.size > TinyTransferApp.options.maxSize) {
                        is_maxsize_file = true;
                        fids.push(v.fid);
                    } else {
                        TinyTransferApp.Uploader.files.push(v);
                        TinyTransferApp.Uploader.qaueued_add_file(v.fid, v.file);
                    }
                });

                fids.forEach(function(fid) {
                    jQuery(".tiny-transfer-form").uploader("remove", fid);
                });

                if (is_maxsize_file) {
                    TinyTransferApp.toast('warning', 'Filter oversize files');
                }
                TinyTransferApp.Uploader.files_info();

                TinyTransferApp.Uploader.reader();
                // scrollbar resize
                TinyTransferApp.Scrollbar.resize(".form-scrollbar");

                TinyTransferApp.check();
            },
            events: function() {
                // add file
                jQuery(document).on("click", ".files-add-event", function() {
                    jQuery(".ui-uploader-input").click();
                });
                // remove file
                jQuery(document).on("click", ".file-item-remove", function() {
                    let file_item = jQuery(this).parents(".file-item");
                    var fid = file_item.data("fid");

                    jQuery(".tiny-transfer-form").uploader("remove", fid);
                    file_item.remove();

                    TinyTransferApp.Uploader.reader();
                    // scrollbar resize
                    TinyTransferApp.Scrollbar.resize(".form-scrollbar");

                    TinyTransferApp.check();
                });
            }
        },
        Options: {
            init: function() {
                this.dropdown();
            },
            scroll_end: function() {
                jQuery('.scrollbar').animate({
                    scrollTop: jQuery(".scrollbar").prop("scrollHeight")
                }, '300');
            },
            toggle: function() {
                let that = this;
                jQuery(".options").slideToggle(160, function() {
                    TinyTransferApp.Scrollbar.resize(".form-scrollbar");
                    TinyTransferApp.Scrollbar.scroll(".scrollbar", ".options");

                    if (jQuery(this).is(":hidden")) {
                        jQuery(".tiny-transfer-toggle-options").removeClass("active");
                    } else {
                        jQuery(".tiny-transfer-toggle-options").addClass("active");
                    }
                });
                that.scroll_end();
            },
            dropdown: function() {
                TinyTransferApp.DATA.expires_after = 7;
                TinyTransferApp.DATA.expires_after_text = "1 week";

                jQuery(".dropdown").dropdown({
                    label: "1 week"
                });
            },
            events: function() {
                TinyTransferApp.DATA.type = "email";
                jQuery(document).on('change', 'input[name=type]', function() {
                    let _type = jQuery(this).val();
                    jQuery('.tiny-transfer-form')
                        .removeClass('type-email type-link')
                        .addClass("type-" + _type).attr("data-type", _type);
                    if (_type == "link") {
                        jQuery(".tiny-transfer-button button").text("Get a link");
                    } else {
                        jQuery(".tiny-transfer-button button").text("Transfer");
                    }
                    TinyTransferApp.DATA.type = _type;
                    TinyTransferApp.check();
                });

                // toggle options
                jQuery(document).on("click", ".tiny-transfer-toggle-options", function() {
                    TinyTransferApp.Options.toggle();
                });

                // expires after
                jQuery(document).on("change", "select[name=expires_after]", function() {
                    TinyTransferApp.DATA.expires_after = jQuery(this).val();
                    TinyTransferApp.DATA.expires_after_text = jQuery(this).find("option:selected").text();
                });

            }
        },
        Details: {
            show: function() {
                jQuery(".tiny-transfer-details").addClass("show");
            },
            hide: function() {
                jQuery(".tiny-transfer-details").removeClass("show");
            },
            info: function() {
                let files = TinyTransferApp.Uploader.files;
                let files_list = [];
                files.forEach(function(v) {
                    let _f = v.file;
                    let extName = _f.name
                        .substring(_f.name.lastIndexOf(".") + 1, _f.name.length)
                        .toLowerCase();
                    files_list.push({
                        name: _f.name,
                        size: TinyTransferApp.Uploader.format_file_size(_f.size),
                        ext: extName
                    });
                });
                let message = TinyTransferApp.check("data")["message"];
                let data = {
                    files_num: files.length,
                    files_size: TinyTransferApp.Uploader.format_file_size(TinyTransferApp.Uploader.files_size),
                    files_expires: TinyTransferApp.DATA.expires_after_text,
                    is_message: message == "" ? false : true,
                    message: message,
                    files_list: files_list
                };
                let html = Template(TinyTransferApp.templates.details, data);
                jQuery('.tiny-transfer-details').find(".details-centont").html(html);
                TinyTransferApp.Scrollbar.resize(".details-scrollbar");
            }
        },
        check: function(name) {
            let _return = {
                status: true,
                data: {}
            };
            // get type
            let type = jQuery(".tiny-transfer-form").attr("data-type");
            let recipient = TinyTransferApp.DATA.reciptent_email;
            let sender = jQuery(".fields input[name='sender']").val().trim();
            let message = jQuery(".fields textarea[name='message']").val().trim();
            let files_queue = jQuery(".files-queue").find(".file-item").length;

            if (files_queue <= 0) {
                _return.status = false;
            }

            if (TinyTransferApp.Uploader.files_size >= TinyTransferApp.options.maxUploadSize) {
                _return.status = false;
            }

            if (type == "email") {
                if (recipient.length <= 0 || sender == "") {
                    _return.status = false;
                }
                _return.data = {
                    recipient: recipient.toString(),
                    sender: sender,
                    message: message
                }
            } else {
                _return.data = {
                    message: message
                }
            }
            if (_return.status) {
                jQuery(".tiny-transfer-button").find("button").removeClass("disabled");
            } else {
                jQuery(".tiny-transfer-button").find("button").addClass("disabled");
            }
            if (name == undefined) {
                return _return;
            } else {
                return _return[name];
            }
        },
        events: function() {
            TinyTransferApp.Uploader.events();
            TinyTransferApp.Options.events();

            // upload files
            jQuery(document).on("click", ".tiny-transfer-button", function() {

                if (TinyTransferApp.check("status")) {
                    TinyTransferApp.Details.info();
                    jQuery(".tiny-transfer-progress").show();
                    jQuery(".footer-start").hide();
                    jQuery(".footer-cancel-btn").show();

                    if (jQuery(this).attr("data-type") == "1") {
                        jQuery(".tiny-transfer-form").uploader("start");
                    } else {
                        jQuery(".tiny-transfer-form").uploader("addQueue", TinyTransferApp.Uploader.cache_queue_files);
                    }

                    jQuery(".transferring-warp").find("a.file-num").text("Sending " + TinyTransferApp.Uploader.files.length + " files");

                }
            });

            // cancel
            jQuery(document).on("click", ".cancel-stop", function() {
                jQuery(".tiny-transfer-form").uploader("stop");
                jQuery(".transferring-warp").hide();
                jQuery(".cancel-warp").show();
                jQuery(".footer-cancel-btn").hide();
                jQuery(".footer-cancel-container").show();
            });

            jQuery(document).on("click", ".cancel-no", function() {
                jQuery(".tiny-transfer-form").uploader("continue");
                jQuery(".transferring-warp").show();
                jQuery(".cancel-warp").hide();
                jQuery(".footer-cancel-btn").show();
                jQuery(".footer-cancel-container").hide();
            });

            jQuery(document).on("click", ".cancel-yes", function() {
                jQuery(".tiny-transfer-form").uploader("emptyQueue");
                jQuery(".tiny-transfer-progress").hide();
                jQuery(".transferring-warp").show();
                jQuery(".cancel-warp").hide();
                jQuery(".footer-start").show();
                jQuery(".footer-cancel-container").hide();
                jQuery(".tiny-transfer-button").attr("data-type", "2");
                TinyTransferApp.Uploader.all_progress(0, 0);
            });
            // complete
            jQuery(document).on("click", ".complete-continue", function() {
                TinyTransferApp.Details.hide();
                TinyTransferApp._reset();
            });

            // details
            jQuery(document).on("click", ".details-open", function() {
                TinyTransferApp.Details.show();
            });
            jQuery(document).on("click", ".details-close", function() {
                TinyTransferApp.Details.hide();
            });

        }
    };

    TinyTransferApp.init({
        action: {
            // upload file
            upload: '/mod_tiny_transfer/upload',
            // get link-send email
            transfer: '/mod_tiny_transfer/transfer',
            // verify password
            verify: '/mod_tiny_transfer/verify',
            // download list
            download_page_list: '/mod_tiny_transfer/download_page_list',
            // download link
            download_link: '/mod_tiny_transfer/download_link'
        },
        maxSize: TTC.maxSize, // Single 100 mb 
        // chunkSize: 2048, // 1024kb = 1mb
        maxUploadSize: TTC.maxUploadSize, // All 1G
    });

})(jQuery);