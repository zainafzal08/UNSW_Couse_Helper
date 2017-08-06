var reqList = null;

function init(){
	var settings = new FormModule();
	settings.bind("form-module-settings");
	settings.newRow("3:3:3:3");
	settings.addField(new SimpleInputField("Fac_code", "Faculty Code", "text"), 0);
	settings.addField(new SelectInputField("semester", "Semester", ["1","2","Summer"]), 0);
	var prereqButton = new Button("prereq_add_button", "+", "green");
	var prereqIn = new ButtonInputField("prereq_add", "Add a Prereq", "text", prereqButton);
	var coreqButton = new Button("coreq_add_button", "+", "blue");
	var coreqIn = new ButtonInputField("coreq_add", "Add a Coreq", "text", coreqButton);
	settings.addField(prereqIn, 0);
	settings.addField(coreqIn, 0);
	settings.updateView();

	reqList = new ListModule("reqList", "Met Pre/Coreqs");
	reqList.setSource(settings, "prereq_add", toPreTag);
	reqList.bind("req-list");
	reqList.updateView();

	// have the lsit update whenver settings does
	settings.addListener(reqList);
}

var currTag = -1;

function toPreTag(s){
	currTag++;
	return new Tag('t'+currTag,s,"blue");
}