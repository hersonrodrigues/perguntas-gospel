function SYS(){};
SYS.prototype.config = {};
SYS.prototype.participantes = {};
SYS.prototype.perguntas = {};
SYS.prototype.originalParticipantes = {};
SYS.prototype.originalPerguntas = {};
SYS.prototype.objetoPergunta = {};
SYS.prototype.objetoParticipante = {};
SYS.prototype.acabouParticipante = false;
SYS.prototype.participanteAcertouUltimaPergunta = false;
SYS.prototype.printParticipantesAtivos = function(){
	var nomes = [];
	$.each(sys.filtrarParticipantesAtivados(sys.participantes), function( index, value ){
		nomes = nomes + value.nome + ", ";
	});
	$("#total-participantes-ativos").attr("title", nomes);
};
SYS.prototype.printParticipantesInativos = function(){
	var nomes = [];
	$.each(sys.filtrarParticipantesDesativados(sys.participantes), function( index, value ){
		nomes = nomes + value.nome + ", ";
	});
	$("#total-participantes-inativos").attr("title", nomes);

};
SYS.prototype.getPergunta = function(){
	return sys.objetoPergunta;
};
SYS.prototype.setPergunta = function(pergunta){
	sys.objetoPergunta = pergunta;
};
SYS.prototype.getPergunta = function(){
	return sys.objetoPergunta;
};
SYS.prototype.setParticipante = function(participante){
	sys.objetoParticipante = participante;
};
SYS.prototype.getParticipante = function(){
	return sys.objetoParticipante;
};
SYS.prototype.loadConfig = function(){
	$.getJSON("./json/config.json", function(json) {	
		sys.config = json;
	}).fail(function() {
       sys.alert("O sistema nao conseguiu carregar as configuracoes. Verique a opcao --disable-web-security");
    });
};
SYS.prototype.loadParticipantes = function(){
	$.getJSON("./json/participantes.json", function(json) {	
		sys.originalParticipantes = json;
		sys.participantes = json;
		$("#total-participantes i").html(String(sys.originalParticipantes.length));
		var pativos = sys.filtrarParticipantesAtivados(sys.participantes);
		$("#total-participantes-ativos i").html(String(pativos.length));
		$("#total-participantes-inativos i").html(String(json.length - pativos.length));
		sys.printParticipantesAtivos();
		sys.printParticipantesInativos();
		return pativos;
	}).fail(function() {
       sys.alert("O sistema nao conseguiu carregar os participantes. Verique a opcao --disable-web-security");
    });
};
SYS.prototype.loadPerguntas = function(){
	$.getJSON("./json/perguntas.json", function(json) {
		sys.originalPerguntas = json;
		sys.perguntas = json;
		$("#total-questoes i").html(String(sys.originalPerguntas.length));
		var pnrespondidas = sys.filtrarPerguntasNaoRespondidas(sys.perguntas);
		$("#total-questoes-nao-respondidas i").html(String(pnrespondidas.length));
		$("#total-questoes-respondidas i").html(String(sys.originalPerguntas.length - pnrespondidas.length));
		return pnrespondidas;
	}).fail(function() {
       sys.alert("O sistema nao conseguiu carregar as perguntas. Verique a opcao --disable-web-security");
    });
};
SYS.prototype.delPerguntaFromGame = function(pg){
    var rdata = $.grep(sys.perguntas, function(p, index){
		return p.id != pg.id
    });
	
    $.grep(sys.perguntas, function(p, index){
      if (p.id == pg.id){
		p.respondida = true;
	  }
    });
	
	//$("#total-questoes i").html(String(rdata.length));
	var pnrespondidas = sys.filtrarPerguntasNaoRespondidas(sys.perguntas);
	$("#total-questoes-nao-respondidas i").html(String(pnrespondidas.length));
	$("#total-questoes-respondidas i").html(String(sys.originalPerguntas.length - pnrespondidas.length));
    return rdata;
};
SYS.prototype.delParticipanteFromGame = function(pt){
    var rdata = $.grep(sys.participantes, function(p, index){
      return p.id != pt.id;
    });
	
    $.grep(sys.participantes, function(p, index){
      if (p.id == pt.id){
		p.ativo = false;
	  }
    });

	$("#total-participantes i").html(String(rdata.length));
	var pativos = sys.filtrarParticipantesAtivados(rdata);
	$("#total-participantes-ativos i").html(String(pativos.length));
	$("#total-participantes-inativos i").html(String(sys.originalParticipantes.length - pativos.length));
	sys.printParticipantesAtivos();
	sys.printParticipantesInativos();
    return rdata;
}
SYS.prototype.filtrarPerguntasNaoRespondidas = function(dados){
	if(dados.length > 0){
		var rdata = $.grep(dados, function(e, index){
			  return e.respondida == false;
		});
		return rdata;
	}else{
		sys.alert("Sem perguntas disponiveis.");
	}
};

SYS.prototype.containIn = function(array, id){
	if(array.length>0){
		return array.indexOf(id)!=-1;
	}else{
		sys.alert("Nao tem dados para contar...");
	}
}
SYS.prototype.filtrarPerguntasPorNivel = function(dados){
	if(dados.length > 0){
		var rdata = $.grep(dados, function(p, index){
			var t = sys.containIn(sys.getParticipante().nivel, p.nivel);
			return t;
		});
		return rdata;
	}else{
		sys.alert("Sem perguntas deste nivel");
	}
};
SYS.prototype.filtrarParticipantesAtivados = function(dados){
	if(dados.length > 0){
		var rdata = $.grep(dados, function(e, index){
			  return e.ativo == true;
		});
		return rdata;
	}else{
		sys.alert("Sem participantes ativados");
	}
};
SYS.prototype.listIds = function(dados){
	var list = [];
	$.each(dados, function( index, value ) {
	  list.push(value.id);
	});
	return list;
};
SYS.prototype.filtrarParticipantesDesativados = function(dados){
	if(dados.length > 0){
		var rdata = $.grep(dados, function(e, index){
			  return e.ativo == false;
		});
		return rdata;
	}else{
		sys.alert("Sem participantes inativos");
	}
};
SYS.prototype.rand = function(num){
	return Math.floor(Math.random() * num);
};
SYS.prototype.randParticipante = function(){
	var p1 = sys.filtrarParticipantesAtivados(sys.participantes);
	var n = sys.rand(p1.length);
	return sys.getParticipante();		
};
SYS.prototype.alert = function(msg){
	$("#alert").fadeIn()
	$("#alert h3").html(msg);
	setTimeout(function(){
		$("#alert").fadeOut();
	}, 5000);
};
SYS.prototype.getRandPerguntas = function(){
	var p1 = sys.filtrarPerguntasNaoRespondidas(sys.perguntas);
	var p2 = sys.filtrarPerguntasPorNivel(p1);
	if(p2.length > 0){
		var n = sys.rand(p2.length);
		sys.setPergunta(p2[n]);
		return sys.getPergunta();
	}else{
		sys.alert("Sem perguntas para este nível!");
	}
};
SYS.prototype.getRandParticipante = function(){
	var p1 = sys.filtrarParticipantesAtivados(sys.participantes);
	var n = sys.rand(p1.length);
	sys.setParticipante(p1[n]);
	return sys.getParticipante();		
	
};
SYS.prototype.sortParticipante = function(){
	sys.getRandParticipante();
	$("#login").html(sys.getParticipante().nome);
	$("#nvp i").html(String(sys.getParticipante().nivel));
	$("#login").addClass("blur");
	setTimeout(function(){
		$("#login").removeClass("blur");
	}, 7000);
};
SYS.prototype.sortPergunta = function(){
	sys.opcaoResposta = false;
	if(sys.participanteAcertouUltimaPergunta){
		if(sys.config.manterParticipanteRespondendoEmCasoDeAcerto == false){
			sys.sortParticipante();
		}
	}else{
		sys.sortParticipante();
	}
	
	var pg = sys.getRandPerguntas();
	$(".dpy").removeClass('display').addClass('ocultar');
	$("#newQuestion").hide();
	$("#show").show().addClass("disabled");
	setTimeout(function(){
		$( "input:checked" ).removeAttr('checked');
		$("#labelA,#labelB,#labelC,#labelD").parent().removeClass("alert-danger").removeClass("alert-success");
		$(".dpy").removeClass("display");
		$("#question").html(pg.titulo);
		$("#labelA").html(pg.A);
		$("#labelB").html(pg.B);
		$("#labelC").html(pg.C);
		$("#labelD").html(pg.D);
		$("#ref i").html(pg.ref);
		$("#idq i").html(pg.id);
		$("#nivel i").html(pg.nivel);		
		setTimeout(function(){$(".dpy").removeClass('ocultar').addClass("display");},25);
	}, 3000);
};
SYS.prototype.opcaoResposta = false;
SYS.prototype.optionSelected = {};
SYS.prototype.init = function(){
	sys.loadConfig();
	sys.loadPerguntas();
	sys.loadParticipantes();
};

var sys;
sys = new SYS();
sys.init();

$(document).ready(function(){
	//$("#newLogin").click(sys.sortParticipante);
	$("#newQuestion").click(sys.sortPergunta);
	$("#show").click(function(){
		if($( "input:checked" ).length==0){
			alert("Selecione uma alternativa.");
		}else{
			sys.opcaoResposta = true;
			$("#labelA,#labelB,#labelC,#labelD").parent().addClass("alert-danger");
			$("#newQuestion").show();
			$("#show").hide();
			var r = sys.getPergunta().resposta;
			$("#label"+r).parent().removeClass("alert-danger").addClass("alert-success");
			// marcou a alternativa correta
			if($("input[type=radio]:checked").attr('id')=="radio"+r){
				sys.participanteAcertouUltimaPergunta = true;
				if(sys.config.excluirPerguntaQuandoParticipanteAcertar){
					sys.delPerguntaFromGame(sys.getPergunta());
				}
				if(sys.config.excluirParticipanteQuandoAcertarPergunta){
					sys.delParticipanteFromGame(sys.getParticipante());
				}
			}else{ //marcou errada
				sys.participanteAcertouUltimaPergunta = false;
				if(sys.config.excluirPerguntaQuandoParticipanteErrar){
					sys.delPerguntaFromGame(sys.getPergunta());
				}
				if(sys.config.excluirParticipanteQuandoErrarPergunta){
					sys.delParticipanteFromGame(sys.getParticipante());
				}
			}
		}
	});

	$("input[type=radio]").on( "click", function(){
		if(sys.opcaoResposta == true){
			sys.optionSelected.prop("checked", true)
		}else{
			sys.optionSelected = $(this);
			$("#show").show().removeClass("disabled");
			$("#newQuestion").hide();
		}
	});
	$("#config").click(function(){
		$("#box-question").hide();
		$("#box-config").show();
		$("#excluirParticipanteQuandoErrarPergunta").prop("checked", sys.config.excluirParticipanteQuandoErrarPergunta);
		$("#excluirParticipanteQuandoAcertarPergunta").prop("checked", sys.config.excluirParticipanteQuandoAcertarPergunta);
		$("#manterParticipanteRespondendoEmCasoDeAcerto").prop("checked", sys.config.manterParticipanteRespondendoEmCasoDeAcerto);
		$("#excluirPerguntaQuandoParticipanteAcertar").prop("checked", sys.config.excluirPerguntaQuandoParticipanteAcertar);
		$("#excluirPerguntaQuandoParticipanteErrar").prop("checked", sys.config.excluirPerguntaQuandoParticipanteErrar);
	});
	
	$("#config2").click(function(){
		$("#box-question").show();
		$("#box-config").hide();
	});
	
	$("#excluirParticipanteQuandoErrarPergunta, #excluirParticipanteQuandoAcertarPergunta, #manterParticipanteRespondendoEmCasoDeAcerto, #excluirPerguntaQuandoParticipanteAcertar, #excluirPerguntaQuandoParticipanteErrar").change(function(){
		var prop = $(this).prop("checked");
		var id = $(this).attr("id");
		sys.config[id] = prop;
	});
	
	$("#json-config").click(function(){
		$("#r-json-config").val(JSON.stringify(sys.config, null, '\t')).show();
		$("#json-config-save").show();
	});

	$("#json-participantes").click(function(){
		$("#r-json-participantes").val(JSON.stringify(sys.participantes, null, '\t')).show();
		$("#json-participantes-save").show();
	});	
	
	$("#json-perguntas").click(function(){
		$("#r-json-perguntas").val(JSON.stringify(sys.perguntas, null, '\t')).show();
		$("#json-perguntas-save").show();
	});
	
	$("#json-config-save").click(function(){
		var json = $("#r-json-config").val();
		var pjson = $.parseJSON(json);
		sys.config = pjson;
		$("#r-json-config").hide();
		$(this).hide();
	});
	
	$("#json-participantes-save").click(function(){
		var json = $("#r-json-participantes").val();
		var pjson = $.parseJSON(json);
		sys.participantes = pjson;
		$("#r-participantes-config").hide();
		$(this).hide();
	});
	
	$("#json-perguntas-save").click(function(){
		var json = $("#r-json-perguntas").val();
		var pjson = $.parseJSON(json);
		sys.perguntas = pjson;
		$("#r-perguntas-config").hide();
		$(this).hide();
	});
});