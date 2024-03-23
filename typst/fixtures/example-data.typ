#let biller = (
    name: "Gyro Gearloose",
    title: "Inventor",
    company: "Crazy Inventions Ltd.",
    vat-id: "DL1234567",
    iban: "DE89370400440532013000",
    address: (
      country: "Disneyland",
      city: "Duckburg",
      postal-code: "123456",
      street: "Inventor Drive 23",
    ),
  )

#let recipient = (
    name: "Scrooge McDuck",
    title: "Treasure Hunter",
    vat-id: "DL7654321",
    address: (
      country: "Disneyland",
      city: "Duckburg",
      postal-code: "123456",
      street: "Killmotor Hill 1",
    )
  )

#let table-data = (
    (
      number: 1,
      date: "2016-04-03",
      description: "Arc reactor",
      dur-min: 0,
      quantity: 1,
      price: 13000,
    ),
    (
      number: 2,
      date: "2016-04-05",
      description: "Flux capacitor",
      dur-min: 0,
      quantity: 1,
      price: 27000,
    ),
    (
      number: 3,
      date: "2016-04-07",
      description: "Lightsaber",
      dur-min: 0,
      quantity: 2,
      price: 3600,
    ),
    (
      number: 4,
      date: "2016-04-08",
      description: "Sonic screwdriver",
      dur-min: 0,
      quantity: 10,
      price: 800,
    ),
    (
      number: 5,
      date: "2016-04-12",
      description: "Assembly",
      dur-min: 160,
      quantity: 1,
      price: 53.33,
     )
  )
