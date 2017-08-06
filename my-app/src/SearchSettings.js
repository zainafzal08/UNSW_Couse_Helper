import React, { Component } from 'react';
import {HelpBlock, Button, Label, InputGroup, Row,Col,FormControl,FormGroup, ControlLabel} from 'react-bootstrap';
import axios from 'axios';

class SearchSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prereq_in: [],
      validFacCodes: [],
      fac_code_in: [],
      sem: '1',
      grad: "Undergraduate",
      year: (new Date()).getFullYear().toString()
    };
    this.handleChange = this.handleChange.bind(this);
    this.getFilterList = this.getFilterList.bind(this);
    this.validateFacCode = this.validateFacCode.bind(this);
    this.validateCourseCode = this.validateCourseCode.bind(this);
    this.onChange = props.onChange;
  }
  componentDidMount(){
    axios.get("/get?sem="+this.state.sem+"&year="+this.state.year+"&type=facCodes")
      .then(res => {
        this.setState({validFacCodes: res.data});
      });
  }
  handleChange(field, val){
    var obj = {};
    obj[field] = val;
    this.setState(obj);
    var cpy = JSON.parse(JSON.stringify(this.state));
    cpy[field] = val;
    this.onChange(cpy);
  }
  getFilterList(){
    var temp = this.state.prereq_in;
    temp = temp.concat(this.state.fac_code_in);
    var sem = "Sem "+this.state.sem;
    var year = this.state.year;
    temp.push(["default",sem]);
    if(this.validateYear(null,this.state.year)[0] === "success")
      temp.push(["info",year]);
    return temp;
  }
  validateFacCode(elem, facCode){
    facCode = facCode.toUpperCase();
    if(facCode.length === 0)
      return [null, ""];
    if(this.state.validFacCodes.indexOf(facCode) !== -1)
      return ["success",""];
    else
      return ["error","Unknown Faculty Code"];
  }
  validateCourseCode(elem, courseCode){
    courseCode = courseCode.toUpperCase();
    if(courseCode.length === 0)
      return [null, ""];
    if(courseCode.length === 8){
      var url = "/get?type=courseCodeValidty&courseCode="+courseCode+"&year="+this.state.year+"&sem="+this.state.sem
      axios.get(url)
      .then(res => {
        if(res.data.validity === true){
          elem.setState({validationState: "success"});
          elem.setState({validationMsg: res.data.courseName});
        }
      });
    }
    return ["error","Unknown Course Code"];
  }
  validateYear(elem, y){
    if(y.length===0){
      return ["",""];
    }
    var year = parseInt(y,10);
    if(!year)
      return ["error", "Invalid Year"];
    var currYear = (new Date()).getFullYear();
    if (year > currYear || year < 2000){
      return ["error", "Invalid Year"];
    }else{
      return ["success", ""];
    }
  }
  render() {
    return (
      <div>
        <Row>
          <Col md={2}><SelectInput name="sem" label="Semester" onChange={this.handleChange} items={["1","2","Summer"]}></SelectInput></Col>
          <Col md={2}><SelectInput name="grad" label="Grad Level" onChange={this.handleChange} items={["Undergraduate","Postgraduate","Both"]}></SelectInput></Col>
          <Col md={3}><TextButtonInput onSubmit={this.handleChange} validationFunction={this.validateFacCode} triggerLabel="+" name="fac_code_in" label="Add a Faculty" ph="COMP" butStyle="primary"></TextButtonInput></Col>
          <Col md={3}><TextButtonInput onSubmit={this.handleChange} validationFunction={this.validateCourseCode} triggerLabel="+" name="prereq_in" label="Add a Prereq" ph="COMP1511" butStyle="success"></TextButtonInput></Col>
          <Col md={2}><TextInput onChange={this.handleChange} validationFunction={this.validateYear} name="year" label="Year" ph="2017" value="2017"></TextInput></Col>
        </Row>
          <TagList label="Filter List" name="filter_list" getItems={this.getFilterList}></TagList>
        <br></br>
      </div>
    );
  }
}

class TextInput extends Component{
  constructor(props) {
    super(props);
    this.label = props.label;
    this.ph = props.ph;
    this.onChange = props.onChange;
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      value: props.value,
      validationState: "success",
      validationMsg: ""
    };
    this.name = props.name;
    this.getValidationState = props.validationFunction;
  }

  handleChange(e){
    // call the controller update
    this.onChange(this.name, e.target.value);
    // update ourselfs
    this.setState({value: e.target.value});
    var validationState = this.getValidationState(this, e.target.value)[0];
    var validationMsg = this.getValidationState(this, e.target.value)[1];
    this.setState({validationState: validationState});
    this.setState({validationMsg: validationMsg});
  }
  render(){
    return (
      <FormGroup controlId={this.name} validationState={this.state.validationState}>
        <ControlLabel>{this.label}</ControlLabel>
        <FormControl
          type="text"
          value={this.state.value}
          placeholder={this.ph}
          onChange={this.handleChange}
        />
        <HelpBlock>{this.state.validationMsg}</HelpBlock>
      </FormGroup>
    );
  }
}

class SelectInput extends Component{
  constructor(props) {
    super(props);
    this.label = props.label;
    this.ph = props.ph;
    this.onChange = props.onChange;
    this.handleChange = this.handleChange.bind(this);
    this.items = props.items;
    this.state = {value: ""};
    this.name = props.name;
  }

  handleChange(e){
    // call the controller update
    this.onChange(this.name, e.target.value);
    // update ourselfs
    this.setState({value: e.target.value});
  }
  render(){
    var options = [];
    var i = 0;
    this.items.forEach(function(e){
      options.push(<option key={i} value={e}>{e}</option>);
      i++;
    });
    return (
      <FormGroup controlId={this.name}>
        <ControlLabel>{this.label}</ControlLabel>
        <FormControl componentClass="select" placeholder={this.items[0]} onChange={this.handleChange}>
          {options}
        </FormControl>
      </FormGroup>
    );
  }
}

class TextButtonInput extends Component{
  constructor(props) {
    super(props);
    this.label = props.label;
    this.ph = props.ph;
    this.valueList = [];
    this.onSubmit = props.onSubmit;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      value: "",
      validationState: null,
      validationMsg: ""
    };
    this.name = props.name;
    this.triggerLabel = this.props.triggerLabel;
    this.style = props.butStyle;
    this.getValidationState = props.validationFunction;
  }

  handleChange(e){
    // update ourselfs
    this.setState({value: e.target.value});
    var validationState = this.getValidationState(this, e.target.value)[0];
    var validationMsg = this.getValidationState(this, e.target.value)[1];
    this.setState({validationState: validationState});
    this.setState({validationMsg: validationMsg});
  }
  handleSubmit(e){
    // update the list
    this.valueList.push([this.style, this.state.value]);
    // tell our controller what just happened
    this.onSubmit(this.name, this.valueList);
    // clear ourselves
    this.setState({value:""});
    this.setState({validationState: null});
    this.setState({validationMsg: ""});
  }

  render(){
    if(this.state.validationState === "success")
      return (
        <FormGroup controlId={this.name} validationState={this.state.validationState}>
          <ControlLabel>{this.label}</ControlLabel>
          <InputGroup>
            <FormControl
              type="text"
              value={this.state.value}
              placeholder={this.ph}
              onChange={this.handleChange}
            />
            <InputGroup.Button >
              <Button onClick={this.handleSubmit} bsStyle={this.style}>{this.triggerLabel}</Button>
            </InputGroup.Button>
          </InputGroup>
          <HelpBlock>{this.state.validationMsg}</HelpBlock>
      </FormGroup>
      );
    else
      return (
        <FormGroup controlId={this.name} validationState={this.state.validationState}>
          <ControlLabel>{this.label}</ControlLabel>
          <InputGroup>
            <FormControl
              type="text"
              value={this.state.value}
              placeholder={this.ph}
              onChange={this.handleChange}
            />
            <InputGroup.Button>
              <Button disabled bsStyle={this.style}>{this.triggerLabel}</Button>
            </InputGroup.Button>
          </InputGroup>
          <HelpBlock>{this.state.validationMsg}</HelpBlock>
      </FormGroup>
      );
  }
}

class TagList extends Component{
  constructor(props) {
    super(props);
    this.label = props.label;
    this.getItems = props.getItems;
    this.name = props.name;
  }
  render(){
    var tags = [];
    var i = 0;
    var items = this.getItems();
    items.forEach(function(e){
      tags.push(<Label key={i} bsStyle={e[0]}>{e[1]}</Label>);
      tags.push(" ");
      i++;
    });
    return (
      <div>
        <Row>
          <Col md={12}><ControlLabel>{this.label}</ControlLabel></Col>
        </Row>
        <Row>
          <Col md={12}>
            {tags}
          </Col>
        </Row>
      </div>
    );
  }
}
export default SearchSettings;
