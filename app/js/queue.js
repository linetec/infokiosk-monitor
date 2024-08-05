function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timeString = `${hours}:${minutes}`;

    document.querySelector('.clock').textContent = timeString;
}

// Update the clock immediately and then every second
updateClock();
setInterval(updateClock, 1000);

let isDialogOn = false

const dialog = document.querySelector("dialog");

  function showDialogue(text) {
    document.querySelector(".dialog-content").innerHTML = text
    dialog.showModal();
    let audio = new Audio('./492503-pleasing-melodic-bell-tonal-06.wav');
    audio.play();
    isDialogOn = true
    setTimeout(() => {
        dialog.close();
        isDialogOn = false 
    }, 7000)
  }

function addDiv(id) {
    const numbersDiv = document.querySelector('.numbers');
    const newDiv = document.createElement('div');

    newDiv.id = id;
    newDiv.textContent = `Div with ID: ${id}`;
    numbersDiv.appendChild(newDiv);
}

function removeDivById(id) {
    const divToRemove = document.getElementById(id).remove()
}


async function updateQueueMonitor() {

    const host = await app_data.host()

    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        showQueueMonitor(JSON.parse(this.response))
      }
    }

    xmlhttp.open("GET", `http://${host}:9012/monitor`);
    xmlhttp.setRequestHeader("Content-Type", "application/json");

    xmlhttp.send();
}

updateQueueMonitor()
setInterval(updateQueueMonitor, 5000);

function showQueueMonitor(data) {

    document.querySelector(".numbers").innerHTML = ""
    for (let i = 0; i < data.ticketsQueue.length; i++) {
        
        const h4 = document.createElement("h4");
        if (data.ticketsQueue[i].time) {
            h4.textContent = `${data.ticketsQueue[i].id} → ${data.ticketsQueue[i].time}`;
        } else {
            h4.textContent = `${data.ticketsQueue[i].id}`;
        }

        document.querySelector('.numbers').appendChild(h4)
    }

    for (let i = 0; i < data.ticketAlerts.length; i++) {
        function showAlert(ticketAlert) {

            if (isDialogOn) {
                setTimeout(showAlert(ticketAlert), 8000)
            } else {
                const message = `Запрошуємо <br><br><h1>талон №${ticketAlert.id}</h1> <br><br><h2>до ${ticketAlert.local_description}</h2>`
                showDialogue(message)
            }
        }

        showAlert(data.ticketAlerts[i])
    }

    document.querySelector(".workspaces").innerHTML = ""
    for (let i = 0; i < data.workplaces.length; i++) {

        if (data.workplaces[i].online) {

            const div = document.createElement("div")
            div.classList.add("item")
    
            const h4 = document.createElement("h4");
            h4.textContent = `${data.workplaces[i].local_description || data.workplaces[i].description}`;
            div.appendChild(h4)
    
            const ticket_status = document.createElement("div")
            ticket_status.classList.add("ticket")
            if (data.workplaces[i].online && data.workplaces[i].ticket_number != "" && data.workplaces[i].ticket_arrived) {
                ticket_status.classList.add("big")
                ticket_status.innerHTML = data.workplaces[i].ticket_number
            } else if (data.workplaces[i].online && data.workplaces[i].ticket_number != "") {
                ticket_status.classList.add("big")
                ticket_status.classList.add("yellow")
                ticket_status.innerHTML = data.workplaces[i].ticket_number
            }else if (data.workplaces[i].online && data.workplaces[i].isWorking) {
                ticket_status.classList.add("green")
                ticket_status.innerHTML = "Працює"
            } else {
                ticket_status.innerHTML = "Перерва"
            }
    
            div.appendChild(ticket_status)
    
            document.querySelector(".workspaces").appendChild(div)

        }

    }
}
