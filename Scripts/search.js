// search.js
// Issue #2 - Dedicated search page (needs entries.js loaded first).

// ---------- Search page ----------
// Adds a value to a list only if it is not already in it
function addUnique(list, value) {
  if (list.indexOf(value) === -1) {
    list.push(value);
  }
}

// Returns true if one entry matches the keywords, language and tags that were picked
function entryMatches(entry, needle, language, pickedTags) {
  var searchable = entry.title + " " + entry.language + " " + entry.code + " " + entry.tags.join(" ");
  if (needle !== "" && searchable.toLowerCase().indexOf(needle) === -1) {
    return false;
  }
  if (language !== "" && entry.language !== language) {
    return false;
  }
  for (var t = 0; t < pickedTags.length; t++) {
    if (entry.tags.indexOf(pickedTags[t]) === -1) {
      return false;
    }
  }
  return true;
}

var resultsBox = document.getElementById("results");
if (resultsBox) {
  // Read what was searched from the address bar (search.html?q=...&language=...&tag=...)
  var params = new URLSearchParams(window.location.search);
  var q = params.get("q") || "";
  q = q.trim();
  var chosenLanguage = params.get("language") || "";
  var chosenTags = params.getAll("tag");

  // Collect every language and tag that exists in the entries
  var languages = [];
  var allTags = [];
  for (var e = 0; e < ENTRIES.length; e++) {
    addUnique(languages, ENTRIES[e].language);
    for (var k = 0; k < ENTRIES[e].tags.length; k++) {
      addUnique(allTags, ENTRIES[e].tags[k]);
    }
  }
  languages.sort();
  allTags.sort();

  // Fill in the language dropdown
  var languageSelect = document.getElementById("language");
  for (var l = 0; l < languages.length; l++) {
    languageSelect.add(new Option(languages[l], languages[l]));
  }

  // Make a checkbox for each tag
  var tagBox = document.getElementById("tag-options");
  for (var a = 0; a < allTags.length; a++) {
    var label = document.createElement("label");
    var box = document.createElement("input");
    box.type = "checkbox";
    box.name = "tag";
    box.value = allTags[a];
    box.checked = chosenTags.indexOf(allTags[a]) !== -1;
    label.appendChild(box);
    label.appendChild(document.createTextNode(allTags[a]));
    tagBox.appendChild(label);
  }

  // Keep the form showing what was searched
  document.getElementById("q").value = q;
  languageSelect.value = chosenLanguage;

  // Show the matching entries
  var found = 0;
  for (var m = 0; m < ENTRIES.length; m++) {
    if (entryMatches(ENTRIES[m], q.toLowerCase(), chosenLanguage, chosenTags)) {
      resultsBox.appendChild(makeEntryCard(ENTRIES[m]));
      found++;
    }
  }
  var countText = found + " entries found";
  if (found === 1) {
    countText = "1 entry found";
  }
  document.getElementById("result-count").textContent = countText;
}
