// mapping colours to bootstrap classes
var colorToClass = {
	"RED" : "danger",
	"BLUE" : "info",
	"GREEN" : "success"
}

class Viewable{
	constructor(){
		this.target = null;
		this.listeners = [];
	}
	updateView(){
		if(this.target != null)
			document.getElementById(this.target).innerHTML = this.render();
		else
			throw Error("This element is not binded to anything!");
	}
	bind(t){
		this.target = t;
	}
	// Module functions 
	// TODO move into seperate interface. 
	update(){
		for (var i = 0; i < this.listeners.length; i++) {
			this.listeners[i].update();
		}
	}
	addListener(l){
		this.listeners.push(l);
	}
}

class SimpleInputField extends Viewable{
	constructor (name, label, type) {
		super();
		this.name = name;
		this.label = label;
		this.type = type;
		this.change = null;
	}
	render(){
		var result = [];
		result.push(`<div class="form-group">`);
		result.push(`<label class="control-label" for="${this.name}">${this.label}</label>`);
		if(this.change != null)
			result.push(`<input class="form-control" type="${this.type}" onblur="${this.change}" id="${this.name}">`);
		else
			result.push(`<input class="form-control" type="${this.type}" id="${this.name}">`);
		result.push(`</div>`);
		return result.join('\n');
	}
	getValue(){
		return document.getElementById(this.name).value;
	}
	getState(){
		return this.getValue();
	}
}

class Button extends Viewable{
	constructor (name, label, color) {
		super();
		this.name = name;
		this.label = label;
		this.color = colorToClass[color.toUpperCase()];
		this.action = null
		this.func = null;
	}
	setAction(trigger, func){
		var handler = globalEventHandler.registerVector(func);
		this.action = `${trigger} = "${handler}"`;
	}
	render(){
		if(this.action == null)
			return `<button id="${this.name}" class="btn btn-${this.color}" type="button">${this.label}</button>`;
		else
			return `<button id="${this.name}" ${this.action} class="btn btn-${this.color}" type="button">${this.label}</button>`;
	}
}

class ButtonInputField extends Viewable{
	constructor (name, label, type, button) {
		super();
		this.name = name;
		this.label = label;
		this.type = type;
		this.button = button;
		var self = this;
		this.button.setAction("onclick", function(){
			var field = document.getElementById(self.name);
			self.values.push(field.value);
			field.value = "";
		});
		this.values = [];
		this.change = null;
	}
	render(){
		var result = [];
		result.push(`<div class="form-group">`);
		result.push(`<label class="control-label" for="${this.name}">${this.label}</label>`);
		result.push(`<div class="input-group">`);
		if(this.change != null)
			result.push(`<input onblur="${this.change}" class="form-control" type=${this.type}" id="${this.name}">`);
		else
			result.push(`<input class="form-control" type=${this.type}" id="${this.name}">`);
		result.push(`<span class="input-group-btn">`);
		result.push(this.button.render());
		result.push(`</span>`);
		result.push(`</div>`);
		result.push(`</div>`);
		return result.join('\n');
	}
	getValues(){
		return this.values;
	}
	getState(){
		return this.getValues();
	}
}

class SelectInputField extends Viewable{
	constructor (name, label, options) {
		super();
		this.name = name;
		this.label = label;
		this.options = options;
		this.value = options[0];
		this.change = null;
	}
	render(){
		var result = [];
		result.push(`<div class="form-group">`);
		result.push(`<label class="control-label" for="${this.name}">${this.label}</label>`);
		if(this.change != null)
			result.push(`<select class="form-control" id="${this.name}" onchange="${this.change}">`);
		else
			result.push(`<select class="form-control" id="${this.name}">`);
		this.options.forEach(function(elem){
			result.push(`<option>${elem}</option>`);
		});
		result.push(`</select>`);
		result.push(`</div>`);
		return result.join('\n');
	}
	getValue(){
		return document.getElementById(this.name).value;
	}
	getState(){
		return this.getValue();
	}
}

class FormModule extends Viewable{
	constructor () {
		super();
		this.rows = [];
		this.numRows = 0;
		this.bootstrap = [];
		var self = this;
		this.change = globalEventHandler.registerVector(function(){self.update()});
	}
	addField(field, row){
		// TODO: needs to handle pushing on more elements then 
		// the bootstrap knows how to handle
		// TOOD: general error handling for invalid row
		field.change = this.change;
		this.rows[row].push(field);
	}
	newRow(bootstrap){
		// TODO: NEEDS ERROR CHECKING BOOTSTRAP IS ASSUMED TO BE SET CORRECTLY
		this.rows.push([]);
		this.bootstrap.push(bootstrap.split(':'));
		this.numRows++;
	}
	render(){
		var result = "";
		var colSize = -1;
		for (var row = 0; row < this.rows.length; row++) {
			result += `<div class="row">\n`;
			for(var i=0; i < this.rows[row].length; i++){
				if(this.bootstrap[row].length == 1){
					colSize = this.bootstrap[row];
				}else{
					colSize = this.bootstrap[row].shift();
				}
				result += `<div class="col-md-${colSize}">\n`;
				result += this.rows[row][i].render();
				result += `</div>\n`;
			}
			result += `</div>\n`;
		}
		return result;
	}
	getState(){
		var json = {};
		for (var row = 0; row < this.rows.length; row++) {
			for(var i=0; i < this.rows[row].length; i++){
				var elem = this.rows[row][i];
				json[elem.name] = elem.getState();
			}
		}
		return json;
	}
}

class ListModule extends Viewable{
	constructor (name, label, elems) {
		super();
		this.name = name;
		this.label = label;
		if(elems)
			this.elems = elems;
		else
			this.elems = [];
		this.source = null;
		this.sourceField = null;
		this.sourceProcess = null;
	}

	add(e){
		this.elems.push(e);
	}

	render(){
		var result = "";
		result +=`<div class="row">`;
		result +=`<div class="col-md-12">`;
		result +=`<label class="control-label"> ${this.label} </label>`;
		result +=`</div>`;
		result +=`</div>`;

		result += `<div class="row">`;
		result += `<div id="${this.name}" class="col-md-12">`;
		if(this.source != null){
			var list = this.source.getState()[this.sourceField];
			for (var i = 0; i < list.length; i++) {
				var pElem = this.sourceProcess(list[i]);
				result += pElem.render();

			}
		}else{
			this.elems.forEach(function(elem){
				result += elem.render();
			});
		}
        result += `</div>`;
       	result += `</div>`;
       	return result;
	}
	setSource(src, field, processFunction){
		this.source = src;
		this.sourceField = field;
		this.sourceProcess = processFunction;
	}
}

class Tag extends Viewable{
	constructor (name, label, color) {
		super();
		this.name = name;
		this.label = label;
		this.color = colorToClass[color.toUpperCase()];
	}
	render(){
		return `<span id="${this.name}" class="label label-${this.color}">${this.label}</span>`;
	}
}

// event handling system
// TODO: handle removing events :/
class EventHandler{
	constructor(){
		this.currentVector = 0;
		this.vectors = [];
	}
	registerVector(func){
		var ret = `globalEventHandler.handle(${this.currentVector});`;
		this.vectors.push(func);
		this.currentVector++;
		return ret;
	}
	handle(vec){
		this.vectors[vec]();
	}
}

// global vars
var globalEventHandler = new EventHandler();


// helper functions
function removeFromDom(elem){
	var c = document.getElementById(elem);
	var p = c.parent;
	p.removeChild(c);
}

