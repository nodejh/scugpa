import React, { Component } from 'react';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

const styles = {
  paper: {
    boxShadow: 'rgba(0, 0, 0, 0.156863) 0px 3px 10px, rgba(0, 0, 0, 0.227451) 0px 3px 10px',
    margin: '20px 10px',
    padding: '20px'
  },
  item: {
    margin: '15px'
  },
  itemPanel: {
    margin: '15px 15px 20px 15px'
  },
  ulStyle: {
    paddingLeft: '15px'
  },
  listStyle: {
    listStyleType: 'none',
    margin: '5px 0',
  },
  caculateWayItem: {
    width: '70px',
    display: 'inline-block'
  },
  card: {
    margin: '20px 0'
  },
  cardText: {
    padding: 0
  },
  tableRowColumn: {
    height: 'auto',
    whiteSpace: 'pre-wrap',
    overflow: 'visible'
  }
};

class TipsDom extends Component {
  render() {
    return (
      <div style={styles.paper}>
        <Card style={styles.card}>
          <CardHeader
            title="计算方法"
            actAsExpander={false}
            showExpandableButton={false}
          />
          <CardText expandable={false} style={styles.cardText}>
            <div style={styles.item}>
              <span style={styles.caculateWayItem}>加权平均分</span> = ∑(成绩 * 课程学分) / ∑课程学分
            </div>
            <div style={styles.item}>
              <span style={styles.caculateWayItem}>绩点</span> = ∑(绩点 * 课程学分) / ∑课程学分
            </div>
          </CardText>
        </Card>
        <Card style={styles.card}>
          <CardHeader
            title="百分之成绩与绩点对照表"
            actAsExpander={false}
            showExpandableButton={false}
          />
          <CardText expandable={false} style={styles.cardText}>
            <Table>
              <TableBody displayRowCheckbox={false}>
                <TableRow>
                  <TableRowColumn style={styles.tableRowColumn}>{`100~95`}</TableRowColumn>
                  <TableRowColumn style={styles.tableRowColumn}>{`94~90`}</TableRowColumn>
                  <TableRowColumn style={styles.tableRowColumn}>{`89~85`}</TableRowColumn>
                  <TableRowColumn style={styles.tableRowColumn}>{`84~80`}</TableRowColumn>
                  <TableRowColumn style={styles.tableRowColumn}>{`79~75`}</TableRowColumn>
                  <TableRowColumn style={styles.tableRowColumn}>{`74~70`}</TableRowColumn>
                  <TableRowColumn style={styles.tableRowColumn}>{`69~65`}</TableRowColumn>
                  <TableRowColumn style={styles.tableRowColumn}>{`64~60`}</TableRowColumn>
                  <TableRowColumn style={styles.tableRowColumn}>{`<60`}</TableRowColumn>
                </TableRow>
                <TableRow>
                  <TableRowColumn style={styles.tableRowColumn}>{`4`}</TableRowColumn>
                  <TableRowColumn style={styles.tableRowColumn}>{`3.8`}</TableRowColumn>
                  <TableRowColumn style={styles.tableRowColumn}>{`3.6`}</TableRowColumn>
                  <TableRowColumn style={styles.tableRowColumn}>{`3.2`}</TableRowColumn>
                  <TableRowColumn style={styles.tableRowColumn}>{`2.7`}</TableRowColumn>
                  <TableRowColumn style={styles.tableRowColumn}>{`2.2`}</TableRowColumn>
                  <TableRowColumn style={styles.tableRowColumn}>{`1.7`}</TableRowColumn>
                  <TableRowColumn style={styles.tableRowColumn}>{`1`}</TableRowColumn>
                  <TableRowColumn style={styles.tableRowColumn}>{`0`}</TableRowColumn>
                </TableRow>
              </TableBody>
            </Table>
          </CardText>
        </Card>

        <Card style={styles.card}>
          <CardHeader
            title="等级转换为百分制成绩和绩点对照表"
            actAsExpander={false}
            showExpandableButton={false}
          />
          <CardText expandable={false} style={styles.cardText}>
            <Table>
              <TableBody displayRowCheckbox={false}>
                <TableRow>
                  <TableRowColumn style={styles.tableRowColumn}>{`优秀`}</TableRowColumn>
                  <TableRowColumn style={styles.tableRowColumn}>{`良好`}</TableRowColumn>
                  <TableRowColumn style={styles.tableRowColumn}>{`中等`}</TableRowColumn>
                  <TableRowColumn style={styles.tableRowColumn}>{`通过`}</TableRowColumn>
                  <TableRowColumn style={styles.tableRowColumn}>{`未通过`}</TableRowColumn>
                </TableRow>
                <TableRow>
                  <TableRowColumn style={styles.tableRowColumn}>{`95`}</TableRowColumn>
                  <TableRowColumn style={styles.tableRowColumn}>{`85`}</TableRowColumn>
                  <TableRowColumn style={styles.tableRowColumn}>{`75`}</TableRowColumn>
                  <TableRowColumn style={styles.tableRowColumn}>{`60`}</TableRowColumn>
                  <TableRowColumn style={styles.tableRowColumn}>{`0`}</TableRowColumn>
                </TableRow>
                <TableRow>
                  <TableRowColumn style={styles.tableRowColumn}>{`4`}</TableRowColumn>
                  <TableRowColumn style={styles.tableRowColumn}>{`3.6`}</TableRowColumn>
                  <TableRowColumn style={styles.tableRowColumn}>{`2.7`}</TableRowColumn>
                  <TableRowColumn style={styles.tableRowColumn}>{`1`}</TableRowColumn>
                  <TableRowColumn style={styles.tableRowColumn}>{`0`}</TableRowColumn>
                </TableRow>
              </TableBody>
            </Table>
          </CardText>
        </Card>

        <Card style={styles.card}>
          <CardHeader
            title="关于形势与政策"
            actAsExpander={false}
            showExpandableButton={false}
          />
          <CardText expandable={false} style={styles.cardText}>
            <div style={styles.item}>
              每个学期的形势与政策学分为 0.25 分。
            </div>
          </CardText>
        </Card>

        <Card style={styles.card}>
          <CardHeader
            title="关于不及格成绩的处理"
            actAsExpander={false}
            showExpandableButton={false}
          />
          <CardText expandable={false} style={styles.cardText}>
            <div style={styles.itemPanel}>
              若有不及格成绩，为了计算的准确性，可在“所有学期”页面手动选择课程进行计算。
            </div>
            <div style={styles.item}>
              对于必修不及格成绩，不同学院有不同计算方式，大概有三种
              <ul style={styles.ulStyle}>
                <li style={styles.listStyle}>按照第一次期末的成绩进行计算</li>
                <li style={styles.listStyle}>如果补考过了按照补考成绩计算</li>
                <li style={styles.listStyle}>补考没过重修过了按照重修成绩计算</li>
              </ul>
            </div>
            <div style={styles.item}>
              在该绩点计算器中
              <ul style={styles.ulStyle}>
                <li style={styles.listStyle}>对于当前学期成绩，计算时包含不及格成绩</li>
                <li style={styles.listStyle}>对于每学期的成绩，计算时不包含不及格成绩</li>
              </ul>
            </div>

          </CardText>
        </Card>

      </div>
    );
  }
}


export default TipsDom;
