var templateComponent = UnmanagedComponent.extend({

    messages: {
        error: {
            noData: "No data available.",
            invalidTemplate: "Invalid template.",
            invalidTemplateType: "Invalid template type.",
            generic: "Invalid options defined. Please check the template component properties."
        }, 
        success: { }, 
        warning: { },
        info: { },
        config: {
            style: {
                success: { icon: "comment", type: "success" },
                error: { icon: "remove-sign", type: "danger" },
                info: { icon: "info-sign", type: "info" },
                warning: { icon: "exclamation-sign", style: "warning" }
            },
            template:   "<div class='alert alert-<%=type%>' role='alert'>" +
                        "   <span class='glyphicon glyphicon-<%=icon%>' aria-hidden='true'></span> " +
                        "   <span> <%=msg%> </span>" +
                        "</div>"
        }
    },

    init: function() {
        _.defaults(this, (_.isFunction(this.extendableOptions)?this.extendableOptions():this.extendableOptions));
        _.defaults(this.defaults, (_.isFunction(this.options)?this.options():this.options));
        //$.extend(true, this, (_.isFunction(this.extendableOptions)?this.extendableOptions():this.extendableOptions));
    },

    update: function() {
        _.bindAll(this, 'redraw', 'init', 'processData', 'renderTemplate', 'attachEvent', 'processMessage');
        this.init();
        this.triggerQuery(this.chartDefinition, this.redraw);
    },

    redraw: function(data) {
        var htmlResult = this.renderTemplate(this.template, this.templateType, this.processData(data));
        $("#" + this.htmlObject).empty().append(htmlResult);
        if (!_.isEmpty(this.events)) {
            this.attachEvent(this.eventSelector, this.eventType, this.eventHandler);
        }
    },

    // Transform qyeryResult.dataset to JSON format to be used in Templates 
    processData: function(queryResult) {
        if (!_.isFunction(this.modelHandler)) {
            if (queryResult.queryInfo.totalRows > 0) {
                var data = [];
                _.each(queryResult.resultset, function(row) {
                    data.push(_.extend({}, row));
                });
                var model = {};
                model[this.rootElement] = data;
                return model;
            } else {
                return "";
            }
        } else {
            return this.mnodelHandler(queryResult);
        }
    },

    // Apply template based on the result of a query. Creates a template based (mustache or underscore) view data object and apply columns format 
    renderTemplate: function(template, templateType, data) {
        var hmtl = "";
        if (!_.isEmpty(data)) {
            try {
                switch (templateType.toUpperCase()) {
                    case 'UNDERSCORE':
                        hmtl = _.template((_.isFunction(template) ? template() : template), data);
                        break;
                    case 'MUSTACHE':
                        hmtl = Mustache.render((_.isFunction(template) ? template() : template), data);
                        break;
                    default:
                        hmtl = this.processMessage(this.messages.error.invalidTemplateType, 'error');
                        break;
                }
            } catch (e) {
                hmtl = this.processMessage(this.messages.error.invalidTemplate, 'error');
                Dashboards.log(this.messages.error.invalidTemplate, 'error');
            }
        } else {
            hmtl = this.processMessage(this.messages.error.noData, 'error');
            Dashboards.log(this.messages.error.noData, 'error');
        }
        return hmtl;
    },

    // bind click to created cards 
    attachEvent: function() {
        var myself = this;
        _.each(this.events, function(elem) {
            var separator = ' ',
                handler = _.first(elem).split(separator),
                eventHandler = _.last(elem),
                event = _.first(handler),
                selector = _.last(handler);
            if (_.isFunction(eventHandler)) {
                myself.placeholder(selector).on(event, eventHandler);
            }
        });
    },

    processMessage: function(message, type) {
        var completeMsg = {
            msg: message || "",
            type: this.messages.config.style[type].type || "info",
            icon: this.messages.config.style[type].icon || "comment"};
        return _.template(this.messages.config.template, completeMsg)
    }

});

var templateAddIn = {
    name: "template",
    label: "template",
    
    defaults: {
        templateType: 'mustache', 
        template: '<div>{{items}}<div>',
        rootElement: 'items',
        formatters: {    }
    },
    
    messages: {
        error: {
            noData: "No data available.",
            invalidTemplate: "Invalid template.",
            invalidTemplateType: "Invalid template type.",
            generic: "Invalid options defined. Please check the template component properties."
        }, 
        success: { }, 
        warning: { },
        info: { },
        config: {
            style: {
                success: { icon: "comment", type: "success" },
                error: { icon: "remove-sign", type: "danger" },
                info: { icon: "info-sign", type: "info" },
                warning: { icon: "exclamation-sign", style: "warning" }
            },
            template:   "<div class='alert alert-<%=type%>' role='alert'>" +
                        "   <span class='glyphicon glyphicon-<%=icon%>' aria-hidden='true'></span> " +
                        "   <span> <%=msg%> </span>" +
                        "</div>"
        }
    },

    processMessage: function(message, type) {
        var completeMsg = {
            msg: message || "",
            type: this.messages.config.style[type].type || "info",
            icon: this.messages.config.style[type].icon || "comment"};
        return _.template(this.messages.config.template, completeMsg)
    },

    init: function() {
        $.fn.dataTableExt.oSort[this.name + '-asc'] = $.fn.dataTableExt.oSort['string-asc'];
        $.fn.dataTableExt.oSort[this.name + '-desc'] = $.fn.dataTableExt.oSort['string-desc'];
    },

    implementation: function(tgt, st, opt) {
        var html = this.renderTemplate(tgt, st, opt);
        $(tgt).empty().html(hmtl);
    },
    
    renderTemplate: function(tgt, st, opt) {
        var data = $.parseJSON(st.value);
        if ((!_.isEmpty(data)) && (_.isObject(data))) {
            _.each(opt.formatters, function(value, key){
                if ((!_.isUndefined(data[key])) && (_.isFunction(value))) {
                    data[key] = value(data[key]) || data[key];
                }                     
            });
            var model = {};
            model[opt.rootElement] = data;
            try {
                switch (opt.templateType.toUpperCase()) {
                    case 'UNDERSCORE':
                        hmtl = _.template((_.isFunction(opt.template) ? opt.template() : opt.template), model);
                        break;
                    case 'MUSTACHE':
                        hmtl = Mustache.render((_.isFunction(opt.template) ? opt.template() : opt.template), model);
                        break;
                    default:
                        hmtl = this.processMessage(this.messages.error.invalidTemplateType, 'error');
                        break;
                }
            } catch (e) {
                hmtl = this.processMessage(this.messages.error.invalidTemplate, 'error');
                Dashboards.log(this.messages.error.invalidTemplate, 'info');
            }
        } else {
            hmtl = this.processMessage(this.messages.error.noData, 'error');
            Dashboards.log(this.messages.error.noData, 'info');
        }
        return hmtl;
    }
};
Dashboards.registerAddIn("Table", "colType", new AddIn(templateAddIn));