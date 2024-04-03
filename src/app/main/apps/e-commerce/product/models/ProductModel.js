import _ from '@lodash';
/**
 * The product model.
 */
let id;
if (JSON.parse(localStorage.getItem("Products")).length > 0) {
	id = JSON.parse(localStorage.getItem("Products"))[0].id + 1;
}else {
	id = 0
}
const ProductModel = (data) =>
	_.defaults(data || {}, {
		id: id,
		name: '',
		handle: '',
		description: '',
		categories: [],
		tags: [],
		featuredImageId: '',
		images: [],
		priceTaxExcl: 0,
		priceTaxIncl: 0,
		taxRate: 0,
		comparedPrice: 0,
		quantity: 0,
		sku: '',
		width: '',
		height: '',
		depth: '',
		weight: '',
		extraShippingFee: 0,
		price: '',
		active: true,
		image: '',
		total: ''
	});
export default ProductModel;
