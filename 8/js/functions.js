const strLength = (str, charAmount) => str.length <= charAmount;

const palindrommCheck = (str) => str.replace(/\s/g, '').toLowerCase() === str.replace(/\s/g, '').toLowerCase().split('').reverse().join('');

strLength('');
palindrommCheck('');

const CheckTimeMeeting = (workStartTime, workEndTime, meetingStartTime, meetingDuration) => {
  const toMinutes = (timeStr) =>  {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  const startWorkMin = toMinutes(workStartTime);
  const endWorkMin = toMinutes(workEndTime);
  const startMeetingMin = toMinutes(meetingStartTime);
  const endMeetingMin = startMeetingMin + meetingDuration;

  return startMeetingMin >= startWorkMin && endMeetingMin <= endWorkMin;
};

CheckTimeMeeting('08:00', '17:30', '14:00', 90); // true
CheckTimeMeeting('8:0', '10:0', '8:0', 120);     // true
CheckTimeMeeting('08:00', '14:30', '14:00', 90); // false
CheckTimeMeeting('14:00', '17:30', '08:0', 90);  // false
CheckTimeMeeting('8:00', '17:30', '08:00', 900); // false

