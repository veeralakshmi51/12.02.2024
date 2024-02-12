import { combineReducers } from 'redux'
import LoginReducer from './login/reducer'
import PSConfigReducer from './staffConfiguration/reducer'
import AccessControlReducer from './accesscontrol/reducer'
import StaffReducer from './staff/reducer'
import PatientReducer from './patient/reducer'
import BeaconReducer from './beaconDevices/reducer'
import OrganizationDetailsReducer from './organizationDetails/reducer'
import OrganizationReducer from './organization/reducer'
import BedAssignReducer from './bedAssign/reducer'
import PatientAssignReducer from './patientAssign/reducer'

const rootReducer = combineReducers({
  Login: LoginReducer,
  PSConfig: PSConfigReducer,
  Access: AccessControlReducer,
  Staff: StaffReducer,
  Patient: PatientReducer,
  Beacon: BeaconReducer,
  Org: OrganizationReducer,
  Organization:OrganizationDetailsReducer,
  BedAssign:BedAssignReducer,
  PatientAssign:PatientAssignReducer,
})

export default rootReducer
