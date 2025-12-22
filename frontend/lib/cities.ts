// export const citiesByCountry: Record<string, string[]> = {
//     FR: ["Paris", "Marseille", "Lyon", "Lille", "Toulouse", "Nice", "Bordeaux"],
//     US: ["New York", "Los Angeles", "Chicago", "Houston", "Miami"],
//     JP: ["Tokyo", "Osaka", "Kyoto", "Nagoya"],
//     ES: ["Madrid", "Barcelona", "Valencia", "Seville"],
//     IT: ["Rome", "Milan", "Naples", "Turin"],
//     // Ajoute ce que tu veux
//   }

export const citiesByCountry: Record<string, { name: string; latlng: number[] }[]> = {
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
    // etc.
  }
  