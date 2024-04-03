import _ from '@lodash';
import FuseUtils from '@fuse/utils';
import mockApi from '../mock-api.json';
import { updateProductId } from './api/auth.product';
import { getAllProductsId, getOrders } from './api/auth.company';

let productsDB = JSON.parse(localStorage.getItem("Products"));
// console.log(JSON.parse(localStorage.getItem("Products")));
// let products = JSON.parse(localStorage.getItem("Products"));
// if (products) {
// 	productsDB = JSON.parse(localStorage.getItem("Products"));
// }
// let productsDB = mockApi.components.examples.ecommerce_products.value;
let ordersDB = JSON.parse(localStorage.getItem("orders"));

// if (products.length > 0) {
// 	products.forEach(element => {
// 		productsDB.push(
// 			{
// 				"id": element.id,
// 				"name": element.name,
// 				"handle": "",
// 				"description": "Duis anim est non exercitation consequat. Ullamco ut ipsum dolore est elit est ea elit ad fugiat exercitation. Adipisicing eu ad sit culpa sint. Minim irure Lorem eiusmod minim nisi sit est consectetur.",
// 				"categories": [],
// 				"featuredImageId": "2",
// 				"images": [
// 					{
// 						"id": "0",
// 						"url": element.img,
// 						"type": "image"
// 					}
// 				],
// 				"priceTaxExcl": element.price,
// 				"priceTaxIncl": element.price,
// 				"taxRate": 10,
// 				"comparedPrice": 29.9,
// 				"quantity": 92,
// 				"sku": "A445BV",
// 				"width": "22cm",
// 				"height": "24cm",
// 				"depth": "15cm",
// 				"weight": "3kg",
// 				"extraShippingFee": 3,
// 				"active": true
// 			},
// 		)
// 		return [200, productsDB];
// 	});
// }
export const eCommerceApiMocks = (mock) => {
	mock.onGet('/ecommerce/products').reply(async () => {
		const products = await getAllProductsId();
		let p = [];
		products.data.forEach(element => {
			console.log(element);
			p.push(
				{
					"id": element.id,
					"name": element.name,
					"handle": "",
					"description": element.description,
					"categories": [
						element.nameCategory
					],
					"featuredImageId": "2",
					"images": [
						{
							"id": "0",
							"url": element.img,
							"type": "image"
						}
					],
					"priceTaxExcl": element.price,
					"priceTaxIncl": element.price,
					"taxRate": element.taxRate,
					"comparedPrice": element.comparedPrice,
					"quantity": element.stock,
					"sku": element.sku,
					"width": element.width,
					"height": element.height,
					"depth": element.depth,
					"weight": element.weight,
					"extraShippingFee": element.extraShippingFee,
					"active": true,
					"idCompany": element.idCompany,
					"idCategory": element.idCategory
				},
			)
		})

		localStorage.setItem("Products", JSON.stringify(p.reverse()))
		return [200, productsDB];
	});
	mock.onPost('/ecommerce/products').reply(async ({ data }) => {
		const newProduct = { id: FuseUtils.generateGUID(), ...JSON.parse(data) };
		console.log("Dataaa", newProduct);

		productsDB.push(newProduct);
		console.log(productsDB, "P");
		// Actualizar el producto en el localStorage
		localStorage.setItem('Products', JSON.stringify(productsDB));
		return [200, newProduct];
	});
	mock.onDelete('/ecommerce/products').reply(({ data }) => {
		const ids = JSON.parse(data);
		productsDB = productsDB.filter((item) => !ids.includes(item.id));
		return [200, productsDB];
	});
	mock.onGet('/ecommerce/products/:id').reply((config) => {
		productsDB = JSON.parse(localStorage.getItem("Products"));
		const { id } = config.params;
		console.log("kjfdg", productsDB);

		let productFound = null;

		productsDB.forEach(product => {
			if (product.id == id) {
				console.log("existe");
				productFound = product;
			}
		});

		if (productFound) {
			console.log("p", productFound);
			return [200, productFound];
		}

		return [404, 'Requested product does not exist.'];
	});

	mock.onPut('/ecommerce/products/:id').reply(async (config) => {
		const { id } = config.params;
		const newData = JSON.parse(config.data);
		console.log("new Data ", newData);
		let updatedProduct = null;
		for (let index = 0; index < productsDB.length; index++) {
			const product = productsDB[index];
			if (product.id == id) {
				const res = await updateProductId(newData);
				console.log("res: ", res);
				productsDB[index] = { ...product, ...newData };

				// Actualizar el producto en el localStorage
				updatedProduct = productsDB[index];
				break; // Se encontró el producto, no es necesario seguir iterando
			}
		}
		localStorage.setItem('Products', JSON.stringify(productsDB));
		return updatedProduct ? [200, updatedProduct] : [404, 'Product not found'];
	});

	mock.onDelete('/ecommerce/products/:id').reply((config) => {
		const { id } = config.params;
		let deletedProductId = null;
		productsDB.forEach((product, index) => {
			if (product.id == id) {
				productsDB.splice(index, 1);
				deletedProductId = id;
			}
		});
		return deletedProductId ? [200, deletedProductId] : [404, 'Product not found'];
	});

	mock.onGet('/ecommerce/orders').reply(async () => {
		const response = await getOrders()
		console.log("ordersss", response);
		let pOrders = [];
		if (response.data) {
			if (response.data.length > 0) {
				response.data.forEach(element => {
					pOrders.push({
						"id": element.idPurchase,
						"reference": "70d4d7d0",
						"tax": "",
						"subtotal": element.total,
						"discount": "",
						"total": element.total,
						"date": element.purchaseDate,
						"customer": {
							"id": "1",
							"firstName": element.userName,
							"lastName": "",
							"avatar": element.imgProfileUser,
							"company": "Saois",
							"jobTitle": "Digital Archivist",
							"email": element.email,
							"phone": "+1-202-555-0175",
							"invoiceAddress": {
								"address": "704 6th Ave, New York, NY 10010, USA",
								"lat": 40.7424739,
								"lng": -73.99283919999999
							},
							"shippingAddress": {
								"address": "377 E South Omaha Bridge Rd, Council Bluffs, IA 51501, USA",
								"lat": 41.2183223,
								"lng": -95.8420876
							}
						},
						"products": [
							{
								"id": element.idProduct,
								"name": element.nameProduct,
								"price": element.unitPrice,
								"quantity": element.quantity,
								"image": element.img
							}
						],
						"status": [
							{
								"id": "1",
								"name": "On pre-order (paid)",
								"color": "purple-300",
								"date": "2016/04/03 10:06:18"
							},
							{
								"id": "2",
								"name": "Awaiting check payment",
								"color": "blue-500",
								"date": "2015/03/17 18:28:37"
							}
						],
						"payment": {
							"transactionId": "2a894b9e",
							"amount": "73.31",
							"method": "Credit Card",
							"date": "2016/02/23 15:50:23"
						},
						"shippingDetails": [
							{
								"tracking": "",
								"carrier": "TNT",
								"weight": "10.44",
								"fee": "7.00",
								"date": element.purchaseDate
							}
						]
					})
				});
			}
		}
		console.log("Porders", pOrders);
		localStorage.setItem("orders", JSON.stringify(pOrders));
		return [200, pOrders];

	});
	mock.onPost('/ecommerce/orders').reply((config) => {
		const newOrder = { id: FuseUtils.generateGUID(), ...JSON.parse(config.data) };
		ordersDB.push(newOrder);
		return [200, newOrder];
	});
	mock.onDelete('/ecommerce/orders').reply((config) => {
		const ids = JSON.parse(config.data);
		ordersDB = ordersDB.filter((item) => !ids.includes(item.id));
		return [200, ordersDB];
	});
	mock.onGet('/ecommerce/orders/:id').reply((config) => {
		ordersDB = JSON.parse(localStorage.getItem("orders"));
		const { id } = config.params;
		console.log("kjfdg", productsDB);

		let orderFound = null;

		ordersDB.forEach(order => {
			if (order.id == id) {
				console.log("existe");
				orderFound = order;
			}
		});

		if (orderFound) {
			console.log("p", orderFound);
			return [200, orderFound];
		}

		return [404, 'Requested product does not exist.'];
		// const { id } = config.params;
		// const order = _.find(ordersDB, { id });

		// if (order) {
		// 	return [200, order];
		// }

		// return [404, 'Requested order do not exist.'];
	});
	mock.onPut('/ecommerce/orders/:id').reply((config) => {
		const { id } = config.params;
		_.assign(_.find(ordersDB, { id }), JSON.parse(config.data));
		return [200, _.find(ordersDB, { id })];
	});
	mock.onDelete('/ecommerce/orders/:id').reply((config) => {
		const { id } = config.params;
		_.remove(ordersDB, { id });
		return [200, id];
	});
};
