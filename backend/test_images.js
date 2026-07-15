const https = require('https');

const imageIds = [
  "1555854877-c90cc328bc12", "1522798514-97ceb8c4f1c8", "1590073541814-1af1b1b46b28", "1566073771259-6a85e60cb386", // Hostels
  "1558981403-c5f9899a28bc", "1558981806-ec527fa84c39", // Bikes
  "1516005086888-ea121aee22d7", "1591438670356-150bc6223847", // Scooters
  "1494976388531-d1059f9ad092", "1503376780353-7e6692767b70", // Cars
  "1619767886554-2f2288adc99a", "1593941707882-c5bdd14ad1c4", // EVs
  "1524492413608-2e4ff4a1e941", "1477617722481-9962aae88c44", "1548013146-735c7d206095", // Places
  "1583391733956-6c78276477e2", "1610030469983-98e6f24941da", // Clothes
  "1606744824161-078fd61304f1", "1515814472491-a203f6f69904", // Handicrafts
  "1534528741775-53994a69daeb", "1506794778202-cad84cf45f1d", "1580281657527-73d74c0e64b2", // Guides
  "1523496922386-b1a83f4f66db", "1587474260584-1281d429f490" // Cities
];

async function checkImage(id) {
  return new Promise((resolve) => {
    const url = `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=1200`;
    https.get(url, (res) => {
      resolve({ id, status: res.statusCode });
    }).on('error', (e) => {
      resolve({ id, status: e.message });
    });
  });
}

async function run() {
  console.log("Checking image IDs...");
  for (const id of imageIds) {
    const result = await checkImage(id);
    console.log(`${result.id}: ${result.status}`);
  }
}

run();
