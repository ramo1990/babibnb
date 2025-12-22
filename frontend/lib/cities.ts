type City = {
  name: string;
  latlng: [lat: number, lng: number];
};

export const citiesByCountry: Record<string, City[]> = {
    FR: [
      { name: "Paris", latlng: [48.8566, 2.3522] },
      { name: "Marseille", latlng: [43.2965, 5.3698] },
      { name: "Lyon", latlng: [45.7640, 4.8357] },
      { name: "Lille", latlng: [50.6292, 3.0573] },
      { name: "Toulouse", latlng: [43.6047, 1.4442] },
      { name: "Nice", latlng: [43.7102, 7.2620] },
      { name: "Bordeaux", latlng: [44.8378, -0.5792] },
    ],
    US: [
      { name: "New York", latlng: [40.7128, -74.0060] },
      { name: "Los Angeles", latlng: [34.0522, -118.2437] },
      { name: "Chicago", latlng: [41.8781, -87.6298] },
      { name: "Houston", latlng: [29.7604, -95.3698] },
      { name: "Miami", latlng: [25.7617, -80.1918] },
    ],
    CI: [
        { name: "Abidjan", latlng: [5.3599, -4.0083] },
        { name: "Bouaké", latlng: [7.6906, -5.0303] },
        { name: "Yamoussoukro", latlng: [6.8276, -5.2893] },
        { name: "Daloa", latlng: [6.8774, -6.4500] },
        { name: "San-Pédro", latlng: [4.7485, -6.6363] },
        { name: "Korhogo", latlng: [9.4580, -5.6290] },
    ],
    // etc.
  }

//   afficher Abidjan en priorité, grouper les villes par région, charger les villes dynamiquement selon le pays
// ou remplacer ce tableau par une API backend plus tard