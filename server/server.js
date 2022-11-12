const express = require("express");
const cors = require("cors");

const stripe = require("stripe")("copy your stripe key here");

const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

const YOUR_DOMAIN = "http://localhost:3000";

app.post("/api/checkout", async (req, res, next) => {
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: req.body.items.map((item) => {
        return {
          price_data: {
            currency: "usd",
            product_data: { name: item.name, images: [item.product] },
            unit_amount: item.price * 100,
          },
          quantity: item.quantity,
        };
      }),
      mode: "payment",
      success_url: `${YOUR_DOMAIN}/success.html`,
      cancel_url: `${YOUR_DOMAIN}/cancel.html`,
    });

    res.status(200).json(session);
  } catch (error) {
    next(error);
  }
});

app.listen(3000, () => console.log("Running on port 4242"));
