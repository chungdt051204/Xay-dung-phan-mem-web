const fetchApi = ({ url, setData }) => {
  let headers = {};
  const token = localStorage.getItem("token");
  if (token) headers["Authorization"] = `Bearer ${token}`;
  fetch(`${url}`, { headers })
    .then((res) => {
      if (res.ok) return res.json();
      throw res;
    })
    .then(({ result }) => {
      setData(result);
    })
    .catch(async (err) => {
      try {
        if (err instanceof Response) {
          const { message } = await err.json();
          console.log(message);
        } else {
          console.log("Network or other error:", err.message || err);
        }
      } catch (parseError) {
        console.log("Error parsing response:", parseError);
      }
    });
};
export default fetchApi;
