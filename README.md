### Fishy Skin Checker Discord Bot
messy code ik lol shut up

### Preivew
![img](https://cdn.discordapp.com/attachments/1174210667641835590/1178742091900264448/image.png?ex=6577401e&is=6564cb1e&hm=306fb7796b006affe07ecc7b43b710945bd62e780e1f7bafc6b8994e5d9d6a3c&)

### Get Started
To get started, run `npm install`. Then run one of the following commands:
```
npm run prod
npm run dev
```

### Authentication
fnbr.js

### How Does The Bot Get Cosmetics?
Epic Games API
```
const payload = {};
const response = await fetch(`https://fngw-mcp-gc-livefn.ol.epicgames.com/fortnite/api/game/v2/profile/${fnbrclient.user.id}/client/QueryProfile?profileId=athena`, {
    method: "POST",
    headers: {
        "Authorization": `Bearer ${fnbrclient.auth.auths.get("fortnite").token}`,
        "Content-Type": "application/json"
    },
    body: JSON.stringify(payload),
});
const user = await response.json();
```



If you are confused about Epic Games API, go [here](https://github.com/LeleDerGrasshalmi/FortniteEndpointsDocumentation).