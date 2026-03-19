/* =====================================================
   MUMBAI LOCAL SMART NAVIGATOR
   Graph-Based Professional Version
===================================================== */

console.log("Mumbai Local Smart Navigator Loaded");

/* ===============================
   GLOBAL DATA STRUCTURE
================================= */

const railwayData = {
    western: [
        "Churchgate","Marine Lines","Charni Road",
        "Grant Road","Mumbai Central","Mahalaxmi",
        "Lower Parel","Dadar","Bandra",
        "Andheri","Goregaon","Borivali"
    ],
    central: [
        "CSMT","Masjid","Sandhurst Road",
        "Byculla","Dadar","Kurla",
        "Ghatkopar","Vikhroli","Kanjurmarg",
        "Bhandup","Mulund","Thane"
    ],
    harbour: [
        "CSMT","Masjid","Sandhurst Road",
        "Dockyard Road","Reay Road","Sewri",
        "Vadala Road","Kurla","Chembur",
        "Govandi","Vashi","Panvel"
    ]
};

const stationTouristInfo = {
    western: {
        "Churchgate": ["Marine Drive", "Nariman Point"],
        "Marine Lines": ["Girgaon Chowpatty"],
        "Charni Road": ["Hanging Gardens"],
        "Mumbai Central": ["Mumbai Central Bus Depot"],
        "Mahalaxmi": ["Mahalaxmi Temple", "Haji Ali Dargah"],
        "Dadar": ["Siddhivinayak Temple"],
        "Bandra": ["Bandra Fort", "Mount Mary Church"],
        "Andheri": ["Infinity Mall"],
        "Borivali": ["Sanjay Gandhi National Park"]
    }
};

/* ===============================
   PAGE LOAD EVENTS
================================= */

window.addEventListener("DOMContentLoaded", function () {

    alert("Welcome to Mumbai Local Smart Navigator 🚆");

    const dateElement = document.getElementById("datetime");
    if (dateElement) {
        const now = new Date();
        dateElement.innerHTML =
            "Current Date & Time: " + now.toLocaleString();
    }
});

/* ===============================
   GRAPH BUILDING
================================= */

function buildGraph() {

    const graph = {};

    for (let line in railwayData) {

        const stations = railwayData[line];

        for (let i = 0; i < stations.length; i++) {

            if (!graph[stations[i]]) {
                graph[stations[i]] = [];
            }

            if (i > 0) {
                graph[stations[i]].push(stations[i - 1]);
            }

            if (i < stations.length - 1) {
                graph[stations[i]].push(stations[i + 1]);
            }
        }
    }

    return graph;
}

/* ===============================
   BFS SHORTEST PATH
================================= */

function findShortestPath(graph, start, end) {

    const queue = [[start]];
    const visited = new Set();

    while (queue.length > 0) {

        const path = queue.shift();
        const station = path[path.length - 1];

        if (station === end) {
            return path;
        }

        if (!visited.has(station)) {

            visited.add(station);

            const neighbours = graph[station];

            for (let neighbour of neighbours) {
                queue.push([...path, neighbour]);
            }
        }
    }

    return [];
}

/* ===============================
   UTILITY FUNCTIONS
================================= */

function getStationLine(station) {
    for (let line in railwayData) {
        if (railwayData[line].includes(station)) {
            return line;
        }
    }
    return null;
}

function isInterchange(station) {
    let count = 0;
    for (let line in railwayData) {
        if (railwayData[line].includes(station)) count++;
    }
    return count > 1;
}

function formatLineName(line) {
    return line.charAt(0).toUpperCase() + line.slice(1);
}

function calculateFare(totalStations) {
    return (totalStations - 1) * 5;
}

function checkServiceStatus() {
    const hour = new Date().getHours();
    return (hour >= 5 && hour <= 23)
        ? "🟢 Service Running"
        : "🔴 Service Closed";
}

function generateDelay() {
    return Math.random() > 0.75
        ? "⚠ 10-15 Minutes Delay Due to Signal Issue"
        : "✅ On Time";
}

function showWesternLineDetails() {

    const container = document.getElementById("westernRouteDetails");
    if (!container) return;

    let output = `
        <h3>Route Timeline</h3>
        <ul class="route-timeline">
    `;

    railwayData.western.forEach(station => {

        const isInter = isInterchange(station);

        output += `
            <li>
                <span class="timeline-dot ${isInter ? 'interchange-dot' : ''}"></span>
                <div class="timeline-content">
                    <strong>
                        ${station} ${isInter ? '🔁 (Interchange)' : ''}
                    </strong>
                    ${
                        stationTouristInfo.western[station]
                        ? `<div class="nearby">
                              📍 ${stationTouristInfo.western[station].join(", ")}
                           </div>`
                        : ""
                    }
                </div>
            </li>
        `;
    });

    output += "</ul>";

    container.innerHTML = output;
}


function toggleStation(index) {

    const details = document.getElementById(`station-${index}`);

    if (details.style.display === "block") {
        details.style.display = "none";
    } else {
        details.style.display = "block";
    }
}




function searchStation() {

    const input = document.getElementById("searchInput").value.trim();
    const resultDiv = document.getElementById("searchResult");

    if (!input) {
        resultDiv.innerHTML = "Please enter a station name.";
        return;
    }

    let found = false;
    let foundLine = "";

    for (let line in railwayData) {
        for (let station of railwayData[line]) {

            if (station.toLowerCase() === input.toLowerCase()) {
                found = true;
                foundLine = line;
                break;
            }
        }
    }

    if (found) {
        resultDiv.innerHTML =
            `<strong>${input}</strong> found on <span class="${foundLine}">
             ${foundLine.charAt(0).toUpperCase() + foundLine.slice(1)} Line
             </span>`;
    } else {
        resultDiv.innerHTML =
            `<span style="color:red;">Station Not Found</span>`;
    }
}

function showDelayNotification() {

    const delayDiv = document.getElementById("delayOutput");

    const random = Math.random();

    let message = "";

    if (random > 0.7) {
        message = "⚠ Western Line Fast Train delayed by 12 minutes due to signal issue.";
    } else if (random > 0.4) {
        message = "⏳ Minor delay of 5 minutes on Central Line.";
    } else {
        message = "✅ All trains running on time.";
    }

    delayDiv.innerHTML = `<strong>${message}</strong>`;
}

function showRoute() {

    const routeNumber = document.getElementById("routeNumberInput").value;
    const resultDiv = document.getElementById("routeNumberResult");

    let routeDetails = "";

    switch (routeNumber) {

        case "101":
            routeDetails = railwayData.western.join(" → ");
            resultDiv.innerHTML =
                `<strong>Western Line Route:</strong><br>${routeDetails}`;
            break;

        case "102":
            routeDetails = railwayData.central.join(" → ");
            resultDiv.innerHTML =
                `<strong>Central Line Route:</strong><br>${routeDetails}`;
            break;

        case "103":
            routeDetails = railwayData.harbour.join(" → ");
            resultDiv.innerHTML =
                `<strong>Harbour Line Route:</strong><br>${routeDetails}`;
            break;

        default:
            resultDiv.innerHTML =
                `<span style="color:red;">Invalid Route Number</span>`;
    }
}


/* ===============================
   JOURNEY PLANNER LOGIC
================================= */

document.addEventListener("DOMContentLoaded", function () {

    const lineSelect = document.getElementById("lineSelect");
    const sourceSelect = document.getElementById("sourceStation");
    const destSelect = document.getElementById("destinationStation");
    const form = document.getElementById("journeyForm");
    const resultDiv = document.getElementById("routeResult");

    if (!lineSelect) return;

    /* Populate Dropdowns */
    lineSelect.addEventListener("change", function () {

        const selectedLine = this.value;

        sourceSelect.innerHTML = "<option value=''>Select Source</option>";
        destSelect.innerHTML = "<option value=''>Select Destination</option>";

        if (!selectedLine) return;

        railwayData[selectedLine].forEach(station => {
            sourceSelect.add(new Option(station, station));
        });

        const allStations = new Set();
        for (let line in railwayData) {
            railwayData[line].forEach(st => allStations.add(st));
        }

        allStations.forEach(station => {
            destSelect.add(new Option(station, station));
        });
    });

    /* FORM SUBMIT */
    form.addEventListener("submit", function (e) {

        e.preventDefault();

        const source = sourceSelect.value;
        const destination = destSelect.value;

        if (!source || !destination) {
            alert("Please select both stations.");
            return;
        }

        const graph = buildGraph();
        const route = findShortestPath(graph, source, destination);

        if (route.length === 0) {
            alert("Route not found.");
            return;
        }

        const totalStations = route.length;
        const fare = calculateFare(totalStations);
        const status = checkServiceStatus();

        /* Detect Line Changes */
        let interchangeMessages = [];

        for (let i = 1; i < route.length; i++) {

            const previousLine = getStationLine(route[i - 1]);
            const currentLine = getStationLine(route[i]);

            if (previousLine !== currentLine) {

                interchangeMessages.push(
                    `🔁 At ${route[i - 1]}, change from ${formatLineName(previousLine)} Line to ${formatLineName(currentLine)} Line`
                );
            }
        }

        /* OUTPUT BUILD */

        let output = `
            <h3>Journey Summary</h3>
            <p><strong>Total Stations:</strong> ${totalStations}</p>
            <p><strong>Estimated Fare:</strong> ₹${fare}</p>
            <p><strong>Status:</strong> ${status}</p>
        `;

        if (interchangeMessages.length > 0) {

            output += `<p><strong>Interchange Instructions:</strong></p><ul>`;

            interchangeMessages.forEach(msg => {
                output += `<li class="interchange">${msg}</li>`;
            });

            output += `</ul>`;
        }

        output += `<p><strong>Route:</strong></p><ul>`;

        route.forEach(station => {

            let className = getStationLine(station);

            if (isInterchange(station)) {
                className = "interchange";
            }

            output += `<li class="${className}">${station}</li>`;
        });

        output += "</ul>";

        resultDiv.innerHTML = output;
    });
});

/* ===============================
   DYNAMIC SCHEDULE TABLE
================================= */

const scheduleData = [
    { line: "Western", type: "Fast", time: "08:15 AM" },
    { line: "Central", type: "Slow", time: "09:05 AM" },
    { line: "Harbour", type: "Fast", time: "10:40 AM" },
    { line: "Western", type: "Slow", time: "12:10 PM" }
];

function generateScheduleTable() {

    const container = document.getElementById("scheduleContainer");
    if (!container) return;

    let table = `
        <table>
            <tr>
                <th>Line</th>
                <th>Train Type</th>
                <th>Departure Time</th>
            </tr>
    `;

    scheduleData.forEach(train => {
        table += `
            <tr>
                <td>${train.line}</td>
                <td>${train.type}</td>
                <td>${train.time}</td>
            </tr>
        `;
    });

    table += "</table>";

    container.innerHTML = table;
}

function showTrain(type) {

    const details = document.getElementById("trainDetails");
    const content = document.getElementById("trainContent");

    let output = "";

if (type === "local") {
    output = `
        <div class="train-info-layout">
            <img src="images/local-train.jpg" alt="Mumbai Local Train">

            <div>
                <h3>🚆 Mumbai Local Train (Suburban EMU)</h3>

                <ul>
                    <li><strong>Available On:</strong> Western, Central & Harbour Lines</li>

                    <li><strong>Major Boarding Stations:</strong> 
                        Churchgate, Dadar, Bandra, Andheri (Western) | 
                        CSMT, Kurla, Thane (Central) | 
                        CSMT, Vadala Road, Panvel (Harbour)
                    </li>

                    <li><strong>Stops:</strong> All stations (Slow) | Major stations only (Fast)</li>

                    <li><strong>Fare:</strong> Most economical mode of travel in Mumbai</li>

                    <li><strong>Coach Types:</strong> General, First Class, Ladies Special, Senior Citizen Reserved</li>

                    <li><strong>Frequency:</strong> Every 3–5 minutes during peak hours</li>

                    <li><strong>Daily Ridership:</strong> Over 7 million passengers</li>

                    <li><strong>Ideal For:</strong> Daily office commuters, students, and short-distance travel</li>
                </ul>

                <p style="margin-top:15px; font-size:14px; color:#666;">
                    *Mumbai Local Trains are the lifeline of the city, 
                    forming one of the busiest suburban railway networks in the world.
                </p>
            </div>
        </div>
    `;
}
    else if (type === "ac") {
    output = `
        <div class="train-info-layout">
            <img src="images/ac-local.jpg" alt="AC Local Train">

            <div>
                <h3>❄️ AC Local (Mumbai Suburban)</h3>

                <ul>
                    <li><strong>Available On:</strong> Western Line & Central Line</li>

                    <li><strong>Major Boarding Stations:</strong> 
                        Churchgate, Andheri, Borivali (Western) | 
                        CSMT, Dadar, Thane (Central)
                    </li>

                    <li><strong>Stops:</strong> Limited compared to regular local</li>

                    <li><strong>Fare:</strong> Higher than First-Class Local</li>

                    <li><strong>Coach Type:</strong> Fully Air-Conditioned EMU Coaches</li>

                    <li><strong>Payment Options:</strong> Smart Card, UTS App, Ticket Counter</li>

                    <li><strong>Ideal For:</strong> Office commuters seeking comfort during peak hours</li>
                </ul>

                <p style="margin-top:15px; font-size:14px; color:#666;">
                    *AC Local trains were introduced to provide enhanced 
                    passenger comfort in Mumbai’s high-density suburban network.
                </p>
            </div>
        </div>
    `;
}

else if (type === "express") {
    output = `
        <div class="train-info-layout">
            <img src="images/express-train.jpg" alt="Vande Bharat Express">

            <div>
                <h3>⚡ Vande Bharat Express (Premium Service)</h3>

                <ul>
                    <li><strong>Boarding Stations in Mumbai:</strong> 
                        Mumbai Central, Chhatrapati Shivaji Maharaj Terminus (CSMT)
                    </li>

                    <li><strong>Major Connectivity From Mumbai:</strong> 
                        Ahmedabad, Gandhinagar, Solapur, Madgaon (Goa)
                    </li>

                    <li><strong>Travel Type:</strong> Intercity Semi High-Speed Train</li>

                    <li><strong>Average Speed:</strong> Up to 160 km/h</li>

                    <li><strong>Coach Type:</strong> Fully Air-Conditioned Chair Car & Executive Class</li>

                    <li><strong>Ideal For:</strong> Business travel & fast interstate connectivity</li>
                </ul>

                <p style="margin-top:15px; font-size:14px; color:#666;">
                    *Vande Bharat Express connects Mumbai with major cities 
                    across western and southern India, providing faster 
                    premium intercity travel.
                </p>
            </div>
        </div>
    `;
}

    content.innerHTML = output;
    details.classList.remove("hidden");
}

document.addEventListener("DOMContentLoaded", function () {

    const params = new URLSearchParams(window.location.search);
    const trainType = params.get("train");

    if (trainType) {
        showTrain(trainType);

        // Optional auto scroll
        setTimeout(() => {
            document.getElementById("trainDetails")
                .scrollIntoView({ behavior: "smooth" });
        }, 200);
    }

});

/* ==========================================
   SERVICE AVAILABILITY CHECK (Task 5)
========================================== */

function checkServiceAvailability() {

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();

    const currentTime = currentHour + currentMinutes / 60;

    let message = "";

    // Local Train Service (4:30 AM – 12:30 AM)
    if (currentTime >= 4.5 && currentTime <= 24.5) {
        message = "✅ Local Train Services are currently AVAILABLE.";
    }

    // Early Morning Maintenance Window
    else if (currentTime > 0 && currentTime < 4.5) {
        message = "⚠ Limited Services Running (Night Maintenance Hours).";
    }

    // Fallback
    else {
        message = "❌ Services Currently Unavailable.";
    }

    const statusDiv = document.getElementById("serviceStatus");

    if (statusDiv) {
        statusDiv.innerHTML = message;
    }
}

document.addEventListener("DOMContentLoaded", checkServiceAvailability);