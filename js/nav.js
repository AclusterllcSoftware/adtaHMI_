function correctTime(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    var day = today.getDate();
    var month = today.getMonth() + 1;
    var year = today.getFullYear();

    day = correctTime(day);
    month = correctTime(month);

    // add a zero in front of numbers<10
    h = correctTime(h);
    m = correctTime(m);
    s = correctTime(s);
    jQuery('#display_time').text(h + ":" + m + ":" + s);
    jQuery('#display_date').text(month + "/" + day + "/" + year);
    t = setTimeout(function() {
        startTime()
    }, 500);
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* function secondsToDhms(seconds) {
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600*24));
    var h = Math.floor(seconds % (3600*24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);
    
    var parts = [];
    var dDisplay = d > 0 ? d + (d == 1 ? " day" : " days") : "";
    if(dDisplay !== "") parts.push(dDisplay);
    var hDisplay = h > 0 ? h + (h == 1 ? " hour" : " hours") : "";
    if(hDisplay !== "") parts.push(hDisplay);
    var mDisplay = m > 0 ? m + (m == 1 ? " minute" : " minutes") : "";
    if(mDisplay !== "") parts.push(mDisplay);
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    if(sDisplay !== "") parts.push(sDisplay);
    return parts.join(", ");
} */

function secondsToDhms(seconds) {
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600*24));
    var h = Math.floor(seconds % (3600*24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);
    
    var parts = [];
    var dDisplay = d > 0 ? d + "d" : "";
    if(dDisplay !== "") parts.push(dDisplay);
    var hDisplay = h > 0 ? h + "h" : "";
    if(hDisplay !== "") parts.push(hDisplay);
    var mDisplay = m > 0 ? m + "m" : "";
    if(mDisplay !== "") parts.push(mDisplay);
    var sDisplay = s > 0 ? s + "s" : "";
    if(sDisplay !== "") parts.push(sDisplay);
    var returnDhms = parts.join(" ");

    if(returnDhms === "") returnDhms = "0s";

    return returnDhms;
}

function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate() < 10 ? '0' + a.getDate() : a.getDate();
    var hour = a.getHours() < 10 ? '0' + a.getHours() : a.getHours();
    var min = a.getMinutes() < 10 ? '0' + a.getMinutes() : a.getMinutes();
    var sec = a.getSeconds() < 10 ? '0' + a.getSeconds() : a.getSeconds();
    //var hour = a.getHours();
    //var min = a.getMinutes();
    //var sec = a.getSeconds();
    //var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    var time = month + '-' + date + '-' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;
}

function getIPAddress() {
    var interfaces = require('os').networkInterfaces();
    for (var devName in interfaces) {
        var iface = interfaces[devName];

        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal)
                return alias.address;
        }
    }

    return '0.0.0.0';
}
function getPaginationHtml(totalRecords,per_page,page){
    let page_total=(per_page>0)?Math.ceil(totalRecords/per_page):1;
    let html='<div class="row"><div class="col-12"><ul class="pagination float-right"><li class="page-item'+(page<2?' disabled':'')+'"  data-page="-"><button class="page-link">Previous</button></li>';
    for(let i=1;i<=page_total;i++){
        html+='<li class="page-item'+(page==i?' active':'')+'" data-page="'+i+'"><button class="page-link">'+i+'</button></li>';
        if(((i%35)==0)&&((i+4)<page_total)){
            html+='<li class="page-item'+(page>=page_total?' disabled':'')+'"  data-page="+"><button class="page-link">Next</button></li></ul></div></div>';
            html+='<div class="row"><div class="col-12"><ul class="pagination float-right"><li class="page-item'+(page<2?' disabled':'')+'"  data-page="-"><button class="page-link">Previous</button></li>';
        }
    }
    html+='<li class="page-item'+(page>=page_total?' disabled':'')+'"  data-page="+"><button class="page-link">Next</button></li></ul></div></div>';
    return html;
}
function changeMachineNameBg(mode) {
    if(mode === 1) {
        jQuery("#display_machine_name").removeClass("machine-mode-zero").addClass("machine-mode-one");
    } else if(mode === 0) {
        jQuery("#display_machine_name").removeClass("machine-mode-one").addClass("machine-mode-zero");
    }
}

let harcoded_cm_ip_address = 0;
async function loadCMAddress() {
    let settings_values = await ipcRenderer.invoke('getStoreValue');

    harcoded_cm_ip_address = settings_values['cm_ip_address_input'];
    //console.log(settings_values);
}

const electron = require('electron');
const {ipcRenderer} = electron;
let machine_list = {};
let maintenance_ip_list = {};
let selected_machine = 0;
let logged_in_user = "";

jQuery(document).ready(function() {
    window.addEventListener('keydown', (e) => {
        const { key, altKey } = e;
        if (key === 'F4' && altKey) {
            e.preventDefault();
        }
        // if (altKey) {
        //     e.preventDefault();
        // }
    });

    $(document).on("input", ".float_positive", function(event)
    {
        this.value = this.value.replace(/[^0-9.]/g, '').replace('.', 'x').replace(/\./g,'').replace('x','.');
    });
    ipcRenderer.send("page:loaded");
    loadCMAddress();
    startTime();
    
    jQuery("a.nav-link").click(function() {
        if($(this).attr('id')=='btn-logout'){
            ipcRenderer.send("sendRequest", selected_machine,'logoutUser', {});
        }
        else{
            let link = jQuery(this).data("link");
            ipcRenderer.send("change:link", link);
        }
        return false;
    });
    jQuery("a.btn-footer").click( function() {
        let link = jQuery(this).data("link");
        ipcRenderer.send("change:link", link);
        return false;
    });
    addCommandButtonsListener();

});
$('.button-3d').on('mousedown',function (){
    console.log('mousedown 3d')
    let ele=$(this);
    ele.addClass('down')
    $(document).one('mouseup',function (){
        console.log('mouseup3d')
        ele.removeClass('down')
    })
})
$('.button-3d').on('touchstart',function (){
    console.log('touchstart 3d')
    let ele=$(this);
    ele.addClass('down')
    $(document).one('touchend',function (){
        console.log('touchend 3d')
        ele.removeClass('down')
    })
})
function addCommandButtonsListener(){
    $('.button-device-command').off('click')
    $('.button-device-command').on('click',function (){
        ipcRenderer.send("sendRequest", selected_machine,'sendDeviceCommand', {
            'deviceId':$(this).attr('data-device-id'),
            'command':$(this).attr('data-command'),
            'parameter1':$(this).attr('data-parameter1')
        });
    })
    $('.button-device-command-press-release').off('click')
    $('.button-device-command-press-release').on('click',function (){
        let device_id=$(this).attr('data-device-id');
        let command_start=$(this).attr('data-command-start');
        let command_end=$(this).attr('data-command-end');
        let parameter1=$(this).attr('data-parameter1');
        let started=$(this).attr('data-started');//data-started is not set in the gui
        let startedColor=$(this).attr('data-started-color');
        if(!startedColor){
            startedColor='#27e22b';
        }

        if(started==1){
            ipcRenderer.send("sendRequest", selected_machine,'sendDeviceCommand', {
                'deviceId':device_id,
                'command':command_end,
                'parameter1':parameter1
            });
            $(this).attr('data-started',0);
            $(this).css('background-color','darkgray');
        }
        else{
            ipcRenderer.send("sendRequest", selected_machine,'sendDeviceCommand', {
                'deviceId':device_id,
                'command':command_start,
                'parameter1':parameter1
            });
            $(this).attr('data-started',1);
            $(this).css('background-color',startedColor);
        }
    });
}

ipcRenderer.on("render:ip_list", function(e, ip_list_html, machine_list_from_server, maintenance_ip_list_from_server) {
    //console.log("IP List rendered : " + harcoded_cm_ip_address);
    jQuery("#ip_list_dropdown").html(ip_list_html);
    machine_list = machine_list_from_server;
    maintenance_ip_list = maintenance_ip_list_from_server;

    if(harcoded_cm_ip_address != 0 || harcoded_cm_ip_address !== "not_set") {
        jQuery("#ip_list_dropdown > option").each(function() {
            if(this.text === harcoded_cm_ip_address) {
                jQuery("#ip_list_dropdown > option").removeAttr("selected");
                let cmip_matched_value = jQuery(this).attr("value");
                jQuery("#ip_list_dropdown").val(cmip_matched_value).trigger("change");
            }
        });
    }
});

ipcRenderer.on("render:server_connected", function(e) {
    jQuery("#status-circle").css("color", "#32CD32");
});

ipcRenderer.on("render:server_disconnected", function(e) {
    jQuery("#status-circle").css("color", "#FF0000");
    //jQuery("#status-circle").css("color", "#000000");
});
ipcRenderer.on("getCommonStatus", function(e, data) {
    let disconnectedDeviceCounter = Number(data['disconnectedDeviceCounter']);
    if(disconnectedDeviceCounter != 0) {
        jQuery("#status-circle").css("color", "#FFBF00");
    }
    else {
        jQuery("#status-circle").css("color", "#32CD32");
    }

    let currentMachineMode=data['machineMode'];
    changeMachineNameBg(currentMachineMode)
    
    if(currentMachineMode==0){
        $('#global_button_manual_mode_active').show();
        $('#global_button_manual_mode_deactive').hide();
    }
    else if(currentMachineMode==1){
        $('#global_button_manual_mode_active').hide();
        $('#global_button_manual_mode_deactive').show();
    }
    else{
        $('#global_button_manual_mode_active').hide();
        $('#global_button_manual_mode_deactive').hide();
    }

    $('#header-alarm-id-1').hide();
    $('#header-alarm-id-40').css('background-color','#00FF00');
    $('#header-alarm-id-101').css('background-color','#00FF00');

    for(let i in data['activeAlarms']){
        let activeAlarm=data['activeAlarms'][i];
        if((activeAlarm['alarm_id']==1)&&(activeAlarm['alarm_type']==0)){
            $('#header-alarm-id-1').show();
        }
        if((activeAlarm['alarm_id']==40)&&(activeAlarm['alarm_type']==0)){
            $('#header-alarm-id-40').css('background-color','#FF0000');
        }
        if((activeAlarm['alarm_id']==101)&&(activeAlarm['alarm_type']==0)){
            $('#header-alarm-id-101').css('background-color','#FF0000');
        }
    }
});
ipcRenderer.on("link:changed", async function(e, ip_list_html, machine_list_from_server, selected_machine_from_server, maintenance_ip_list_from_server) {
    //console.log(machine_list_from_server);
    //console.log(selected_machine_from_server);
    let currentUser=await getCurrentUser();
    if((currentUser['role']>0)&&(currentUser['role']<4)){
        jQuery("#menu-maint").show();
        $('#global_mode_buttons_container').show();
    }
    else{
        jQuery("#menu-maint").hide();
        $('#global_mode_buttons_container').hide();
    }
    jQuery("#global_button_manual_mode_active").click( function() {
        $('#global_button_manual_mode_active').hide();
        ipcRenderer.send("sendRequest", selected_machine,'changeMode', {'mode':1});
    });
    jQuery("#global_button_manual_mode_deactive").click( function() {
        $('#global_button_manual_mode_deactive').hide();
        ipcRenderer.send("sendRequest", selected_machine,'changeMode', {'mode':0});
    });
    if(currentUser['role']>0){
        jQuery("#menu-login").hide();
        jQuery("#menu-logout").show();
    }
    else{
        jQuery("#menu-login").show();
        jQuery("#menu-logout").hide();
    }
    jQuery("#show-username").text(currentUser['name']);
    if(!jQuery.isEmptyObject(machine_list_from_server)) {
        selected_machine = selected_machine_from_server;
        machine_list = machine_list_from_server;
        maintenance_ip_list = maintenance_ip_list_from_server;
        jQuery("#ip_list_dropdown").html(ip_list_html);
        if(selected_machine != 0) {
            jQuery("#ip_list_dropdown").val(selected_machine_from_server).trigger("change");
        }
        else {
            jQuery("#display_machine_name").text("Select a machine");    
        }
    }
    else{
        ipcRenderer.send("connect:server");
        jQuery("#display_machine_name").text("Select a machine");
    }
});

//global functions
    async function getCurrentUser() {
        return await ipcRenderer.invoke('getCurrentUser');
    }

    async function loadAndGetDetailedActiveAlarmSettings() {
        let detailed_active_alarm_settings_value = await ipcRenderer.invoke('getSingleStoreValue', 'adta_detailed_active_alarm');

        if(detailed_active_alarm_settings_value === "1") {
            jQuery("#active_alarms_ticker_container").hide();
            jQuery("#active_alarms_details_table").show();
        }
        else {
            jQuery("#active_alarms_details_table").hide();
            jQuery("#active_alarms_ticker_container").show();
        }
    }
    let alarm_ticker = $('#alarm-ticker').newsTicker({
        row_height: 100,
        max_rows: 2,
        duration: 4000,
        pauseOnHover: 0
    });
    let old_tickers = [], new_tickers = [];
    function setActiveAlarms(machineId,activeAlarms,alarmsInfo){
        jQuery("#active_alarms_details_tbody").empty();
        let alarm_class_to_names = {"0" : "Error", "1" : "Warning", "2" : "Message"};
        if(!jQuery.isEmptyObject(activeAlarms)) {
            let now_time=moment().unix();
            new_tickers = [];
            let alarm_count = 0;
            for (let index in activeAlarms) {
                alarm_count++;
                if(alarm_count>5) break;
                let activeAlarm = activeAlarms[index];
                let combo_id=activeAlarm['machine_id']+'_'+activeAlarm['alarm_id']+'_'+activeAlarm['alarm_type'];
                let alarmInfo=alarmsInfo[combo_id];
                let date_active_timestamp=activeAlarm['date_active_timestamp'];

                let tr_html = '<tr>' +
                    '<td>' + timeConverter(date_active_timestamp) + '</td>'+
                    '<td>' + secondsToDhms(now_time-date_active_timestamp)+ '</td>'+
                    '<td>' + alarm_class_to_names[alarmInfo['alarm_class']] + '</td>'+
                    '<td>' + alarmInfo['location'] + '</td>'+
                    '<td>' + alarmInfo['description'] + '</td>'+
                    '<td>' + alarmInfo['variable_name'] + '</td>'+
                    '</tr>';

                jQuery("#active_alarms_details_tbody").append(tr_html);
                new_tickers.push(alarmInfo['description']);
                //console.log(alarmInfo)
                //console.log(activeAlarm)
            }
            if(new_tickers.sort().join(',') !== old_tickers.sort().join(',')) {
                old_tickers = [...new_tickers];

                alarm_ticker.newsTicker('pause');
                alarm_ticker.newsTicker('remove');
                let num = new_tickers.length;
                if(num == 1) alarm_ticker.newsTicker('add', new_tickers[0], "single-ticker")
                else new_tickers.forEach(elem => alarm_ticker.newsTicker('add', elem, ""));
                (num > 2) && alarm_ticker.newsTicker('unpause');
            }
        }
        else {
            let tr_html = '<tr><td colspan="6">No active alarm to display</td></tr>';
            jQuery("#active_alarms_details_tbody").append(tr_html);
            old_tickers = [];
            alarm_ticker.newsTicker('pause');
            alarm_ticker.newsTicker('remove');
        }
    }

    //general view
    function setTestButtonsStatus(ioOutputStates){
        if(ioOutputStates[selected_machine+"_49"] && ioOutputStates[selected_machine+"_49"]['state']==1){
            $("#btn-test-red-light").attr('data-started',1).css('background-color',$("#btn-test-red-light").attr('data-started-color'));
        }
        if(ioOutputStates[selected_machine+"_50"] && ioOutputStates[selected_machine+"_50"]['state']==1){
            $("#btn-test-amber-light").attr('data-started',1).css('background-color',$("#btn-test-amber-light").attr('data-started-color'));
        }
        if(ioOutputStates[selected_machine+"_51"] && ioOutputStates[selected_machine+"_51"]['state']==1){
            $("#btn-test-blue-light").attr('data-started',1).css('background-color',$("#btn-test-blue-light").attr('data-started-color'));
        }
    }
    function setBinsLabel(binsInfo,layoutNo){
        let num_bins=0;
        for(let key in binsInfo){
            if(binsInfo[key]['gui_bin_id']!="999"){
                if(parseInt(binsInfo[key]['gui_bin_id'])>num_bins){
                    num_bins=binsInfo[key]['gui_bin_id'];
                }
            }
        }
        let bin_width=0;
        if(num_bins>0){
            if(layoutNo=="5"){
                bin_width=Math.trunc(1120/Math.ceil(num_bins/2))
            }
            else{
                bin_width=Math.trunc(1500/Math.ceil(num_bins/2))
            }

        }
        for(let key in binsInfo){
            if(binsInfo[key]['gui_bin_id']>0){
                if(binsInfo[key]['gui_bin_id']!="999"){
                    let binIndex=(Math.ceil(binsInfo[key]['gui_bin_id']/2));
                    let posRect=0;
                    let posText=0;
                    if((layoutNo=="1")||(layoutNo=="3"))
                    {
                        posRect=201-1+(binIndex-1)*bin_width;
                    }
                    else if(layoutNo==5){
                        posRect=1280-(binIndex)*bin_width;
                    }
                    else {
                        posRect=1650-(binIndex)*bin_width;
                    }
                    posText=posRect-20+(bin_width/2);
                    $('.bin[gui-bin-id='+binsInfo[key]['gui_bin_id']+'] rect').attr('width',bin_width-10).attr('x',posRect)
                    $('.bin[gui-bin-id='+binsInfo[key]['gui_bin_id']+'] text').attr('x',posText);
                }
                $('.bin[gui-bin-id='+binsInfo[key]['gui_bin_id']+'] .bin-label').text(binsInfo[key].bin_label);
                $('.bin[gui-bin-id='+binsInfo[key]['gui_bin_id']+']').attr('bin-key',key).show();
            }
        }

    }
    function setBinsStates(machineId,binsStates,binsInfo){
        let bin_colors = {
            "1" : "#27e22b",
            "2" : "#27e22b",
            "3" : "#ffc000",
            "4" : "#cccccc",//#e6e7e8
            "5" : "#4d80ff",
            "6" : "#cccccc",//#e6e7e8
            "7" : "#ff0000",
            "8" : "#c55a11",
        };
        for(let bin_id in binsStates){
            $('.bin[bin-key='+machineId+'_'+bin_id+'] rect').css('fill',bin_colors[binsStates[bin_id]]);
        }
    }
    function setPhotoeyesLabel(inputsInfo){
        for(let key in inputsInfo){
            let inputInfo=inputsInfo[key];
            if(inputInfo.gui_input_id>0 && (inputInfo.input_type==0)&& (inputInfo.device_type==0)&& (inputInfo.device_number==0) ){
                $('.photoeye[gui-input-id='+inputInfo.gui_input_id+']').attr('input-id',inputInfo.input_id).attr('data-original-title',inputInfo.electrical_name+'<br>'+inputInfo.description).show();
            }
        }
    }
    function setPhotoeyesStates(machineId,inputsStates,inputsInfo){
        //console.log(inputsStates,inputsInfo)
        let input_colors = {"in-active" : "#39b54a", "active" : "#f7931e"};
        for(let key in inputsInfo){
            let inputInfo=inputsInfo[key];
            if((inputInfo['input_type']==0)&&(inputInfo['device_type']==0)&&(inputInfo['device_number']==0)&& (inputInfo['gui_input_id']>0)){
                let state='in-active'
                if(inputsStates[key]){
                    if(inputInfo['active_state']==inputsStates[key]['input_state']){
                        state='active'
                    }
                }
                $('.photoeye[input-id='+inputInfo["input_id"]+'] .status').css('fill',input_colors[state]);

            }
        }
    }
    function setConveyorsLabel(conveyorsInfo){
        for(let key in conveyorsInfo){
            let conveyorInfo=conveyorsInfo[key];
            if(conveyorInfo.gui_conveyor_id){
                $('.conveyor[gui-conveyor-id='+conveyorInfo.gui_conveyor_id+']').attr('conveyor-id',conveyorInfo.conveyor_id).attr('data-original-title',conveyorInfo.conveyor_name).show();
                $('.conveyor-bg[gui-conveyor-id='+conveyorInfo.gui_conveyor_id+']').show();
            }
        }
    }
    function setConveyorsStates(machineId,conveyorsStates,conveyorsInfo){
        let conveyor_colors = { "0" : "#ccc",  "1" : "#27e22b", "2" : "#ffc000", "3" : "red","4":"#87cefa"};
        for(let conveyor_id in conveyorsStates){
            //$('.conveyor[conveyor-id='+conveyor_id+'] .status').css('fill',conveyor_colors[conveyorsStates[conveyor_id]]);
            $('.conveyor[conveyor-id='+conveyor_id+'] .status').css('stroke',conveyor_colors[conveyorsStates[conveyor_id]]);
        }
    }
    function setDevicesLabel(devicesInfo){

        for(let key in devicesInfo){
            let deviceInfo=devicesInfo[key];
            if(deviceInfo['gui_device_id']>0 ){
                $('.device[gui-device-id='+deviceInfo["gui_device_id"]+']').attr('device-id',deviceInfo["device_id"]).attr('data-original-title',deviceInfo['device_name']+'<br>'+deviceInfo['ip_address']).show();
            }
        }
    }
    function setDevicesStates(machineId,devicesStates,devicesInfo){
        let device_colors = {"0" : "#f00", "1" : "#27e22b"};
        for(let key in devicesInfo){
            let deviceInfo=devicesInfo[key];
            if(deviceInfo['gui_device_id']>0 ){
                let state=0;
                if(devicesStates[key]){
                    state=devicesStates[key]['device_state'];
                }
                $('.device[device-id='+deviceInfo["device_id"]+'] .status').css('fill',device_colors[state]);

            }
        }
    }
    function setEstopsLabel(inputsInfo){
        for(let key in inputsInfo){
            let inputInfo=inputsInfo[key];
            if((inputInfo['input_type']==3) && inputInfo['gui_input_id']>0 &&  (inputInfo['device_type']==0) && (inputInfo['device_number']==0) ){
                $('.estop[gui-input-id='+inputInfo["gui_input_id"]+']').attr('input-id',inputInfo["input_id"]).attr('data-original-title',inputInfo['electrical_name']+'<br>'+inputInfo['description']).show();
            }
        }
    }
    function setEstopsStates(machineId,inputsStates,inputsInfo){
        //console.log(inputsStates,inputsInfo)
        let input_colors = {"in-active" : "#00ff00", "active" : "#ff0000"};
        for(let key in inputsInfo){
            let inputInfo=inputsInfo[key];
            if((inputInfo['input_type']==3) && inputInfo['gui_input_id']>0 &&  (inputInfo['device_type']==0) && (inputInfo['device_number']==0) ){
                let state='in-active'
                if(inputsStates[key]){
                    if(inputInfo['active_state']==inputsStates[key]['input_state']){
                     state='active'
                    }
                }
                $('.estop[input-id='+inputInfo["input_id"]+'] .status').css('fill',input_colors[state]);

            }
        }
    }
    function setMotorsLabel(motorsInfo){
        for(let key in motorsInfo){
            let motorInfo=motorsInfo[key];
            if(motorInfo['gui_motor_id']>0){
                $('.motor[gui-motor-id='+motorInfo["gui_motor_id"]+']').attr('motor-id',motorInfo["motor_id"]).attr('data-original-title',motorInfo['motor_name']+'<br>'+motorInfo['ip_address']+'<br>Loc: '+motorInfo['location']).show();
            }
        }
    }
    function setDoorsStates(machineId,inputsStates,doorsInfo){
        $('.door').hide();//hide all buttons
        for(let door_no in doorsInfo){
            let doorInfo=doorsInfo[door_no];
            let door_closed='in-active';
            let door_locked='in-active';
            let door_safe='in-active';
            if(doorInfo[1]){
                if(inputsStates[machineId+'_'+doorInfo[1]['input_id']]){
                    if(inputsStates[machineId+'_'+doorInfo[1]['input_id']]['input_state']==doorInfo[1]['active_state']){
                        door_closed='active';
                    }
                }
            }
            if(doorInfo[2]){
                if(inputsStates[machineId+'_'+doorInfo[2]['input_id']]){
                    if(inputsStates[machineId+'_'+doorInfo[2]['input_id']]['input_state']==doorInfo[2]['active_state']){
                        door_locked='active';
                    }
                }
            }
            if(doorInfo[3]){
                if(inputsStates[machineId+'_'+doorInfo[3]['input_id']]){
                    if(inputsStates[machineId+'_'+doorInfo[3]['input_id']]['input_state']==doorInfo[3]['active_state']){
                        door_safe='active';
                    }
                }
            }
            if(door_closed=='active'){
                if((door_locked=='in-active')&&(door_safe=='in-active')){
                    $('.door-lock[data-device-id='+(door_no-1+91)+']').show();
                }
                else{
                    $('.door-unlock[data-device-id='+(door_no-1+91)+']').show();
                }
            }
            else{
                $('.door-open[data-device-id='+(door_no-1+91)+']').show();
            }

        }
}
    function setStatisticsCounter(statistics_counter){
        if(statistics_counter.length>0){
            let shiftInfo=statistics_counter[0];
            let machine_errors = 0, non_machine_errors = 0
            Object.keys(shiftInfo).forEach(s_key => {
                if (['sc1', 'sc3', 'sc4', 'sc6', 'sc9', 'sc14', 'sc16', 'sc17', 'sc21'].includes(s_key)) {
                    machine_errors += Number(shiftInfo[s_key]);
                }
                if (['sc5', 'sc7', 'sc8', 'sc10', 'sc12', 'sc18'].includes(s_key)) {
                    non_machine_errors += Number(shiftInfo[s_key]);
                }
                // if (Object.keys(scs_data).includes(s_key)) {
                //     total_scs_value += data[s_key];
                //     scs_data[s_key].value = data[s_key];
                // }
            });

            let production_data = {
                total_read: {label: 'Total inducted', count: 0},
                sc0: {label: 'Total good diverts', count: 0},
                machine_error: {label: 'Total machine error packages', count: 0},
                non_machine_error: {label: 'Total non-machine error packages', count: 0},
            };
            production_data['total_read']['count'] = shiftInfo['total_read'];
            production_data['sc0']['count'] = shiftInfo['sc0'];
            production_data['machine_error']['count'] = machine_errors;
            production_data['non_machine_error']['count'] = non_machine_errors;
            $('#table_production tbody').empty();
            Object.keys(production_data).forEach(key => {
                let html = '<tr>' + '<td>' + production_data[key]['label'] + '</td>' +
                    '<td class="text-right">' + production_data[key]['count'] + '</td>' +
                    '<td class="text-right">' + (shiftInfo['total_read'] > 0 ? (production_data[key]['count'] * 100 / shiftInfo['total_read']).toFixed(2) : '0') + '%' + '</td>'
                    + '</tr>';
                $('#table_production tbody').append(html)
            });

            let scanner_data = {
                valid: {label: 'Good scan', count: 0},
                no_read: {label: 'No read', count: 0},
                no_code: {label: 'No code', count: 0},
                multiple_read: {label: 'Multiple read', count: 0},
            };
            scanner_data['valid']['count'] = shiftInfo['valid']
            scanner_data['no_read']['count'] = shiftInfo['no_read']
            scanner_data['no_code']['count'] = shiftInfo['no_code']
            scanner_data['multiple_read']['count'] = shiftInfo['multiple_read']

            $('#table_scanner tbody').empty();
            Object.keys(scanner_data).forEach(key => {
                let html = '<tr>' + '<td>' + scanner_data[key]['label'] + '</td>' +
                    '<td class="text-right">' + scanner_data[key]['count'] + '</td>' +
                    '<td class="text-right">' + (shiftInfo['total_read'] > 0 ? (scanner_data[key]['count'] * 100 / shiftInfo['total_read']).toFixed(2) : 0) + '%' + '</td>'
                    + '</tr>';
                $('#table_scanner tbody').append(html)
            });
        }

    }
    function setStatisticsOee(statistics_oee){
        if(statistics_oee.length>0){
            let oeeInfo=statistics_oee[0];
            let oee_data = {
                cal_availability: {label: 'Availability'},
                cal_quality: {label: 'Quality'},
                cal_performance: {label: 'Performance'},
                cal_oee: {label: 'OEE'},
            };

            oeeInfo['cal_availability']= (+oeeInfo['tot_sec_blocked']) + (+oeeInfo['tot_sec_estop']) + (+oeeInfo['tot_sec_fault']) + (+oeeInfo['tot_sec_run'])
            oeeInfo['cal_availability']= (+oeeInfo['cal_availability'])>0? ((+oeeInfo['tot_sec_run'])/oeeInfo['cal_availability']).toFixed(2):'0';
            oeeInfo['cal_quality']= (+oeeInfo['packages_inducted'])>0?((+oeeInfo['successful_divert_packages'])/(+oeeInfo['packages_inducted'])).toFixed(2):'0';
            oeeInfo['cal_performance']= (+oeeInfo['tot_sec_run'])>0?((+oeeInfo['packages_inducted']) * (+oeeInfo['max_3min_tput'])/(+oeeInfo['tot_sec_run'])).toFixed(2):'0';
            oeeInfo['cal_oee']= ((+oeeInfo['cal_availability']) * (+oeeInfo['cal_quality']) * (+oeeInfo['cal_performance'])).toFixed(2)

            $('#table_oee tbody').empty();
            Object.keys(oee_data).forEach(key => {
                let html = '<tr>' + '<td>' + oee_data[key]['label'] + '</td>' +
                    '<td class="text-right">' + oeeInfo[key] + '</td>' +
                    + '</tr>';
                $('#table_oee tbody').append(html)
            });
        }
    }


