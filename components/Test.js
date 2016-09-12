import React from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';


const TableExampleSimple = () => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHeaderColumn>ID</TableHeaderColumn>
        <TableHeaderColumn>Name</TableHeaderColumn>
        <TableHeaderColumn>Status</TableHeaderColumn>
        <TableHeaderColumn>Name</TableHeaderColumn>
        <TableHeaderColumn>Status</TableHeaderColumn>
        <TableHeaderColumn>Name</TableHeaderColumn>
        <TableHeaderColumn>Status</TableHeaderColumn>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow style={{ height: 'auto' }}>
        <TableRowColumn>1</TableRowColumn>
        <TableRowColumn style={{ height: 'auto', whiteSpace: 'pre-wrap', overflow: 'visible' }}>
          中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文
        </TableRowColumn>
        <TableRowColumn style={{ height: 'auto', whiteSpace: 'pre-wrap', overflow: 'visible' }}>中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文</TableRowColumn>
        <TableRowColumn style={{ height: 'auto', whiteSpace: 'pre-wrap', overflow: 'visible' }}>John Smith</TableRowColumn>
        <TableRowColumn style={{ height: 'auto', whiteSpace: 'pre-wrap', overflow: 'visible' }}>中文中文中文中文中文中文中文中文</TableRowColumn>
        <TableRowColumn style={{ height: 'auto', whiteSpace: 'pre-wrap', overflow: 'visible' }}>John Smith</TableRowColumn>
        <TableRowColumn style={{ height: 'auto', whiteSpace: 'pre-wrap', overflow: 'visible' }}>Employed</TableRowColumn>
      </TableRow>
      <TableRow style={{ height: 'auto' }}>
        <TableRowColumn>2</TableRowColumn>
        <TableRowColumn style={{ height: 'auto', whiteSpace: 'pre-wrap', overflow: 'visible' }}>Randal White</TableRowColumn>
        <TableRowColumn style={{ height: 'auto', whiteSpace: 'pre-wrap', overflow: 'visible' }}>Unemployed</TableRowColumn>
        <TableRowColumn style={{ height: 'auto', whiteSpace: 'pre-wrap', overflow: 'visible' }}>Randal White</TableRowColumn>
        <TableRowColumn style={{ height: 'auto', whiteSpace: 'pre-wrap', overflow: 'visible' }}>Unemployed</TableRowColumn>
        <TableRowColumn style={{ height: 'auto', whiteSpace: 'pre-wrap', overflow: 'visible' }}>Randal White</TableRowColumn>
        <TableRowColumn style={{ height: 'auto', whiteSpace: 'pre-wrap', overflow: 'visible' }}>Unemployed</TableRowColumn>
      </TableRow>
      <TableRow style={{ height: 'auto' }}>
        <TableRowColumn>3</TableRowColumn>
        <TableRowColumn style={{ height: 'auto', whiteSpace: 'pre-wrap', overflow: 'visible' }}>Stephanie Sanders</TableRowColumn>
        <TableRowColumn style={{ height: 'auto', whiteSpace: 'pre-wrap', overflow: 'visible' }}>Employed</TableRowColumn>
        <TableRowColumn style={{ height: 'auto', whiteSpace: 'pre-wrap', overflow: 'visible' }}>Stephanie Sanders</TableRowColumn>
        <TableRowColumn style={{ height: 'auto', whiteSpace: 'pre-wrap', overflow: 'visible' }}>Employed</TableRowColumn>
        <TableRowColumn style={{ height: 'auto', whiteSpace: 'pre-wrap', overflow: 'visible' }}>Stephanie Sanders</TableRowColumn>
        <TableRowColumn style={{ height: 'auto', whiteSpace: 'pre-wrap', overflow: 'visible' }}>Employed</TableRowColumn>
      </TableRow>
      <TableRow style={{ height: 'auto' }}>
        <TableRowColumn>4</TableRowColumn>
        <TableRowColumn>Steve Brown</TableRowColumn>
        <TableRowColumn>Employed</TableRowColumn>
        <TableRowColumn>Steve Brown</TableRowColumn>
        <TableRowColumn>Employed</TableRowColumn>
        <TableRowColumn>Steve Brown</TableRowColumn>
        <TableRowColumn>Employed</TableRowColumn>
      </TableRow>
    </TableBody>
  </Table>
);

export default TableExampleSimple;
