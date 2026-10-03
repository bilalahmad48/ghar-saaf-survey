/**
 * Ghar Saaf survey: jawab seedha Google Sheet mein likhta hai.
 * Setup ke liye SETUP-SHEET.md dekhein.
 */

// Columns isi tarteeb se banenge. Form mein koi naya field aaye to wo khud naya column ban jata hai.
var HEADERS = [
  "submitted_at", "source", "surveyor", "duration_seconds", "model_town",
  "area", "house_size", "working_woman",
  "maid_currently", "no_maid_reason", "maid_frequency", "maid_duration",
  "maid_work", "maid_pay", "maid_problems", "maid_satisfaction", "tried_agency",
  "interest", "interest_barriers", "service_scope", "female_pref", "same_worker", "preferred_time",
  "important_factors", "booking_method", "payment_method", "payment_timing",
  "fair_price", "price_reaction", "package_pref", "monthly_budget",
  "worker_checks", "alone_comfort", "bad_work", "worker_absent",
  "biggest_problem", "trial_interest", "whatsapp", "age", "suggestion",
  "survey", "survey_version"
];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000); // ek saath kai log bhejen to row aapas mein na takrayen

  try {
    var data = mergeOther_(JSON.parse(e.postData.contents));
    var sheet = getSheet_();
    var headers = ensureHeaders_(sheet, Object.keys(data));

    var row = headers.map(function (key) {
      var value = data[key];
      if (value === undefined || value === null) return "";
      if (Object.prototype.toString.call(value) === "[object Array]") return value.join(", ");
      // Phone number ka shuru wala 0 na ghayab ho
      if (key === "whatsapp") return "'" + value;
      return value;
    });

    sheet.appendRow(row);

    return json_({ ok: true });
  } catch (error) {
    return json_({ ok: false, error: String(error) });
  } finally {
    lock.releaseLock();
  }
}

// Browser mein link kholne par check karne ke liye
function doGet() {
  return json_({ ok: true, message: "Ghar Saaf survey sheet chal rahi hai." });
}

// "Kuch aur" ka likha hua text us sawal ke apne column mein chala jata hai
// (jaise "Late aati hai, Other: bohat shor karti hai"), alag column nahi banta.
function mergeOther_(data) {
  Object.keys(data).forEach(function (key) {
    var match = /^(.+)_other$/.exec(key);
    if (!match || !(match[1] in data)) return;

    var base = match[1];
    var label = "Other: " + data[key];
    var current = data[base];

    if (Object.prototype.toString.call(current) === "[object Array]") {
      data[base] = current.map(function (v) { return v === "Other" ? label : v; });
    } else if (current === "Other") {
      data[base] = label;
    }
    delete data[key];
  });
  return data;
}

// Data hamesha spreadsheet ke pehle tab (Sheet1) mein jata hai.
function getSheet_() {
  var book = SpreadsheetApp.getActiveSpreadsheet();
  return book.getSheets()[0];
}

function ensureHeaders_(sheet, incomingKeys) {
  var lastCol = sheet.getLastColumn();
  var headers = lastCol > 0 ? sheet.getRange(1, 1, 1, lastCol).getValues()[0] : [];

  if (headers.length === 0 || headers[0] === "") {
    headers = HEADERS.slice();
  }

  incomingKeys.forEach(function (key) {
    if (headers.indexOf(key) === -1) headers.push(key);
  });

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.setFrozenRows(1);
  return headers;
}

function json_(object) {
  return ContentService
    .createTextOutput(JSON.stringify(object))
    .setMimeType(ContentService.MimeType.JSON);
}
