var _line_up = new Array();
var _positions;
var _old_json_line_up;

$(document).ready(function() {
  var json_line_up = $("#edit-line-up").val();
  _old_json_line_up = $("#edit-line-up").val();
  _line_up = eval('(' + json_line_up + ')');
});

function confirm_reset_formazione(){
	$(window).unbind();
	if (confirm("Sei sicuro di voler cancellare la formazione inserita?")) {
			return (true);
	}
	return (false);
}

function confirm_conferma_formazione(){
	if (confirm("Vuoi confermare la formazione?")) {
			return (true);
	}
	return (false);
}

//mobile functions
function changePosition(pl_id, t_id, c_id, role, position) {
	var blockPosition = (position == 2) ? 1 : 0;
	var oldPosition = (position + 3) % 4;
	var positionNames = new Array("Tribuna", "Titolare", "Riserva 1", "Riserva 2");

	$("#" + pl_id + '_' + position).show();
	//$("#" + pl_id + '_' + oldPosition).children().html(positionNames[oldPosition]);
	$("#" + pl_id + '_' + oldPosition).hide();		

	//update arrays
	_line_up[pl_id].position = position;

	$("#edit-line-up").val("" + JSON.stringify(_line_up));

	var checks = checkLineUp(_line_up);

	if (checks[0] && checks[1] && checks[2] && checks[3]) {
		$("#line_up_submit").button('enable');
		$(window).unbind();
	}
	else
		$("#line_up_submit").button('disable');

	if($("#edit-line-up").val() == '' || $("#edit-line-up").val() == _old_json_line_up)
		$(window).unbind();
	else {
		$(window).bind("beforeunload", function() {
			return "Sicuro di voler uscire dalla pagina?";
		});

		$("#line_up_submit").click(function() {
			$(window).unbind();
		});

		$("#edit-clear").click(function() {
			$(window).unbind();
		});
	}
}
//END - mobile functions

//web functions 
$(document).ready(
	function () {
		if ($.fn.Sortable != undefined) {
			$('div.groupWrapper').Sortable(
				{
					accept: 'groupItem',
					helperclass: 'sortHelper',
					activeclass: 'sortableactive',
					hoverclass:	'sortablehover',
					handle: 'div.itemHeader',
					tolerance: 'pointer',
					onChange : function(ser)
					{
					},
					onStart : function()
					{
						$.iAutoscroller.start(this, document.getElementsByTagName('body'));
					},
					onStop : function()
					{
						$.iAutoscroller.stop();

						var pl_id = this.getAttribute('id');				
						var role_c_id = this.getAttribute('name');
						
						//args
						var broken_role_c_id = role_c_id.split('_');
						var role = broken_role_c_id[0];
						var c_id = broken_role_c_id[1];
						var uid = broken_role_c_id[2];

						var position = this.parentNode.getAttribute('id');	
						var var3 = document.getElementById(position).getElementsByTagName('div');
						var j = 0;
						for (var i = 0; i < var3.length; i++) {
							if (var3[i].getAttribute("name") == role_c_id) {
								j++;
								if (var3[i].getAttribute("id") == pl_id) {
									var blockPosition = j;
								}
							}
						}
						var blocksNumber = j;
						position = parseInt(position.substring(4));

						if (position > 1)
							position += blockPosition - 1;


						//update arrays

						//update position
						var oldPosition = _line_up[pl_id].position;
						_line_up[pl_id].position = position;

						//scalo le riserve
						if (oldPosition > 1) { //diminuisco la posizione delle riserve successive (solo stesso ruolo)
							for(var i = 0; i < Object.keys(_line_up).length; i++) {
								var key = Object.keys(_line_up)[i];
								if (key != pl_id && _line_up[key] != undefined) {
									if (_line_up[key].role == _line_up[pl_id].role) {
										if (_line_up[key].position >= oldPosition){
											_line_up[key].position = parseInt(_line_up[key].position) - 1;
										}
									}
								}
							}
						}

						//nuova posizione < 2 ---> diminuisco i successivi
						if (position > 1) { //aumento la posizione delle riserve successive (solo stesso ruolo)
							for(var j = 0; j < Object.keys(_line_up).length; j++) {
								var key = Object.keys(_line_up)[j];
								if (key != pl_id && _line_up[key] != undefined) {
									if (_line_up[key].role == _line_up[pl_id].role) {
										if (_line_up[key].position >= position){
											_line_up[key].position = parseInt(_line_up[key].position) + 1;
										}
									}
								}
							}
						}

						$("#edit-line-up").val("" + JSON.stringify(_line_up));

						//$("#show-line-up").val(showObject(_line_up, pl_id));

						var checks = checkLineUp(_line_up);

						if (checks[0] && checks[1] && checks[2] && checks[3])
							$("#line_up_submit").removeAttr("disabled").css("opacity", "1");
						else
							$("#line_up_submit").attr("disabled", "disabled").css("opacity", "0.5");

						if($("#edit-line-up").val() == '' || $("#edit-line-up").val() == _old_json_line_up)
							$(window).unbind();
						else {
							$(window).bind("beforeunload", function() {
								return "Sicuro di voler uscire dalla pagina?";
							});

							$("#line_up_submit").click(function() {
								$(window).unbind();
							});

							$("#edit-clear").click(function() {
								$(window).unbind();
							});

						}

					}
				}
			);
		}
	}
);


$(document).ready(
	function () {
		if ($.fn.Sortable != undefined) {
			$('div.groupWrapperAdmin').Sortable(
				{
					accept: 'groupItem',
					helperclass: 'sortHelper',
					activeclass: 'sortableactive',
					hoverclass:	'sortablehover',
					handle: 'div.itemHeader',
					tolerance: 'pointer',
					onChange : function(ser)
					{
					},
					onStart : function()
					{
						$.iAutoscroller.start(this, document.getElementsByTagName('body'));
					},
					onStop : function()
					{
						$.iAutoscroller.stop();

						var id = this.getAttribute('id');				
						var ruolo_lid = this.getAttribute('name');
						
						//args
						var broken_ruolo_lid = ruolo_lid.split('_');
						var ruolo = broken_ruolo_lid[0];
						var c_id = broken_ruolo_lid[1];
						var t_id = broken_ruolo_lid[2];

						var posizione = this.parentNode.getAttribute('id');	
						var var3 = document.getElementById(posizione).getElementsByTagName('div');
						var j = 0;
						for (var i = 0; i < var3.length; i++) {
							if (var3[i].getAttribute("name") == ruolo_lid) {
								j++;
								if (var3[i].getAttribute("id") == id) {
									var pos_blocco = j;
								}
							}
						}
						var nr_blocchi = j;
						posizione = posizione.substring(4);

						//update arrays

						//update position
						var oldPosition = _line_up[pl_id].position;
						_line_up[pl_id].position = position;

						//scalo le riserve
						if (oldPosition > 1) { //diminuisco la posizione delle riserve successive (solo stesso ruolo)
							for(var i = 0; i < Object.keys(_line_up).length; i++) {
								var key = Object.keys(_line_up)[i];
								if (key != pl_id && _line_up[key] != undefined) {
									if (_line_up[key].role == _line_up[pl_id].role) {
										if (_line_up[key].position >= oldPosition){
											_line_up[key].position = parseInt(_line_up[key].position) - 1;
										}
									}
								}
							}
						}

						//nuova posizione < 2 ---> diminuisco i successivi
						if (position > 1) { //aumento la posizione delle riserve successive (solo stesso ruolo)
							for(var j = 0; j < Object.keys(_line_up).length; j++) {
								var key = Object.keys(_line_up)[j];
								if (key != pl_id && _line_up[key] != undefined) {
									if (_line_up[key].role == _line_up[pl_id].role) {
										if (_line_up[key].position >= position){
											_line_up[key].position = parseInt(_line_up[key].position) + 1;
										}
									}
								}
							}
						}

						$("#edit-line-up").val("" + JSON.stringify(_line_up));

						//$("#show-line-up").val(showObject(_line_up, pl_id));

						var checks = checkLineUp(_line_up);

						if (checks[0] && checks[1] && checks[2] && checks[3])
							$("#line_up_submit").removeAttr("disabled").css("opacity", "1");
						else
							$("#line_up_submit").attr("disabled", "disabled").css("opacity", "0.5");

						if($("#edit-line-up").val() == '' || $("#edit-line-up").val() == _old_json_line_up)
							$(window).unbind();
						else {
							$(window).bind("beforeunload", function() {
								return "Sicuro di voler uscire dalla pagina?";
							});

							$("#line_up_submit").click(function() {
								$(window).unbind();
							});

							$("#edit-clear").click(function() {
								$(window).unbind();
							});

						}
					}
				}
			);
		}
	}
);
//web functions 

function inArray(needle, haystack) {
    for(var i = 0; i < haystack.length; i++) {
	    if(haystack[i] === needle) return true;
    }
    return false;
}

function inArrayTwoLevels(needle, haystack) {
    for(var i = 0; i < haystack.length; i++) {
		var check = true;
		if (haystack[i].length == needle.length) {
			for(var j = 0; j < haystack[i].length; j++) {
				if(haystack[i][j] != needle[j]) 
					check = false;
			}
			if (check)
				return true;
		}
    }
    return false;
}

//check lineup
function checkLineUp(line_up){
	//massima posizione
	var maxPosition = 0;
	for(var i = 0; i < Object.keys(line_up).length; i++){
		var key = Object.keys(line_up)[i];
		if (line_up[key].position > maxPosition)
			maxPosition = line_up[key].position;
	}

	//inizializzo gli array
	var positions = new Array();
	for(var j = 0; j <= maxPosition; j++){
		positions[j] = new Array(0, 0, 0, 0);
	}

	//conto gli elementi (per posizione e per ruolo)
	
	for(var k = 0; k < Object.keys(line_up).length; k++){
		var key = Object.keys(line_up)[k];
		var currPosition = parseInt(line_up[key].position);
		var currRole = parseInt(line_up[key].role);
		
		positions[currPosition][currRole]++;
	}

	//moduli consentiti e numero giocatori
	var check_number_1 = false; var check_module_1 = false; var check_number_2_3 = false; var check_module_2_3 = false; 
	var modules_1 = new Array(new Array(1, 3, 4, 3), new Array(1, 3, 5, 2), new Array(1, 4, 3, 3), new Array(1, 4, 4, 2), new Array(1, 4, 5, 1), new Array(1, 5, 3, 2), new Array(1, 5, 4, 1), new Array(1, 6, 3, 1));
	var modules_2 = new Array(new Array(1, 1, 1, 1));
	var modules_3 = new Array(new Array(0, 1, 1, 1));

	//verifico titolari
	if (positions[1] != undefined ) {
		//numero titolari
		var number_1 = positions[1][0] + positions[1][1] + positions[1][2] + positions[1][3]; 
		if(number_1 == 11)
			check_number_1 = true;
		else 
			check_number_1 = false;
			
		//modulo titolari
		var module_1 = new Array(positions[1][0], positions[1][1], positions[1][2], positions[1][3]);
		if(inArrayTwoLevels(module_1, modules_1)) 
			check_module_1 = true;
		else 
			check_module_1 = false;

	}

	//verifico riserve
	if (positions[2] != undefined && positions[3] != undefined) {
	
		//numero riserve
		var number_reserves = 0;
		for(var i = 2; i <= maxPosition; i++ ) {
			number_reserves += positions[i][0] + positions[i][1] + positions[i][2] + positions[i][3];
		}
	
		if(number_reserves == 7)
			check_number_2_3 = true;
		else 
			check_number_2_3 = false;

		//modulo riserve
		var module_2 = new Array(positions[2][0], positions[2][1], positions[2][2], positions[2][3]);
		var module_3 = new Array(positions[3][0], positions[3][1],positions[3][2], positions[3][3]);
		if(inArrayTwoLevels(module_2, modules_2) && inArrayTwoLevels(module_3, modules_3) && positions[4] == undefined) 
			check_module_2_3 = true;
		else 
			check_module_2_3 = false;
	}
	
	for(var i = 2; i <= maxPosition; i++ ) {
	
	}
	
	//update images	
	$("#check_number_1").attr("src", (check_number_1 == true ? "/sites/all/modules/fantacalcio/images/ok.png" : "/sites/all/modules/fantacalcio/images/no.png"));
	$("#check_module_1").attr("src", (check_module_1 == true ? "/sites/all/modules/fantacalcio/images/ok.png" : "/sites/all/modules/fantacalcio/images/no.png"));
	$("#check_number_2_3").attr("src", (check_number_2_3 == true ? "/sites/all/modules/fantacalcio/images/ok.png" : "/sites/all/modules/fantacalcio/images/no.png"));
	$("#check_module_2_3").attr("src", (check_module_2_3 == true ? "/sites/all/modules/fantacalcio/images/ok.png" : "/sites/all/modules/fantacalcio/images/no.png"));
	
	//risultato
	return new Array(check_number_1, check_module_1, check_number_2_3, check_module_2_3);
}

