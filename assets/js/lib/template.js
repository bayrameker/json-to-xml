(function() {
    "use strict";
    var _this = {
        global: Function('return this')(),
        each: function(list, fn) {
            if (list instanceof Array) {
                for (var i = 0; i < list.length; i++) {
                    var item = list[i]
                    fn.call(this, item, i, i)
                }
            } else {
                var i = 0
                for (var key in list) {
                    if (list.hasOwnProperty(key)) {
                        var item = list[key]
                        fn.call(this, item, key, i++)
                    }
                }
            }
        },
        escape: function(value) {
            return String(value).replace(/</g, '&lt;').replace(/>/g, '&gt;')
        }
    }

    function tag(str) {
        var leftTag = '(?:' + Template.leftTag + ')'
        var rightTag = '(?:' + Template.rightTag + ')'
        return RegExp(leftTag + str + rightTag, 'g')
    }

    function getVars(tpl) {
        var code = tpl.match(tag('.*')).join()
            .replace(/\b(for|if|else|typeof|instanceof|new|in|null|true|false|\..+?)\b/g, '')

        var m = code.match(/[_$a-z][_$a-z0-9]*/ig) || []

        var vars = ''
        var map = {}
        for (var i = 0; i < m.length; i++) {
            var item = m[i]
            if (!map.hasOwnProperty(item)) {
                vars += 'var ' + item + ' ="' + item + '" in _data_? _data_.' + item + ': this.global.' + item + '\n'
                map[item] = true
            }
        }

        return vars
    }

    function Template(tpl, data) {
        if (tpl.nodeType == 1) {
            var node = tpl
            if (node.tpl) {
                tpl = node.tpl
            } else {
                tpl = node.tpl = node.innerHTML
                node.innerHTML = ''
            }
        }
        var code = tpl
            .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
            .replace(tag('for (\\S+?) (\\S+?)(?: (\\S+?))?'), '\f;this.each($1, function($2, $3){\f')
            .replace(tag('for (\\S+?) (\\S+?) (\\S+?) (\\S+?)'), '\f;this.each($1, function($2, $3, $4){\f')
            .replace(tag('/for'), '\f})\f')
            .replace(tag('if (.+?)'), '\f;if($1){\f')
            .replace(tag('else ?if (.+?)'), '\f}else if($1){\f')
            .replace(tag('else'), '\f}else{\f')
            .replace(tag('/if'), '\f}\f')
            .replace(tag('#(.+?)'), '\f;_html_+= $1\f')
            .replace(tag('([^\f]+?)'), '\f;_html_+= this.escape($1)\f')
            .replace(/ Template-src=/g, ' src=')
            // .replace(/(^|\f)([\s\S]*?)(\f|$)/g, ';_html_+= `$2`')
            .replace(/(^|\f)([\s\S]*?)(\f|$)/g, function($and, $1, $2, $3) {
                return '\n;_html_+= "' + $2
                    .replace(/\\/g, '\\\\')
                    .replace(/"/g, '\\"')
                    .replace(/\r?\n/g, '\\n') +
                    '"\n'
            })

        var vars = getVars(tpl)
        code = vars + '\nvar _html_ =""\n' + code + '\nreturn _html_'
            // console.log(code)

        var fn = Function('_data_', code)
        var render = function(data) {
            data = data || {}
            var html = fn.call(_this, data)
            if (node) {
                node.innerHTML = html
            }
            return html
        }
        render.fn = fn

        return data ? render(data) : render
    }

    Template.leftTag = '<!-- {|{'
    Template.rightTag = '} -->|}'

    if (typeof module == 'object') module.exports = Template
    else if (typeof global == 'object') global.Template = Template
    else if (typeof define == 'function' && (define.amd || define.cmd))
        define(function(require, exports, module) { module.exports = Template })
    else if (typeof window == 'object') window.Template = Template
})()