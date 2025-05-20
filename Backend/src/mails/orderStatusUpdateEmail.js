exports.orderStatusUpdateEmail = (name, orderNumber, status) => {
    return `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Order Status Update</title>
      <style>
        body { font-family: Arial; color: #333; }
        .container { max-width: 600px; margin: auto; padding: 20px; text-align: center; }
        .logo { max-width: 200px; margin-bottom: 20px; }
        .body { font-size: 16px; }
        .cta { background-color: #FFD60A; color: #000; padding: 10px 20px; border-radius: 5px; text-decoration: none; margin-top: 20px; display: inline-block; }
      </style>
    </head>
    <body>
      <div class="container">
        <img class="logo" src="https://res.cloudinary.com/dm1ghdlep/image/upload/v1693037440/ssproject_vlhgg8.png" alt="Store Logo">
        <h2>Hello, ${name}!</h2>
        <p class="body">Your order <strong>${orderNumber}</strong> status has been updated to <strong>${status}</strong>.</p>
        <a class="cta" href="/orders/${orderNumber}">View Order Details</a>
      </div>
    </body>
    </html>`;
  };