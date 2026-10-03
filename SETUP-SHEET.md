# Survey ke jawab Google Sheet mein (n8n ke bagair)

1. **Google Sheet banayein**: sheets.google.com par naya khali Sheet, naam "Ghar Saaf Survey".
2. Menu mein **Extensions → Apps Script** kholein. Wahan jo purana code ho, sab mita dein.
3. [sheet-script.gs](sheet-script.gs) ka poora code copy kar ke wahan paste karein aur **Save** (Ctrl+S) karein.
4. **Deploy → New deployment** par click karein.
   - Type: gear icon se **Web app** chunein.
   - Execute as: **Me**
   - Who has access: **Anyone**
   - **Deploy** dabayein. Pehli baar Google permission maangega: "Review permissions" → apna account → "Advanced" → "Go to ... (unsafe)" → **Allow**. (Yeh aap ka apna script hai, is liye safe hai.)
5. Jo **Web app URL** milega (`https://script.google.com/macros/s/.../exec`) usay copy karein.
6. [index.html](index.html) mein yeh line dhoondein aur URL badal dein:
   ```js
   const SHEET_URL = "PASTE_APPS_SCRIPT_URL_HERE";
   ```
7. **Test**: survey khud ek baar poora bharein. Pehle tab (Sheet1) mein column ke naam aur aap ka jawab aa jayega.

## Dhyan rakhein
- Script mein koi bhi tabdeeli (code badalna) ke baad **Deploy → Manage deployments → Edit → New version** karna parta hai, warna purana code chalta rehta hai. Sirf `SHEET_URL` badalna ho to dobara deploy nahi karna.
- Link browser mein kholne par `{"ok":true,...}` aaye to script theek chal raha hai.
- Jawab hamesha pehle tab (Sheet1) mein aate hain. Column ke naam na badlein.
- Multiple choice ke jawab ek cell mein comma laga kar aate hain (jaise `Late aati hai, Chhutti karti hai`).
- Jab tak `SHEET_URL` set nahi hota, form "Sheet ka link set nahi hua" ka paigham dikhata hai aur jawab zaya nahi hone deta.
