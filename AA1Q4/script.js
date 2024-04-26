//initialize the supply array to store inventory items
var supply = [];

//function to add an item to the inventory
function addItem() {
    var itemInput = document.getElementById("itemInput").value;
    var inputArr = itemInput.split(",");
    var itemName = inputArr[0].trim();
    var itemQuantity = parseInt(inputArr[1].trim());
  
    if (!itemName || isNaN(itemQuantity) || itemQuantity <= 0) {
      alert("Please enter valid item name and quantity separated by comma.");
      return;
    }
  
    //Check if item already exists
    for (var i = 0; i < supply.length; i++) {
      if (supply[i].itemName.toLowerCase() === itemName.toLowerCase()) {
        alert("Item already added.");
        return;
      }
    }
  
    //if item doesn't exist, add it to the inventory
    supply.push({itemName: itemName, noOfItem: itemQuantity});
    displayItems(); // Call displayItems after adding item
}

//function to add quantity to an existing item
function addNoOfItem() {
    var itemName = document.getElementById("itemInput").value.split(",")[0].trim();
    var itemQuantity = parseInt(document.getElementById("itemInput").value.split(",")[1].trim());
  
    if (!itemName || isNaN(itemQuantity) || itemQuantity <= 0) {
      alert("Please enter valid item name and quantity separated by comma.");
      return;
    }
  
    //check if item already exists in inventory
    for (var i = 0; i < supply.length; i++) {
      if (supply[i].itemName.toLowerCase() === itemName.toLowerCase()) {
        supply[i].noOfItem += itemQuantity;
        displayItems(); // Call displayItems after updating item quantity
        return;
      }
    }
  
    //if doesn't exist, alert user
    alert("Item not found in inventory.");
}

//function to subtract from existing item
function subNoOfItem() {
    var itemName = document.getElementById("itemInput").value.split(",")[0].trim();
    var itemQuantity = parseInt(document.getElementById("itemInput").value.split(",")[1].trim());
  
    if (!itemName || isNaN(itemQuantity) || itemQuantity <= 0) {
      alert("Please enter valid item name and quantity separated by comma.");
      return;
    }
  
    //check if item exists
    for (var i = 0; i < supply.length; i++) {
      if (supply[i].itemName.toLowerCase() === itemName.toLowerCase()) {
        var newQuantity = supply[i].noOfItem - itemQuantity;
        if (newQuantity >= 0) {
          supply[i].noOfItem = newQuantity;
          displayItems(); //if the difference is negative
        } else {
          alert("Not enough items in inventory.");
        }
        return;
      }
    }
  
    //if item doesn't exist, alert user
    alert("Item not found in inventory.");
}

//function to remove an item
function removeItem() {
    var itemName = document.getElementById("itemInput").value.split(",")[0].trim();
  
    if (!itemName) {
      alert("Please enter item name to remove.");
      return;
    }
  
    for (var i = 0; i < supply.length; i++) {
      if (supply[i].itemName.toLowerCase() === itemName.toLowerCase()) {
        supply.splice(i, 1);
        displayItems();
        return;
      }
    }
  
    alert("Item not found in inventory.");
}

//function to display inventory in the table
function displayItems() {
    var table = document.getElementById("inventoryTable");
    
    table.innerHTML = "<tr><th>Item Name</th><th>No. of Items</th></tr>";
  
    for (var i = 0; i < supply.length; i++) {
      var row = table.insertRow(-1);
      var nameCell = row.insertCell(0);
      var numCell = row.insertCell(1);
  
      nameCell.textContent = supply[i].itemName;
      numCell.textContent = supply[i].noOfItem;
    }
}
