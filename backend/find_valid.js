const https = require('https');

const candidates = {
  CITY: ["1477587458883-47145ed94245", "1523496922386-b1a83f4f66db", "1587474260584-1281d429f490", "1514282401047-d79a71a590e8"],
  HOSTEL: ["1555854877-c90cc328bc12", "1522798514-97ceb8c4f1c8", "1590073541814-1af1b1b46b28", "1566073771259-6a85e60cb386", "1520250497591-112f2f40a3f4"],
  BIKE: ["1558981403-c5f9899a28bc", "1558981806-ec527fa84c39", "1515777315835-281b94c9589f", "1444491741275-3747c53c99b4"],
  SCOOTER: ["1516005086888-ea121aee22d7", "1591438670356-150bc6223847", "1625047509128-ED77334795aa"],
  CAR: ["1494976388531-d1059f9ad092", "1503376780353-7e6692767b70", "1541899481-2fd3956b78ef"],
  EV: ["1619767886554-2f2288adc99a", "1593941707882-c5bdd14ad1c4", "1620002093397-9475fe57a920"],
  PLACE: ["1524492413608-2e4ff4a1e941", "1477617722481-9962aae88c44", "1548013146-735c7d206095", "1564507522543-d8921ec94726"],
  SHOP_CLOTHING: ["1583391733956-6c78276477e2", "1610030469983-98e6f24941da", "1621431607593-3ea33918a0ed"],
  SHOP_HANDICRAFT: ["1606744824161-078fd61304f1", "1515814472491-a203f6f69904", "1582558586915-a67b4f910405"],
  SHOP_GEAR: ["1523381235312-3c1900754700", "1441926932896-01a5a5b7557e", "1606103816285-024058f377c7"],
  GUIDE: ["1534528741775-53994a69daeb", "1506794778202-cad84cf45f1d", "1580281657527-73d74c0e64b2", "1500648767791-00dcc994a43e"]
};

function checkImage(id) {
  return new Promise((resolve) => {
    const url = `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=1200`;
    https.get(url, (res) => {
      resolve(res.statusCode);
    }).on('error', () => resolve(500));
  });
}

async function run() {
  const valid = {};
  for (const [cat, ids] of Object.entries(candidates)) {
    valid[cat] = [];
    for (const id of ids) {
      const status = await checkImage(id);
      if (status === 200) {
        valid[cat].push(id);
      }
    }
  }
  console.log("VALID_IMAGES =", JSON.stringify(valid, null, 2));
}

run();
