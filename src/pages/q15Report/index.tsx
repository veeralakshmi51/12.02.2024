import React, { useState, useEffect, useRef } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import Rectangle6215 from './../../assets/images/Rectangle 6215.png';
import axios from "axios";
import { Autocomplete, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField, SelectChangeEvent, } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getAllPatient, getAllStaff } from "../../slices/thunk";
import { Button } from "primereact/button";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { HttpLogin } from "../../utils/Http";
import moment from 'moment';

export default function ControlledAccordions() {

    const dispatch = useDispatch()
    const org = useSelector((state: any) => state.Login.organization)
    const { patientData } = useSelector((state: any) => state.Patient);
    const { staffData } = useSelector((state: any) => state.Staff);
    let [addCalendarDate, setAddCalendarDate] = useState(new Array<any>());
    let [tableData, setTableData] = useState(new Array<any>());
    const [report, setReport] = React.useState<any>(null)
    const [date, setDate] = React.useState("")
    const [date1, setDate1] = React.useState("")
    // const [q15Date, setQ15Date] = React.useState("")
    const [q15Date, setQ15Date] = React.useState<Date | null>(null);
    let [data, setData] = useState(new Array<any>());
    let [getStaffData, setStaffData] = useState(new Array<any>());
    let [calendarDate, setCalendarDate] = React.useState(new Date());
    const formattedDate = date || new Date().toISOString().slice(0, 10).replace(/-/g, "");
    let [newTimeSlot, setNewTimeSlot] = useState(new Array<any>());   
    const addInputData = {
        shiftIncharge: "",
        criteria: "",
        patientName: "",
        slot: "",
        shift: "",
        startDate: null,
        endDate: null
    }

    function removeDuplicates(arr: any[]) {
        return arr.filter((item,
            index) => arr.indexOf(item) === index);
    }

    let [newInputData, setNewInputData] = useState(addInputData);
    let [addNurseIncharge, setAddNurseIncharge] = useState("");
    let [addEnteredBy, setAddEnteredBy] = useState("");
    let [addNewStaff, setAddNewStaff] = useState(new Array<any>());
    let [addPatientName, setAddPatientName] = useState("");
    let [addNewPatient, setAddNewPatient] = useState(new Array<any>());
    let [loginStaff, setLoginStaff] = useState("");
   
    function formatDate(epoch: any) {
        let d = new Date(epoch);      
        let hours = String((d.getHours())).padStart(2, '0');
        let mins = String((d.getMinutes())).padStart(2, '0');

        return `${hours}:${mins}`;
    }
    useEffect(() => {
        console.log(JSON.stringify(window.localStorage.getItem("LoginData")));

        HttpLogin.axios().get("api/org/getById/" + org)
            .then((res) => {
                if (res.data.message.code === "MHC - 0200") {
                    var newResult = res.data.data.shift.startTime !== "" ? res.data.data.shift.startTime : "08:00"
                    const createTimeSlots = (fromTime: string, toTime: string, slotLength = 15 * 60) => {
                        let slotStart = new Date(fromTime).valueOf();
                        let slotEnd = new Date(fromTime).valueOf() + slotLength * 1000;
                        let endEpoch = new Date(toTime).valueOf();
                        let ob = [];
                        for (slotEnd; slotEnd <= endEpoch; slotEnd = slotEnd + slotLength * 1000) {
                            ob.push(formatDate(slotStart));
                            slotStart = slotEnd;
                        }

                        return ob;
                    }


                    const from = "2022-05-25 " + newResult;
                    const to = "2022-05-26 " + newResult;
                    const slotLength = 15 * 60; //seconds             
                    var r = createTimeSlots(from, to, slotLength);
                    console.log(JSON.stringify(r));
                    setNewTimeSlot(r);
                    
                } else {

                }
            })

       setNewInputData({ ...newInputData });
        var from = newInputData.startDate !== null ? new Date(newInputData.startDate) : new Date();
       
        var dayCalendar = [];

        dayCalendar.push(moment(new Date(from.setDate(from.getDate()))).format("YYYYMMDD"));
        setAddCalendarDate(dayCalendar);  
        
    }, []);

    React.useEffect(() => {
        getAllPatient(dispatch, org);
        getAllStaff(dispatch, org);
    }, [dispatch])

    React.useEffect(() => {
        setAddNewPatient(patientData !== null && patientData !== undefined && patientData);
        setData(patientData !== null && patientData !== undefined && patientData.map((k: any) => { return k.basicDetails[0].name[0].given + " " + k.basicDetails[0].name[0].family }))
    }, [patientData])

    React.useEffect(() => {
        let newLoginstaff = staffData !== null && staffData !== undefined && staffData.filter((t: any) => ((t.role === "Social Workers" || t.role === "Registered Nurses" || t.role === "Nurse Practitioner")&&(t.id === window.localStorage.getItem("LoginData")))) 
        console.log(JSON.stringify(newLoginstaff));
        if(newLoginstaff.length>0){
            setLoginStaff(newLoginstaff[0].name[0].given + " " + newLoginstaff[0].name[0].family);
            console.log(JSON.stringify(newLoginstaff[0].name[0].given + " " + newLoginstaff[0].name[0].family))
        }
        setAddNewStaff(staffData !== null && staffData !== undefined && staffData.filter((t: any) => t.role === "Social Workers" || t.role === "Registered Nurses" || t.role === "Nurse Practitioner"));
        setStaffData(staffData !== null && staffData !== undefined && staffData.filter((t: any) => t.role === "Social Workers" || t.role === "Registered Nurses" || t.role === "Nurse Practitioner").map((k: any) => { return k.name[0].given + " " + k.name[0].family }))
    }, [staffData])

    if (newInputData.endDate === null && newInputData.startDate !== null) {
        var newFromDate = moment(newInputData.startDate).format("YYYYMMDD");
        var newToDate = moment(new Date()).format("YYYYMMDD");
        HttpLogin.axios().get("/api/config/getByDateRange?startDate=" + newFromDate + "&endDate=" + newToDate)
            .then((response) => {
                if (response.data.data !== null && response.data.data !== undefined) {                        
                    setTableData(response.data.data);
                }

            })
    } else if (newInputData.endDate !== null && newInputData.startDate !== null) {
        var newFromDate = moment(newInputData.startDate).format("YYYYMMDD");
        var newToDate = moment(newInputData.endDate).format("YYYYMMDD");
        HttpLogin.axios().get("/api/config/getByDateRange?startDate=" + newFromDate + "&endDate=" + newToDate)
            .then((response) => {
                if (response.data.data !== null && response.data.data !== undefined) {                  
                    setTableData(response.data.data);
                }

            })
    } else if (newInputData.endDate === null && newInputData.startDate === null) {
        HttpLogin.axios().get("/api/config/getByDate/" + addCalendarDate[0])
            .then((response) => {
                 
                if (response.data.data !== undefined && response.data.data !== null) {
                    setTableData(response.data.data);
                }
            })
    }
  
  
   
    const handleDateChange = (event: any) => {
        newInputData.startDate = event;
        setNewInputData({ ...newInputData });       
        var from = newInputData.startDate !== null ? new Date(newInputData.startDate) : new Date(calendarDate.getFullYear(), calendarDate.getMonth(), calendarDate.getDate());
        let dayCalendar = [];
        var to = newInputData.endDate !== null ? new Date(newInputData.endDate) : new Date(calendarDate.getFullYear(), calendarDate.getMonth(), calendarDate.getDate());
        for (var day = from; day <= to; day.setDate(day.getDate() + 1)) {
            dayCalendar.push(moment(new Date(day)).format("YYYYMMDD"));
        }
        setAddCalendarDate(removeDuplicates(dayCalendar));
    }

    const handleNewDateChange = (event: any) => {
        newInputData.endDate = event;
        setNewInputData({ ...newInputData });

        var from = newInputData.startDate !== null ? new Date(newInputData.startDate) : new Date();
        var dayCalendar = [];
        var to = newInputData.endDate !== null ? new Date(newInputData.endDate) : new Date(calendarDate.getFullYear(), calendarDate.getMonth(), calendarDate.getDate());

        for (var day = from; day <= to; day.setDate(day.getDate() + 1)) {

            dayCalendar.push(moment(new Date(day)).format("YYYYMMDD"));
        }
        setAddCalendarDate(removeDuplicates(dayCalendar));

    }    
   

    const [expanded, setExpanded] = React.useState<string | false>('panel1');
    const [newExpanded, setNewExpanded] = React.useState<string | false>('panel11');
    const [newAddExpanded, setNewAddExpanded] = React.useState<string | false>('Shift A');


    const handleChange =
        (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
            setExpanded(newExpanded ? panel : false);
        };

    const handleNewChange =
        (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
            setNewExpanded(newExpanded ? panel : false);
        };

    const handleNewAddChange =
        (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
            setNewAddExpanded(newExpanded ? panel : false);
        };

    const handleChanges = (event: SelectChangeEvent) => {
        if (event.target.name === "shift") {
            newInputData.shift = event.target.value;
            if (event.target.value !== "") {
                setNewAddExpanded(event.target.value);
            }
        } else if (event.target.name === "shiftIncharge") {
            newInputData.shiftIncharge = event.target.value;
            var newTableData = (tableData.map((k) => {
                var sureData = "";
                if (k.shiftIncharge.shiftInchargeA === event.target.value && sureData === 'Shift A') {
                    setNewAddExpanded('Shift A');
                    return k;
                } else if (k.shiftIncharge.shiftInchargeB === event.target.value && sureData === 'Shift B') {
                    setNewAddExpanded('Shift B');
                    return k;
                } else if (k.shiftIncharge.shiftInchargeC === event.target.value && sureData === 'Shift C') {
                    setNewAddExpanded('Shift C');
                    return k;
                } else {
                    setNewAddExpanded('Shift A');
                    return k;
                }
            }))
            setTableData(newTableData);

        } else if (event.target.name === "criteria") {
            newInputData.criteria = event.target.value;
        } else if (event.target.name === "patientName") {
            newInputData.patientName = event.target.value;
            var newTableData = (tableData.map((k) => {
                if (k.pid === event.target.value) {
                    return k;
                } else {
                    return k;
                }
            }))
            setTableData(newTableData);
        } else if (event.target.name === "q15Slot") {
            newInputData.slot = event.target.value;
        }     
        setNewInputData({ ...newInputData });
        setNewExpanded('panel11');
        event.preventDefault();
    }

    const handlePrint = () => {
        console.log(JSON.stringify(tableData));
        let printContents = document.getElementById('q15Reports')!.innerHTML;
        let originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        // window.location.reload();
    }
    
    return (
        <div className="row d-flex flex-column" style={{ width: "100%" }}>
            <div className="row" style={{ paddingLeft: "25px", display: 'block' }}> <span style={{ fontSize: '22px', fontWeight: 600 }}>Q15 Report</span><button className="btn btn-primary" style={{ width: 'fit-content', float: 'right' }} onClick={handlePrint}>Print</button>
            </div>
            <div className="row" style={{ padding: "40px" }}>
                <div className="col-md-2 h-100 d-flex flex-column" style={{ backgroundColor: '#EAF2FA', borderRadius: "5px" }}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker className="m-3" label="Start Date" value={newInputData.startDate}
                            onChange={(e) => { handleDateChange(e) }} />
                        <DatePicker className="m-3" label="End Date" value={newInputData.endDate}
                            onChange={(e) => { handleNewDateChange(e) }} />
                    </LocalizationProvider>                    
                    <FormControl className="m-3" variant="outlined">
                        <InputLabel color="primary" ><span >Shift
                        </span></InputLabel>
                        <Select color="primary" size="medium" label="Shift" name="shift"
                            value={newInputData.shift} onChange={handleChanges}
                        >
                            <MenuItem value=""><em>None</em></MenuItem>
                            <MenuItem value="Shift A">Shift A</MenuItem>
                            <MenuItem value="Shift B">Shift B</MenuItem>
                            <MenuItem value="Shift C">Shift C</MenuItem>
                        </Select>
                        <FormHelperText />
                    </FormControl>                   
                    <FormControl className="m-3" variant="outlined">
                        <InputLabel color="primary" ><span >Slot
                        </span></InputLabel>
                        <Select color="primary" size="medium" label="Slot" name="q15Slot"
                            value={newInputData.slot} onChange={handleChanges}
                        >
                            <MenuItem value="1">Nurse Incharge</MenuItem>
                            <MenuItem value="2">Social Worker</MenuItem>
                            <MenuItem value="3">Start Date</MenuItem>
                            <MenuItem value="1">End Date</MenuItem>
                            <MenuItem value="2">Patient</MenuItem>
                            <MenuItem value="3">Slot</MenuItem>
                            <MenuItem value="3">Shift</MenuItem>
                        </Select>
                        <FormHelperText />
                    </FormControl>                  
                    <Autocomplete
                        className="m-3"
                        id="criteria"
                        options={data}
                        getOptionLabel={(option) => option}
                        value={addPatientName}
                        onChange={(e, v) => {
                            setAddPatientName(v);
                            let newPatientData = addNewPatient.filter((m:any)=>m.basicDetails[0].name[0].given + " " + m.basicDetails[0].name[0].family === v).map((k)=>{return k.id});
                            newInputData.patientName = newPatientData[0];
                            setNewInputData({ ...newInputData }); 
                            }}
                        sx={{ width: "82%" }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                label="patient name"
                                placeholder="patient name"
                                margin="none"
                                fullWidth
                            />
                        )}
                    />                    
                    <Autocomplete
                        className="m-3"
                        id="criteria"
                        options={getStaffData}
                        disabled = {loginStaff.length>0}
                        getOptionLabel={(option) => option}
                        value={loginStaff.length>0?loginStaff:addNurseIncharge}
                        onChange={(e, v) => {
                            addNurseIncharge = v;
                            setAddNurseIncharge(v); 
                            let newStaffData = addNewStaff.filter((m:any)=>m.name[0].given + " " + m.name[0].family === v).map((k)=>{return k.id});
                            newInputData.shiftIncharge = newStaffData[0];
                            setNewInputData({ ...newInputData });
                        }}
                        sx={{ width: "82%" }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                label="Nurse Incharge"
                                placeholder="Nurse Incharge"
                                margin="none"
                                fullWidth
                            />
                        )}
                    />
                    <Autocomplete
                        className="m-3"
                        id="criteria"
                        options={getStaffData}
                        disabled = {loginStaff.length>0}
                        getOptionLabel={(option) => option}
                        value={loginStaff.length>0?loginStaff:addEnteredBy}
                        onChange={(e, v) => { 
                            addEnteredBy = v;
                            setAddEnteredBy(v);
                            let newStaffData = addNewStaff.filter((m:any)=>m.name[0].given + " " + m.name[0].family === v).map((k)=>{return k.id});
                            newInputData.criteria = newStaffData[0];
                            setNewInputData({ ...newInputData }); }}
                        sx={{ width: "82%" }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                label="Entered By"
                                placeholder="Entered By"
                                margin="none"
                                fullWidth
                            />
                        )}
                    />                    
                    {/* <Button label="Search" style={{ backgroundColor: '#0f3995', marginBottom: "14px" }}  /> */}
                </div>
                <div className="col-md-10">
                    {addCalendarDate !== undefined && addCalendarDate !== null && addCalendarDate.length !== 0 ? addCalendarDate.map((u: any) => (
                        <Accordion expanded={expanded === 'panelmain' + u} onChange={handleChange('panelmain' + u)}>
                            <AccordionSummary style={{ backgroundColor: "#FFF" }} aria-controls="panel1d-content" id="panel1d-header">
                                <Typography style={{ backgroundColor: "#FFF" }}> <span style={{ fontFamily: "poppins", fontSize: "18px", fontStyle: "normal", fontWeight: 600, lineHeight: "normal" }}>{moment(u).format("MMM DD, YYYY")}</span>

                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails >
                                <Typography >
                                    {tableData !== null && tableData !== undefined && tableData.filter(j => u === moment(j.q15Date).format("YYYYMMDD")).length > 0 ? (tableData !== null && tableData !== undefined && tableData.filter(j => u === moment(j.q15Date).format("YYYYMMDD") && (newInputData.shiftIncharge === "" ||
                                        j.shiftIncharge.shiftInchargeA === newInputData.shiftIncharge || j.shiftIncharge.shiftInchargeB === newInputData.shiftIncharge || j.shiftIncharge.shiftInchargeC === newInputData.shiftIncharge) &&
                                        (newInputData.patientName === "" || newInputData.patientName === j.pid) && (newInputData.criteria === "" || newInputData.criteria === j.enteredBy.shiftA.slot1 || newInputData.criteria === j.enteredBy.shiftA.slot2 ||
                                            newInputData.criteria === j.enteredBy.shiftA.slot3 || newInputData.criteria === j.enteredBy.shiftA.slot4 || newInputData.criteria === j.enteredBy.shiftB.slot1 || newInputData.criteria === j.enteredBy.shiftB.slot2
                                            || newInputData.criteria === j.enteredBy.shiftB.slot3 || newInputData.criteria === j.enteredBy.shiftB.slot4 || newInputData.criteria === j.enteredBy.shiftC.slot1 || newInputData.criteria === j.enteredBy.shiftC.slot2
                                            || newInputData.criteria === j.enteredBy.shiftC.slot3 || newInputData.criteria === j.enteredBy.shiftC.slot4)).map((l: any) => (
                                                <Accordion style={{ borderStyle: "none" }} expanded={newExpanded === 'panel11'} onChange={handleNewChange('panel11')}>
                                                    <AccordionSummary style={{ backgroundColor: "#FFF" }} expandIcon={false} aria-controls="panel11d-content" id="panel11d-header">
                                                        <Typography style={{ width: "-webkit-fill-available" }}>

                                                            <div>
                                                                <span style={{ color: "#000", fontFamily: "poppins", fontSize: "16px", fontStyle: "normal", fontWeight: 600, lineHeight: "normal", position: 'relative', top: '-14px' }}>Shift Incharge: {newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeB !== "" && newAddExpanded === 'Shift B' && staffData.filter((i: any) => i.id === l.shiftIncharge.shiftInchargeC).map((tableData: any) => { return tableData.name[0].given + " " + tableData.name[0].family.charAt(0, 2) }) ||
                                                                    newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeC !== "" && newAddExpanded === 'Shift C' && staffData.filter((i: any) => i.id === l.shiftIncharge.shiftInchargeC).map((tableData: any) => { return tableData.name[0].given + " " + tableData.name[0].family.charAt(0, 2) }) ||
                                                                    newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "" && newAddExpanded === 'Shift A' && staffData.filter((i: any) => i.id === l.shiftIncharge.shiftInchargeA).map((tableData: any) => { return tableData.name[0].given + " " + tableData.name[0].family.charAt(0, 2) }) ||
                                                                    newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeB && l.shiftIncharge.shiftInchargeB !== "" && newAddExpanded === 'Shift B' && staffData.filter((i: any) => i.id === l.shiftIncharge.shiftInchargeB && i.id === newInputData.shiftIncharge).map((tableData: any) => { return tableData.name[0].given + " " + tableData.name[0].family.charAt(0, 2) }) ||
                                                                    newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeC && l.shiftIncharge.shiftInchargeC !== "" && newAddExpanded === 'Shift C' && staffData.filter((i: any) => i.id === l.shiftIncharge.shiftInchargeC && i.id === newInputData.shiftIncharge).map((tableData: any) => { return tableData.name[0].given + " " + tableData.name[0].family.charAt(0, 2) }) ||
                                                                    newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "" && newAddExpanded === 'Shift A' && staffData.filter((i: any) => i.id === l.shiftIncharge.shiftInchargeA && i.id === newInputData.shiftIncharge).map((tableData: any) => { return tableData.name[0].given + " " + tableData.name[0].family.charAt(0, 2) }) ||
                                                                    staffData.filter((m: any) => m.id === newInputData.shiftIncharge && newInputData.shiftIncharge !== "" && newInputData.shiftIncharge !== l.shiftIncharge.shiftInchargeB && newInputData.shiftIncharge !== l.shiftIncharge.shiftInchargeC && newInputData.shiftIncharge !== l.shiftIncharge.shiftInchargeA).map((m: any) => { return "--" }) && "--"}</span>
                                                                <div className="bedorgForm-fields" style={{ zIndex: 1, top: "-15px", display: "flex", flexDirection: "row-reverse", left: "unset", right: "-1px", width: "250px" }}>

                                                                    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                                                                        <InputLabel id="demo-select-small-label">Shift A</InputLabel>
                                                                        <Select
                                                                            labelId="demo-select-small-label"
                                                                            id="shift" name="shift"
                                                                            value={newInputData.shift}
                                                                            label="Shift"
                                                                            onChange={handleChanges}
                                                                        >
                                                                            <MenuItem value=""><em>None</em></MenuItem>
                                                                            <MenuItem value="Shift A">Shift A</MenuItem>
                                                                            <MenuItem value="Shift B">Shift B</MenuItem>
                                                                            <MenuItem value="Shift C">Shift C</MenuItem>
                                                                        </Select>
                                                                    </FormControl>
                                                                    <span style={{ position: "relative", top: "20px" }}>Select Shift:</span>
                                                                </div>
                                                                <div style={{ position: 'relative', width: '100%', top: '18px', left: '-10px' }}>
                                                                    <Accordion style={{ borderStyle: "none", top: '-12px' }} expanded={newAddExpanded === 'Shift A'} onChange={handleNewAddChange('Shift A')}>
                                                                        <AccordionSummary style={{ backgroundColor: "#F7FAFE", borderRadius: '6px' }} aria-controls="panel11Ad-content" id="panel11Ad-header">
                                                                            <Typography >
                                                                                <span style={{ fontFamily: "poppins", color: "#000", fontSize: "14px", fontStyle: "normal", fontWeight: 600, lineHeight: "normal", position: "relative", top: "0px" }}>Shift A:
                                                                                    <span style={{ fontFamily: "poppins", color: "#000", fontSize: "14px", fontStyle: "normal", fontWeight: 500, lineHeight: "normal" }}>{newTimeSlot[0]} {newTimeSlot[0] >= "12:00" && newTimeSlot[0]<= "23:45"?"PM":"AM"} to {newTimeSlot[31]} {newTimeSlot[31] >= "12:00" && newTimeSlot[31]<= "23:45"?"PM":"AM"}</span>
                                                                                </span>
                                                                                <div style={{ position: "absolute", left: "unset", whiteSpace: "nowrap", right: "90px", top: "12px", width: "131px", display: "flex", gap: "7px" }}>
                                                                                    <img src={Rectangle6215}></img>
                                                                                    <div style={{}}>Patient: {patientData.filter((i: any) => i.id === l.pid).map((tableData: any) => { return tableData.basicDetails[0].name[0].given + " " + tableData.basicDetails[0].name[0].family.charAt(0, 2) })}</div>
                                                                                </div>
                                                                            </Typography>
                                                                        </AccordionSummary>
                                                                        <AccordionDetails style={{ backgroundColor: "#F7FAFE", borderBottomLeftRadius: '6px', borderBottomRightRadius: '6px' }}>
                                                                            <Typography style={{ height: "448px", backgroundColor: "#F7FAFE", cursor: 'auto' }}>
                                                                                <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                                                                                    <div style={{ width: "155px", fontFamily: "poppins", fontSize: "14px", fontWeight: 500, color: "#000", lineHeight: "normal" }}>{newTimeSlot[0]} {newTimeSlot[0] >= "12:00" && newTimeSlot[0]<= "23:45"?"PM":"AM"} to {newTimeSlot[7]} {newTimeSlot[7] >= "12:00" && newTimeSlot[7]<= "23:45"?"PM":"AM"}:

                                                                                        <div style={{ position: "absolute", left: "unset", top: "137px", width: "131px", display: "flex", gap: "7px", whiteSpace: "nowrap" }}>
                                                                                            <div style={{ position: "relative", top: "5px", width: "fit-contant" }}>Entered By:</div>
                                                                                            <img src={Rectangle6215}></img>
                                                                                            <div style={{ fontFamily: "poppins", fontSize: "13px", fontWeight: 400, color: "#000", lineHeight: "normal", position: "relative", top: "5px" }}>{((newInputData.criteria === "" && l.enteredBy.shiftA.slot1 !== "" && l.enteredBy.shiftA.slot1 !== null) && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "") && staffData.filter((i: any) => i.id === l.enteredBy.shiftA.slot1).map((tableData: any) => { return tableData.name[0].given + " " + tableData.name[0].family.charAt(0, 2) })) ||
                                                                                                ((newInputData.criteria !== "" && l.enteredBy.shiftA.slot1 !== "" && l.enteredBy.shiftA.slot1 !== null && l.enteredBy.shiftA.slot1 === newInputData.criteria) && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "") && staffData.filter((i: any) => i.id === l.enteredBy.shiftA.slot1).map((tableData: any) => { return tableData.name[0].given + " " + tableData.name[0].family.charAt(0, 2) })) ||
                                                                                                staffData.filter((m: any) => m.id === newInputData.criteria && newInputData.criteria !== "" && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "") && newInputData.criteria !== l.enteredBy.shiftA.slot1).map((m: any) => { return "--" }) && "--"}</div>
                                                                                        </div>
                                                                                    </div>
                                                                                    {newTimeSlot !== null && newTimeSlot !== undefined && newTimeSlot.length>0 &&newTimeSlot.map((s:any,t:number)=>{
                                                                                        return t >= 0 && t<=7 && (<div style={{ display: "flex", gap: "10px", flexDirection: "column", width: "60px", height: "73px", border: "1px solid", borderRadius: "4px" }}>
                                                                                        <span style={{ textAlign: "center", color: " #415F9E", fontFamily: "poppins", fontSize: "15px", fontStyle: "normal", fontWeight: 600, lineHeight: "normal" }}>{newTimeSlot[t]} </span>
                                                                                        <span style={{ textAlign: "center", border: "1px solid #E3E8F1", width: "45px", position: "relative", left: "7px" }}></span>
                                                                                        <span style={{ textAlign: "center", color: " #5E7494", fontFamily: "poppins", fontSize: "16px", fontStyle: "normal", fontWeight: 600, lineHeight: "130%", letterSpacing: "0.016px" }} >{l.data.filter((m: any) => m.q15Time === newTimeSlot[t].replace(/:/g,'')+"-"+newTimeSlot[t+1].replace(/:/g,'') && m.location !== "" && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "")).length > 0 ? l.data.filter((m: any) => m.q15Time === newTimeSlot[t].replace(/:/g,'')+"-"+newTimeSlot[t+1].replace(/:/g,'') && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "")).map((n: any) => { return n.location }) : "NA"}-{l.data.filter((m: any) => m.q15Time === newTimeSlot[t].replace(/:/g,'')+"-"+newTimeSlot[t+1].replace(/:/g,'') && m.activity !== "" && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "")).length > 0 ? l.data.filter((m: any) => m.q15Time === newTimeSlot[t].replace(/:/g,'')+"-"+newTimeSlot[t+1].replace(/:/g,'') && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "")).map((n: any) => { return n.activity }) : "NA"}</span>
                                                                                    </div>)
                                                                                    })}                                                                                  
                                                                                </div>
                                                                                <span style={{ textAlign: "center", border: "1px solid ", position: "relative", left: "7px", display: "flex", width: "calc(100% - 11px)", top: "31px", borderColor: "#E3E8F1" }}></span>
                                                                                <div style={{ display: "flex", justifyContent: "space-evenly", position: "relative", top: "46px" }}>
                                                                                    <div style={{ width: "155px", fontFamily: "poppins", fontSize: "14px", fontWeight: 500, color: "#000", lineHeight: "normal" }}>{newTimeSlot[8]} {newTimeSlot[8] >= "12:00" && newTimeSlot[8]<= "23:45"?"PM":"AM"} to {newTimeSlot[15]} {newTimeSlot[15] >= "12:00" && newTimeSlot[15]<= "23:45"?"PM":"AM"}:

                                                                                        <div style={{ position: "absolute", left: "unset", top: "70px", width: "131px", display: "flex", gap: "7px", whiteSpace: "nowrap" }}>
                                                                                            <div style={{ position: "relative", top: "4px", width: "fit-contant" }}>Entered By:</div>
                                                                                            <img src={Rectangle6215}></img>
                                                                                            <div style={{ fontFamily: "poppins", fontSize: "13px", fontWeight: 400, color: "#000", lineHeight: "normal", position: "relative", top: "5px" }}>{((newInputData.criteria === "" && l.enteredBy.shiftA.slot2 !== "" && l.enteredBy.shiftA.slot2 !== null) && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "") && staffData.filter((i: any) => i.id === l.enteredBy.shiftA.slot2).map((tableData: any) => { return tableData.name[0].given + " " + tableData.name[0].family.charAt(0, 2) })) ||
                                                                                                ((newInputData.criteria !== "" && l.enteredBy.shiftA.slot2 !== "" && l.enteredBy.shiftA.slot2 !== null && l.enteredBy.shiftA.slot2 === newInputData.criteria) && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "") && staffData.filter((i: any) => i.id === l.enteredBy.shiftA.slot2).map((tableData: any) => { return tableData.name[0].given + " " + tableData.name[0].family.charAt(0, 2) })) ||
                                                                                                staffData.filter((m: any) => m.id === newInputData.criteria && newInputData.criteria !== "" && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "") && newInputData.criteria !== l.enteredBy.shiftA.slot2).map((m: any) => { return "--" }) && "--"}</div>
                                                                                        </div>
                                                                                    </div>
                                                                                    {newTimeSlot !== null && newTimeSlot !== undefined && newTimeSlot.length>0 &&newTimeSlot.map((s:any,t:number)=>{
                                                                                        return t >= 8 && t<=15 && (<div style={{ display: "flex", gap: "10px", flexDirection: "column", width: "60px", height: "73px", border: "1px solid", borderRadius: "4px" }}>
                                                                                        <span style={{ textAlign: "center", color: " #415F9E", fontFamily: "poppins", fontSize: "15px", fontStyle: "normal", fontWeight: 600, lineHeight: "normal" }}>{newTimeSlot[t]} </span>
                                                                                        <span style={{ textAlign: "center", border: "1px solid #E3E8F1", width: "45px", position: "relative", left: "7px" }}></span>
                                                                                        <span style={{ textAlign: "center", color: " #5E7494", fontFamily: "poppins", fontSize: "16px", fontStyle: "normal", fontWeight: 600, lineHeight: "130%", letterSpacing: "0.016px" }} >{l.data.filter((m: any) => m.q15Time === newTimeSlot[t].replace(/:/g,'')+"-"+newTimeSlot[t+1].replace(/:/g,'') && m.location !== "" && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "")).length > 0 ? l.data.filter((m: any) => m.q15Time === newTimeSlot[t].replace(/:/g,'')+"-"+newTimeSlot[t+1].replace(/:/g,'') && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "")).map((n: any) => { return n.location }) : "NA"}-{l.data.filter((m: any) => m.q15Time === newTimeSlot[t].replace(/:/g,'')+"-"+newTimeSlot[t+1].replace(/:/g,'') && m.activity !== "" && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "")).length > 0 ? l.data.filter((m: any) => m.q15Time === newTimeSlot[t].replace(/:/g,'')+"-"+newTimeSlot[t+1].replace(/:/g,'') && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "")).map((n: any) => { return n.activity }) : "NA"}</span>
                                                                                    </div>)
                                                                                    })}        
                                                                                </div>
                                                                                <span style={{ textAlign: "center", border: "1px solid", position: "relative", left: "7px", display: "flex", width: "calc(100% - 11px)", top: "75px", borderColor: "#E3E8F1" }}></span>
                                                                                <div style={{ display: "flex", justifyContent: "space-evenly", position: "relative", top: "86px" }}>
                                                                                    <div style={{ width: "155px", fontFamily: "poppins", fontSize: "14px", fontWeight: 500, color: "#000", lineHeight: "normal" }}>{newTimeSlot[16]} {newTimeSlot[16] >= "12:00" && newTimeSlot[16]<= "23:45"?"PM":"AM"} to {newTimeSlot[23]} {newTimeSlot[23] >= "12:00" && newTimeSlot[23]<= "23:45"?"PM":"AM"}:

                                                                                        <div style={{ position: "absolute", left: "unset", top: "70px", width: "131px", display: "flex", gap: "7px", whiteSpace: "nowrap" }}>
                                                                                            <div style={{ position: "relative", top: "5px", width: "fit-contant" }}>Entered By:</div>
                                                                                            <img src={Rectangle6215}></img>
                                                                                            <div style={{ fontFamily: "poppins", fontSize: "13px", fontWeight: 400, color: "#000", lineHeight: "normal", position: "relative", top: "5px" }}>{((newInputData.criteria === "" && l.enteredBy.shiftA.slot3 !== "" && l.enteredBy.shiftA.slot3 !== null) && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "") && staffData.filter((i: any) => i.id === l.enteredBy.shiftA.slot3).map((tableData: any) => { return tableData.name[0].given + " " + tableData.name[0].family.charAt(0, 2) })) ||
                                                                                                ((newInputData.criteria !== "" && l.enteredBy.shiftA.slot3 !== "" && l.enteredBy.shiftA.slot3 !== null && l.enteredBy.shiftA.slot3 === newInputData.criteria) && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "") && staffData.filter((i: any) => i.id === l.enteredBy.shiftA.slot3).map((tableData: any) => { return tableData.name[0].given + " " + tableData.name[0].family.charAt(0, 2) })) ||
                                                                                                staffData.filter((m: any) => m.id === newInputData.criteria && newInputData.criteria !== "" && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "") && newInputData.criteria !== l.enteredBy.shiftA.slot3).map((m: any) => { return "--" }) && "--"}</div>
                                                                                        </div>
                                                                                    </div>
                                                                                    {newTimeSlot !== null && newTimeSlot !== undefined && newTimeSlot.length>0 &&newTimeSlot.map((s:any,t:number)=>{
                                                                                        return t >= 16 && t<=23 && (<div style={{ display: "flex", gap: "10px", flexDirection: "column", width: "60px", height: "73px", border: "1px solid", borderRadius: "4px" }}>
                                                                                        <span style={{ textAlign: "center", color: " #415F9E", fontFamily: "poppins", fontSize: "15px", fontStyle: "normal", fontWeight: 600, lineHeight: "normal" }}>{newTimeSlot[t]} </span>
                                                                                        <span style={{ textAlign: "center", border: "1px solid #E3E8F1", width: "45px", position: "relative", left: "7px" }}></span>
                                                                                        <span style={{ textAlign: "center", color: " #5E7494", fontFamily: "poppins", fontSize: "16px", fontStyle: "normal", fontWeight: 600, lineHeight: "130%", letterSpacing: "0.016px" }} >{l.data.filter((m: any) => m.q15Time === newTimeSlot[t].replace(/:/g,'')+"-"+newTimeSlot[t+1].replace(/:/g,'') && m.location !== "" && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "")).length > 0 ? l.data.filter((m: any) => m.q15Time === newTimeSlot[t].replace(/:/g,'')+"-"+newTimeSlot[t+1].replace(/:/g,'') && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "")).map((n: any) => { return n.location }) : "NA"}-{l.data.filter((m: any) => m.q15Time === newTimeSlot[t].replace(/:/g,'')+"-"+newTimeSlot[t+1].replace(/:/g,'') && m.activity !== "" && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "")).length > 0 ? l.data.filter((m: any) => m.q15Time === newTimeSlot[t].replace(/:/g,'')+"-"+newTimeSlot[t+1].replace(/:/g,'') && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "")).map((n: any) => { return n.activity }) : "NA"}</span>
                                                                                    </div>)
                                                                                    })}                                                                                   
                                                                                </div>
                                                                                <span style={{ textAlign: "center", border: "1px solid", position: "relative", left: "7px", display: "flex", width: "calc(100% - 11px)", top: "116px", borderColor: "#E3E8F1" }}></span>
                                                                                <div style={{ display: "flex", justifyContent: "space-evenly", position: "relative", top: "130px" }}>
                                                                                    <div style={{ width: "155px", fontFamily: "poppins", fontSize: "14px", fontWeight: 500, color: "#000", lineHeight: "normal" }}>{newTimeSlot[24]} {newTimeSlot[24] >= "12:00" && newTimeSlot[24]<= "23:45"?"PM":"AM"} to {newTimeSlot[31]} {newTimeSlot[31] >= "12:00" && newTimeSlot[31]<= "23:45"?"PM":"AM"}:

                                                                                        <div style={{ position: "absolute", left: "unset", top: "70px", width: "131px", display: "flex", gap: "7px", whiteSpace: "nowrap" }}>
                                                                                            <div style={{ position: "relative", top: "5px", width: "fit-contant" }}>Entered By:</div>
                                                                                            <img src={Rectangle6215}></img>
                                                                                            <div style={{ fontFamily: "poppins", fontSize: "13px", fontWeight: 400, color: "#000", lineHeight: "normal", position: "relative", top: "5px" }}>{((newInputData.criteria === "" && l.enteredBy.shiftA.slot4 !== "" && l.enteredBy.shiftA.slot4 !== null) && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "") && staffData.filter((i: any) => i.id === l.enteredBy.shiftA.slot4).map((tableData: any) => { return tableData.name[0].given + " " + tableData.name[0].family.charAt(0, 2) })) ||
                                                                                                ((newInputData.criteria !== "" && l.enteredBy.shiftA.slot4 !== "" && l.enteredBy.shiftA.slot4 !== null && l.enteredBy.shiftA.slot4 === newInputData.criteria) && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "") && staffData.filter((i: any) => i.id === l.enteredBy.shiftA.slot4).map((tableData: any) => { return tableData.name[0].given + " " + tableData.name[0].family.charAt(0, 2) })) ||
                                                                                                staffData.filter((m: any) => m.id === newInputData.criteria && newInputData.criteria !== "" && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "") && newInputData.criteria !== l.enteredBy.shiftA.slot4).map((m: any) => { return "--" }) && "--"}</div>
                                                                                        </div>
                                                                                    </div>
                                                                                    {newTimeSlot !== null && newTimeSlot !== undefined && newTimeSlot.length>0 &&newTimeSlot.map((s:any,t:number)=>{
                                                                                        return t >= 24 && t<=31 && (<div style={{ display: "flex", gap: "10px", flexDirection: "column", width: "60px", height: "73px", border: "1px solid", borderRadius: "4px" }}>
                                                                                        <span style={{ textAlign: "center", color: " #415F9E", fontFamily: "poppins", fontSize: "15px", fontStyle: "normal", fontWeight: 600, lineHeight: "normal" }}>{newTimeSlot[t]} </span>
                                                                                        <span style={{ textAlign: "center", border: "1px solid #E3E8F1", width: "45px", position: "relative", left: "7px" }}></span>
                                                                                        <span style={{ textAlign: "center", color: " #5E7494", fontFamily: "poppins", fontSize: "16px", fontStyle: "normal", fontWeight: 600, lineHeight: "130%", letterSpacing: "0.016px" }} >{l.data.filter((m: any) => m.q15Time === newTimeSlot[t].replace(/:/g,'')+"-"+newTimeSlot[t+1].replace(/:/g,'') && m.location !== "" && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "")).length > 0 ? l.data.filter((m: any) => m.q15Time === newTimeSlot[t].replace(/:/g,'')+"-"+newTimeSlot[t+1].replace(/:/g,'') && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "")).map((n: any) => { return n.location }) : "NA"}-{l.data.filter((m: any) => m.q15Time === newTimeSlot[t].replace(/:/g,'')+"-"+newTimeSlot[t+1].replace(/:/g,'') && m.activity !== "" && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "")).length > 0 ? l.data.filter((m: any) => m.q15Time === newTimeSlot[t].replace(/:/g,'')+"-"+newTimeSlot[t+1].replace(/:/g,'') && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "")).map((n: any) => { return n.activity }) : "NA"}</span>
                                                                                    </div>)
                                                                                    })}                                                                                           
                                                                                </div>
                                                                            </Typography>
                                                                        </AccordionDetails>
                                                                    </Accordion>
                                                                    <Accordion style={{ borderStyle: "none", top: '-6px' }} expanded={newAddExpanded === 'Shift B'} onChange={handleNewAddChange('Shift B')}>
                                                                        <AccordionSummary style={{ backgroundColor: "#F7FAFE", borderRadius: '6px' }} aria-controls="panel11Ad-content" id="panel11Ad-header">
                                                                            <Typography>
                                                                                <span style={{ fontFamily: "poppins", color: "#000", fontSize: "14px", fontStyle: "normal", fontWeight: 600, lineHeight: "normal", position: "relative", top: "0px" }}>Shift B:
                                                                                    <span style={{ fontFamily: "poppins", color: "#000", fontSize: "14px", fontStyle: "normal", fontWeight: 500, lineHeight: "normal" }}>{newTimeSlot[32]} {newTimeSlot[32] >= "12:00" && newTimeSlot[32]<= "23:45"?"PM":"AM"} to {newTimeSlot[63]} {newTimeSlot[63] >= "12:00" && newTimeSlot[63]<= "23:45"?"PM":"AM"}</span>
                                                                                </span>
                                                                                <div style={{ position: "absolute", left: "unset", top: "12px", width: "131px", display: "flex", gap: "7px", whiteSpace: "nowrap", right: "90px" }}>
                                                                                    <img src={Rectangle6215}></img>
                                                                                    <div style={{}}>Patient: {patientData.filter((i: any) => i.id === l.pid).map((tableData: any) => { return tableData.basicDetails[0].name[0].given + " " + tableData.basicDetails[0].name[0].family.charAt(0, 2) })}</div>
                                                                                </div>
                                                                            </Typography>
                                                                        </AccordionSummary>
                                                                        <AccordionDetails style={{ backgroundColor: "#F7FAFE", borderBottomLeftRadius: '6px', borderBottomRightRadius: '6px' }}>
                                                                            <Typography style={{ height: "448px", backgroundColor: "#F7FAFE" }}>
                                                                                <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                                                                                    <div style={{ width: "155px", fontFamily: "poppins", fontSize: "14px", fontWeight: 500, color: "#000", lineHeight: "normal" }}>{newTimeSlot[32]} {newTimeSlot[32] >= "12:00" && newTimeSlot[32]<= "23:45"?"PM":"AM"} to {newTimeSlot[39]} {newTimeSlot[39] >= "12:00" && newTimeSlot[39]<= "23:45"?"PM":"AM"}:

                                                                                        <div style={{ position: "absolute", left: "unset", top: "137px", width: "131px", display: "flex", gap: "7px", whiteSpace: "nowrap" }}>
                                                                                            <div style={{ position: "relative", top: "5px", width: "fit-contant" }}>Entered By:</div>
                                                                                            <img src={Rectangle6215}></img>
                                                                                            <div style={{ fontFamily: "poppins", fontSize: "13px", fontWeight: 400, color: "#000", lineHeight: "normal", position: "relative", top: "5px" }}>{((newInputData.criteria === "" && l.enteredBy.shiftB.slot1 !== "" && l.enteredBy.shiftB.slot1 !== null) && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeB && l.shiftIncharge.shiftInchargeB !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeB !== "") && staffData.filter((i: any) => i.id === l.enteredBy.shiftB.slot1).map((tableData: any) => { return tableData.name[0].given + " " + tableData.name[0].family.charAt(0, 2) })) ||
                                                                                                ((newInputData.criteria !== "" && l.enteredBy.shiftB.slot1 !== "" && l.enteredBy.shiftB.slot1 !== null && l.enteredBy.shiftB.slot1 === newInputData.criteria) && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeB && l.shiftIncharge.shiftInchargeB !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeB !== "") && staffData.filter((i: any) => i.id === l.enteredBy.shiftB.slot1).map((tableData: any) => { return tableData.name[0].given + " " + tableData.name[0].family.charAt(0, 2) })) ||
                                                                                                staffData.filter((m: any) => m.id === newInputData.criteria && newInputData.criteria !== "" && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeB && l.shiftIncharge.shiftInchargeB !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeB !== "") && newInputData.criteria !== l.enteredBy.shiftB.slot1).map((m: any) => { return "--" }) && "--"}</div>
                                                                                        </div>
                                                                                    </div>
                                                                                    {newTimeSlot !== null && newTimeSlot !== undefined && newTimeSlot.length>0 &&newTimeSlot.map((s:any,t:number)=>{
                                                                                        return t >= 32 && t<=39 && (<div style={{ display: "flex", gap: "10px", flexDirection: "column", width: "60px", height: "73px", border: "1px solid", borderRadius: "4px" }}>
                                                                                        <span style={{ textAlign: "center", color: " #415F9E", fontFamily: "poppins", fontSize: "15px", fontStyle: "normal", fontWeight: 600, lineHeight: "normal" }}>{newTimeSlot[t]} </span>
                                                                                        <span style={{ textAlign: "center", border: "1px solid #E3E8F1", width: "45px", position: "relative", left: "7px" }}></span>
                                                                                        <span style={{ textAlign: "center", color: " #5E7494", fontFamily: "poppins", fontSize: "16px", fontStyle: "normal", fontWeight: 600, lineHeight: "130%", letterSpacing: "0.016px" }} >{l.data.filter((m: any) => m.q15Time === newTimeSlot[t].replace(/:/g,'')+"-"+newTimeSlot[t+1].replace(/:/g,'') && m.location !== "" && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "")).length > 0 ? l.data.filter((m: any) => m.q15Time === newTimeSlot[t].replace(/:/g,'')+"-"+newTimeSlot[t+1].replace(/:/g,'') && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "")).map((n: any) => { return n.location }) : "NA"}-{l.data.filter((m: any) => m.q15Time === newTimeSlot[t].replace(/:/g,'')+"-"+newTimeSlot[t+1].replace(/:/g,'') && m.activity !== "" && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "")).length > 0 ? l.data.filter((m: any) => m.q15Time === newTimeSlot[t].replace(/:/g,'')+"-"+newTimeSlot[t+1].replace(/:/g,'') && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "")).map((n: any) => { return n.activity }) : "NA"}</span>
                                                                                    </div>)
                                                                                    })}        

                                                                                </div>
                                                                                <span style={{ textAlign: "center", border: "1px solid ", position: "relative", left: "7px", display: "flex", width: "calc(100% - 11px)", top: "31px", borderColor: "#E3E8F1" }}></span>
                                                                                <div style={{ display: "flex", justifyContent: "space-evenly", position: "relative", top: "46px" }}>
                                                                                    <div style={{ width: "155px", fontFamily: "poppins", fontSize: "14px", fontWeight: 500, color: "#000", lineHeight: "normal" }}>{newTimeSlot[40]} {newTimeSlot[40] >= "12:00" && newTimeSlot[40]<= "23:45"?"PM":"AM"} to {newTimeSlot[47]} {newTimeSlot[47] >= "12:00" && newTimeSlot[47]<= "23:45"?"PM":"AM"}:

                                                                                        <div style={{ position: "absolute", left: "unset", top: "70px", width: "131px", display: "flex", gap: "7px", whiteSpace: "nowrap" }}>
                                                                                            <div style={{ position: "relative", top: "5px", width: "fit-contant" }}>Entered By:</div>
                                                                                            <img src={Rectangle6215}></img>
                                                                                            <div style={{ fontFamily: "poppins", fontSize: "13px", fontWeight: 400, color: "#000", lineHeight: "normal", position: "relative", top: "5px" }}>{((newInputData.criteria === "" && l.enteredBy.shiftB.slot2 !== "" && l.enteredBy.shiftB.slot2 !== null) && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeB && l.shiftIncharge.shiftInchargeB !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeB !== "") && staffData.filter((i: any) => i.id === l.enteredBy.shiftB.slot2).map((tableData: any) => { return tableData.name[0].given + " " + tableData.name[0].family.charAt(0, 2) })) ||
                                                                                                ((newInputData.criteria !== "" && l.enteredBy.shiftB.slot2 !== "" && l.enteredBy.shiftB.slot2 !== null && l.enteredBy.shiftB.slot2 === newInputData.criteria) && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeB && l.shiftIncharge.shiftInchargeB !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeB !== "") && staffData.filter((i: any) => i.id === l.enteredBy.shiftB.slot2).map((tableData: any) => { return tableData.name[0].given + " " + tableData.name[0].family.charAt(0, 2) })) ||
                                                                                                staffData.filter((m: any) => m.id === newInputData.criteria && newInputData.criteria !== "" && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeB && l.shiftIncharge.shiftInchargeB !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeB !== "") && newInputData.criteria !== l.enteredBy.shiftB.slot2).map((m: any) => { return "--" }) && "--"}</div>
                                                                                        </div>
                                                                                    </div>
                                                                                    {newTimeSlot !== null && newTimeSlot !== undefined && newTimeSlot.length>0 &&newTimeSlot.map((s:any,t:number)=>{
                                                                                        return t >= 40 && t<=47 && (<div style={{ display: "flex", gap: "10px", flexDirection: "column", width: "60px", height: "73px", border: "1px solid", borderRadius: "4px" }}>
                                                                                        <span style={{ textAlign: "center", color: " #415F9E", fontFamily: "poppins", fontSize: "15px", fontStyle: "normal", fontWeight: 600, lineHeight: "normal" }}>{newTimeSlot[t]} </span>
                                                                                        <span style={{ textAlign: "center", border: "1px solid #E3E8F1", width: "45px", position: "relative", left: "7px" }}></span>
                                                                                        <span style={{ textAlign: "center", color: " #5E7494", fontFamily: "poppins", fontSize: "16px", fontStyle: "normal", fontWeight: 600, lineHeight: "130%", letterSpacing: "0.016px" }} >{l.data.filter((m: any) => m.q15Time === newTimeSlot[t].replace(/:/g,'')+"-"+newTimeSlot[t+1].replace(/:/g,'') && m.location !== "" && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "")).length > 0 ? l.data.filter((m: any) => m.q15Time === newTimeSlot[t].replace(/:/g,'')+"-"+newTimeSlot[t+1].replace(/:/g,'') && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "")).map((n: any) => { return n.location }) : "NA"}-{l.data.filter((m: any) => m.q15Time === newTimeSlot[t].replace(/:/g,'')+"-"+newTimeSlot[t+1].replace(/:/g,'') && m.activity !== "" && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "")).length > 0 ? l.data.filter((m: any) => m.q15Time === newTimeSlot[t].replace(/:/g,'')+"-"+newTimeSlot[t+1].replace(/:/g,'') && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "")).map((n: any) => { return n.activity }) : "NA"}</span>
                                                                                    </div>)
                                                                                    })}

                                                                                </div>
                                                                                <span style={{ textAlign: "center", border: "1px solid", position: "relative", left: "7px", display: "flex", width: "calc(100% - 11px)", top: "75px", borderColor: "#E3E8F1" }}></span>
                                                                                <div style={{ display: "flex", justifyContent: "space-evenly", position: "relative", top: "86px" }}>
                                                                                    <div style={{ width: "155px", fontFamily: "poppins", fontSize: "14px", fontWeight: 500, color: "#000", lineHeight: "normal" }}>{newTimeSlot[48]} {newTimeSlot[48] >= "12:00" && newTimeSlot[48]<= "23:45"?"PM":"AM"} to {newTimeSlot[55]} {newTimeSlot[55] >= "12:00" && newTimeSlot[55]<= "23:45"?"PM":"AM"}:

                                                                                        <div style={{ position: "absolute", left: "unset", top: "70px", width: "131px", display: "flex", gap: "7px", whiteSpace: "nowrap" }}>
                                                                                            <div style={{ position: "relative", top: "5px", width: "fit-contant" }}>Entered By:</div>
                                                                                            <img src={Rectangle6215}></img>
                                                                                            <div style={{ fontFamily: "poppins", fontSize: "13px", fontWeight: 400, color: "#000", lineHeight: "normal", position: "relative", top: "5px" }}>{((newInputData.criteria === "" && l.enteredBy.shiftB.slot3 !== "" && l.enteredBy.shiftB.slot3 !== null) && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeB && l.shiftIncharge.shiftInchargeB !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeB !== "") && staffData.filter((i: any) => i.id === l.enteredBy.shiftB.slot3).map((tableData: any) => { return tableData.name[0].given + " " + tableData.name[0].family.charAt(0, 2) })) ||
                                                                                                ((newInputData.criteria !== "" && l.enteredBy.shiftB.slot3 !== "" && l.enteredBy.shiftB.slot3 !== null && l.enteredBy.shiftB.slot3 === newInputData.criteria) && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeB && l.shiftIncharge.shiftInchargeB !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeB !== "") && staffData.filter((i: any) => i.id === l.enteredBy.shiftB.slot3).map((tableData: any) => { return tableData.name[0].given + " " + tableData.name[0].family.charAt(0, 2) })) ||
                                                                                                staffData.filter((m: any) => m.id === newInputData.criteria && newInputData.criteria !== "" && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeB && l.shiftIncharge.shiftInchargeB !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeB !== "") && newInputData.criteria !== l.enteredBy.shiftB.slot3).map((m: any) => { return "--" }) && "--"}</div>
                                                                                        </div>
                                                                                    </div>
                                                                                    {newTimeSlot !== null && newTimeSlot !== undefined && newTimeSlot.length>0 &&newTimeSlot.map((s:any,t:number)=>{
                                                                                        return t >= 48 && t<=55 && (<div style={{ display: "flex", gap: "10px", flexDirection: "column", width: "60px", height: "73px", border: "1px solid", borderRadius: "4px" }}>
                                                                                        <span style={{ textAlign: "center", color: " #415F9E", fontFamily: "poppins", fontSize: "15px", fontStyle: "normal", fontWeight: 600, lineHeight: "normal" }}>{newTimeSlot[t]} </span>
                                                                                        <span style={{ textAlign: "center", border: "1px solid #E3E8F1", width: "45px", position: "relative", left: "7px" }}></span>
                                                                                        <span style={{ textAlign: "center", color: " #5E7494", fontFamily: "poppins", fontSize: "16px", fontStyle: "normal", fontWeight: 600, lineHeight: "130%", letterSpacing: "0.016px" }} >{l.data.filter((m: any) => m.q15Time === newTimeSlot[t].replace(/:/g,'')+"-"+newTimeSlot[t+1].replace(/:/g,'') && m.location !== "" && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "")).length > 0 ? l.data.filter((m: any) => m.q15Time === newTimeSlot[t].replace(/:/g,'')+"-"+newTimeSlot[t+1].replace(/:/g,'') && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "")).map((n: any) => { return n.location }) : "NA"}-{l.data.filter((m: any) => m.q15Time === newTimeSlot[t].replace(/:/g,'')+"-"+newTimeSlot[t+1].replace(/:/g,'') && m.activity !== "" && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "")).length > 0 ? l.data.filter((m: any) => m.q15Time === newTimeSlot[t].replace(/:/g,'')+"-"+newTimeSlot[t+1].replace(/:/g,'') && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "")).map((n: any) => { return n.activity }) : "NA"}</span>
                                                                                    </div>)
                                                                                    })}

                                                                                </div>
                                                                                <span style={{ textAlign: "center", border: "1px solid", position: "relative", left: "7px", display: "flex", width: "calc(100% - 11px)", top: "116px", borderColor: "#E3E8F1" }}></span>
                                                                                <div style={{ display: "flex", justifyContent: "space-evenly", position: "relative", top: "130px" }}>
                                                                                    <div style={{ width: "155px", fontFamily: "poppins", fontSize: "14px", fontWeight: 500, color: "#000", lineHeight: "normal" }}>{newTimeSlot[56]} {newTimeSlot[56] >= "12:00" && newTimeSlot[56]<= "23:45"?"PM":"AM"} to {newTimeSlot[63]} {newTimeSlot[63] >= "12:00" && newTimeSlot[63]<= "23:45"?"PM":"AM"}:

                                                                                        <div style={{ position: "absolute", left: "unset", top: "70px", width: "131px", display: "flex", gap: "7px", whiteSpace: "nowrap" }}>
                                                                                            <div style={{ position: "relative", top: "5px", width: "fit-contant" }}>Entered By:</div>
                                                                                            <img src={Rectangle6215}></img>
                                                                                            <div style={{ fontFamily: "poppins", fontSize: "13px", fontWeight: 400, color: "#000", lineHeight: "normal", position: "relative", top: "5px" }}>{((newInputData.criteria === "" && l.enteredBy.shiftB.slot4 !== "" && l.enteredBy.shiftB.slot4 !== null) && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeB && l.shiftIncharge.shiftInchargeB !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeB !== "") && staffData.filter((i: any) => i.id === l.enteredBy.shiftB.slot4).map((tableData: any) => { return tableData.name[0].given + " " + tableData.name[0].family.charAt(0, 2) })) ||
                                                                                                ((newInputData.criteria !== "" && l.enteredBy.shiftB.slot4 !== "" && l.enteredBy.shiftB.slot4 !== null && l.enteredBy.shiftB.slot4 === newInputData.criteria) && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeB && l.shiftIncharge.shiftInchargeB !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeB !== "") && staffData.filter((i: any) => i.id === l.enteredBy.shiftB.slot4).map((tableData: any) => { return tableData.name[0].given + " " + tableData.name[0].family.charAt(0, 2) })) ||
                                                                                                staffData.filter((m: any) => m.id === newInputData.criteria && newInputData.criteria !== "" && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeB && l.shiftIncharge.shiftInchargeB !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeB !== "") && newInputData.criteria !== l.enteredBy.shiftB.slot4).map((m: any) => { return "--" }) && "--"}</div>
                                                                                        </div>
                                                                                    </div>
                                                                                    {newTimeSlot !== null && newTimeSlot !== undefined && newTimeSlot.length>0 &&newTimeSlot.map((s:any,t:number)=>{
                                                                                        return t >= 56 && t<=63 && (<div style={{ display: "flex", gap: "10px", flexDirection: "column", width: "60px", height: "73px", border: "1px solid", borderRadius: "4px" }}>
                                                                                        <span style={{ textAlign: "center", color: " #415F9E", fontFamily: "poppins", fontSize: "15px", fontStyle: "normal", fontWeight: 600, lineHeight: "normal" }}>{newTimeSlot[t]} </span>
                                                                                        <span style={{ textAlign: "center", border: "1px solid #E3E8F1", width: "45px", position: "relative", left: "7px" }}></span>
                                                                                        <span style={{ textAlign: "center", color: " #5E7494", fontFamily: "poppins", fontSize: "16px", fontStyle: "normal", fontWeight: 600, lineHeight: "130%", letterSpacing: "0.016px" }} >{l.data.filter((m: any) => m.q15Time === newTimeSlot[t].replace(/:/g,'')+"-"+newTimeSlot[t+1].replace(/:/g,'') && m.location !== "" && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "")).length > 0 ? l.data.filter((m: any) => m.q15Time === newTimeSlot[t].replace(/:/g,'')+"-"+newTimeSlot[t+1].replace(/:/g,'') && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "")).map((n: any) => { return n.location }) : "NA"}-{l.data.filter((m: any) => m.q15Time === newTimeSlot[t].replace(/:/g,'')+"-"+newTimeSlot[t+1].replace(/:/g,'') && m.activity !== "" && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "")).length > 0 ? l.data.filter((m: any) => m.q15Time === newTimeSlot[t].replace(/:/g,'')+"-"+newTimeSlot[t+1].replace(/:/g,'') && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "")).map((n: any) => { return n.activity }) : "NA"}</span>
                                                                                    </div>)
                                                                                    })}

                                                                                </div>
                                                                            </Typography>
                                                                        </AccordionDetails>
                                                                    </Accordion>
                                                                    <Accordion style={{ borderStyle: "none", marginBottom: '40px' }} expanded={newAddExpanded === 'Shift C'} onChange={handleNewAddChange('Shift C')}>
                                                                        <AccordionSummary style={{ backgroundColor: "#F7FAFE", borderRadius: '6px' }} aria-controls="panel11Ad-content" id="panel11Ad-header">
                                                                            <Typography>
                                                                                <span style={{ fontFamily: "poppins", color: "#000", fontSize: "14px", fontStyle: "normal", fontWeight: 600, lineHeight: "normal", position: "relative", top: "0px" }}>Shift C:
                                                                                    <span style={{ fontFamily: "poppins", color: "#000", fontSize: "14px", fontStyle: "normal", fontWeight: 500, lineHeight: "normal" }}>{newTimeSlot[64]} {newTimeSlot[64] >= "12:00" && newTimeSlot[64]<= "23:45"?"PM":"AM"} to {newTimeSlot[95]} {newTimeSlot[95] >= "12:00" && newTimeSlot[95]<= "23:45"?"PM":"AM"}</span>
                                                                                </span>
                                                                                <div style={{ position: "absolute", left: "unset", top: "12px", width: "131px", display: "flex", gap: "7px", whiteSpace: "nowrap", right: "90px" }}>
                                                                                    <img src={Rectangle6215}></img>
                                                                                    <div style={{}}>Patient: {l.pid !== "" ? patientData.filter((i: any) => i.id === l.pid).map((tableData: any) => { return tableData.basicDetails[0].name[0].given + " " + tableData.basicDetails[0].name[0].family.charAt(0, 2) }) : "--"}</div>
                                                                                </div>
                                                                            </Typography>
                                                                        </AccordionSummary>
                                                                        <AccordionDetails style={{ backgroundColor: "#F7FAFE", borderBottomLeftRadius: '6px', borderBottomRightRadius: '6px' }}>
                                                                            <Typography style={{ height: "448px", backgroundColor: "#F7FAFE" }}>
                                                                                <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                                                                                    <div style={{ width: "155px", fontFamily: "poppins", fontSize: "14px", fontWeight: 500, color: "#000", lineHeight: "normal" }}>{newTimeSlot[64]} {newTimeSlot[64] >= "12:00" && newTimeSlot[64]<= "23:45"?"PM":"AM"} to {newTimeSlot[71]} {newTimeSlot[71] >= "12:00" && newTimeSlot[71]<= "23:45"?"PM":"AM"}:

                                                                                        <div style={{ position: "absolute", left: "unset", top: "137px", width: "131px", display: "flex", gap: "7px", whiteSpace: "nowrap" }}>
                                                                                            <div style={{ position: "relative", top: "5px", width: "fit-contant" }}>Entered By:</div>
                                                                                            <img src={Rectangle6215}></img>
                                                                                            <div style={{ fontFamily: "poppins", fontSize: "13px", fontWeight: 400, color: "#000", lineHeight: "normal", position: "relative", top: "5px" }}>{((newInputData.criteria === "" && l.enteredBy.shiftC.slot1 !== "" && l.enteredBy.shiftC.slot1 !== null) && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeC && l.shiftIncharge.shiftInchargeC !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeC !== "") && staffData.filter((i: any) => i.id === l.enteredBy.shiftC.slot1).map((tableData: any) => { return tableData.name[0].given + " " + tableData.name[0].family.charAt(0, 2) })) ||
                                                                                                ((newInputData.criteria !== "" && l.enteredBy.shiftC.slot1 !== "" && l.enteredBy.shiftC.slot1 !== null && l.enteredBy.shiftC.slot1 === newInputData.criteria) && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeC && l.shiftIncharge.shiftInchargeC !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeC !== "") && staffData.filter((i: any) => i.id === l.enteredBy.shiftC.slot1).map((tableData: any) => { return tableData.name[0].given + " " + tableData.name[0].family.charAt(0, 2) })) ||
                                                                                                staffData.filter((m: any) => m.id === newInputData.criteria && newInputData.criteria !== "" && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeC && l.shiftIncharge.shiftInchargeC !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeC !== "") && newInputData.criteria !== l.enteredBy.shiftC.slot1).map((m: any) => { return "--" }) && "--"}</div>
                                                                                        </div>
                                                                                    </div>
                                                                                    {newTimeSlot !== null && newTimeSlot !== undefined && newTimeSlot.length>0 &&newTimeSlot.map((s:any,t:number)=>{
                                                                                        return t >= 64 && t<=71 && (<div style={{ display: "flex", gap: "10px", flexDirection: "column", width: "60px", height: "73px", border: "1px solid", borderRadius: "4px" }}>
                                                                                        <span style={{ textAlign: "center", color: " #415F9E", fontFamily: "poppins", fontSize: "15px", fontStyle: "normal", fontWeight: 600, lineHeight: "normal" }}>{newTimeSlot[t]} </span>
                                                                                        <span style={{ textAlign: "center", border: "1px solid #E3E8F1", width: "45px", position: "relative", left: "7px" }}></span>
                                                                                        <span style={{ textAlign: "center", color: " #5E7494", fontFamily: "poppins", fontSize: "16px", fontStyle: "normal", fontWeight: 600, lineHeight: "130%", letterSpacing: "0.016px" }} >{l.data.filter((m: any) => m.q15Time === newTimeSlot[t].replace(/:/g,'')+"-"+newTimeSlot[t+1].replace(/:/g,'') && m.location !== "" && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "")).length > 0 ? l.data.filter((m: any) => m.q15Time === newTimeSlot[t].replace(/:/g,'')+"-"+newTimeSlot[t+1].replace(/:/g,'') && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "")).map((n: any) => { return n.location }) : "NA"}-{l.data.filter((m: any) => m.q15Time === newTimeSlot[t].replace(/:/g,'')+"-"+newTimeSlot[t+1].replace(/:/g,'') && m.activity !== "" && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "")).length > 0 ? l.data.filter((m: any) => m.q15Time === newTimeSlot[t].replace(/:/g,'')+"-"+newTimeSlot[t+1].replace(/:/g,'') && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "")).map((n: any) => { return n.activity }) : "NA"}</span>
                                                                                    </div>)
                                                                                    })}

                                                                                </div>
                                                                                <span style={{ textAlign: "center", border: "1px solid ", position: "relative", left: "7px", display: "flex", width: "calc(100% - 11px)", top: "31px", borderColor: "#E3E8F1" }}></span>
                                                                                <div style={{ display: "flex", justifyContent: "space-evenly", position: "relative", top: "46px" }}>
                                                                                    <div style={{ width: "157px", fontFamily: "poppins", fontSize: "14px", fontWeight: 500, color: "#000", lineHeight: "normal" }}>{newTimeSlot[72]} {newTimeSlot[72] >= "12:00" && newTimeSlot[72]<= "23:45"?"PM":"AM"} to {newTimeSlot[79]} {newTimeSlot[79] >= "12:00" && newTimeSlot[79]<= "23:45"?"PM":"AM"}:

                                                                                        <div style={{ position: "absolute", left: "unset", top: "70px", width: "131px", display: "flex", gap: "7px", whiteSpace: "nowrap" }}>
                                                                                            <div style={{ position: "relative", top: "5px", width: "fit-contant" }}>Entered By:</div>
                                                                                            <img src={Rectangle6215}></img>
                                                                                            <div style={{ fontFamily: "poppins", fontSize: "13px", fontWeight: 400, color: "#000", lineHeight: "normal", position: "relative", top: "5px" }}>{((newInputData.criteria === "" && l.enteredBy.shiftC.slot2 !== "" && l.enteredBy.shiftC.slot2 !== null) && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeC && l.shiftIncharge.shiftInchargeC !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeC !== "") && staffData.filter((i: any) => i.id === l.enteredBy.shiftC.slot2).map((tableData: any) => { return tableData.name[0].given + " " + tableData.name[0].family.charAt(0, 2) })) ||
                                                                                                ((newInputData.criteria !== "" && l.enteredBy.shiftC.slot2 !== "" && l.enteredBy.shiftC.slot2 !== null && l.enteredBy.shiftC.slot2 === newInputData.criteria) && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeC && l.shiftIncharge.shiftInchargeC !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeC !== "") && staffData.filter((i: any) => i.id === l.enteredBy.shiftC.slot2).map((tableData: any) => { return tableData.name[0].given + " " + tableData.name[0].family.charAt(0, 2) })) ||
                                                                                                staffData.filter((m: any) => m.id === newInputData.criteria && newInputData.criteria !== "" && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeC && l.shiftIncharge.shiftInchargeC !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeC !== "") && newInputData.criteria !== l.enteredBy.shiftC.slot2).map((m: any) => { return "--" }) && "--"}</div>
                                                                                        </div>
                                                                                    </div>
                                                                                    {newTimeSlot !== null && newTimeSlot !== undefined && newTimeSlot.length>0 &&newTimeSlot.map((s:any,t:number)=>{
                                                                                        return t >= 72 && t<=79 && (<div style={{ display: "flex", gap: "10px", flexDirection: "column", width: "60px", height: "73px", border: "1px solid", borderRadius: "4px" }}>
                                                                                        <span style={{ textAlign: "center", color: " #415F9E", fontFamily: "poppins", fontSize: "15px", fontStyle: "normal", fontWeight: 600, lineHeight: "normal" }}>{newTimeSlot[t]} </span>
                                                                                        <span style={{ textAlign: "center", border: "1px solid #E3E8F1", width: "45px", position: "relative", left: "7px" }}></span>
                                                                                        <span style={{ textAlign: "center", color: " #5E7494", fontFamily: "poppins", fontSize: "16px", fontStyle: "normal", fontWeight: 600, lineHeight: "130%", letterSpacing: "0.016px" }} >{l.data.filter((m: any) => m.q15Time === newTimeSlot[t].replace(/:/g,'')+"-"+newTimeSlot[t+1].replace(/:/g,'') && m.location !== "" && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "")).length > 0 ? l.data.filter((m: any) => m.q15Time === newTimeSlot[t].replace(/:/g,'')+"-"+newTimeSlot[t+1].replace(/:/g,'') && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "")).map((n: any) => { return n.location }) : "NA"}-{l.data.filter((m: any) => m.q15Time === newTimeSlot[t].replace(/:/g,'')+"-"+newTimeSlot[t+1].replace(/:/g,'') && m.activity !== "" && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "")).length > 0 ? l.data.filter((m: any) => m.q15Time === newTimeSlot[t].replace(/:/g,'')+"-"+newTimeSlot[t+1].replace(/:/g,'') && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "")).map((n: any) => { return n.activity }) : "NA"}</span>
                                                                                    </div>)
                                                                                    })}

                                                                                </div>
                                                                                <span style={{ textAlign: "center", border: "1px solid", position: "relative", left: "7px", display: "flex", width: "calc(100% - 11px)", top: "75px", borderColor: "#E3E8F1" }}></span>
                                                                                <div style={{ display: "flex", justifyContent: "space-evenly", position: "relative", top: "86px" }}>
                                                                                    <div style={{ width: "159px", fontFamily: "poppins", fontSize: "14px", fontWeight: 500, color: "#000", lineHeight: "normal" }}>{newTimeSlot[80]} {newTimeSlot[80] >= "12:00" && newTimeSlot[80]<= "23:45"?"PM":"AM"} to {newTimeSlot[87]} {newTimeSlot[87] >= "12:00" && newTimeSlot[87]<= "23:45"?"PM":"AM"}:

                                                                                        <div style={{ position: "absolute", left: "unset", top: "70px", width: "131px", display: "flex", gap: "7px", whiteSpace: "nowrap" }}>
                                                                                            <div style={{ position: "relative", top: "5px", width: "fit-contant" }}>Entered By:</div>
                                                                                            <img src={Rectangle6215}></img>
                                                                                            <div style={{ fontFamily: "poppins", fontSize: "13px", fontWeight: 400, color: "#000", lineHeight: "normal", position: "relative", top: "5px" }}>{((newInputData.criteria === "" && l.enteredBy.shiftC.slot3 !== "" && l.enteredBy.shiftC.slot3 !== null) && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeC && l.shiftIncharge.shiftInchargeC !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeC !== "") && staffData.filter((i: any) => i.id === l.enteredBy.shiftC.slot3).map((tableData: any) => { return tableData.name[0].given + " " + tableData.name[0].family.charAt(0, 2) })) ||
                                                                                                ((newInputData.criteria !== "" && l.enteredBy.shiftC.slot3 !== "" && l.enteredBy.shiftC.slot3 !== null && l.enteredBy.shiftC.slot3 === newInputData.criteria) && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeC && l.shiftIncharge.shiftInchargeC !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeC !== "") && staffData.filter((i: any) => i.id === l.enteredBy.shiftC.slot3).map((tableData: any) => { return tableData.name[0].given + " " + tableData.name[0].family.charAt(0, 2) })) ||
                                                                                                staffData.filter((m: any) => m.id === newInputData.criteria && newInputData.criteria !== "" && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeC && l.shiftIncharge.shiftInchargeC !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeC !== "") && newInputData.criteria !== l.enteredBy.shiftC.slot3).map((m: any) => { return "--" }) && "--"}</div>
                                                                                        </div>
                                                                                    </div>
                                                                                    {newTimeSlot !== null && newTimeSlot !== undefined && newTimeSlot.length>0 &&newTimeSlot.map((s:any,t:number)=>{
                                                                                        return t >= 80 && t<= 87 && (<div style={{ display: "flex", gap: "10px", flexDirection: "column", width: "60px", height: "73px", border: "1px solid", borderRadius: "4px" }}>
                                                                                        <span style={{ textAlign: "center", color: " #415F9E", fontFamily: "poppins", fontSize: "15px", fontStyle: "normal", fontWeight: 600, lineHeight: "normal" }}>{newTimeSlot[t]} </span>
                                                                                        <span style={{ textAlign: "center", border: "1px solid #E3E8F1", width: "45px", position: "relative", left: "7px" }}></span>
                                                                                        <span style={{ textAlign: "center", color: " #5E7494", fontFamily: "poppins", fontSize: "16px", fontStyle: "normal", fontWeight: 600, lineHeight: "130%", letterSpacing: "0.016px" }} >{l.data.filter((m: any) => m.q15Time === newTimeSlot[t].replace(/:/g,'')+"-"+newTimeSlot[t+1].replace(/:/g,'') && m.location !== "" && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "")).length > 0 ? l.data.filter((m: any) => m.q15Time === newTimeSlot[t].replace(/:/g,'')+"-"+newTimeSlot[t+1].replace(/:/g,'') && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "")).map((n: any) => { return n.location }) : "NA"}-{l.data.filter((m: any) => m.q15Time === newTimeSlot[t].replace(/:/g,'')+"-"+newTimeSlot[t+1].replace(/:/g,'') && m.activity !== "" && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "")).length > 0 ? l.data.filter((m: any) => m.q15Time === newTimeSlot[t].replace(/:/g,'')+"-"+newTimeSlot[t+1].replace(/:/g,'') && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "")).map((n: any) => { return n.activity }) : "NA"}</span>
                                                                                    </div>)
                                                                                    })}

                                                                                </div>
                                                                                <span style={{ textAlign: "center", border: "1px solid", position: "relative", left: "7px", display: "flex", width: "calc(100% - 11px)", top: "116px", borderColor: "#E3E8F1" }}></span>
                                                                                <div style={{ display: "flex", justifyContent: "space-evenly", position: "relative", top: "130px" }}>
                                                                                    <div style={{ width: "158px", fontFamily: "poppins", fontSize: "14px", fontWeight: 500, color: "#000", lineHeight: "normal" }}>{newTimeSlot[88]} {newTimeSlot[88] >= "12:00" && newTimeSlot[88]<= "23:45"?"PM":"AM"} to {newTimeSlot[95]} {newTimeSlot[95] >= "12:00" && newTimeSlot[95]<= "23:45"?"PM":"AM"}:

                                                                                        <div style={{ position: "absolute", left: "unset", top: "70px", width: "131px", display: "flex", gap: "7px", whiteSpace: "nowrap" }}>
                                                                                            <div style={{ position: "relative", top: "5px", width: "fit-contant" }}>Entered By:</div>
                                                                                            <img src={Rectangle6215}></img>
                                                                                            <div style={{ fontFamily: "poppins", fontSize: "13px", fontWeight: 400, color: "#000", lineHeight: "normal", position: "relative", top: "5px" }}>{((newInputData.criteria === "" && l.enteredBy.shiftC.slot4 !== "" && l.enteredBy.shiftC.slot4 !== null) && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeC && l.shiftIncharge.shiftInchargeC !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeC !== "") && staffData.filter((i: any) => i.id === l.enteredBy.shiftC.slot4).map((tableData: any) => { return tableData.name[0].given + " " + tableData.name[0].family.charAt(0, 2) })) ||
                                                                                                ((newInputData.criteria !== "" && l.enteredBy.shiftC.slot4 !== "" && l.enteredBy.shiftC.slot4 !== null && l.enteredBy.shiftC.slot4 === newInputData.criteria) && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeC && l.shiftIncharge.shiftInchargeC !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeC !== "") && staffData.filter((i: any) => i.id === l.enteredBy.shiftC.slot4).map((tableData: any) => { return tableData.name[0].given + " " + tableData.name[0].family.charAt(0, 2) })) ||
                                                                                                staffData.filter((m: any) => m.id === newInputData.criteria && newInputData.criteria !== "" && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeC && l.shiftIncharge.shiftInchargeC !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeC !== "") && newInputData.criteria !== l.enteredBy.shiftC.slot4).map((m: any) => { return "--" }) && "--"}</div>
                                                                                        </div>
                                                                                    </div>
                                                                                    {newTimeSlot !== null && newTimeSlot !== undefined && newTimeSlot.length>0 &&newTimeSlot.map((s:any,t:number)=>{
                                                                                        return t >= 88 && t<= 95 && (<div style={{ display: "flex", gap: "10px", flexDirection: "column", width: "60px", height: "73px", border: "1px solid", borderRadius: "4px" }}>
                                                                                        <span style={{ textAlign: "center", color: " #415F9E", fontFamily: "poppins", fontSize: "15px", fontStyle: "normal", fontWeight: 600, lineHeight: "normal" }}>{newTimeSlot[t]} </span>
                                                                                        <span style={{ textAlign: "center", border: "1px solid #E3E8F1", width: "45px", position: "relative", left: "7px" }}></span>
                                                                                        <span style={{ textAlign: "center", color: " #5E7494", fontFamily: "poppins", fontSize: "16px", fontStyle: "normal", fontWeight: 600, lineHeight: "130%", letterSpacing: "0.016px" }} >{l.data.filter((m: any) => m.q15Time === newTimeSlot[t].replace(/:/g,'')+"-"+newTimeSlot[t=== 95?t=0:t+1].replace(/:/g,'') && m.location !== "" && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "")).length > 0 ? l.data.filter((m: any) => m.q15Time === newTimeSlot[t].replace(/:/g,'')+"-"+newTimeSlot[t=== 95?t=0:t+1].replace(/:/g,'') && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "")).map((n: any) => { return n.location }) : "NA"}-{l.data.filter((m: any) => m.q15Time === newTimeSlot[t].replace(/:/g,'')+"-"+newTimeSlot[t=== 95?t=0:t+1].replace(/:/g,'') && m.activity !== "" && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "")).length > 0 ? l.data.filter((m: any) => m.q15Time === newTimeSlot[t].replace(/:/g,'')+"-"+newTimeSlot[t=== 95?t=0:t+1].replace(/:/g,'') && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "")).map((n: any) => { return n.activity }) : "NA"}</span>
                                                                                    </div>)
                                                                                    })}

                                                                                </div>
                                                                            </Typography>
                                                                        </AccordionDetails>
                                                                    </Accordion>
                                                                </div>
                                                            </div>
                                                        </Typography>
                                                    </AccordionSummary>
                                                </Accordion>))) : (
                                        <div style={{ fontFamily: "poppins", fontSize: "18px", fontStyle: "normal", fontWeight: 600, lineHeight: "normal", textAlign: 'center' }}>No Records Found</div>
                                    )
                                    }
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    )) : <div style={{ fontFamily: "poppins", fontSize: "18px", fontStyle: "normal", fontWeight: 600, lineHeight: "normal", textAlign: 'center' }}>No Records Found</div>}
                </div>
            </div>
            <div id="q15Reports" hidden={true}>
{addCalendarDate !== undefined && addCalendarDate !== null && addCalendarDate.length !== 0 ? addCalendarDate.map((u: any) => (
    tableData !== null && tableData !== undefined && tableData.filter(j => u === moment(j.q15Date).format("YYYYMMDD")).length > 0 ? (tableData !== null && tableData !== undefined && tableData.filter(j => u === moment(j.q15Date).format("YYYYMMDD") && (newInputData.shiftIncharge === "" ||
    j.shiftIncharge.shiftInchargeA === newInputData.shiftIncharge || j.shiftIncharge.shiftInchargeB === newInputData.shiftIncharge || j.shiftIncharge.shiftInchargeC === newInputData.shiftIncharge) &&
    (newInputData.patientName === "" || newInputData.patientName === j.pid) && (newInputData.criteria === "" || newInputData.criteria === j.enteredBy.shiftA.slot1 || newInputData.criteria === j.enteredBy.shiftA.slot2 ||
        newInputData.criteria === j.enteredBy.shiftA.slot3 || newInputData.criteria === j.enteredBy.shiftA.slot4 || newInputData.criteria === j.enteredBy.shiftB.slot1 || newInputData.criteria === j.enteredBy.shiftB.slot2
        || newInputData.criteria === j.enteredBy.shiftB.slot3 || newInputData.criteria === j.enteredBy.shiftB.slot4 || newInputData.criteria === j.enteredBy.shiftC.slot1 || newInputData.criteria === j.enteredBy.shiftC.slot2
        || newInputData.criteria === j.enteredBy.shiftC.slot3 || newInputData.criteria === j.enteredBy.shiftC.slot4)).map((l: any) => (
    <div>
        <div>

            <div style={{ width: "90%", textAlign: "center", position: "relative", top: "20px" }}>Mettler Health Care Organization</div>
            <div style={{ width: "200px", height: "80px", border: "1px groove", position: "relative", left: "500px", bottom: "20px", textAlign: "center", lineHeight: 5 }}>{patientData.filter((i: any) => i.id === l.pid).map((tableData: any) => { return tableData.basicDetails[0].name[0].given + " " + tableData.basicDetails[0].name[0].family.charAt(0, 2) })}</div>
            <div style={{ width: "100%", height: "400px", border: "1px groove", top: "10px", display: "flex" }}>
                <div style={{ display: 'flex', flexDirection: "column", gap: "8px", position: "relative", left: "10px", top: "10px" }} >
                    <div style={{ whiteSpace: "nowrap", position: "relative", left: "80px" }}>Location Code</div>
                    <div>L1 Bedroom</div>
                    <div>L2 BedroomAwake</div>
                    <div>L3 BedroomAsleep</div>
                    <div>L4 Bathroom</div>
                    <div>L5 DayArea</div>
                    <div>L6 FishBowl</div>
                    <div>L7 ExamRoom</div>
                    <div>L8 WithNurse</div>
                    <div>L9 OnPass</div>
                    <div>L10 WithTherapist</div>
                    <div>L11 School</div>
                </div>
                <div style={{ display: 'flex', flexDirection: "column", gap: "8px", position: "relative", left: "50px", borderRight: "1px groove", width: "20%" }} >
                    <div style={{ position: "relative", top: "30px", display: 'flex', flexDirection: "column", gap: "8px", }}>
                        <div style={{ whiteSpace: "nowrap" }}></div>
                        <div>L12 Cafeteria</div>
                        <div>L13 Outdoors</div>
                        <div>L14 TR Room</div>
                        <div>L15 Gym</div>
                        <div>L16 Fish Bowl</div>
                        <div>L17 Playground</div>
                        <div>L18 On Visit</div>
                        <div>L19 On Pass</div>
                        <div>L20 Quiet Room</div>
                        <div>L21 Seclusion</div>
                        <div>L22 </div>
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: "column", gap: "8px", position: "relative", left: "60px", }} >
                    <div style={{ position: "relative", top: "10px", display: 'flex', flexDirection: "column", gap: "8px", }}>
                        <div style={{ whiteSpace: "nowrap", position: "relative", left: "50px" }}>Activity</div>
                        <div>Sucide</div>
                        <div>Homicidal</div>
                        <div>Elopement</div>
                        <div>Assauiltive</div>
                        <div>Psychosis</div>
                        <div>Self Abuse</div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div> </div>
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: "column", gap: "8px", position: "relative", left: "80px", borderRight: "1px groove", width: "12%" }} >
                    <div style={{ position: "relative", top: "33px", display: 'flex', flexDirection: "column", gap: "8px", }}>
                        <div style={{ whiteSpace: "nowrap" }}></div>
                        <div>Sucide</div>
                        <div>Homicidal</div>
                        <div>Elopement</div>
                        <div>Assauiltive</div>
                        <div>Psychosis</div>
                        <div>Self Abuse</div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div> </div>
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: "column", gap: "8px", position: "relative", left: "90px", }} >
                    <div style={{ position: "relative", top: "10px", display: 'flex', flexDirection: "column", gap: "8px", }}>
                        <div style={{ whiteSpace: "nowrap", position: "relative", left: "50px" }}>Restriction(circle)</div>
                        <div>phone</div>
                        <div>visitor</div>
                        <div>unit</div>
                        <div>other:</div>
                        <div></div>
                        <div ></div>
                        <div style={{ border: "1px groove", }}></div>
                        <div></div>
                        <div style={{ border: "1px groove", }}></div>
                        <div></div>
                        <div style={{ border: "1px groove", }}> </div>
                    </div>
                </div>
            </div>
        </div>
        <div style={{ width: "100%", height: "30px" }}></div>

        <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ width: '10%', border: '1px solid #C9C9C9', textAlign: 'center' }}></div>
            <div style={{ width: '13%', border: '1px solid #C9C9C9', textAlign: 'center' }}>Loction</div>
            <div style={{ width: '10%', border: '1px solid #C9C9C9', textAlign: 'center' }}>Initial</div>
            <div style={{ width: '10%', border: '1px solid #C9C9C9', textAlign: 'center' }}></div>
            <div style={{ width: '14%', border: '1px solid #C9C9C9', textAlign: 'center' }}>Loction</div>
            <div style={{ width: '10%', border: '1px solid #C9C9C9', textAlign: 'center' }}>Initial</div>
            <div style={{ width: '10%', border: '1px solid #C9C9C9', textAlign: 'center' }}></div>
            <div style={{ width: '13%', border: '1px solid #C9C9C9', textAlign: 'center' }}>Loction</div>
            <div style={{ width: '10%', border: '1px solid #C9C9C9', textAlign: 'center' }}>Initial</div>
        </div>
        <div style={{ width: '100%', display: 'flex' }}>
            <div style={{ width: '33%' }}>
                {newTimeSlot !== null && newTimeSlot !== undefined && newTimeSlot.length>0 &&newTimeSlot.map((s:any,t:number)=>{return t >= 0 && t<=15 && (<>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <div style={{ width: '30.7%', border: '1px solid #C9C9C9', textAlign: 'center' }}>{s}</div>
                        <div style={{ width: '40%', border: '1px solid #C9C9C9', textAlign: 'center' }}>{l.data.filter((m: any) => m.q15Time === newTimeSlot[t].replace(/:/g,'')+"-"+newTimeSlot[t+1].replace(/:/g,'') && m.location !== "" && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "")).length > 0 ? l.data.filter((m: any) => m.q15Time === newTimeSlot[t].replace(/:/g,'')+"-"+newTimeSlot[t+1].replace(/:/g,'') && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "")).map((n: any) => { return n.location }) : ""}</div>
                        <div style={{ width: '31%', border: '1px solid #C9C9C9', textAlign: 'center' }}>{l.data.filter((m: any) => m.q15Time === newTimeSlot[t].replace(/:/g,'')+"-"+newTimeSlot[t+1].replace(/:/g,'') && m.activity !== "" && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "")).length > 0 ? l.data.filter((m: any) => m.q15Time === newTimeSlot[t].replace(/:/g,'')+"-"+newTimeSlot[t+1].replace(/:/g,'') && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "")).map((n: any) => { return n.activity }) : ""}</div>
                    </div>
                </>)})}
            </div>
            <div style={{ width: '34%' }}>
            {newTimeSlot !== null && newTimeSlot !== undefined && newTimeSlot.length>0 &&newTimeSlot.map((s:any,t:number)=>{return t >= 16 && t<=31 && (<>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <div style={{ width: '30.7%', border: '1px solid #C9C9C9', textAlign: 'center' }}>{s}</div>
                        <div style={{ width: '40%', border: '1px solid #C9C9C9', textAlign: 'center' }}>{l.data.filter((m: any) => m.q15Time === newTimeSlot[t].replace(/:/g,'')+"-"+newTimeSlot[t+1].replace(/:/g,'') && m.location !== "" && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "")).length > 0 ? l.data.filter((m: any) => m.q15Time === newTimeSlot[t].replace(/:/g,'')+"-"+newTimeSlot[t+1].replace(/:/g,'') && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "")).map((n: any) => { return n.location }) : ""}</div>
                        <div style={{ width: '31%', border: '1px solid #C9C9C9', textAlign: 'center' }}>{l.data.filter((m: any) => m.q15Time === newTimeSlot[t].replace(/:/g,'')+"-"+newTimeSlot[t+1].replace(/:/g,'') && m.activity !== "" && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "")).length > 0 ? l.data.filter((m: any) => m.q15Time === newTimeSlot[t].replace(/:/g,'')+"-"+newTimeSlot[t+1].replace(/:/g,'') && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "")).map((n: any) => { return n.activity }) : ""}</div>
                    </div>
                </>)})}
            </div>
            <div style={{ width: '33%' }}>
            {newTimeSlot !== null && newTimeSlot !== undefined && newTimeSlot.length>0 &&newTimeSlot.map((s:any,t:number)=>{return t >= 32 && t<=47 && (<>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <div style={{ width: '30.7%', border: '1px solid #C9C9C9', textAlign: 'center' }}>{s}</div>
                        <div style={{ width: '40%', border: '1px solid #C9C9C9', textAlign: 'center' }}>{l.data.filter((m: any) => m.q15Time === newTimeSlot[t].replace(/:/g,'')+"-"+newTimeSlot[t+1].replace(/:/g,'') && m.location !== "" && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "")).length > 0 ? l.data.filter((m: any) => m.q15Time === newTimeSlot[t].replace(/:/g,'')+"-"+newTimeSlot[t+1].replace(/:/g,'') && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "")).map((n: any) => { return n.location }) : ""}</div>
                        <div style={{ width: '31%', border: '1px solid #C9C9C9', textAlign: 'center' }}>{l.data.filter((m: any) => m.q15Time === newTimeSlot[t].replace(/:/g,'')+"-"+newTimeSlot[t+1].replace(/:/g,'') && m.activity !== "" && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "")).length > 0 ? l.data.filter((m: any) => m.q15Time === newTimeSlot[t].replace(/:/g,'')+"-"+newTimeSlot[t+1].replace(/:/g,'') && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "")).map((n: any) => { return n.activity }) : ""}</div>
                    </div>
                </>)})}
            </div>

        </div>


        <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ width: '10%', border: '1px solid #C9C9C9', textAlign: 'center' }}></div>
            <div style={{ width: '13%', border: '1px solid #C9C9C9', textAlign: 'center' }}>Loction</div>
            <div style={{ width: '10%', border: '1px solid #C9C9C9', textAlign: 'center' }}>Initial</div>
            <div style={{ width: '10%', border: '1px solid #C9C9C9', textAlign: 'center' }}></div>
            <div style={{ width: '14%', border: '1px solid #C9C9C9', textAlign: 'center' }}>Loction</div>
            <div style={{ width: '10%', border: '1px solid #C9C9C9', textAlign: 'center' }}>Initial</div>
            <div style={{ width: '10%', border: '1px solid #C9C9C9', textAlign: 'center' }}></div>
            <div style={{ width: '13%', border: '1px solid #C9C9C9', textAlign: 'center' }}>Loction</div>
            <div style={{ width: '10%', border: '1px solid #C9C9C9', textAlign: 'center' }}>Initial</div>
        </div>
        <div style={{ width: '100%', display: 'flex' }}>
            <div style={{ width: '33%' }}>
            {newTimeSlot !== null && newTimeSlot !== undefined && newTimeSlot.length>0 &&newTimeSlot.map((s:any,t:number)=>{return t >= 48 && t<= 63 && (<>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <div style={{ width: '30.7%', border: '1px solid #C9C9C9', textAlign: 'center' }}>{s}</div>
                        <div style={{ width: '40%', border: '1px solid #C9C9C9', textAlign: 'center' }}>{l.data.filter((m: any) => m.q15Time === newTimeSlot[t].replace(/:/g,'')+"-"+newTimeSlot[t+1].replace(/:/g,'') && m.location !== "" && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "")).length > 0 ? l.data.filter((m: any) => m.q15Time === newTimeSlot[t].replace(/:/g,'')+"-"+newTimeSlot[t+1].replace(/:/g,'') && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "")).map((n: any) => { return n.location }) : ""}</div>
                        <div style={{ width: '31%', border: '1px solid #C9C9C9', textAlign: 'center' }}>{l.data.filter((m: any) => m.q15Time === newTimeSlot[t].replace(/:/g,'')+"-"+newTimeSlot[t+1].replace(/:/g,'') && m.activity !== "" && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "")).length > 0 ? l.data.filter((m: any) => m.q15Time === newTimeSlot[t].replace(/:/g,'')+"-"+newTimeSlot[t+1].replace(/:/g,'') && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "")).map((n: any) => { return n.activity }) : ""}</div>
                    </div>
                </>)})}
            </div>
            <div style={{ width: '34%' }}>
            {newTimeSlot !== null && newTimeSlot !== undefined && newTimeSlot.length>0 &&newTimeSlot.map((s:any,t:number)=>{return t >= 64 && t<= 79 && (<>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <div style={{ width: '30.7%', border: '1px solid #C9C9C9', textAlign: 'center' }}>{s}</div>
                        <div style={{ width: '40%', border: '1px solid #C9C9C9', textAlign: 'center' }}>{l.data.filter((m: any) => m.q15Time === newTimeSlot[t].replace(/:/g,'')+"-"+newTimeSlot[t+1].replace(/:/g,'') && m.location !== "" && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "")).length > 0 ? l.data.filter((m: any) => m.q15Time === newTimeSlot[t].replace(/:/g,'')+"-"+newTimeSlot[t+1].replace(/:/g,'') && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "")).map((n: any) => { return n.location }) : ""}</div>
                        <div style={{ width: '31%', border: '1px solid #C9C9C9', textAlign: 'center' }}>{l.data.filter((m: any) => m.q15Time === newTimeSlot[t].replace(/:/g,'')+"-"+newTimeSlot[t+1].replace(/:/g,'') && m.activity !== "" && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "")).length > 0 ? l.data.filter((m: any) => m.q15Time === newTimeSlot[t].replace(/:/g,'')+"-"+newTimeSlot[t+1].replace(/:/g,'') && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "")).map((n: any) => { return n.activity }) : ""}</div>
                    </div>
                </>)})}
            </div>
            <div style={{ width: '33%' }}>
            {newTimeSlot !== null && newTimeSlot !== undefined && newTimeSlot.length>0 &&newTimeSlot.map((s:any,t:number)=>{return t >= 80 && t<= 95 && (<>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <div style={{ width: '30.7%', border: '1px solid #C9C9C9', textAlign: 'center' }}>{s}</div>
                        <div style={{ width: '40%', border: '1px solid #C9C9C9', textAlign: 'center' }}>{l.data.filter((m: any) => m.q15Time === newTimeSlot[t].replace(/:/g,'')+"-"+newTimeSlot[t=== 95?t=0:t+1].replace(/:/g,'') && m.location !== "" && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "")).length > 0 ? l.data.filter((m: any) => m.q15Time === newTimeSlot[t].replace(/:/g,'')+"-"+newTimeSlot[t=== 95?t=0:t+1].replace(/:/g,'') && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "")).map((n: any) => { return n.location }) : ""}</div>
                        <div style={{ width: '31%', border: '1px solid #C9C9C9', textAlign: 'center' }}>{l.data.filter((m: any) => m.q15Time === newTimeSlot[t].replace(/:/g,'')+"-"+newTimeSlot[t=== 95?t=0:t+1].replace(/:/g,'') && m.activity !== "" && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "")).length > 0 ? l.data.filter((m: any) => m.q15Time === newTimeSlot[t].replace(/:/g,'')+"-"+newTimeSlot[t=== 95?t=0:t+1].replace(/:/g,'') && ((newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "") || newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "")).map((n: any) => { return n.activity }) : ""}</div>
                    </div>
                </>)})}
            </div>
        </div>
        <div style={{ width: "100%", height: "30px" }}></div>
        <div style={{ display: 'flex', flexDirection: "row", width: "100%", justifyContent: "space-between" }} >
            <div style={{ width: '20%', border: '1px solid #C9C9C9', textAlign: 'center', height: "50px", lineHeight: 2.5 }}>Shift</div>
            <div style={{ width: '50%', border: '1px solid #C9C9C9', textAlign: 'center', height: "50px", lineHeight: 2.5 }}>Staff Name</div>
            <div style={{ width: '15%', border: '1px solid #C9C9C9', textAlign: 'center', height: "50px", lineHeight: 2.5 }}>Initial</div>
            <div style={{ width: '50%', border: '1px solid #C9C9C9', textAlign: 'center', height: "50px", lineHeight: 2.5 }}>Sign Name</div>
        </div>
        <div style={{ display: 'flex', flexDirection: "row", width: "100%", justifyContent: "space-between" }} >
            <div style={{ width: '20%', border: '1px solid #C9C9C9', textAlign: 'center', height: "30px", lineHeight: 2.5 }}>{newTimeSlot[0]} to {newTimeSlot[31]}</div>
            <div style={{ width: '50%', border: '1px solid #C9C9C9', textAlign: 'center', height: "30px", lineHeight: 1.5 }}>
            {newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "" && staffData.filter((i:any) => i.id === l.shiftIncharge.shiftInchargeA).map((tableData:any) => { return tableData.name[0].given }) ||
                                                        newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "" && staffData.filter((i:any) => i.id === l.shiftIncharge.shiftInchargeA && i.id === newInputData.shiftIncharge).map((tableData:any) => { return tableData.name[0].given }) || "--"}
            </div>
            <div style={{ width: '15%', border: '1px solid #C9C9C9', textAlign: 'center', height: "30px", lineHeight: 1.5 }}>{newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "" && staffData.filter((i:any) => i.id === l.shiftIncharge.shiftInchargeA).map((tableData:any) => { return tableData.name[0].family.charAt(0, 2) }) ||
                                                        newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeA && l.shiftIncharge.shiftInchargeA !== "" && staffData.filter((i:any) => i.id === l.shiftIncharge.shiftInchargeA && i.id === newInputData.shiftIncharge).map((tableData:any) => { return tableData.name[0].family.charAt(0, 2) }) || "--"}</div>
            <div style={{ width: '50%', border: '1px solid #C9C9C9', textAlign: 'center', height: "30px", lineHeight: 2.5 }}></div>
        </div>
        <div style={{ display: 'flex', flexDirection: "row", width: "100%", justifyContent: "space-between" }} >
            <div style={{ width: '20%', border: '1px solid #C9C9C9', textAlign: 'center', height: "30px", lineHeight: 2.5 }}>{newTimeSlot[32]} to {newTimeSlot[63]}</div>
            <div style={{ width: '50%', border: '1px solid #C9C9C9', textAlign: 'center', height: "30px", lineHeight: 1.5 }}>
            {newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "" && staffData.filter((i:any) => i.id === l.shiftIncharge.shiftInchargeB).map((tableData:any) => { return tableData.name[0].given }) ||
                                                        newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeB && l.shiftIncharge.shiftInchargeB !== "" && staffData.filter((i:any) => i.id === l.shiftIncharge.shiftInchargeB && i.id === newInputData.shiftIncharge).map((tableData:any) => { return tableData.name[0].given }) || "--"}
            </div>
            <div style={{ width: '15%', border: '1px solid #C9C9C9', textAlign: 'center', height: "30px", lineHeight: 1.5 }}>{newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "" && staffData.filter((i:any) => i.id === l.shiftIncharge.shiftInchargeB).map((tableData:any) => { return tableData.name[0].family.charAt(0, 2) }) ||
                                                        newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeB && l.shiftIncharge.shiftInchargeB !== "" && staffData.filter((i:any) => i.id === l.shiftIncharge.shiftInchargeB && i.id === newInputData.shiftIncharge).map((tableData:any) => { return tableData.name[0].family.charAt(0, 2) }) || "--"}</div>
            <div style={{ width: '50%', border: '1px solid #C9C9C9', textAlign: 'center', height: "30px", lineHeight: 2.5 }}></div>
        </div>
        <div style={{ display: 'flex', flexDirection: "row", width: "100%", justifyContent: "space-between" }} >
            <div style={{ width: '20%', border: '1px solid #C9C9C9', textAlign: 'center', height: "30px", lineHeight: 2.5 }}>{newTimeSlot[64]} to {newTimeSlot[95]}</div>
            <div style={{ width: '50%', border: '1px solid #C9C9C9', textAlign: 'center', height: "30px", lineHeight: 1.5 }}>
            {newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "" && staffData.filter((i:any) => i.id === l.shiftIncharge.shiftInchargeC).map((tableData:any) => { return tableData.name[0].given }) ||
            newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeC && l.shiftIncharge.shiftInchargeC !== "" && staffData.filter((i:any) => i.id === l.shiftIncharge.shiftInchargeC && i.id === newInputData.shiftIncharge).map((tableData:any) => { return tableData.name[0].given }) || "--"}
            </div>
            <div style={{ width: '15%', border: '1px solid #C9C9C9', textAlign: 'center', height: "30px", lineHeight: 1.5 }}>{newInputData.shiftIncharge === "" && l.shiftIncharge.shiftInchargeA !== "" && staffData.filter((i:any) => i.id === l.shiftIncharge.shiftInchargeC).map((tableData:any) => { return tableData.name[0].family.charAt(0, 2) }) ||
                                                        newInputData.shiftIncharge !== "" && newInputData.shiftIncharge === l.shiftIncharge.shiftInchargeC && l.shiftIncharge.shiftInchargeC !== "" && staffData.filter((i:any) => i.id === l.shiftIncharge.shiftInchargeC && i.id === newInputData.shiftIncharge).map((tableData:any) => { return tableData.name[0].family.charAt(0, 2) }) || "--"}</div>
            <div style={{ width: '50%', border: '1px solid #C9C9C9', textAlign: 'center', height: "30px", lineHeight: 2.5 }}></div>
        </div>
        <div style={{ width: "100%", height: "355px"}}></div>
    </div>
    ))) : (
        <div style={{ fontFamily: "poppins", fontSize: "18px", fontStyle: "normal", fontWeight: 600, lineHeight: "normal", textAlign: 'center' }}>No Records Found</div>
    )    
)       ):<div style={{ fontFamily: "poppins", fontSize: "18px", fontStyle: "normal", fontWeight: 600, lineHeight: "normal", textAlign: 'center' }}>No Records Found</div>}

</div>
        </div>
    );
};