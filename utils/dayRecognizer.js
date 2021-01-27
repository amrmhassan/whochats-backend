const main = (date) => {
  //? when getting days it will start from 0 to 6
  //? 7 days in week
  //? the week start with Sunday=0, Monday=1 ...etc
  //!
  //? the custom date
  //? this is the date that the user will be last seen at
  //? and its value is an example
  //? 'year-month-date(day) T hours:minutes:seconds:milliseconds+timeZone'

  const customDate = new Date(date);
  const customDateObj = {
    day: customDate.getDate(),
    month: customDate.getMonth(),
    year: customDate.getFullYear(),
  };

  //? now date
  const now = new Date(Date.now());
  const nowObj = {
    day: now.getDate(),
    month: now.getMonth(),
    year: now.getFullYear(),
  };

  //? the difference in days
  const differenceDays =
    (new Date(now - customDate) - new Date('1970-01-01')) / 1000 / 60 / 60 / 24;

  //? for getting the day before the day given
  const getYesterday = (today) => {
    //? i will give it today and it will return the after that
    //? today may be [0, 1, 2, 3, 4, 5, 6]
    if (today === 0) {
      return 6;
    }
    return today - 1;
  };
  //? for getting the final day result
  const dayString = (now, customObj, customDate) => {
    if (
      now.day === customObj.day &&
      now.month === customObj.month &&
      now.year === customObj.year
    ) {
      return 'Today';
    } else if (
      getYesterday(now.day) === customObj.day &&
      now.month === customObj.month &&
      now.year === customObj.year
    ) {
      return 'Yesterday';
    } else if (differenceDays <= 7 && differenceDays > 0) {
      //! adding the days for the last week
      const days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ];
      return days[customDate.getDay()];
    } else if (differenceDays < 0) {
      return 'The custom date is in the future';
    } else {
      return `${customDate.getFullYear()}/${
        customDate.getMonth() + 1
      }/${customDate.getDate()}`;
    }
  };

  //? this function will return the hour and the minutes
  const time = (customDate) => {
    let hours = customDate.getHours();
    const minutes = customDate.getMinutes();
    let periodOfTime;
    if (hours > 12) {
      hours -= 12;
      periodOfTime = 'PM';
    } else {
      periodOfTime = 'AM';
    }
    return `${hours}:${minutes} ${periodOfTime}`;
  };

  const finalResult = (nowObj, customDateObj, customDate) => {
    return `${dayString(nowObj, customDateObj, customDate)}`;
  };

  return finalResult(nowObj, customDateObj, customDate);
};
export default main;
