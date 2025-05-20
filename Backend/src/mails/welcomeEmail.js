
const welcomeEmail = (name, userType) => {
  const userSpecificMessage =
    userType === "retailer"
      ? "Explore our wholesale products and grow your business!"
      : "Discover amazing products tailored just for you!";
  const ctaLink = userType === "retailer" ? "/products?type=wholesale" : "/products";

  return `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Welcome to Our Store</title>
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
      <h2>Welcome, ${name}!</h2>
      <p class="body">${userSpecificMessage}</p>
      <a class="cta" href="${ctaLink}">Start Shopping</a>
    </div>
  </body>
  </html>`;
};

export default welcomeEmail;