let allStocks = [];

fetch("stocks.json")
    .then(response => response.json())
    .then(data => {

        allStocks = data;

        displayStocks(allStocks);

    });

function displayStocks(stocks) {

    let table = document.querySelector("#table tbody");

    table.innerHTML = "";

    stocks.forEach(stock => {

        let row = `
            <tr onclick='showDetails(${JSON.stringify(stock)})'>
                <td>${stock.Ticker}</td>
                <td>${stock["PE Ratio"]}</td>
                <td>${(stock["Market Cap"] / 1e9).toFixed(1)} B</td>
                <td>${(stock["Revenue Growth"] * 100).toFixed(1)}%</td>

                <td style="color: ${stock.Score >= 80 ? "#22c55e" : stock.Score >= 60 ? "#facc15" : "#ef4444"};
                font-weight:bold;
                ">
                ${stock.Score.toFixed(1)}/100
                </td>
            </tr>
        `;

        table.innerHTML += row;

    });

}

function filterStocks() {

    let maxPE = Number(document.getElementById("maxPE").value);

    let tickerSearch = document
        .getElementById("searchTicker")
        .value
        .toUpperCase();

    let minMarketCap = Number(document.getElementById("minMarketCap").value);

    let minRevenueGrowth = Number(document.getElementById("minRevenueGrowth").value);

    let sortBy = document.getElementById("sortBy").value;

    let sortOrder = document.getElementById("sortOrder").value;

    let filtered = allStocks.filter(stock => {

        return stock["PE Ratio"] <= maxPE && stock.Ticker.includes(tickerSearch) &&
            (stock["Market Cap"] / 1e9) >= minMarketCap &&
            ((stock["Revenue Growth"] ?? 0) * 100) >= minRevenueGrowth;
    });

    filtered.sort((a, b) => {
        let valueA = a[sortBy];
        let valueB = b[sortBy];

        if (sortBy === "Ticker") {
            return sortOrder === "asc"
                ? valueA.localeCompare(valueB)
                : valueB.localeCompare(valueA);
        }

        valueA = valueA ?? 0;
        valueB = valueB ?? 0;

        return sortOrder === "asc"
            ? valueA - valueB
            : valueB - valueA;
    });
    displayStocks(filtered);

}
function showDetails(stock) {

    document.getElementById("overlay").style.display = "block";

    let popup = document.getElementById("stockDetails");

    popup.style.display = "block";

    setTimeout(() => {

        popup.style.opacity = "1";

    }, 20);

    document.getElementById("stockTitle").innerText = stock.Ticker;

    document.getElementById("price").innerText = stock["Current Price"];

    document.getElementById("pe").innerText = stock["PE Ratio"];

    document.getElementById("cap").innerText =
        (stock["Market Cap"] / 1e9).toFixed(1) + " B";

    document.getElementById("growth").innerText =
        (stock["Revenue Growth"] * 100).toFixed(1) + "%";

    document.getElementById("high").innerText =
        stock["52 Week High"];

    document.getElementById("low").innerText =
        stock["52 Week Low"];

    document.getElementById("sector").innerText =
        stock["Sector"];

    document.getElementById("industry").innerText =
        stock["Industry"];
    document.getElementById("detailsScore").innerText =
        stock.Score.toFixed(1) + "/100";

}
setInterval(() => {

    fetch("stocks.json")

        .then(response => response.json())

        .then(data => {

            allStocks = data;

            filterStocks();

            console.log("Updated!");

        });

}, 60000);

function closeDetails() {

    document.getElementById("overlay").style.display = "none";

    let popup = document.getElementById("stockDetails");

    popup.style.opacity = "0";

    setTimeout(() => {

        popup.style.display = "none";

    }, 250);

}

document.getElementById("overlay").addEventListener("click", closeDetails);