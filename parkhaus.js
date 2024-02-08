document.addEventListener('DOMContentLoaded', () => {
    let muenzen = 100; // Startwert der Münzen
    let parkhaus = ladeParkhausDaten();
    aktualisiereMuenzenAnzeige();
    aktualisiereEtagenKosten();

    function ladeParkhausDaten() {
        const gespeicherteDaten = localStorage.getItem('parkhausDaten');
        if (gespeicherteDaten) {
            return JSON.parse(gespeicherteDaten);
        } else {
            // Standardwerte, falls keine Daten im localStorage sind
            return [];
        }
    }

    function speichereParkhausDaten() {
        localStorage.setItem('parkhausDaten', JSON.stringify(parkhaus));
        aktualisiereMuenzenAnzeige();
    }

    function aktualisiereAnzeige() {
        const stockwerkeContainer = document.getElementById('stockwerke');
        stockwerkeContainer.innerHTML = '';
        parkhaus.forEach((stockwerk, index) => {
            const freiePlaetze = stockwerk.kapazitaet - stockwerk.belegt;
            stockwerkeContainer.innerHTML += `
                <div class=\"p-5 border rounded shadow\">
                    <h2 class=\"text-xl mb-2\">Etage ${stockwerk.etage}</h2>
                    <p>Gesamtparkplätze: ${stockwerk.kapazitaet}</p>
                    <p>Belegte Parkplätze: ${stockwerk.belegt}</p>
                    <p>Freie Parkplätze: ${freiePlaetze}</p>
                </div>
            `;
        });
    }

    window.neueEtageHinzufuegen = function() {
        const etagenKosten = berechneEtageKosten();
        if (muenzen >= etagenKosten) {
            muenzen -= etagenKosten;
            const neueEtageNummer = parkhaus.length + 1;
            const neueEtage = { etage: neueEtageNummer, kapazitaet: 50, belegt: 0, mps: 1, kosten: etagenKosten };
            parkhaus.push(neueEtage);
            speichereParkhausDaten();
            aktualisiereAnzeige();
            aktualisiereEtagenKosten();
        } else {
            alert('Nicht genug Münzen!');
        }
    }

    function berechneEtageKosten() {
        return 50 * parkhaus.length; // Die Kosten für jede neue Etage steigen
    }

    function aktualisiereEtagenKosten() {
        document.getElementById('etagenKosten').textContent = berechneEtageKosten();
    }

    function aktualisiereMuenzenAnzeige() {
        document.getElementById('muenzen').textContent = muenzen;
    }

    setInterval(() => {
        parkhaus.forEach(etage => {
            muenzen += etage.mps;
        });
        speichereParkhausDaten();
        aktualisiereMuenzenAnzeige();
    }, 1000);
});