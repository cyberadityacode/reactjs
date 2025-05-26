# React Form with Google Sheet

- Go to Google Sheet=> Extensions -> App Script

```js
function doPost(e) {
  const sheetURL = SpreadsheetApp.openByUrl(
    "LINK OF YOUR GOOGLE SHEET"
  );

  const sheet = sheetURL.getSheetByName("Sheet1");
  let data = e.parameter;
  sheet.appendRow([data.Name, data.Email]);
  return ContentService.createTextOutput("Added");
}
```


