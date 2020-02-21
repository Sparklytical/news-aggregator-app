const getData = async url => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('could not fetch data');
  }
  const data = await res.json();
  return data;
};

export { getData };
