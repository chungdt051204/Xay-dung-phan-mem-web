const fetchApi = ({ url, setData }) => {
  fetch(`${url}`)
    .then((res) => {
      if (res.ok) return res.json();
      throw res;
    })
    .then(({ result }) => {
      console.log(result);
      setData(result);
    })
    .catch(async (err) => {
      const { message } = await err.json();
      console.log(message);
    });
};
export default fetchApi;
