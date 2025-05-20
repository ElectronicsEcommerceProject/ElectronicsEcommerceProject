exports.couponNotificationEmail = (name, couponCode, expiryDate) => {
    return `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>New Coupon Available</title>
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
        <p class="body">A new coupon <strong>${couponCode}</strong> is available! Use it before <strong>${expiryDate}</strong> to enjoy discounts.</p>
        <a class="cta" href="/coupons">View Coupons</a>
      </div>
    </body>
    </html>`;
  };