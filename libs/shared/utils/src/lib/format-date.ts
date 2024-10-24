export const formatDate = (
  date: Date | number,
  opts?: Intl.DateTimeFormatOptions,
) => {
  const options: Intl.DateTimeFormatOptions = {
    dateStyle: 'short',
    timeStyle: 'short',
    hour12: false,
    ...opts,
  };
  return new Intl.DateTimeFormat('en-US', options).format(date);
};
