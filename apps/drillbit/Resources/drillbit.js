
var TFS = Titanium.Filesystem;
var TA  = Titanium.App;
var Drillbit = Titanium.Drillbit;

var frontend = {
	test_status:function(name,classname)
	{
		var el = $('#suite_'+name+'_status');
		el.html(classname);
		el.removeClass('untested').removeClass('failed').removeClass('running')
			.removeClass('passed').addClass(classname.toLowerCase());
		$('#suite_'+name).removeClass('suite-untested').removeClass('suite-failed')
			.removeClass('suite-running').removeClass('suite-passed').addClass('suite-'+classname.toLowerCase());
	},
	
	suite_started:function(suite)
	{
		this.test_status(suite, 'running');
	},
	
	total_progress:function(passed,failed,total)
	{
		$('#passed-count').html('<img src="images/check_on.png"/>&nbsp;&nbsp;'+passed+' passed');
		$('#failed-count').html('<img src="images/check_off.png"/>&nbsp;&nbsp;'+failed+' failed');
	},
	
	show_current_test:function(suite_name, test_name)
	{
		$('#current-test').html('<b>'+suite_name + '</b>:&nbsp;&nbsp;' + test_name);
	},
	
	add_assertion:function(test_name, line_number)
	{
		$('#assertion-count').html(Drillbit.total_assertions+' assertions');
	}
};

function show_test_details(name)
{
	var w = Titanium.UI.currentWindow.createWindow();
	w.setHeight(600);
	w.setWidth(600);
	w.setURL('app://test_results/' + name + '.html');
	w.open();
}

function toggle_test_includes()
{	
	$.each($("div.suites img"),function()
	{
		if ($(this).attr('src').indexOf('check_on') == -1)
		{
			$(this).attr('src', 'images/check_on.png');
		}
		else
		{
			$(this).attr('src', 'images/check_off.png');
		}
	});
}

function select_tests(tests)
{
	// clear the table
	$("div.suites img").attr('src', 'images/check_off.png');
	
	//select tests
	for (var t = 0; t < tests.length; t++) {
		var test = tests[t];
		$('#suite_'+test+' img').attr('src', 'images/check_on.png');
	}
}

function clear_current_test()
{
	$('#current-test').html('<span style="color: #ccc">&lt;no tests currently running&gt;</span>')	
}

function reset_all()
{	
	$('div[class^=suite] img').attr('src', 'images/check_on.png');
	$('div[id^=suite_]').removeClass().addClass('suite');
	$('span[id^=suite_]').removeClass().addClass('untested').html('untested');
	$('#assertion-count').html('0 assertions');
	$('#passed-count').html('<img src="images/check_on.png"/>&nbsp;&nbsp;0 passed');
	$('#failed-count').html('<img src="images/check_off.png"/>&nbsp;&nbsp;0 failed');
	clear_current_test();
	Drillbit.reset();
}

var tests = {};
$(window).ready(function()
{
	Drillbit.run_tests_async = true;
	Drillbit.frontend = frontend;
	Drillbit.window = window;
	
	var test_dir = TFS.getFile(TA.appURLToPath('app://tests'));
	var dir_list = test_dir.getDirectoryListing();
	
	Drillbit.loadTests(dir_list);
	Drillbit.setupTestHarness(TFS.getFile(TFS.getApplicationDirectory(), 'manifest_harness'));
	
	var suites_html = '';	
	for (var c=0;c<Drillbit.test_names.length;c++)
	{
		var name = Drillbit.test_names[c];
		var entry = Drillbit.tests[name];
		
		suites_html +=
		'<div class="suite" id="suite_'+name+'">'+
			'<img src="images/check_on.png"/> <span class="suite_name">'+name+'</span><br/>'+
			'<span class="description">'+entry.description+'</span></br>'+
			'<span id="suite_'+name+'_status" class="untested">untested</span>'+
		'</div>';
	}
	
	$('div.suites').html(suites_html);
	$('div[id^=suite_]').click(function()
	{
		if ($(this).find('img').attr('src').indexOf('check_on') != -1)
		{
			$(this).find('img').attr('src', 'images/check_off.png');
		}
		else
		{
			$(this).find('img').attr('src', 'images/check_on.png');
		}
	});
	$('div[id^=suite_]').dblclick(function()
	{
		var suite_name = $(this).attr('id').substr(6);
		show_test_details(suite_name);
	});
	
	var w = $('div.suites').width() + 4;
	var h = $('div.suites').height() + 55;
	Titanium.UI.currentWindow.setWidth(w);
	Titanium.UI.currentWindow.setHeight(h);
	
	var run_link = $('#run-link');
	$('#toggle-link').click(function() {
		toggle_test_includes();
	});
	$('#reset-link').click(function() {
		reset_all();
	});
	
	run_link.click(function ()
	{
		if (!run_link.disabled)
		{
			run_link.disabled = true;
			var test_names = [];
			$.each($('div[id^=suite_]'),function()
			{
				var name = $(this).attr('id').substr(6);
				frontend.test_status(name,'untested');
				if ($(this).find('img').attr('src').indexOf('check_on') != -1)
				{
					test_names.push(name);
				}
			});
			
			Drillbit.runTests(test_names, true);
		}
		else
		{
			alert("Tests are currently running");
		}
	});
	
	// if you pass in --autorun, just go ahead and start
	for (var c=0;c<Titanium.App.arguments.length;c++)
	{
		var arg = Titanium.App.arguments[c];
		
		if (arg == '--autorun')
		{
			run_link.click();
		}
		else if (arg == '--autoclose')
		{
			Drillbit.auto_close = true;
		}
		else if (arg == '--debug-tests')
		{
			Drillbit.debug_tests = true;
		}
		else if (arg == '--console')
		{
			Titanium.UI.currentWindow.showInspector(true);
		}
		else if (arg.indexOf('--tests=')==0)
		{
			specific_tests = arg.substring(8).split(',');
			select_tests(specific_tests);
		}
	}
});

