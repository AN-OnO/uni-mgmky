import request from "../utils/request"

/**
 * 打卡
 * @return 
 */
export function ClockIn() {
	return request.post('/api/Attendance/ClockIn');
}