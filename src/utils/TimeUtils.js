/* export const TimeUtils = () => {
  return 2;
}; */

export const isSameDay = (start, end) => {
  return (
    start.getFullYear() === end.getFullYear() && start.getMonth() === end.getMonth() && start.getDay() === end.getDay()
  );
};

/* export {isSameDay, TimeUtils} */
