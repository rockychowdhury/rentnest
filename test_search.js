async function run() {
  const res = await fetch("https://rentnestapi.vercel.app/api/areas/search?q=dhaka");
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}
run();
