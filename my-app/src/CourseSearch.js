import React, { Component } from 'react';
import SearchSettings from './SearchSettings';
import ResultTable from './ResultTable';
import axios from 'axios';

class CourseSearch extends Component {
	constructor(props) {
    super(props);
    this.state ={
      searchParams: {},
      results: null
    };
    this.updateSearchParams = this.updateSearchParams.bind(this);
    this.getResults = this.getResults.bind(this);
  }
  updateSearchParams(s){
    var cpy = JSON.parse(JSON.stringify(s));
    delete cpy.validFacCodes;
    cpy.fac_code_in = cpy.fac_code_in.map(function(x){
      return x[1];
    });
    this.setState({searchParams: cpy});
    this.requestSearch(this, cpy);
  }
  requestSearch(elem, s){
    var loadingRes = {
        "error":false,
        "error-msg":"loading",
        "status": -1
      };
    elem.setState({results:loadingRes});
    axios.post('/search', s)
      .then(function (response) {
        elem.setState({results:response.data});
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  getResults(){
    return this.state.results;
  }
  render() {
    return (
      <div>
        <SearchSettings onChange={this.updateSearchParams}></SearchSettings>
        <ResultTable getResults={this.getResults}></ResultTable>
      </div>
    );
  }
}

export default CourseSearch;