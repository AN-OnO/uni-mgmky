import request from "../utils/request"

/**
 * 打卡
 * @return 
 */
export function ClockIn() {
	return request.post('/api/Attendance/ClockIn');
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
export function Mend() {
	return request.post('/api/Attendance/Mend');
}

/**
 * 查询考勤记录
 * @return 
 */
export function GetAttendanceRecords() {
	return request.post('/api/Attendance/GetAttendanceRecords');
}