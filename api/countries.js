export default async function handler(req, res) {
  const response = await fetch('https://restcountries.com/v3.1/all');
  const data = await response.json();
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json(data);
}