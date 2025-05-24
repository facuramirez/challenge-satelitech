export const options = (title) => ({
  title,
  titleTextStyle: {
    fontSize: 24, // tamaño en px, ajústalo a lo que quieras
    fontName: "Arial", // opcional, fuente
    bold: true,
    color: "#333",
  },
  legend: {
    position: "right",
    alignment: "center",
  },
  chartArea: { width: "100%", height: "100%" },
});

export const getFiltersAndMappedTrips = (trips) => {
  const litersData = [
    ["Litros", "Cantidad"],
    ["<10000", 0],
    ["10000-19999", 0],
    ["20000-30000", 0],
  ];

  trips.forEach((trip) => {
    const liters = parseInt(trip.liters, 10);

    if (liters < 10000) {
      litersData[1][1]++;
    } else if (liters < 20000) {
      litersData[2][1]++;
    } else if (liters <= 30000) {
      litersData[3][1]++;
    }
  });

  const statusMap = {
    completado: 0,
    en_transito: 0,
    sin_iniciar: 0,
    cancelado: 0,
  };

  trips.forEach((trip) => {
    const status = trip.status;
    if (statusMap.hasOwnProperty(status)) {
      statusMap[status]++;
    }
  });

  const statusData = [
    ["Estado", "Cantidad"],
    ["completado", statusMap.completado],
    ["en_transito", statusMap.en_transito],
    ["sin_iniciar", statusMap.sin_iniciar],
    ["cancelado", statusMap.cancelado],
  ];

  const fuelMap = {
    Diesel: 0,
    Gasolina: 0,
    Biodiesel: 0,
    GNC: 0,
  };

  trips.forEach((trip) => {
    const fuel = trip.fuel;
    if (fuelMap.hasOwnProperty(fuel)) {
      fuelMap[fuel]++;
    }
  });

  const fuelData = [
    ["Combustible", "Cantidad"],
    ["Diesel", fuelMap.Diesel],
    ["Gasolina", fuelMap.Gasolina],
    ["Biodiesel", fuelMap.Biodiesel],
    ["GNC", fuelMap.GNC],
  ];

  const originMap = {
    "Planta A": 0,
    "Planta B": 0,
    "Planta C": 0,
  };

  trips.forEach((trip) => {
    const origin = trip.origin;
    if (originMap.hasOwnProperty(origin)) {
      originMap[origin]++;
    }
  });

  const originData = [
    ["Origen", "Cantidad"],
    ["Planta A", originMap["Planta A"]],
    ["Planta B", originMap["Planta B"]],
    ["Planta C", originMap["Planta C"]],
  ];

  return { options, litersData, statusData, fuelData, originData };
};
