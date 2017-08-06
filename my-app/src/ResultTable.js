import React, { Component } from 'react';
import {Row,Col,ControlLabel,ProgressBar,tr,td,Table,tbody,thead,Alert} from 'react-bootstrap';

class ResultTable extends Component {
	constructor(props) {
    super(props);
    this.getResults = props.getResults;
  }
  render() {
    var results = this.getResults();
    console.log(results)
    var content;
    if(results === null){
      content = <Alert bsStyle="info">Put in a faculty to get started!</Alert>;
    }
    else if(results['error'] === false && results['status'] === -1){
      content = <ProgressBar active now={100} bsStyle="info"/>;
    }
    else if(results['error'] === true && results['status'] === 7){
      content = <Alert bsStyle="info">Put in a faculty to get started!</Alert>;
    }else if(results['error'] === true && results['status'] !== 200){
      content = <Alert bsStyle="info">Correct the invalid input to get searching!</Alert>;
    }
    else{
      var headers = [];
      for (var i = 0; i < results.rows.length; i++){
        headers.push(<th>{results.rows[i]}</th>);
      }
      var  htmlResults = [];
      for (var i = 0; i < results.data.length; i++) {
        var cols = [];
        for (var j = 0; j < results.rows.length; j++){
          if(results.data[i][j]['type'] === "link")
            cols.push(<td><a href={results.data[i][j]['data']}>{"Go"}</a></td>);
          else
            cols.push(<td>{results.data[i][j]['data']}</td>);
        }
        htmlResults.push(<tr>{cols}</tr>);
      }
      content = (
        <Table striped bordered hover>
          <thead>
            <tr>
              {headers}
            </tr>
          </thead>
          <tbody>
            {htmlResults}
          </tbody>
        </Table>
        );
    }

    return (
      <div>
        <Row>
          <Col md={12}><ControlLabel>{"Results"}</ControlLabel></Col>
        </Row>
        <Row>
          <Col md={12}>
            {content} 
          </Col>
        </Row>
      </div>
    );
  }
}

export default ResultTable;
