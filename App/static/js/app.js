// Variable declaration
const c1 = document.getElementById("currency-one");
const c2 = document.getElementById("currency-two");
const c3 = document.getElementById("currency-to-add");
const amount1 = document.getElementById("amount-one");
const amount2 = document.getElementById("amount-two");
const swap = document.getElementById("swap");
const theRate = document.getElementById("rate");

const chosen_currencies = [];

calculateAndDisplay();

// Event  Listeners
c1.addEventListener("change", changeResult);
c3.addEventListener("change", calculateAndDisplay);
amount1.addEventListener("input", changeResult);
const CurrencyDetail = {
  CAD: "CAD - Canadian Dollar",
  IDR: "IDR - Indonesian Rupiah",
  USD: "USD - United States Dollar",
  GBP: "GBP - British Pound Sterling",
  CHF: "CHF - Swiss Franc",
  SGD: "SGD - Singaporean Dollar",
  INR: "INR - Indian Rupee",
  MYR: "MYR - Malaysian Ringgit",
  JPY: "JPY - Japanese Yen",
  KRW: "KRW - South Korean Won"
};
function calculateAndDisplay() {
  var curr1 = c1.value;
  var curr2 = c3.value;
  // for default
  if (curr2 == "NAN") {
    curr2 = "IDR";
  }
  chosen_currencies.push(curr2);
  console.log("Chosen Currencies "+ chosen_currencies);
  const amountToConvert = amount1.value;
  
  const rateForTable = "";
  fetch(
    `http://api.currencylayer.com/convert?access_key=78043916d97d6372736025516e52e69a&from=${curr1}&to=${curr2}&amount=${amountToConvert}`
  )
    .then((res) => res.json())
    .then((data) => {
      const rate = data.info.quote;
      const rateForTable = `1 ${curr1} = ${curr2} ${rate} `;
      addToTable(curr2, data.result, rateForTable );
    });

  // selected value should be back to empty
  
  let element = document.getElementById("currency-to-add");
  element.value = "NAN";
}
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
var rowNum = 1;
const trArray = [];
const tableId = document.getElementById("resultTable");
function addToTable(currency, result, rate){
  result = Number(result);
  result = numberWithCommas(result.toFixed(2))
  if (!trArray.includes(currency)) {
    var id_tr = currency;
    trArray.push(id_tr)
    var x = document.createElement("TR");
    x.setAttribute("id", id_tr);
    tableId.appendChild(x);
    
    // td for currency and result and rate
    var td4 = document.createElement("TD");
    var curr = currency;
        //span for result in td
    var spanCurrency = document.createElement("span");
    spanCurrency.setAttribute("style","font-weight: bold; font-size: larger; display:block;");
    spanCurrency.setAttribute('id', 'span_id_'+curr)
    valCurr = document.createTextNode(curr+" \u00A0 \u00A0\u00A0 \u00A0 \u00A0 \u00A0 "+result);
    spanCurrency.appendChild(valCurr);
    td4.append(spanCurrency);
        //span for currency detail
    var spanCurrencyDtl = document.createElement("span");
    spanCurrencyDtl.setAttribute("style","font-size: smaller; display:block;");
    valCurrDtl = document.createTextNode(CurrencyDetail[curr]);
    spanCurrencyDtl.appendChild(valCurrDtl);
    td4.append(spanCurrencyDtl);
        //span for rate
    var spanRate = document.createElement("span");
    spanRate.setAttribute("style","font-size: small;");
    spanRate.setAttribute('id', 'span_id_rate_'+curr)
    valRate = document.createTextNode(rate);
    spanRate.appendChild(valRate);
    td4.append(spanRate);

    document.getElementById(id_tr).appendChild(td4);

    var tdRemoveButton = document.createElement("TD");
    var a_remove = document.createElement('a');
    a_remove.setAttribute("title", "Remove");
    a_remove.href = "javascript:void(0);";
    a_remove.setAttribute("class", "fas fa-trash-alt");
    a_remove.setAttribute("style","color:red")

    var func_a = "deleteRow('"+id_tr+"');";
    a_remove.setAttribute("onclick",func_a)
    a_remove.id = "idRemoveDir";
    tdRemoveButton.appendChild(a_remove);
    document.getElementById(id_tr).appendChild(tdRemoveButton);
  }
    
}

function deleteRow(row_number){
    var index = chosen_currencies.indexOf(row_number);
    console.log("DELETE ROW :"+index)
    if (index > -1) {
      chosen_currencies.splice(index, 1);
      trArray.splice(index,1);
    }
    console.log("Chosen currency after deletion :"+chosen_currencies)
  // then delete the tr element
    var trel=document.getElementById(row_number);
      if (trel!=null){
        document.getElementById(row_number).remove();
      }
 }

 function changeResult() {
  //change result of conversion 
  var rows = document.getElementById("resultTable").rows;
  if (amount1.value> 0) {
    for (let item of rows) {
      var idSpan = "span_id_"+item.id;
      var idSpanRate = "span_id_rate_"+item.id;
      const spanRes = document.getElementById(idSpan);
      const spanRate = document.getElementById(idSpanRate);
      fetch(
        `http://api.currencylayer.com/convert?access_key=78043916d97d6372736025516e52e69a&from=${c1.value}&to=${item.id}&amount=${amount1.value}`
       )
        .then((res) => res.json())
        .then((data) => {
          const ratee = data.info.quote;
          spanRate.innerText = `1 ${c1.value} = ${item.id} ${ratee} `;
          const newVal = numberWithCommas(Number(data.result).toFixed(2));
          spanRes.innerText = `${item.id} \u00A0 \u00A0\u00A0 \u00A0 \u00A0 \u00A0 ${newVal}`;
        });
    }
  }
  
 }