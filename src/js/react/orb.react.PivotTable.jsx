/** @jsx React.DOM */

/* global module, require, React */

'use strict';

var pivotId = 1;
var themeChangeCallbacks = {};

module.exports.PivotTable = react.createClass({
  id: pivotId++,
  pgrid: null,
  pgridwidget: null,
  getInitialState: function() {
    comps.DragManager.init(this);
    
    themeChangeCallbacks[this.id] = [];
    this.registerThemeChanged(this.updateClasses);

    this.pgridwidget = this.props.pgridwidget;
    this.pgrid = this.pgridwidget.pgrid;
    return {};
  },
  sort: function(axetype, field) {
    this.pgridwidget.sort(axetype, field);
    this.setProps({});
  },
  moveButton: function(button, newAxeType, position) {
    this.pgridwidget.moveField(button.props.field.name, button.props.axetype, newAxeType, position);
    this.setProps({});
  },
  expandRow: function(cell) {
    cell.expand();
    this.setProps({});
  },
  collapseRow: function(cell) {
    cell.subtotalHeader.collapse();
    this.setProps({});
  },
  applyFilter: function(fieldname, operator, term, staticValue, excludeStatic) {
    this.pgridwidget.applyFilter(fieldname, operator, term, staticValue, excludeStatic);
    this.setProps({});
  },
  registerThemeChanged: function(compCallback) {
    if(compCallback) {
      themeChangeCallbacks[this.id].push(compCallback);
    }
  },
  unregisterThemeChanged: function(compCallback) {
    var i;
    if(compCallback && (i = themeChangeCallbacks[this.id].indexOf(compCallback)) >= 0) {
      themeChangeCallbacks[this.id].splice(i, 1);
    }
  },
  changeTheme: function(newTheme) {
    if(this.pgridwidget.pgrid.config.setTheme(newTheme)) {
      // notify self/sub-components of the theme change
      for(var i = 0; i < themeChangeCallbacks[this.id].length; i++) {
        themeChangeCallbacks[this.id][i]();
      }
    }
  },
  updateClasses: function() {
      var thisnode = this.getDOMNode();
      var classes = this.pgridwidget.pgrid.config.theme.getPivotClasses();    
      thisnode.className = classes.container;
      thisnode.children[1].className = classes.table;
  },
  render: function() {

    var self = this;

    var config = this.pgridwidget.pgrid.config;
    var Toolbar = comps.Toolbar;
    var PivotTableUpperButtons = comps.PivotTableUpperButtons;
    var PivotTableColumnButtons = comps.PivotTableColumnButtons;
    var PivotTableRowButtons = comps.PivotTableRowButtons;
    var PivotTableRowHeaders = comps.PivotTableRowHeaders;
    var PivotTableColumnHeaders = comps.PivotTableColumnHeaders;
    var PivotTableDataCells = comps.PivotTableDataCells;

    var classes = config.theme.getPivotClasses();    

    var tblStyle = {};
    if(config.width) { tblStyle.width = config.width; }
    if(config.height) { tblStyle.height = config.height; }

    return (
    <div className={classes.container} style={tblStyle}>
      <div className="orb-toolbar" style={{ display: config.showToolbar ? 'block' : 'none' }}>
        <Toolbar pivotTableComp={self}></Toolbar>
      </div>
      <table id={'tbl-' + self.id} className={classes.table} style={{width: '100%'}}>
        <tbody>
          <tr>
            <td colSpan="2">
              <PivotTableUpperButtons pivotTableComp={self}></PivotTableUpperButtons>              
            </td>
          </tr>
          <tr>
            <td></td>
            <td>
              <PivotTableColumnButtons pivotTableComp={self}></PivotTableColumnButtons>
            </td>
          </tr>
          <tr>
            <td>
              <PivotTableRowButtons pivotTableComp={self}></PivotTableRowButtons>
            </td>
            <td>
              <PivotTableColumnHeaders pivotTableComp={self}></PivotTableColumnHeaders>
            </td>
          </tr>
          <tr>
            <td>
              <PivotTableRowHeaders pivotTableComp={self}></PivotTableRowHeaders>
            </td>
            <td>
              <PivotTableDataCells pivotTableComp={self}></PivotTableDataCells>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="orb-overlay orb-overlay-hidden" id={'drilldialog' + self.id}></div>
    </div>
    );
  }
});