import request from "../utils/request"

/**
 * 打卡
 * @return 
 */
export function ClockIn(params) {
	return request.post('/api/Attendance/ClockIn',params);
}

/**
 * 最近一天的打卡记录
 * @param params 
 * @return 
 */
export function GetLatestAttendances(params) {
	return request.get('/api/Attendance/GetLatestAttendances');
}

/**
 * 补卡
 * @return 
 */
export function Mend(params) {
	return request.post('/api/Attendance/Mend',params);
}

/**
 * 查询考勤记录
 * @return 
 */
export function GetAttendanceRecords(params) {
	return request.post('/api/Attendance/GetAttendanceRecords',params);
}

/**
 * 判断是否打卡上班中
 * @return 
 */
export function IsWorking(params) {
	return request.get('/api/Attendance/IsWorking');
}