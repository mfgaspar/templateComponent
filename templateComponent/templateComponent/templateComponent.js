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
        $.extend(true, this, (_.isFunction(this.extendableOptions)?this.extendableOptions():this.extendableOptions));
    },

    update: function() {
        _.bindAll(this, 'redraw', 'init', 'dataHandler', 'renderTemplate', 'attachEvent');
        this.init();
        this.triggerQuery(this.chartDefinition, this.redraw);
    },

    redraw: function(data) {
        var htmlResult = this.renderTemplate(this.template, this.templateType, this.dataHandler(data));
        $("#" + this.htmlObject).empty().append(htmlResult);
        if ((!_.isUndefined(this.eventSelector)) && (!_.isNull(this.eventSelector)) && (!_.isEmpty(this.eventSelector)) && (_.isFunction(this.eventHandler))) {
            this.attachEvent(this.eventSelector, this.eventType, this.eventHandler);
        }
    },

    // Transform qyeryResult.dataset to JSON format to be used in Templates 
    dataHandler: function(queryResult) {
        if (queryResult.queryInfo.totalRows > 0) {
            var data = [];
            _.each(queryResult.resultset, function(row) {
                data.push(_.extend({}, row));
            });
            return { root: data };
        } else {
            data = "";
        }
        return data;
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
    attachEvent: function(eventSelector, eventType, eventHandler) {
        this.placeholder(eventSelector).on(eventType, eventHandler);
    },

    processMessage: function(message, type) {
        var completeMsg = {
            msg: message || "",
            type: this.messages.config.style[type].type || "info",
            icon: this.messages.config.style[type].icon || "comment"};
        return _.template(this.messages.config.template, completeMsg)
    }

});
