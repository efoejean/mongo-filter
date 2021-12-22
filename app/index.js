import express from "express";
import capitalize from "lodash.capitalize";

const app = express();

app.get("/api/listings", (req, res) => {
  /**
   * TODO: Use Insomnia to test this endpoint:
   * 'http://localhost:3000/api/listings?and-price-lte=250&and-price-gte=150&beds=2&bed_type=real+bed'
   *
   * TODO: Use `reduce` to generate: `{ $and: [{price: {$lte: 250}}, {price: {$gte: 150}}], beds: 2, bed_type:"Real Bed" }`. Hint: `Object.entries`.
   *
   * TODO: Send the response back as JSON. Hint: `res.json`.
   */
  const mongoFilter = Object.entries(req.query).reduce((acc, [key, value]) => {
    let v = null;
    // Is it a numeric value?
    if (Number(value)) {
      v = Number(value);
    }
    // Is value keywords with '+'?
    else if (value.includes("+")) {
      v = value
        .split("+")
        .map((keyword) => capitalize(keyword))
        .join(" ");
    } else {
      v = value;
    }

    // Is this an 'and'?
    if (key.startsWith("and-")) {
      // Pull the field and the operator
      const [_, field, operator] = key.split("-");

      // Do we have an 'and' already?
      if (acc.$and) {
        // Add to the existing 'and'
        acc.$and = [
          ...acc.$and,
          {
            [field]: {
              [`$${operator}`]: v,
            },
          },
        ];
      } else {
        acc.$and = [{ [field]: { [`$${operator}`]: v } }];
      }
    } else {
      acc[key] = v;
    }

    return acc;
  }, {});

  res.json(mongoFilter);
});

app.listen(3000, () => {
  console.info("Server 🏃🏾‍♂️ at: http://localhost:3000");
});
