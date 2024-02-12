import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllBedAssign
} from "../../slices/bedAssign/thunk";
import { getAllBed } from "../../slices/patientAssign/thunk";
import {
  Button
} from "reactstrap";
import "./bedassign.css";
import { HttpLogin } from "../../utils/Http";
import {Autocomplete, TextField, Chip} from '@mui/material';

const BedAddAssign: React.FC = () => {
  const dispatch = useDispatch<any>();           
  const { bedAssignData = [], loading } = useSelector(
    (state: any) => state.BedAssign
  );
  const { organization } = useSelector((state: any) => state.Login); 

  let inputNewData = {
      roomNoStart: "",
      roomNoEnd: "",
      oddOrEven: "",
      organization: "",
      bedNoList: [
        {
          roomNo: "",
          bedQuantity: 0
        }
      ]
    }
  
  let[inputFormData, setInputFormData] = useState(inputNewData);  
  let [arrayBedList, setArrayBedList] = useState<any[]>([]);
  let [selectedBedList, setSelectedBedList] = useState<any[]>([]);
  let [selectedTripleBedList, setSelectedTripleBedList] = useState<any[]>([]);
  const fixedOptions = useState<any[]>([]);
  const findElementsTwice = (array:any) => {
    const result = array.filter((element:any, index:any, arr:any) => {
      const count = arr.filter((el:any) => el === element).length;
      return count === 2 && arr.indexOf(element) === index;
    });
  
    return result;  
  };

  const findElementsThrice = (array:any) => {
    const result = array.filter((element:any, index:any, arr:any) => {
      const count = arr.filter((el:any) => el === element).length;
      return count === 3 && arr.indexOf(element) === index;
    });
  
    return result;  
  };
 
  useEffect(() => {
    getAllBedAssign(dispatch, organization);
     
    HttpLogin.axios().get("http://47.32.254.89:7000/api/Q15Bed/getByOrg/"+organization)
            .then((response) => {
                 
                if (response.data.data !== undefined && response.data.data !== null) {
                  if(response.data.data.length > 0){                          
                    setSelectedBedList(findElementsTwice(response.data.data.map((k:any)=>{return k.roomNo})));
                    setSelectedTripleBedList(findElementsThrice(response.data.data.map((k:any)=>{return k.roomNo})))
                    //console.log(JSON.stringify());
                    let newBedAssign = response.data.data !== null && response.data.data !== undefined && response.data.data.map((k:any) => {return k.roomNo});        
                    var elementCounts = newBedAssign.reduce((count:any, item:any) => (count[item] = count[item] + 1 || 1, count), {});
                    elementCounts = Object.entries(elementCounts).map(([key, value]) => ({
                      roomNo: `${key}`,
                      bedQuantity: parseInt(`${value}`)
                  }));   
                  //setSelectedTripleBedList()          
                  console.log(JSON.stringify(elementCounts))
                  inputFormData.roomNoStart = elementCounts !== null && elementCounts !== undefined ? elementCounts[0].roomNo: "";
                  inputFormData.roomNoEnd = elementCounts !== null && elementCounts !== undefined ? elementCounts[elementCounts.length - 1].roomNo:"";
                  inputFormData.bedNoList = elementCounts !== null && elementCounts !== undefined ? elementCounts:inputNewData.bedNoList;    
                  setArrayBedList(elementCounts !== null && elementCounts !== undefined ? elementCounts.map((k:any)=>{return k.roomNo}): [])
                  setInputFormData({...inputFormData})           
                  }
                }
            })
       
  }, [dispatch, organization]);
  
 
  const handleInputChange = (event:any)=>{
    if(event.target.id ==="roomNoStart"){
      inputFormData.roomNoStart = event.target.value;
      inputFormData.oddOrEven = "both";  
    }else if(event.target.id ==="oddOrEven"){
      inputFormData.oddOrEven = event.target.value;      
      let newValue = [];           
      for(var i=parseInt(inputFormData.roomNoStart); i <= parseInt(inputFormData.roomNoEnd);i++){       
        let numberValue;      
        numberValue = event.target.value === "odd" ? i % 2 !== 0 && i:event.target.value === "even" ? i % 2 === 0 && i : i % 1 === 0 && i;                      
        let newData = {
          roomNo: JSON.stringify(numberValue),
          bedQuantity: 1
        }                       
       inputFormData.bedNoList.length>1 ? inputFormData.bedNoList.push(newData):newValue.push(newData);          
      }         
      console.log(JSON.stringify(arrayBedList));
      if(event.target.value === "odd"){
        let filteredArr = arrayBedList.reduce((acc:any, current:any) => {
          const x = acc.find((item:any) => item.roomNo === current.roomNo);
          if (!x) {
            return acc.concat([current]);
          } else {
            return acc;
          }
        }, []);       
        var newOddFilteredArray = filteredArr.filter((m:any)=>m.roomNo !== 'false').filter((k:any)=>parseInt(k.roomNo) % 2 !== 0).map((l:any)=>{return l});
        inputFormData.bedNoList = newOddFilteredArray;
      }else if(event.target.value === "even"){
        let filteredArr = arrayBedList.reduce((acc:any, current:any) => {
          const x = acc.find((item:any) => item.roomNo === current.roomNo);
          if (!x) {
            return acc.concat([current]);
          } else {
            return acc;
          }
        }, []);        
        var newEvenFilteredArray = filteredArr.filter((m:any)=>m.roomNo !== 'false').filter((k:any)=>parseInt(k.roomNo) % 2 === 0).map((l:any)=>{return l});
        inputFormData.bedNoList = newEvenFilteredArray;
      }else if(event.target.value === "both"){
        let filteredArr = arrayBedList.reduce((acc:any, current:any) => {
          const x = acc.find((item:any) => item.roomNo === current.roomNo);
          if (!x) {
            return acc.concat([current]);
          } else {
            return acc;
          }
        }, []);              
        inputFormData.bedNoList = filteredArr.filter((m:any)=>m.roomNo !== 'false').map((l:any)=>{return l});
        inputFormData.bedNoList.sort();
      }else if(inputFormData.bedNoList.length <=1){
        inputFormData.bedNoList = newValue;
        inputFormData.bedNoList.sort();
      }                  
      
    }else if(event.target.id ==="roomNoEnd"){
      if(inputFormData.roomNoStart !== ""){
        inputFormData.roomNoEnd = event.target.value;
        let newValue = [];        
        for(var i=parseInt(inputFormData.roomNoStart); i <= parseInt(event.target.value);i++){          
          let newData = {
            roomNo: JSON.stringify(i),
            bedQuantity: 1
          }  
          
         inputFormData.bedNoList.length>1 ? inputFormData.bedNoList.push(newData):newValue.push(newData);
        } 
        const filteredArr = inputFormData.bedNoList.reduce((acc:any, current:any) => {
          const x = acc.find((item:any) => item.roomNo === current.roomNo);
          if (!x) {
            return acc.concat([current]);
          } else {
            return acc;
          }
        }, [])
                          
        inputFormData.bedNoList = inputFormData.bedNoList.length>1 ? filteredArr: newValue;  
        setArrayBedList(filteredArr ? filteredArr.map((k:any)=>{return k.roomNo}):[])            
      }else{
        alert("Please Enter Start Room Number");
      }       
    } 
    setInputFormData({...inputFormData});
  }

  useEffect(() => {
    getAllBed(dispatch, organization);
  }, [dispatch, organization]); 

  const handleSaveBed = async () => {
    inputFormData.organization = organization;
    inputFormData.oddOrEven = inputFormData.oddOrEven !== "" ? inputFormData.oddOrEven : "both";   
    try {
      if(bedAssignData.length === 0){
        var url = "/api/Q15Bed/create";
        var obj = JSON.stringify(inputFormData);
        HttpLogin.axios().post(url, obj, {
            headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "*",
                "Access-Control-Allow-Headers": "*"
            }
        })
            .then(response => {
              console.log("Registered Data:", response.data);
              console.log("Request details:", inputFormData);
              console.log('ID:', response.data.data.id)
              if (
                response.data.message &&
                response.data.message.code === "MHC - 0200"
              ) {
                alert(response.data.message.description);       
                // getAllBedAssign(dispatch, organization);
                // getAllBed(dispatch, organization);
              } else {
                console.log("error:", response.data.message);
                alert(`Error:${response.data.message.description}`);
              }
            }) 
      }else{
        var url = "/api/Q15Bed/update";        
        let obj = {
          organization: organization,
          bedNoList: inputFormData.bedNoList
        }
        console.log(JSON.stringify(obj));
        HttpLogin.axios().put(url, JSON.stringify(obj), {
            headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "*",
                "Access-Control-Allow-Headers": "*"
            }
        })
            .then(response => {
              console.log("Registered Data:", response.data);
              console.log("Request details:", inputFormData);            
              if (
                response.data.message &&
                response.data.message.code === "MHC - 0200"
              ) {
                alert(response.data.message.description);            
                getAllBedAssign(dispatch, organization);
                getAllBed(dispatch, organization);
              } else {
                console.log("error:", response.data.message);
                alert(`Error:${response.data.message.description}`);
              }
            }) 
      }
             
    } catch (error) {
      alert("Room No and No. of Bed/s Already Exists");
    }
  };
    
  return (
    <div className="container m15 p3" style={{ width: "90%" }}>
      <div>
        <h4 className="text-center">Bed Configuration</h4>
        <div className="form-control">
          <label
            htmlFor="roomNo"
            className="floating-label"
            style={{ fontWeight: "bold", width: '20%' }}
          >
            Start Room No:
          </label>
          <input style={{ width: '25%' }}
            type="text"
            id="roomNoStart"
            name="roomNoStart"
            placeholder="Enter No"
            value={inputFormData.roomNoStart}
            onChange={handleInputChange}
          ></input>
          <label style={{ width: '5%' }} />
          <label
            htmlFor="bedNo"
            className="floating-label"
            style={{ fontWeight: "bold", width: '25%' }}
          >
            End Room No:
          </label>
          <input style={{ width: '25%' }}
            type="text"
            id="roomNoEnd"
            name="roomNoEnd"
            placeholder="Enter No"
            value={inputFormData.roomNoEnd}
            onChange={handleInputChange}
          ></input>
          <div style={{ marginBottom: '15px' }}></div>
          <label
            htmlFor="roomNo"
            className="floating-label"
            style={{ fontWeight: "bold", width: '10%' }}
          >
            Type:
          </label>
          <select id="oddOrEven" style={{ width: '15%', height: '45px', border: '1px solid black', borderRadius: '5px' }} 
          name="oddOrEven" value={inputFormData.oddOrEven} onChange={handleInputChange} >
            <option value="both" >Both</option>
            <option value="odd" >Odd</option>
            <option value="even" >Even</option>
          </select>          
          <label style={{ width: '2.5%' }} />
          <label
            htmlFor="bedNo"
            className="floating-label"
            style={{ fontWeight: "bold", width: '10%' }}
          > Double Bed:           
          </label>
          <Autocomplete
                            limitTags={5}
                            onChange={(e:any, v:any) => { selectedBedList = v;
                              console.log(JSON.stringify(inputFormData.bedNoList.length > 0 && inputFormData.bedNoList !== undefined && inputFormData.bedNoList !== null ? inputFormData.bedNoList.filter((col:any) => {                               
                                return !v.find((sel:any) => sel === col.roomNo) ? col: col.bedQuantity = 2
                            }) : []))
                               setSelectedBedList(selectedBedList); }}
                            multiple
                            id="tags-filled"
                            options={arrayBedList !== null && arrayBedList.length > 0 ? arrayBedList:[]}
                            value={selectedBedList}
                            getOptionLabel={(option) => option}
                            renderTags={(value, getTagProps) => {
                              const numTags = value.length;
                              const limitTags = 3;
                      
                              return (
                                <>
                                  {value.slice(0, limitTags).map((option:any, index:any) => (
                                    <Chip
                                      {...getTagProps({ index })}
                                      key={index}
                                      label={option}
                                    />
                                  ))}
                      
                                  {numTags > limitTags && ` +${numTags - limitTags}`}
                                </>
                              );
                            }}
                            sx={{ width: "25%", height:'20px',display:'inline-flex' }}
                            renderInput={(params) => (
                                <TextField style={{height:'20px',padding:'0px'}}
                                sx={{padding:'0px'}}
                                    {...params}
                                    variant="outlined"
                                    label=""
                                    placeholder=""
                                    margin="none"
                                    fullWidth
                                />
                            )}
                        />  
                          <label style={{ width: '2.5%' }} />
                         <label
            htmlFor="bedNo"
            className="floating-label"
            style={{ fontWeight: "bold", width: '10%' }}
          > Triple Bed:           
          </label>
          <Autocomplete
                            limitTags={5}
                            onChange={(e:any, v:any) => { selectedTripleBedList = v;
                              console.log(JSON.stringify(inputFormData.bedNoList.length > 0 && inputFormData.bedNoList !== undefined && inputFormData.bedNoList !== null ? inputFormData.bedNoList.filter((col:any) => {                               
                                return !v.find((sel:any) => sel === col.roomNo) ? col: col.bedQuantity = 3
                            }) : []))
                            setSelectedTripleBedList(selectedTripleBedList); }}
                            multiple
                            id="tags-filled"
                            options={arrayBedList !== null && arrayBedList.length > 0 ? arrayBedList:[]}
                            value={selectedTripleBedList}
                            getOptionLabel={(option) => option}
                            renderTags={(value, getTagProps) => {
                              const numTags = value.length;
                              const limitTags = 3;
                      
                              return (
                                <>
                                  {value.slice(0, limitTags).map((option:any, index:any) => (
                                    <Chip
                                      {...getTagProps({ index })}
                                      key={index}
                                      label={option}
                                    />
                                  ))}
                      
                                  {numTags > limitTags && ` +${numTags - limitTags}`}
                                </>
                              );
                            }}
                            sx={{ width: "25%", height:'20px',display:'inline-flex' }}
                            renderInput={(params) => (
                                <TextField style={{height:'20px',padding:'0px'}}
                                sx={{padding:'0px'}}
                                    {...params}
                                    variant="outlined"
                                    label=""
                                    placeholder=""
                                    margin="none"
                                    fullWidth
                                />
                            )}
                        />  
          <div  className="p-col-12">
            <div  className="p-grid" >
              <div id="removePadding" className="p-col-12 p-md-12"></div>
              <div id="removePadding" className="p-col-12 p-md-12"></div>         
              <div id="removePadding" className="p-col-12 p-md-1" style={{border:"1px groove",textAlign:"center"}}>Room No</div>
              <div id="removePadding" className="p-col-12 p-md-1" style={{border:"1px groove",textAlign:"center"}}>No. of Bed/s</div>
              <div id="removePadding" className="p-col-12 p-md-1" style={{border:"1px groove",textAlign:"center"}}>Room No</div>
              <div id="removePadding" className="p-col-12 p-md-1" style={{border:"1px groove",textAlign:"center"}}>No. of Bed/s</div>
              <div id="removePadding" className="p-col-12 p-md-1" style={{border:"1px groove",textAlign:"center"}}>Room No</div>
              <div id="removePadding" className="p-col-12 p-md-1" style={{border:"1px groove",textAlign:"center"}}>No. of Bed/s</div>
              <div id="removePadding" className="p-col-12 p-md-1" style={{border:"1px groove",textAlign:"center"}}>Room No</div>
              <div id="removePadding" className="p-col-12 p-md-1" style={{border:"1px groove",textAlign:"center"}}>No. of Bed/s</div>
              <div id="removePadding" className="p-col-12 p-md-1" style={{border:"1px groove",textAlign:"center"}}>Room No</div>
              <div id="removePadding" className="p-col-12 p-md-1" style={{border:"1px groove",textAlign:"center"}}>No. of Bed/s</div>              
              <div id="removePadding" className="p-col-12 p-md-1" style={{border:"1px groove",textAlign:"center"}}>Room No</div>
              <div id="removePadding" className="p-col-12 p-md-1" style={{border:"1px groove",textAlign:"center"}}>No. of Bed/s</div>
              {Array.isArray(inputFormData.bedNoList) && inputFormData.bedNoList.length > 1 && Object.keys(inputFormData.bedNoList).filter((m:any)=>m.roomNo !== "false").map((bedassign: any, index: number) => (
                <>
              {inputFormData.bedNoList !== null && inputFormData.bedNoList !== undefined  ? 
              <><div key={index} id="removePadding" className="p-col-12 p-md-1" style={{border:"1px groove",textAlign:"center"}}>{inputFormData.bedNoList[index].roomNo}</div>
              <div key={index} id="removePadding" className="p-col-12 p-md-1" style={{border:"1px groove",textAlign:"center",display:"flex",justifyContent:"flex-start"}}>
              <input type="number" style={{ width: "80%", textAlign: 'center', height:'32px' }} 
              value={inputFormData.bedNoList[index].bedQuantity} 
               onChange={(e) => {
                if (inputFormData.bedNoList[index].bedQuantity !== 0 && inputFormData.bedNoList[index].bedQuantity !== undefined && inputFormData.bedNoList[index].bedQuantity !== null) {
                  inputFormData.bedNoList[index].bedQuantity = parseInt(e.target.value);
                } else {
                  inputFormData.bedNoList[index].bedQuantity = parseInt(e.target.value);
                }       
               setInputFormData({...inputFormData});                                                                                   
            }} />             
              </div></>:<><div id="removePadding" className="p-col-12 p-md-1" style={{border:"1px groove",textAlign:"center"}}></div>
              <div id="removePadding" className="p-col-12 p-md-1" style={{border:"1px groove",textAlign:"center",display:"flex",justifyContent:"flex-start"}}>              
              </div></>}              
              </>
              ))}                   
            </div>
          </div>
            <Button color="info" onClick={handleSaveBed}>
              Save Changes
            </Button>{" "}
            <Button color="danger" onClick={() => window.location.href = "/bed-table"}>
              Back
            </Button>   
        </div>
      </div>
    </div>
  );
};

export default BedAddAssign;