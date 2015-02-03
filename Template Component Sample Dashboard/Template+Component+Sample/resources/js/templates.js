/*
 * Developed by: Miguel Gaspar
 * Date: 02 February 2015
 * version 1.0
 */ 

var templates = templates || {};
templates.dashboards = templates.dashboards || {};
templates.dashboards.opts = templates.dashboards.opts || {};

mynamespace = (function(self) {

   self.opts = {
    tables: { 
      genericTableComp: {
        chartDefinition: {
          colHeaders: [],
          colTypes: [],
          colFormats: [],
          colWidths: [],
          colSortable: [],
          colSearchable: [],
          paginate: true,
          paginateServerside: false,
          filter: true,
          info: true,
          sort: true,
          sortBy:[],
          lengthChange: false,
          displayLength: 10
        }
      }
    },
    
    charts : {
      genericChartComp: {
        chartDefinition: {
            // generic
            height: 200,
            seriesInRows: false,
            timeSeries: true,
            timeSeriesFormat: '%Y-%m-%d',
            legend: false,
            dotsVisible: true,
            colors: ['#00a3e2', '#646464'],
            baseAxisTickFormatter: function(value, dateTickPrecision, index) {
                var date = moment(value);
                var formattedDate = "",
                    dateFormat = "";
                switch(rangeParam) { 
                            case "year": dateFormat = ((index==0)?true:moment(this[index]).format('YYYY')!=moment(this[index-1]).format('YYYY'))?"YYYY MMM":"MMM"; break;
                            case "quarter": dateFormat = ((index==0)?true:moment(this[index]).format('Q')!=moment(this[index-1]).format('Q'))?"[Q]Q [W]w":"[W]w"; break;
                            case "month": dateFormat = ((index==0)?true:moment(this[index]).format('MM')!=moment(this[index-1]).format('MM'))?"MMM DD":"DD"; break;
                        } 
                formattedDate = date.format(dateFormat);
                return formattedDate;
            },
            executeAtStart: true,
            priority: 5,
            animate: false,
            // ticks and grids 
            plotFrameVisible: false,
            axisGrid_strokeStyle: '#f5f5f5'
            baseAxisGrid: true,
            baseAxisMinorTicks: false,
            baseAxisRule_visible: false,
            baseAxisDomainRoundMode: 'Tick',
            baseAxisLabel_textStyle: '#999999',
            baseAxisLabel_font: 'normal 10px sans-serif',
            baseAxisZeroLine_visible: false,
            orthoAxisLabel_font: 'normal 9px sans-serif',
            orthoAxisLabel_textStyle: '#999999',
            orthoAxisGrid: true,
            orthoAxisMinorTicks: false, 
            orthoAxisTicks: true,
            orthoAxisTicks_strokeStyle: '#f5f5f5',
            orthoAxisRule_visible: false,
            orthoAxisRule_strokeStyle: '#f5f5f5',
            orthoAxisZeroLine_lineWidth: 0,
            orthoAxisDesiredTickCount: 3,
            orthoAxisLabel_text: function(s) {
                if ( s.vars.tick.value !== 0 ){
                    return numeral(s.vars.tick.value).format("0a"); 
                }
            },
            // extension points
            line_lineWidth: 3,
            dot_lineWidth: 2,
            dot_strokeStyle: '#ffffff',
            dot_fillStyle: function(s) {
                var value = s.vars.value.value;
                if (value==chartRange.max)
                    return "#82BE11";
                if (value==chartRange.min)
                    return "#D62828";
                return this.delegate();       
            },
            // plot2
            plot2: true,
            plot2Series: ['Average'],
            plot2DotsVisible: false,
            // plot2 extension points
            plot2Line_lineWidth: 1,
            areasVisible: true,
            baseAxisTooltipEnabled: false,
            area_fillStyle: function(scene){
                return this.finished((this.delegate()).alpha(0.05));
            }
        }
      }
    },

    addins: {
      genericAddinOpts: {    
        textFormat: function(v, st) {
          var result = "";
          switch (st.colIdx) {
            case 0: 
              result = st.colFormat? sprintf(st.colFormat, v) : v;
              break;
            default:
              result = st.colFormat? sprintf(st.colFormat, v) : v;
          }
        }
      }
    },

    templates: {
        emailStatisticsCardsComp: '<% var getTrend = function(elem, key) {if (elem < 0) {return "down"} else {return "up"} } %>' + 
                          '<% _.each(root, function(elem) { %> ' +
                            '<div class="cardWrapper" action="<%=elem.TITLE%>"> ' +
                              '<div class="cardRow first cardTitle"> ' +
                                '<div class="cardCol trend <%=getTrend(elem.RATETOPREVIOUS)%>" title=\'<span class="tooltipDesc"> vs Prev. Equal Period </span><span class="tooltipPercValue <%=getTrend(elem.RATETOPREVIOUS)%>"><%=numeral(elem.RATETOPREVIOUS).format("+0.0")%></span><span class="tooltipPercSymbol <%=getTrend(elem.RATETOPREVIOUS)%>">%</span\'></div>' +
                              '</div>' +
                              '<div class="cardRow values"> ' +
                                '<div class="cardCol value"> <%-numeral(elem.VALUE).format("0,0")%></div>' +
                              '</div>' +
                              '<div class="cardRow last sparktrend"> ' +
                                '<div class="cardCol sparkline" values="<%=elem.SPARKLINE%>"> </div>' +
                              '</div>' +
                            '</div>' +
                          '<% }); %>'
    }
  }

  return self;

})(templates.dashboards.opts);
