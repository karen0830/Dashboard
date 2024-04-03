/*
eslint-disable camelcase
 */
import FuseUtils from '@fuse/utils';
import _ from '@lodash';
import Base64 from 'crypto-js/enc-base64';
import HmacSHA256 from 'crypto-js/hmac-sha256';
import Utf8 from 'crypto-js/enc-utf8';
import jwtDecode from 'jwt-decode';
import UserModel from 'src/app/auth/user/models/UserModel';
import axios from 'axios';
import { getAllProductsId, loginRequestCompany, verityTokenRequestCompany } from './api/auth.company';
import { getOrders } from './api/auth.company';

let usersApi = JSON.parse(localStorage.getItem("users")) || [];

const signInCompany = async (user) => {
	try {
		const res = await loginRequestCompany(user);
		return res
	} catch (error) {
		console.log(error);
		return error
	}
}

export const authApiMocks = (mock) => {
	mock.onPost('/auth/sign-in').reply(async (config) => {
		const data = JSON.parse(config.data);
		const { email, password } = data;
		const response = await signInCompany({ email: email, password: password });
		if (response.data) {
			// Verificar si el usuario ya existe en el arreglo de usuarios
			const existingUserIndex = usersApi.findIndex(user => user.data.email === email);
			// localStorage.setItem("userLogin", response.data.user)
			localStorage.setItem("userLogin", JSON.stringify(response.data.user));
			localStorage.setItem("tokenCompany", response.data.token);
			const getOrdersOne = await getOrders()
			console.log("ordersss", getOrdersOne);
			let ordersDB = [];
			getOrdersOne.data.forEach(element => {
				ordersDB.push({
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

			localStorage.setItem("orders", JSON.stringify(ordersDB));
			
			const products = await getAllProductsId();
			let p = []
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

			if (existingUserIndex === -1) {
				// El usuario no existe en el arreglo, agregarlo
				usersApi.push({
					"uid": response.data.user._id,
					"role": "admin",
					"data": {
						"displayName": response.data.user.userNameCompany,
						"photoURL": response.data.user.profileImage,
						"email": response.data.user.email,
						"settings": {
							"layout": {},
							"theme": {}
						},
						"shortcuts": [
							"apps.calendar",
							"apps.mailbox",
							"apps.contacts"
						]
					}
				});

				// Actualizar el arreglo de usuarios en el localStorage
				localStorage.setItem("users", JSON.stringify(usersApi));
			}

			// Actualizar el valor en el mockApi
			usersApi = JSON.parse(localStorage.getItem("users")) || [];
			// Resto del código...
		}
		// usersApi = JSON.parse(usersApi);
		// const usersApiString = usersApi;
		// usersApi = JSON.parse(usersApiString);


		let user = null;
		usersApi.forEach(element => {
			if (element.data.email == email) {

				user = element;
			}
		});

		const error = [];

		if (!user || response.response) {
			error.push({
				type: 'email',
				message: 'Check your email address'
			});
			error.push({
				type: 'password',
				message: 'Check your password'
			});
		}

		// if (user && user.password !== password) {
		// 	error.push({
		// 		type: 'password',
		// 		message: 'Check your password'
		// 	});
		// }

		if (error.length === 0) {
			delete user.password;
			const access_token = generateJWTToken({ id: user.uid });
			console.log(user.uid);
			// const access_token = response.data.token;
			const response = {
				user,
				access_token
			};
			return [200, response];
		}

		return [400, error];
	});
	mock.onPost('/auth/refresh').reply((config) => {
		const newTokenResponse = generateAccessToken(config);

		if (newTokenResponse) {
			const { access_token } = newTokenResponse;
			return [200, null, { 'New-Access-Token': access_token }];
		}

		const error = 'Invalid access token detected or user not found';
		return [401, { data: error }];
	});
	mock.onGet('/auth/user').reply(async (config) => {
		const newTokenResponse = generateAccessToken(config);
		const verifyTokenCompany = await verityTokenRequestCompany();
		if (newTokenResponse && verifyTokenCompany.data) {
			const { access_token, user } = newTokenResponse;
			return [200, user, { 'New-Access-Token': access_token }];
		}

		const error = 'Invalid access token detected or user not found';
		return [401, { error }];
	});

	function generateAccessToken(config) {
		const authHeader = config.headers.Authorization;
		console.log(authHeader);
		if (!authHeader) {
			return null;
		}

		const [scheme, access_token] = authHeader.split(' ');

		if (scheme !== 'Bearer' || !access_token) {
			return null;
		}

		if (verifyJWTToken(access_token)) {
			const { id } = jwtDecode(access_token);
			// const user = _.cloneDeep(usersApi.find((_user) => _user.uid === id));
			let userAuth = JSON.parse(localStorage.getItem("userLogin"));
			let user = null;
			usersApi.forEach(element => {
				if (element.uid == userAuth._id) {
					user = element;
				}
			});

			try {
				if (user) {
					// delete user.password;
					const access_token = generateJWTToken({ id: id });
					return { access_token, user };
				}
			} catch (error) {
				console.log(error);
			}
		}

		return null;
	}

	mock.onPost('/auth/sign-up').reply((request) => {
		const data = JSON.parse(request.data);
		const { displayName, password, email } = data;
		const isEmailExists = usersApi.find((_user) => _user.data.email === email);
		const error = [];

		if (isEmailExists) {
			error.push({
				type: 'email',
				message: 'The email address is already in use'
			});
		}

		if (error.length === 0) {
			const newUser = UserModel({
				role: ['admin'],
				data: {
					displayName,
					photoURL: 'assets/images/avatars/Abbott.jpg',
					email,
					shortcuts: [],
					settings: {}
				}
			});

			return [200, response];
		}

		return [200, { error }];
	});
	mock.onPut('/auth/user').reply((config) => {
		const access_token = config?.headers?.Authorization;
		const userData = jwtDecode(access_token);
		const uid = userData.id;
		const user = JSON.parse(config.data);
		let updatedUser;
		usersApi = usersApi.map((_user) => {
			if (uid === _user.uid) {
				updatedUser = _.assign({}, _user, user);
			}

			return _user;
		});
		delete updatedUser.password;
		return [200, updatedUser];
	});
	/**
	 * JWT Token Generator/Verifier Helpers
	 * !! Created for Demonstration Purposes, cannot be used for PRODUCTION
	 */
	const jwtSecret = 'some-secret-code-goes-here';
	/* eslint-disable */
	function base64url(source) {
		// Encode in classical base64
		let encodedSource = Base64.stringify(source);
		// Remove padding equal characters
		encodedSource = encodedSource.replace(/=+$/, '');
		// Replace characters according to base64url specifications
		encodedSource = encodedSource.replace(/\+/g, '-');
		encodedSource = encodedSource.replace(/\//g, '_');
		// Return the base64 encoded string
		return encodedSource;
	}
	function generateJWTToken(tokenPayload) {
		// Define token header
		const header = {
			alg: 'HS256',
			typ: 'JWT'
		};
		// Calculate the issued at and expiration dates
		const date = new Date();
		const iat = Math.floor(date.getTime() / 1000);
		const exp = Math.floor(date.setDate(date.getDate() + 7) / 1000);
		// Define token payload
		const payload = {
			iat,
			iss: 'Fuse',
			exp,
			...tokenPayload
		};
		// Stringify and encode the header
		const stringifiedHeader = Utf8.parse(JSON.stringify(header));
		const encodedHeader = base64url(stringifiedHeader);
		// Stringify and encode the payload
		const stringifiedPayload = Utf8.parse(JSON.stringify(payload));
		const encodedPayload = base64url(stringifiedPayload);
		// Sign the encoded header and mock-api
		let signature = `${encodedHeader}.${encodedPayload}`;
		// @ts-ignore
		signature = HmacSHA256(signature, jwtSecret);
		// @ts-ignore
		signature = base64url(signature);
		// Build and return the token
		return `${encodedHeader}.${encodedPayload}.${signature}`;
	}
	function verifyJWTToken(token) {
		// Split the token into parts
		const parts = token.split('.');
		const header = parts[0];
		const payload = parts[1];
		const signature = parts[2];
		// Re-sign and encode the header and payload using the secret
		const signatureCheck = base64url(HmacSHA256(`${header}.${payload}`, jwtSecret));
		// Verify that the resulting signature is valid
		return signature === signatureCheck;
	}
	// Generate Authorization header on each successfull response
	axios.interceptors.response.use((response) => {
		// get access token from response headers
		const requestHeaders = response.config.headers;
		const authorization = requestHeaders.Authorization;
		const accessToken = authorization?.split(' ')[1];
		const responseUrl = response.config.url;
		if (responseUrl.startsWith('/mock-api') && authorization) {
			if (!accessToken || !verifyJWTToken(accessToken)) {
				const error = new Error("Invalid access token detected.");
				// @ts-ignore
				error.status = 401;
				return Promise.reject(error);
			}
			const newAccessToken = generateAccessToken(response.config);
			if (newAccessToken) {
				response.headers['New-Access-Token'] = newAccessToken.access_token;
			}
			return response;
		}
		return response;
	});
};
