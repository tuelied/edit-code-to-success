# code constant

export default {
    // Products
    getProductList: "SELECT * FROM products ORDER BY created_at DESC",
    getProductInfo: "SELECT * FROM products WHERE id = ? LIMIT 0,1",
    createProduct: "INSERT INTO products (title, description, image, price, stocks) VALUES (?,?,?,?,?)",
    updateProductById: "UPDATE products SET title = ?, description = ?, image = ?, price = ?, stocks = ? WHERE id = ?",
    updateProductUnitById: "UPDATE products SET stocks = ? WHERE id = ?",
    deleteProductById: "DELETE FROM products WHERE id = ?",
    // Basket
    getBaskets: "SELECT baskets.id, baskets.product_id, products.title, products.image, products.price, products.stocks, baskets.units FROM baskets, products WHERE baskets.product_id = products.id AND baskets.user_id = ? ORDER BY baskets.created_at DESC",
    deleteBasketById: "DELETE FROM baskets WHERE id = ?",
    deleteBasketByUserId: "DELETE FROM baskets WHERE user_id = ?",
    addProductToBasket: "INSERT INTO baskets (product_id, user_id, units) VALUES (?,?,?)",
    // Authenticate
    checkUserByUsername: "SELECT * FROM accounts WHERE username = ?",
    checkUserById: "SELECT * FROM accounts WHERE id = ?",
    registerUser: "INSERT INTO accounts (username, password, display_name) VALUES (?,?,?)",
    // Address
    getProvinces: "SELECT * FROM address_provinces", // order by name_th using tis 620
    getDistrictByProvinceId: "SELECT * FROM address_districts WHERE province_id = ?",
    getSubDistrictByDistrictId: "SELECT * FROM address_sub_districts WHERE district_id = ?",
    getAddressSubDistrictById: "SELECT * FROM address_sub_districts WHERE id = ?",
    // Order
    getOrders: "select o.id, o.created_at, o.order_id, s.name as `shipping_name`, s.address as `shipping_address`, CONCAT('ตำบล', asd.name_th, ' อำเภอ', ad.name_th, ' จังหวัด', ap.name_th, ', ', asd.zip_code) as `shipping_province`, s.mobile as `shipping_mobile`, (SELECT JSON_ARRAYAGG(JSON_OBJECT('id', p.id, 'units', oi.order_units, 'title', p.title, 'price', oi.order_price, 'image', p.image)) FROM order_items oi, products p WHERE oi.order_product_id = p.id AND oi.order_id=o.id LIMIT 0,1) as items from orders o, shipping s, address_sub_districts asd, address_districts ad, address_provinces ap where s.order_id = o.id AND asd.id = s.address_id AND asd.district_id = ad.id AND ad.province_id = ap.id AND o.user_id = ? ORDER BY o.created_at DESC",
    createCheckout: "INSERT INTO orders (order_id, user_id) VALUES (?, ?)",
    createCheckoutItems: "INSERT INTO order_items (order_id, order_product_id, order_price, order_units) VALUES (?,?,?,?)",
    getOrderItemByProductId: "SELECT order_id FROM order_items WHERE order_product_id = ?",
    deleteManyOrderById: "DELETE FROM orders WHERE id IN (?)",
    // Shipping
    createShipping: "INSERT INTO shipping (order_id, name, address, address_id, mobile) VALUES (?,?,?,?,?)"
}
