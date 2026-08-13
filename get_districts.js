async function run() {
  const res = await fetch("https://rentnestapi.vercel.app/api/divisions");
  const data = await res.json();
  const divisions = data.data || [];
  
  const allDistricts = [];
  for (const div of divisions) {
    const res2 = await fetch(`https://rentnestapi.vercel.app/api/divisions/${div.id}/districts`);
    const data2 = await res2.json();
    allDistricts.push(...(data2.data || []));
  }
  
  console.log(JSON.stringify(allDistricts.map(d => ({id: d.id, name: d.name}))));
}

run();
