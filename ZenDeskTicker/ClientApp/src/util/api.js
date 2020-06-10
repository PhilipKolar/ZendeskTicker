const getJsonAsync = async(url) => {
  if (typeof(url) !== "string") {
    return null;
  }

  const response = await fetch(url, {
    method: 'GET',
  });
  const data = await response.json();
  return data;
}

module.exports = {
  getJsonAsync,
}
