import { useState, useRef, useEffect } from 'react';
import React from 'react';
import Footer from '../../../components/Footer/Footer';
import Header from '../../../components/Header/Header';

const BuyNowPage = () => {
  const [productData, setProductData] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [showFullSpecs, setShowFullSpecs] = useState(false);
  const [isRightScrollAtEnd, setIsRightScrollAtEnd] = useState(false);
  const [currentImage, setCurrentImage] = useState("");
  const [hoveredThumbnail, setHoveredThumbnail] = useState(null);
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [lensPosition, setLensPosition] = useState({ x: 0, y: 0 });
    const [isWishlisted, setIsWishlisted] = useState(false); // New state for wishlist


  const rightScrollRef = useRef(null);
  const leftScrollRef = useRef(null);
  const imageContainerRef = useRef(null);

  useEffect(() => {
    const mockApiResponse = {
      mainProduct: {
        title: "Dual Pairing Neckband Bluetooth (Midnight Black, In the Ear)",
        rating: "3.8",
        reviews: "37,635 Ratings & 2,055 Reviews",
        price: "₹289",
        originalPrice: "₹1,999",
        discount: "85% off",
        mainImage: "https://m.media-amazon.com/images/I/61bK6PMOC3L._AC_UF1000,1000_QL80_.jpg",
        thumbnails: [
          "https://m.media-amazon.com/images/I/61bK6PMOC3L._AC_UF1000,1000_QL80_.jpg",
          "https://m.media-amazon.com/images/I/61cwywLZR-L._AC_UF1000,1000_QL80_.jpg",
          "https://m.media-amazon.com/images/I/61cwywLZR-L._AC_UF1000,1000_QL80_.jpg",
          "https://m.media-amazon.com/images/I/61cwywLZR-L._AC_UF1000,1000_QL80_.jpg",
          "https://m.media-amazon.com/images/I/61cwywLZR-L._AC_UF1000,1000_QL80_.jpg",
                    "https://m.media-amazon.com/images/I/61cwywLZR-L._AC_UF1000,1000_QL80_.jpg"

        ],
        colors: [
          { name: "Midnight Black", thumbnail: "https://via.placeholder.com/60x60?text=Black" },
          { name: "Blue", thumbnail: "https://via.placeholder.com/60x60?text=Blue" },
          { name: "Red", thumbnail: "https://via.placeholder.com/60x60?text=Red" },
          { name: "Green", thumbnail: "https://via.placeholder.com/60x60?text=Green" }
        ],
        variants: ["Standard", "Pro", "Pro+"],
        offers: [
          "Bank Offer 5% Unlimited Cashback on Flipkart Axis Bank Credit Card",
          "Bank Offer 10% off up to ₹1,250 on DBS Bank Credit Card Transactions, on orders of ₹5,000 and above",
          "Bank Offer 10% off on BOBCCARD EMI Transactions, up to ₹1,500 on orders of ₹5,000 and above",
          "Special Price Get extra 71% off (price inclusive of cashback/coupon)"
        ],
        delivery: {
          date: "13 May, Tuesday",
          fee: "Free ₹40"
        },
        highlights: [
          "With MIC: Yes",
          "Bluetooth version: v5.0",
          "Wireless range: 10 m",
          "Battery life: 48 Hr"
        ],
        services: [
          "NA",
          "Cash on Delivery available"
        ],
        description: [
          "Aroma NB119 Pro Belief Neckband offers up to 48 hours of playtime with fast charging.",
          "It features Bluetooth v5.0, a 10m wireless range, and IPX5 water resistance."
        ],
        specifications: {
          General: [
            { key: "Model Name", value: "NB119 Pro Belief" },
            { key: "Color", value: "Midnight Black" },
            { key: "Headphone Type", value: "In the Ear" },
            { key: "Inline Remote", value: "Yes" },
            { key: "Water Resistant", value: "Yes, IPX5" },
            { key: "Active Noise Cancellation", value: "No" }
          ],
          Connectivity: [
            { key: "Bluetooth Version", value: "v5.0" },
            { key: "Wireless Range", value: "10m" },
            { key: "Bluetooth Profiles", value: "A2DP, AVRCP, HFP, HSP" },
            { key: "Microphone", value: "Yes" }
          ],
          "Product Details": [
            { key: "Battery Life", value: "Up to 48 hours" },
            { key: "Charging Time", value: "1 hour" },
            { key: "Playback Time", value: "6-8 hours (on single charge)" },
            { key: "Standby Time", value: "200 hours" },
            { key: "Charging Port", value: "Micro USB" }
          ],
          Warranty: [
            { key: "Warranty Summary", value: "1 Year Manufacturer Warranty" },
            { key: "Covered in Warranty", value: "Manufacturing Defects" },
            { key: "Not Covered in Warranty", value: "Physical Damage, Water Damage" }
          ]
        }
      },
      relatedProducts: [
        { id: 1, title: "Wireless Earbuds", price: "₹1,999", image: "https://m.media-amazon.com/images/I/61bK6PMOC3L._AC_UF1000,1000_QL80_.jpg" },
        { id: 2, title: "Bluetooth Headphones", price: "₹2,499", image: "https://m.media-amazon.com/images/I/61bK6PMOC3L._AC_UF1000,1000_QL80_.jpg" },
        { id: 3, title: "Noise Cancelling Headset", price: "₹3,999", image: "https://m.media-amazon.com/images/I/61bK6PMOC3L._AC_UF1000,1000_QL80_.jpg" },
        { id: 4, title: "Bass Boost Earphones", price: "₹1,599", image: "https://m.media-amazon.com/images/I/61bK6PMOC3L._AC_UF1000,1000_QL80_.jpg" },
        { id: 5, title: "Premium Neckband", price: "₹2,299", image: "https://m.media-amazon.com/images/I/61bK6PMOC3L._AC_UF1000,1000_QL80_.jpg" }
      ]
    };

    setProductData(mockApiResponse);
    setCurrentImage(mockApiResponse.mainProduct.mainImage);
  }, []);

  useEffect(() => {
    if (productData) {
      setSelectedColor(productData.mainProduct.colors[0]?.name || '');
      setSelectedVariant(productData.mainProduct.variants[0] || '');
    }
  }, [productData]);

  useEffect(() => {
    const handleRightScroll = () => {
      const element = rightScrollRef.current;
      if (element) {
        const isAtEnd = element.scrollHeight - element.scrollTop <= element.clientHeight + 5;
        setIsRightScrollAtEnd(isAtEnd);
      }
    };

    const rightElement = rightScrollRef.current;
    if (rightElement && productData) {
      rightElement.addEventListener('scroll', handleRightScroll);
      handleRightScroll();
    }

    return () => {
      if (rightElement) {
        rightElement.removeEventListener('scroll', handleRightScroll);
      }
    };
  }, [productData]);

  const handleWindowScroll = () => {
    if (isRightScrollAtEnd) {
      const leftElement = leftScrollRef.current;
      if (leftElement) {
        const scrollAmount = window.scrollY;
        leftElement.scrollLeft = scrollAmount;
        rightScrollRef.current.scrollTop = rightScrollRef.current.scrollHeight;
      }
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleWindowScroll);
    return () => window.removeEventListener('scroll', handleWindowScroll);
  }, [isRightScrollAtEnd]);

  const handleMouseMove = (e) => {
    if (!imageContainerRef.current) return;

    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
    let x = e.clientX - left - 50; // lensSize/2
    let y = e.clientY - top - 50; // lensSize/2

    // Keep lens within bounds
    x = Math.max(0, Math.min(x, width - 100));
    y = Math.max(0, Math.min(y, height - 100));

    setLensPosition({ x, y });
    setShowMagnifier(true);
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

  // Calculate zoom position
  const lensCenterX = lensPosition.x + 50; // lensSize/2
  const lensCenterY = lensPosition.y + 50; // lensSize/2
  const zoomLevel = 2;
  const zoomedPixelX = lensCenterX * zoomLevel;
  const zoomedPixelY = lensCenterY * zoomLevel;
  const zoomContainerWidth = 400;
  const zoomContainerHeight = 400;
  const bgPosX = zoomedPixelX - zoomContainerWidth / 2;
  const bgPosY = zoomedPixelY - zoomContainerHeight / 2;

  // Convert to percentage for backgroundPosition
  const zoomedImageWidth = imageContainerRef.current ? imageContainerRef.current.offsetWidth * zoomLevel : 0;
  const zoomedImageHeight = imageContainerRef.current ? imageContainerRef.current.offsetHeight * zoomLevel : 0;
  const bgPosXPercent = zoomedImageWidth > 0 ? (bgPosX / (zoomedImageWidth - zoomContainerWidth)) * 100 : 0;
  const bgPosYPercent = zoomedImageHeight > 0 ? (bgPosY / (zoomedImageHeight - zoomContainerHeight)) * 100 : 0;

  if (!productData) {
    return <div>Loading...</div>;
  }

  const { mainProduct, relatedProducts } = productData;

  return (
    <div className="min-h-screen bg-gray-100">
      <Header/>
  {/* Product Section */}
  <div className="max-w-7xl mx-auto p-6 flex flex-col md:flex-row gap-6">
    {/* Product Image Section */}
    <div className="md:w-1/3 relative">
      {/* Wishlist button - top right corner */}
      <button 
        className="absolute top-2 right-2 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
        onClick={() => setIsWishlisted(!isWishlisted)}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6" 
          fill={isWishlisted ? "red" : "none"} 
          viewBox="0 0 24 24" 
          stroke={isWishlisted ? "red" : "currentColor"}
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
          />
        </svg>
      </button>

      {/* Main Image Container - Height set for 6 thumbnails (6 x 60px = 360px) */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm flex flex-row h-[360px]">
        {/* Thumbnails Column - 60x60 pixels */}
        <div className="flex flex-col overflow-y-auto no-scrollbar w-[60px] border-r border-gray-200">
          {mainProduct.thumbnails.slice(0, 6).map((thumbnail, index) => (
            <div
              key={index}
              className={`
                relative flex-shrink-0 w-[60px] h-[60px]
                border-b border-gray-200 last:border-b-0
                cursor-pointer transition-all duration-100
                ${hoveredThumbnail === index ? 'bg-blue-50' : 'bg-white'}
              `}
              onMouseEnter={() => {
                setHoveredThumbnail(index);
                setCurrentImage(thumbnail);
              }}
              onClick={() => setCurrentImage(thumbnail)}
            >
              <div className={`
                absolute inset-0 border-2 pointer-events-none
                ${hoveredThumbnail === index ? 'border-blue-500' : 'border-transparent'}
              `}></div>
              
              <div className="absolute inset-0 flex items-center justify-center p-1 overflow-hidden">
                <img
                  src={thumbnail}
                  alt={`Thumbnail ${index + 1}`}
                  className="h-full w-full object-contain hover:scale-105 transition-transform"
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>
        
        {/* Main Image Area with Magnifier */}
        <div 
          ref={imageContainerRef}
          className="flex-grow flex items-center justify-center p-4 bg-white relative"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <img
            src={currentImage || mainProduct.mainImage}
            alt="Main Product"
            className="max-w-full max-h-[320px] object-contain"
          />

          {/* Magnifier Lens */}
          {showMagnifier && (
            <div
              className="absolute pointer-events-none border border-green-400 z-50"
              style={{
                left: lensPosition.x,
                top: lensPosition.y,
                width: `100px`,
                height: `100px`,
                backgroundColor: "rgba(0, 255, 0, 0.15)",
                backgroundImage: `
                  linear-gradient(rgba(0, 255, 0, 0.2) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0, 255, 0, 0.2) 1px, transparent 1px)
                `,
                backgroundSize: "10px 10px",
              }}
            />
          )}
        </div>
      </div>
      
      {/* Zoom Window */}
      {showMagnifier && (
        <div
          className="absolute left-full top-0 ml-4 w-[900px] h-[700px] border-2 border-gray-200 bg-white shadow-xl z-50 overflow-hidden"
          style={{
            backgroundImage: `url(${currentImage || mainProduct.mainImage})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: `${zoomLevel * 100}% ${zoomLevel * 100}%`,
            backgroundPosition: `${bgPosXPercent}% ${bgPosYPercent}%`,
          }}
        />
      )}
      
      {/* Action Buttons */}
      <div className="flex gap-2 mt-4">
        <button className="flex-1 bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors">
          ADD TO CART
        </button>
        <button className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
          BUY NOW
        </button>
      </div>
    </div>
        
        {/* Product Details Section */}
        <div
          ref={rightScrollRef}
          className="md:w-2/3 max-h-[80vh] overflow-y-auto pr-4 no-scrollbar"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          <style dangerouslySetInnerHTML={{
            __html: `.no-scrollbar::-webkit-scrollbar { display: none; }`
          }} />
          
          <h1 className="text-xl font-semibold">{mainProduct.title}</h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="bg-green-600 text-white text-sm px-2 py-1 rounded">{mainProduct.rating} ★</span>
            <span className="text-gray-600 text-sm">{mainProduct.reviews}</span>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-semibold">{mainProduct.price}</span>
            <span className="text-gray-500 line-through ml-2">{mainProduct.originalPrice}</span>
            <span className="text-green-600 ml-2">{mainProduct.discount}</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">+ ₹9 Protect Promise Fee <a href="#" className="text-blue-600 underline">Learn MORE</a></p>
          <p className="text-sm mt-2">Secure delivery by {mainProduct.delivery.date}</p>

          <div className="mt-4">
            <h3 className="font-semibold">Available offers</h3>
            <ul className="mt-2 space-y-2 text-sm">
              {mainProduct.offers.map((offer, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="text-green-600">✔</span> {offer} <a href="#" className="text-blue-600">T&C</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold">Delivery</h3>
            <div className="flex items-center gap-2 mt-2">
              <input
                type="text"
                placeholder="Enter Delivery Pincode"
                className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button className="text-blue-600 hover:underline">Check</button>
            </div>
            <p className="text-sm mt-2">Delivery by {mainProduct.delivery.date} | {mainProduct.delivery.fee} <a href="#" className="text-blue-600 underline">View Details</a></p>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold">Color Select</h3>
            <div className="flex gap-2 mt-2">
              {mainProduct.colors.map((color) => (
                <div
                  key={color.name}
                  className={`flex-shrink-0 w-16 h-16 bg-white border rounded-lg p-1 cursor-pointer ${
                    selectedColor === color.name ? 'border-blue-500' : 'border-gray-200 hover:border-blue-500'
                  }`}
                  onClick={() => setSelectedColor(color.name)}
                >
                  <img
                    src={color.thumbnail}
                    alt={color.name}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
              ))}
            </div>
            <p className="text-sm mt-2">Selected Color: {selectedColor}</p>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold">Variant</h3>
            <div className="flex gap-2 mt-2">
              {mainProduct.variants.map((variant) => (
                <button
                  key={variant}
                  className={`px-4 py-2 border rounded-md text-sm font-medium ${
                    selectedVariant === variant
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                  } transition-colors`}
                  onClick={() => setSelectedVariant(variant)}
                >
                  {variant}
                </button>
              ))}
            </div>
            <p className="text-sm mt-2">Selected Variant: {selectedVariant}</p>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold">Highlights</h3>
            <ul className="mt-2 text-sm list-disc list-inside">
              {mainProduct.highlights.map((highlight, index) => (
                <li key={index}>{highlight}</li>
              ))}
            </ul>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold">Services</h3>
            <ul className="mt-2 text-sm space-y-2">
              {mainProduct.services.map((service, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="text-blue-600">✔</span> {service} {service.includes("Cash on Delivery") && <a href="#" className="text-blue-600">?</a>}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold">Product Description</h3>
            {mainProduct.description.map((line, index) => (
              <p key={index} className="text-sm mt-2">{line}</p>
            ))}
          </div>

          <div className="mt-4">
            <h3 className="font-semibold">Specifications</h3>
            <div className="mt-2 text-sm">
              <div>
                <h4 className="font-medium text-gray-800">General</h4>
                <ul className="mt-1 space-y-1">
                  {mainProduct.specifications.General.map((spec, index) => (
                    <li key={index}><span className="font-medium">{spec.key}:</span> {spec.value}</li>
                  ))}
                </ul>
              </div>

              {showFullSpecs && (
                <>
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-800">Connectivity</h4>
                    <ul className="mt-1 space-y-1">
                      {mainProduct.specifications.Connectivity.map((spec, index) => (
                        <li key={index}><span className="font-medium">{spec.key}:</span> {spec.value}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4">
                    <h4 className="font-medium text-gray-800">Product Details</h4>
                    <ul className="mt-1 space-y-1">
                      {mainProduct.specifications["Product Details"].map((spec, index) => (
                        <li key={index}><span className="font-medium">{spec.key}:</span> {spec.value}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4">
                    <h4 className="font-medium text-gray-800">Warranty</h4>
                    <ul className="mt-1 space-y-1">
                      {mainProduct.specifications.Warranty.map((spec, index) => (
                        <li key={index}><span className="font-medium">{spec.key}:</span> {spec.value}</li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>
            <button
              className="text-blue-600 hover:underline text-sm mt-2"
              onClick={() => setShowFullSpecs(!showFullSpecs)}
            >
              {showFullSpecs ? 'Show Less' : 'Read More'}
            </button>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold">Additional Information</h3>
            <p className="text-sm mt-2">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
        </div>
      </div>

      {isRightScrollAtEnd && (
        <div className="max-w-7xl mx-auto p-6">
          <h3 className="text-xl font-semibold mb-6">Related Products</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {relatedProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-square flex items-center justify-center p-4">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="p-4">
                  <h4 className="text-md font-medium line-clamp-2">{product.title}</h4>
                  <p className="text-lg font-semibold mt-2">{product.price}</p>
                </div>
              </div>
            ))}
          </div>
         
        </div>
      )}
       <Footer/>
    </div>
  );
};

export default BuyNowPage;