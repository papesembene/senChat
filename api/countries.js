export default async function handler(req, res) {
     console.log("API countries appelée !");
     const response = await fetch('https://restcountries.com/v3.1/all?fields=name,idd,cca2', { headers: { 'Accept': 'application/json' } });
  const data = await response.json();
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json(data);
}