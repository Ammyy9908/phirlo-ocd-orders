const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();

app.use(cors());

const PORT = process.env.PORT || 5000;

async function getMetaField(order) {
  try {
    const r = await axios.get(
      `https://phirlo-test-store.myshopify.com/admin/api/2022-10/orders/${order.id}/metafields.json`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": "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",
        },
      }
    );
    return r.data;
  } catch (e) {
    console.log(e);
    return null;
  }
}

app
  .get("/", (req, res) => {
    res.send("Hello World!");
  })
  .get("/orders", async (req, res) => {
    let processed_items = 0;
    const orders = await axios.get(
      `https://phirlo-test-store.myshopify.com/admin/api/2022-10/orders.json`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": "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",
        },
      }
    );

    let all_orders = orders.data.orders;
    let filtered_orders = all_orders.map(
      async (order) => await getMetaField(order)
    );

    Promise.all(filtered_orders).then((values) => {
      res.send(values);
    });
  })
  .get("/order/:id", async (req, res) => {
    const { id } = req.params;
    const order = await axios.get(
      `https://phirlo-test-store.myshopify.com/admin/api/2022-10/orders/${id}.json`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": "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",
        },
      }
    );

    res.send(order.data);
  });

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
