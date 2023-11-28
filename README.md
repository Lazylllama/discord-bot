# Fishy Skin Checker Discord Bot

### Todo
Nothing for now :)

### Get Started
To get started, run `npm install`. Then run one of the following commands:
```
npm run prod - for production
npm run dev - for development/testing
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