import React, { useEffect, useState } from 'react'
import './shifttab.css'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'
import { getPSConfigByDate } from '../../slices/thunk'
import { FaMinusCircle, FaPlusCircle } from 'react-icons/fa'
import { Autocomplete, Checkbox, Chip, FormControl, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, TextField } from '@mui/material';
 
interface ShiftTabProps {
    shiftName: string
    date: any
    startTime: string
    endTime: string
    slot1Time: any
    slot2Time: any
    slot3Time: any
    slot4Time: any
    selectedIncharge: string
    selectedSWorker1: any
    selectedSWorker2: any
    selectedSWorker3: any
    selectedSWorker4: any  
}
 
const ShiftTab = (props: ShiftTabProps) => {
    const { shiftName, date, endTime, startTime, slot1Time, slot2Time, slot3Time, slot4Time, selectedIncharge, selectedSWorker1, selectedSWorker2, selectedSWorker3, selectedSWorker4} = props
    const { rnInchargeList, socialWorkerList } = useSelector((state: any) => state.PSConfig)
    const dispatch = useDispatch();  
   
    const [incharge, setIncharge] = useState<any>(selectedIncharge)
    let slotRegister = [{
        roomRange: [],
        staffName: "",
        staff: "",
        startRoomNo:"",
        endRoomNo:""  
    }]
    let [slotRegister1, setSlotRegister1] = useState(slotRegister);
    let [slotRegister2, setSlotRegister2] = useState(slotRegister);
    let [slotRegister3, setSlotRegister3] = useState(slotRegister);
    let [slotRegister4, setSlotRegister4] = useState(slotRegister);
    let [allStaffData, setAllStaffData] = useState(new Array<any>());  
    let [addStaffData, setAddStaffData] = useState(new Array<any>());  
 
    const date1 = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const forDate = `${year}${month}${date1}`
 
    const bodyA = {
        id:"",date:forDate,createdAt:"",updatedAt:"",shift :[{shiftName,rnIncharge:incharge,startTime,endTime,schedule:[{time:slot1Time,roomRange: [],bedStaff:slotRegister1.map((k) => ({staff: `${k.staff}`,startRoomNo: `${k.startRoomNo}`,endRoomNo: `${k.endRoomNo}`}))},{time:slot2Time,roomRange: [],bedStaff:slotRegister2.map((k) => ({staff: `${k.staff}`,startRoomNo: `${k.startRoomNo}`,endRoomNo: `${k.endRoomNo}`}))},{time:slot3Time,roomRange: [],bedStaff:slotRegister3.map((k) => ({staff: `${k.staff}`,startRoomNo: `${k.startRoomNo}`,endRoomNo: `${k.endRoomNo}`}))},{time:slot4Time,roomRange: [],bedStaff:slotRegister4.map((k) => ({staff: `${k.staff}`,startRoomNo: `${k.startRoomNo}`,endRoomNo: `${k.endRoomNo}`}))}]}]}
    const bodyB = {
        id:"",date:forDate,createdAt:"",updatedAt:"",shift :[{shiftName,rnIncharge:incharge,startTime,endTime,schedule:[{time:slot1Time,roomRange: [],bedStaff:slotRegister1.map((k) => ({staff: `${k.staff}`,startRoomNo: `${k.startRoomNo}`,endRoomNo: `${k.endRoomNo}`}))},{time:slot2Time,roomRange: [],bedStaff:slotRegister2.map((k) => ({staff: `${k.staff}`,startRoomNo: `${k.startRoomNo}`,endRoomNo: `${k.endRoomNo}`}))},{time:slot3Time,roomRange: [],bedStaff:slotRegister3.map((k) => ({staff: `${k.staff}`,startRoomNo: `${k.startRoomNo}`,endRoomNo: `${k.endRoomNo}`}))},{time:slot4Time,roomRange: [],bedStaff:slotRegister4.map((k) => ({staff: `${k.staff}`,startRoomNo: `${k.startRoomNo}`,endRoomNo: `${k.endRoomNo}`}))}]}]}
    const bodyC = {
        id:"",date:forDate,createdAt:"",updatedAt:"",shift :[{shiftName,rnIncharge:incharge,startTime,endTime,schedule:[{time:slot1Time,roomRange: [],bedStaff:slotRegister1.map((k) => ({staff: `${k.staff}`,startRoomNo: `${k.startRoomNo}`,endRoomNo: `${k.endRoomNo}`}))},{time:slot2Time,roomRange: [],bedStaff:slotRegister2.map((k) => ({staff: `${k.staff}`,startRoomNo: `${k.startRoomNo}`,endRoomNo: `${k.endRoomNo}`}))},{time:slot3Time,roomRange: [],bedStaff:slotRegister3.map((k) => ({staff: `${k.staff}`,startRoomNo: `${k.startRoomNo}`,endRoomNo: `${k.endRoomNo}`}))},{time:slot4Time,roomRange: [],bedStaff:slotRegister4.map((k) => ({staff: `${k.staff}`,startRoomNo: `${k.startRoomNo}`,endRoomNo: `${k.endRoomNo}`}))}]}]}
    // const bodyD = {
    //     date:forDate,shift :[{shiftName,rnIncharge:incharge,startTime,endTime,schedule:[{time:slot1Time,bedStaff:slotRegister1.map((k) => ({staff: `${k.staff}`,startRoomNo: `${k.startRoomNo}`,endRoomNo: `${k.endRoomNo}`}))},{time:slot2Time,bedStaff:slotRegister2.map((k) => ({staff: `${k.staff}`,startRoomNo: `${k.startRoomNo}`,endRoomNo: `${k.endRoomNo}`}))},{time:slot3Time,bedStaff:slotRegister4.map((k) => ({staff: `${k.staff}`,startRoomNo: `${k.startRoomNo}`,endRoomNo: `${k.endRoomNo}`}))},{time:slot4Time,bedStaff:slotRegister2.map((k) => ({staff: `${k.staff}`,startRoomNo: `${k.startRoomNo}`,endRoomNo: `${k.endRoomNo}`}))}]}]}
    const baseURL = 'http://47.32.254.89:7000/api'
    const successCode = 'MHC - 0200'
 
const handleSubmit = async() => {  
        try {
            let bodyData;
            // if (!incharge || !slot1Staff1 || !slot2Staff1 || !slot3Staff1 || !slot4Staff1) {
            //     toast.error('Please fill in all required fields');
            //     return;
            // }
            if(shiftName === "Shift-A"){bodyData = { ...bodyA };} else if(shiftName === "Shift-B")bodyData = { ...bodyB };else bodyData = { ...bodyC };
           
            const response = await axios.post(`${baseURL}/PSConfig/register`, bodyData);  
            if (response.data.message.code === successCode) {
                toast.success(response.data.message.description)
               
            } else {
                toast.error("Login failed: " + response.data.message.description);
            }
        } catch (error) {
            // console.log("Date: ",forDate)
            // console.error("Error during Register:", error);
            toast.error("An error occurred during register.");
        }
}
 
 
const handleCancel = () => {  
    setIncharge(selectedIncharge);
    // getPSConfigByDate(dispatch, forDate)
}
 
useEffect(() => {  
    setAllStaffData(socialWorkerList !== null && socialWorkerList !== undefined ? socialWorkerList: []);
    setAddStaffData(socialWorkerList !== null && socialWorkerList !== undefined ? socialWorkerList.map((k: any) => { return k.name[0].given + " " + k.name[0].family }): [])    
}, [dispatch])
 
useEffect(() => {  
    setSlotRegister1(selectedSWorker1 !== null && selectedSWorker1 !== undefined ? selectedSWorker1:slotRegister);
    setSlotRegister2(selectedSWorker2 !== null && selectedSWorker2 !== undefined ? selectedSWorker2:slotRegister);
    setSlotRegister3(selectedSWorker3 !== null && selectedSWorker3 !== undefined ? selectedSWorker3:slotRegister);
    setSlotRegister4(selectedSWorker4 !== null && selectedSWorker4 !== undefined ? selectedSWorker4:slotRegister);    
    setIncharge(selectedIncharge);
}, [selectedIncharge, selectedSWorker1, selectedSWorker2, selectedSWorker3, selectedSWorker4]);
 
    const [roomNumbers, setRoomNumbers] = useState(new Array<any>());
    const [selectedRoomNumbers, setSelectedRoomNumbers] = useState([]);
 
    useEffect(() => {
        fetch('http://47.32.254.89:7000/api/Q15Bed/getByOccupied/sFLIzAZzrg')
        .then(response => response.json())
        .then(data => {
            const rooms = data.data.map((item:any) => item.roomNo);
            setRoomNumbers(rooms);
        })
        .catch(error => console.error('Error fetching room numbers:', error));
    }, []);
 
   
    const handleFieldRemove1 = (index:any) => {
        const list = [...slotRegister1];
        list.splice(index, 1);
        setSlotRegister1(list);
    };
   
    const handleFieldAdd1 = () => {
   
        setSlotRegister1([...slotRegister1,
        {
            roomRange: [],
            staffName: "",
            staff: "",
            startRoomNo:"",
            endRoomNo:""
        }]);
    };
 
 
    const handleFieldRemove2 = (index:any) => {
        const list = [...slotRegister2];
        list.splice(index, 1);
        setSlotRegister2(list);
    };
   
    const handleFieldAdd2 = () => {
   
        setSlotRegister2([...slotRegister2,
        {
            roomRange: [],
            staffName: "",
            staff: "",
            startRoomNo:"",
            endRoomNo:""
        }]);
    };
 
    const handleFieldRemove3 = (index:any) => {
        const list = [...slotRegister3];
        list.splice(index, 1);
        setSlotRegister3(list);
    };
   
    const handleFieldAdd3 = () => {
   
        setSlotRegister3([...slotRegister3,
        {
            roomRange: [],
            staffName: "",
            staff: "",
            startRoomNo:"",
            endRoomNo:""
        }]);
    };
 
 
    const handleFieldRemove4 = (index:any) => {
        const list = [...slotRegister4];
        list.splice(index, 1);
        setSlotRegister4(list);
    };
   
    const handleFieldAdd4 = () => {
   
        setSlotRegister4([...slotRegister4,
        {
            roomRange: [],
            staffName: "",
            staff: "",
            startRoomNo:"",
            endRoomNo:""
        }]);
    };
   
      const isAllSelected = selectedRoomNumbers.length === roomNumbers.length;
   
    return (
        <React.Fragment>
            <div className="p-3">
                <div className="d-flex justify-content-center align-items-center rounded p-1" style={{ backgroundColor: '#0f3995' }}>
                    <span className='text-white'>{shiftName} Configuration</span>
                </div>
                <div className='row mt-1 p-1'>
                    <div className="form-floating mb-3 col-md-2 p-1" >
                        <input type="text" value={startTime} className="form-control" id="floatingStartTime" disabled placeholder='start time' />
                        <label htmlFor="floatingStartTime">Start Time</label>
                    </div>
                    <div className="form-floating mb-3 col-md-2 p-1">
                        <input type="text" value={endTime} className="form-control" id="floatingEndTime" disabled placeholder='end time' />
                        <label htmlFor="floatingEndTime">End Time</label>
                    </div>
                    <div className="mb-3 col-md-6 form-floating p-1">
                        <select className="form-select" id="floatingSelect" onChange={ (e:any) => setIncharge(e.target.value) } value={incharge ? incharge : ""}>
                        <option value="">Select RN Incharge</option>
                            {
                                rnInchargeList?.map((item: any) => {
                                    return (
                                        <option value={item?.id}>{item?.name[0]?.given + ' ' + item?.name[0]?.family}</option>
                                    )
                                })
                            }
                        </select>
                        <label htmlFor='floatingSelect'>Shift Incharge</label>
                    </div>
                </div>
                <div className="row" style={{height:'30px'}}><div className="col-md-6" style={{backgroundColor: '#e6f0ff'}}>
                <div className="row p-2">
                <div className="form-floating mb-3 col-md-6"></div>
                <div className="mb-3 col-md-4">
                <label htmlFor="floatingEndTime">Room Number</label>
                </div>                
                <div className="form-floating mb-3 col-md-2"></div>
                </div>
                </div><div className="col-md-6" style={{backgroundColor: '#e6f0ff'}}>
                <div className="row p-2">
                <div className="form-floating mb-3 col-md-6"></div>
                <div className="mb-3 col-md-4">
                <label htmlFor="floatingEndTime">Room Number</label>
                </div>                
                <div className="form-floating mb-3 col-md-2"></div>
                </div>
                </div></div>
                <div className="row">
                <div className="col-md-6" style={{backgroundColor: '#e6f0ff'}}>
                <div className="row p-2 d-flex flex-column">
                {(slotRegister1.map((addField, index) => (
                                <div key={index} style={{display:'inline-flex', backgroundColor: '#e6f0ff'}}>
                                    <div className="form-floating mb-3 col-md-2">
                                        {index === 0 && <> <input type="text" style={{fontSize:'10px'}} value={slot1Time} className="form-control" id="floatingEndTime" disabled placeholder='end time' />
                                <label htmlFor="floatingEndTime" style={{fontSize:'15px'}}>Slot 1</label></>}                              
                            </div>
                            <div className="mb-3 col-md-4 form-floating p-1">  
                            <select className="form-select" id="floatingSelect" onChange={ (e:any) =>   {let data = [...slotRegister1];
                              data[index].staff = e.target.value;                                                        
                          setSlotRegister1(data)}} value={addField.staff}>
                        <option value="">Select Social Workers</option>
                            {
                                socialWorkerList?.map((item: any) => {
                                    return (
                                        <option value={item?.id}>{item?.name[0]?.given + ' ' + item?.name[0]?.family}</option>
                                    )
                                })
                            }
                        </select>
                        <label htmlFor='floatingSelect' style={{fontSize:'15px'}}>Select Social Workers</label>                                                
                        </div>
 
                        <div className="form-floating mb-3 col-md-2 p-1">
                        <select className="form-select" id="floatingSelect" onChange={ (e:any) => {
                              let data = [...slotRegister1];
                              data[index].startRoomNo = e.target.value;                                                        
                          setSlotRegister1(data)
                        }} value={addField.startRoomNo}>    
                        <option value="">-select-</option>                  
                            {
                                roomNumbers?.map((item: any) => {
                                    return (
                                        <option value={item}>{item}</option>
                                    )
                                })
                            }
                        </select>
                        <label htmlFor='floatingSelect'style={{fontSize:'15px'}}>Start</label>                                                                
                    </div>
                    <div className="form-floating mb-3 col-md-2 p-1">
                    <select className="form-select" id="floatingSelect" onChange={ (e:any) => {
                              let data = [...slotRegister1];
                              data[index].endRoomNo = e.target.value;                                                
                          setSlotRegister1(data)
                        }} value={addField.endRoomNo}>      
                         <option value="">-select-</option>                                
                            {
                                roomNumbers?.map((item: any) => {
                                    return (
                                        <option value={item}>{item}</option>
                                    )
                                })
                            }
                        </select>
                        <label htmlFor='floatingSelect' style={{fontSize:'15px'}}>End</label>              
                    </div>                                                                
                    <div className='col-md-1 d-flex align-items-center' role='button'>{slotRegister1.map((addField, index) => (
                                          slotRegister1.length - 1 === index &&
                                <FaPlusCircle  onClick={handleFieldAdd1}/>
                                ))} </div>      
                                    <div className='col-md-1 d-flex align-items-center' role='button'>{slotRegister1.length !== 1 && (
                                    <FaMinusCircle onClick={() => handleFieldRemove1(index)}/>
                                    )}</div>                                                                                    
                                    </div>
                                   
                            )))}  
                                </div>
                </div>
                <div className="col-md-6" style={{backgroundColor: '#e6f0ff'}}>
                                    <div className="row p-2 d-flex flex-column">
                            {(slotRegister2.map((addField, index) => (
                                <div key={index} style={{display:'inline-flex', backgroundColor: '#e6f0ff'}}>
                                   
                                    <div className="form-floating mb-3 col-md-2">
                                        {index === 0 && <> <input type="text" style={{fontSize:'10px'}} value={slot2Time} className="form-control" id="floatingEndTime" disabled placeholder='end time' />
                                <label htmlFor="floatingEndTime" style={{fontSize:'15px'}}>Slot 2</label></>}                              
                            </div>
                            <div className="mb-3 col-md-4 form-floating p-1">
                            <select className="form-select" id="floatingSelect" onChange={ (e:any) =>   {let data = [...slotRegister2];
                              data[index].staff = e.target.value;                                                        
                          setSlotRegister2(data)}} value={addField.staff}>
                        <option value="">Select Social Workers</option>
                            {
                                socialWorkerList?.map((item: any) => {
                                    return (
                                        <option value={item?.id}>{item?.name[0]?.given + ' ' + item?.name[0]?.family}</option>
                                    )
                                })
                            }
                        </select>
                        <label htmlFor='floatingSelect' style={{fontSize:'15px'}}>Select Social Workers</label>  
                        </div>
                        <div className="form-floating mb-3 col-md-2 p-1">
                        <select className="form-select" id="floatingSelect" onChange={ (e:any) => {
                              let data = [...slotRegister2];
                              data[index].startRoomNo = e.target.value;                                                
                          setSlotRegister2(data)
                        }} value={addField.startRoomNo}>
                         <option value="">-select-</option>                                    
                            {
                                roomNumbers?.map((item: any) => {
                                    return (
                                        <option value={item}>{item}</option>
                                    )
                                })
                            }
                        </select>
                        <label htmlFor='floatingSelect' style={{fontSize:'15px'}}>Start</label>                                                                
                    </div>
                    <div className="form-floating mb-3 col-md-2 p-1">
                    <select className="form-select" id="floatingSelect" onChange={ (e:any) => {
                              let data = [...slotRegister2];
                              data[index].endRoomNo = e.target.value;                                                
                          setSlotRegister2(data)
                        }} value={addField.endRoomNo}>
                         <option value="">-select-</option>                                    
                            {
                                roomNumbers?.map((item: any) => {
                                    return (
                                        <option value={item}>{item}</option>
                                    )
                                })
                            }
                        </select>
                        <label htmlFor='floatingSelect' style={{fontSize:'15px'}}>End</label>              
                    </div>  
                                    <div className='col-md-1 d-flex align-items-center' role='button'>{slotRegister2.map((addField, index) => (
                                          slotRegister2.length - 1 === index &&
                                <FaPlusCircle onClick={handleFieldAdd2}/>
                                ))}</div>
                            <div className='col-md-1 d-flex align-items-center' role='button'>  {slotRegister2.length !== 1 && (
                                <FaMinusCircle onClick={() => handleFieldRemove2(index)}/>
                                )}</div>                                
                                   
                                    </div>
                            )))}  
                                </div>
                </div>
                </div>
                <div className="row">
                <div className="col-md-6" style={{backgroundColor: '#e6f0ff'}}>
                <div className="row p-2 d-flex flex-column">
                {(slotRegister3.map((addField, index) => (
                                <div key={index} style={{display:'inline-flex', backgroundColor: '#e6f0ff'}}>
                                 
                                    <div className="form-floating mb-3 col-md-2">
                                        {index === 0 && <> <input type="text" style={{fontSize:'10px'}} value={slot3Time} className="form-control" id="floatingEndTime" disabled placeholder='end time' />
                                <label htmlFor="floatingEndTime" style={{fontSize:'15px'}}>Slot 3</label></>}                              
                            </div>
                            <div className="mb-3 col-md-4 form-floating p-1">
                            <select className="form-select" id="floatingSelect" onChange={ (e:any) =>   {let data = [...slotRegister3];
                              data[index].staff = e.target.value;                                                        
                          setSlotRegister3(data)}} value={addField.staff}>
                        <option value="">Select Social Workers</option>
                            {
                                socialWorkerList?.map((item: any) => {
                                    return (
                                        <option value={item?.id}>{item?.name[0]?.given + ' ' + item?.name[0]?.family}</option>
                                    )
                                })
                            }
                        </select>
                        <label htmlFor='floatingSelect' style={{fontSize:'15px'}}>Select Social Workers</label>  
                        </div>
                        <div className="form-floating mb-3 col-md-2 p-1">
                        <select className="form-select" id="floatingSelect" onChange={ (e:any) => {
                              let data = [...slotRegister3];
                              data[index].startRoomNo = e.target.value;                                                
                          setSlotRegister3(data)
                        }} value={addField.startRoomNo}>
                         <option value="">-select-</option>                                    
                            {
                                roomNumbers?.map((item: any) => {
                                    return (
                                        <option value={item}>{item}</option>
                                    )
                                })
                            }
                        </select>
                        <label htmlFor='floatingSelect' style={{fontSize:'15px'}}>Start</label>                                                                
                    </div>
                    <div className="form-floating mb-3 col-md-2 p-1">
                    <select className="form-select" id="floatingSelect" onChange={ (e:any) => {
                              let data = [...slotRegister3];
                              data[index].endRoomNo = e.target.value;                                                
                          setSlotRegister3(data)
                        }} value={addField.endRoomNo}>
                         <option value="">-select-</option>                                    
                            {
                                roomNumbers?.map((item: any) => {
                                    return (
                                        <option value={item}>{item}</option>
                                    )
                                })
                            }
                        </select>
                        <label htmlFor='floatingSelect' style={{fontSize:'15px'}}>End</label>              
                    </div>  
                                    <div className='col-md-1 d-flex align-items-center' role='button'>{slotRegister3.map((addField, index) => (
                                          slotRegister3.length - 1 === index &&
                                <FaPlusCircle onClick={handleFieldAdd3}/>
                                ))}</div>
                            <div className='col-md-1 d-flex align-items-center' role='button'>  {slotRegister3.length !== 1 && (
                                <FaMinusCircle onClick={() => handleFieldRemove3(index)}/>
                                )}</div>                                
                                   
                                    </div>
                                   
                            )))}    
                            </div>
 
                             </div>
                                    <div className="col-md-6" style={{backgroundColor: '#e6f0ff'}}>
                                    <div className="row p-2 d-flex flex-column">
                            {(slotRegister4.map((addField, index) => (
                                <div key={index} style={{display:'inline-flex', backgroundColor: '#e6f0ff'}}>
                                   
                                    <div className="form-floating mb-3 col-md-2">
                                        {index === 0 && <> <input type="text" style={{fontSize:'10px'}} value={slot4Time} className="form-control" id="floatingEndTime" disabled placeholder='end time' />
                                <label htmlFor="floatingEndTime" style={{fontSize:'15px'}}>Slot 4</label></>}                              
                            </div>
                            <div className="mb-3 col-md-4 form-floating p-1">
                            <select className="form-select" id="floatingSelect" onChange={ (e:any) =>   {let data = [...slotRegister4];
                              data[index].staff = e.target.value;                                                        
                          setSlotRegister4(data)}} value={addField.staff}>
                        <option value="">Select Social Workers</option>
                            {
                                socialWorkerList?.map((item: any) => {
                                    return (
                                        <option value={item?.id}>{item?.name[0]?.given + ' ' + item?.name[0]?.family}</option>
                                    )
                                })
                            }
                        </select>
                        <label htmlFor='floatingSelect' style={{fontSize:'15px'}}>Select Social Workers</label>  
                        </div>
                        <div className="form-floating mb-3 col-md-2 p-1">
                        <select className="form-select" id="floatingSelect" onChange={ (e:any) => {
                              let data = [...slotRegister4];
                              data[index].startRoomNo = e.target.value;                                                
                          setSlotRegister4(data)
                        }} value={addField.startRoomNo}>  
                         <option value="">-select-</option>                                    
                            {
                                roomNumbers?.map((item: any) => {
                                    return (
                                        <option value={item}>{item}</option>
                                    )
                                })
                            }
                        </select>
                        <label htmlFor='floatingSelect' style={{fontSize:'15px'}}>Start</label>                                                                
                    </div>
                    <div className="form-floating mb-3 col-md-2 p-1">
                    <select className="form-select" id="floatingSelect" onChange={ (e:any) => {
                              let data = [...slotRegister4];
                              data[index].endRoomNo = e.target.value;                                                
                          setSlotRegister4(data)
                        }} value={addField.endRoomNo}>
                             <option value="">-select-</option>                                      
                            {
                                roomNumbers?.map((item: any) => {
                                    return (
                                        <option value={item}>{item}</option>
                                    )
                                })
                            }
                        </select>
                        <label htmlFor='floatingSelect' style={{fontSize:'15px'}}>End</label>              
                    </div>  
                                    <div className='col-md-1 d-flex align-items-center' role='button'>{slotRegister4.map((addField, index) => (
                                          slotRegister4.length - 1 === index &&
                                <FaPlusCircle onClick={handleFieldAdd4}/>
                                ))}</div>
                            <div className='col-md-1 d-flex align-items-center' role='button'>  {slotRegister4.length !== 1 && (
                                <FaMinusCircle onClick={() => handleFieldRemove4(index)}/>
                                )}</div>                                
                                   
                                    </div>
                            )))}  
                                </div>
                </div>
                </div>
               
                <div className="d-flex gap-3 justify-content-end mt-4">
                <button onClick={ handleCancel } className="btn-save float-end mt-3">
                    Clear
                </button>
                <button onClick={ handleSubmit } className="btn-save float-end mt-3">
                    Save
                </button>
            </div>
            </div>
 
        </React.Fragment>
    )
}
 
export default ShiftTab