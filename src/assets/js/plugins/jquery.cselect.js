/* 
Foliotek Inc.
Not on Github yet.
Hopefully in the future
*/
(function ($) {
    var $doc = $(document);
    var pre = "cselect";
    var dotpre = "." + pre;
    var ACTIVE_CLASS = pre + '-active';
    var cselects = [];

    function hideAll() {
        for (var i = 0; i < cselects.length; i++) {
            if (cselects[i]) {
                cselects[i].hide();
            }
        }
    }

    function num(v) { return parseInt(v, 10); }

    var CS = function (el, opts) {
        this.el = el;
        this.$el = $(el);
        this.options = opts;
    };

    CS.prototype = {

        onClick: function (ev) {
            ev.preventDefault();
            ev.stopPropagation();
            var $li = $(ev.currentTarget);
            $li.addClass('cs-selected').siblings().removeClass('cs-selected');
            var val = $li.data("value");
            this.$el.val(val).trigger('change');
            this.hide();
        },

        hide: function () {
            var list = this.list.css({
                opacity: 0,
                zIndex: -99999
            });

            this._toggleActive(false);
        },

        show: function () {
            var self = this;
            hideAll();
            this.positionList();
            this.list.css({
                opacity: 1,
                zIndex: 99999
            });
            this._toggleActive(true);
        },

        _toggleActive: function (tog) {
            this.display.toggleClass(ACTIVE_CLASS, tog);
            this.button.toggleClass(ACTIVE_CLASS, tog);
        },

        _toggleVisibility: function (ev) {
            ev.stopPropagation();
            ev.preventDefault();
            var isActive = this.display.hasClass(ACTIVE_CLASS);
            if (isActive)
                this.hide();
            else
                this.show();
        },

        positionList: function () {
            var appendTo = $(this.appendTo);

            this.list.position({
                at: 'left bottom+1',
                my: 'left top',
                of: appendTo
            });
            
            var width = appendTo.outerWidth();
            if(appendTo.is('.cselect-display') && this.list[0].scrollHeight > this.list.height()) {
                width += this.button.outerWidth(true);
            }
            this.list.width(width);

            var selected = this.list.find("li.cs-selected");
            if (selected.length > 0) {
                this.list.scrollTop(selected.position().top);
            }
        },

        onElChange: function () {
            var text = this.$el.find("option:selected").text();
            var val = this.$el.val();
            this.list.find("li[data-value='" + val + "']").addClass("cs-selected").siblings().removeClass("cs-selected");
            this.value.text(text);
        },

        destroy: function () {
            this.button.off('click.cselect');
            this.display.off('click.cselect');
            this.list.off('click.cselect');
            this.$el.off('change.cselect');
            $(window).off('resize.cselect');
            this.replacer.remove();
            this.list.remove();
            cselects[this.id] = null;
        },

        init: function () {
            var self = this;
            var el = this.$el;
            var o = this.options || {};
            if (!el.is("select")) { throw "cSelect Error - element must be a select"; }

            var replacer = this.replacer = $("<div tabindex='-1' />").appendTo(el.parent()).addClass(pre + '-replacer').data('originalEl', el);
            var display = this.display = $("<div />").appendTo(replacer).addClass(pre + '-display');
            var button = this.button = $("<div />").appendTo(replacer).addClass(pre + '-button');
            var value = this.value = $("<span />").appendTo(display).addClass(pre + '-value');
            var list = this.list = $("<ul tabindex='-1' />").addClass(pre + '-list').appendTo('body');
            var btnText = $("<span class='cselect-button-inner' />").appendTo(button).text('▼');

            function processOption(op) {
                var li = $("<li tabindex='-1'></li>");
                li.attr("data-value", op.val());

                if (o.format) {
                    li.html(o.format(op));
                }
                else {
                    li.html(op.text());
                }

                if (!op.val()) {
                    li.hide();
                }

                return li;
            }

            function processChildren(children) {
                children.each(function () {
                    var child = $(this);

                    if (child.is("option")) {
                        list.append(processOption(child));
                    }
                    else if (child.is("optgroup")) {
                        list.append("<li class='cselect-optgroup'>" + child.attr("label") + "</li>");
                        processChildren(child.children());
                    }
                });
            }

            processChildren(el.children());

            button.on('click.cselect', this._toggleVisibility.bind(this));
            display.on('click.cselect', this._toggleVisibility.bind(this));

            list.on('click.cselect', 'li[data-value]', this.onClick.bind(this));
            list.on('click.cselect', 'li.cselect-optgroup', function (ev) {
                ev.stopPropagation();
                ev.preventDefault();
            });

            $(window).on('resize.cselect', this.positionList.bind(this));
            $doc.on('click.cselect', function () {
                hideAll();
            });
            value.text(el.find("option:selected").text());

            /* Sizing Of Box */
            var maxWidth = replacer.width() - button.outerWidth(true);
            if (!replacer.is(":visible")) {
                var replacerclone = replacer.clone().appendTo('body').css('visibility', 'hidden');
                maxWidth = replacerclone.width() - replacerclone.find('.cselect-button').outerWidth(true);
                replacerclone.remove();
            }
            display.outerWidth(maxWidth);

            if (o.sizeToContent && list.width() < display.width()) {
                display.width(list.width());
            }
            /* End of Sizing */


            el.on('change.cselect', this.onElChange.bind(this));
            el.on('remove.cselect', this.destroy.bind(this));

            if (o.buttonClass) {
                btnText.text('').removeClass('cselect-button-inner').addClass(o.buttonClass);
            }
            if (o.animation) {
                display.addClass('ss-' + o.animation);
            }

            if (o.customClass) {
                replacer.addClass(o.customClass);
                list.addClass(o.customClass);
            }

            /* cleaning up */
            list.attr("style", "").css({
                opacity: 0,
                zIndex: -99999
            }).position({
                at: 'left-1000',
                my: 'left top',
                of: $('body')
            });

            el.addClass(pre + '-hidden ' + pre + '-initialized');

            this.appendTo = o.appendTo || this.display;
            var id = cselects.push(this) - 1;
            this.id = id;
        }
    };

    $.fn.cselect = function (options) {

        if (typeof (options) === "string") {
            return this.each(function () {
                var args = Array.prototype.slice.call(arguments, 1);
                var i = $(this).data("cselect");

                if (!i) { return; }

                var method = i[options];

                if ($.isFunction(method)) {
                    method.apply(i, args);
                }
            });
        }
        else {
            return this.each(function() {
                var i = new CS(this, options);
                $(this).data("cselect", i);
                i.init();
            });
        }
    };
}(jQuery));