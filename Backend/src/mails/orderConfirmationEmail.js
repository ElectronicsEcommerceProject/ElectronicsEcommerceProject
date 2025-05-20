exports.orderConfirmationEmail = (name, orderId, items, totalAmount) => {
  const itemList = items
    .map(
      (item) => `
      <li style="margin-bottom: 15px;">
        <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; margin-right: 10px; vertical-align: middle;">
        <span style="font-weight: bold;">${item.name}</span> - 
        Qty: ${item.quantity} - 
        ₹${item.price} 
        <span style="font-size: 14px; color: #555;">(Subtotal: ₹${item.quantity * item.price})</span>
      </li>`
    )
    .join("");

  return `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Order Confirmation</title>
    <style>
      body { background-color: #ffffff; font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0; }
      .container { max-width: 600px; margin: auto; padding: 20px; text-align: center; }
      .logo { max-width: 200px; margin-bottom: 20px; }
      .message { font-size: 18px; font-weight: bold; }
      .body { font-size: 16px; margin: 20px 0; text-align: left; }
      ul { padding-left: 20px; list-style-type: none; }
      .cta { background-color: #FFD60A; padding: 10px 20px; color: black; font-weight: bold; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px; }
    </style>
  </head>
  <body>
    <div class="container">
      <img class="logo" src="https://res.cloudinary.com/dm1ghdlep/image/upload/v1693037440/ssproject_vlhgg8.png" alt="Store Logo">
      <div class="message">Order Confirmation - #${orderId}</div>
      <div class="body">
        <p>Hi ${name},</p>
        <p>Thank you for your purchase! Here’s what you ordered:</p>
        <ul>${itemList}</ul>
        <p><strong>Total: ₹${totalAmount}</strong></p>
        <p>Your order is being processed and you will receive updates soon.</p>
      </div>
      <a class="cta" href="/orders/${orderId}">Track Order</a>
    </div>
  </body>
  </html>`;
};